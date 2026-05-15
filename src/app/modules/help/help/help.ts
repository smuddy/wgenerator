import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, SecurityContext, inject} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {PageFrameComponent} from '../../../widget-modules/components/sidebar/page-frame.component';
import {CardComponent} from '../../../widget-modules/components/card/card.component';

@Component({
  selector: 'app-help',
  imports: [PageFrameComponent, CardComponent],
  templateUrl: './help.html',
  styleUrl: './help.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sanitizer = inject(DomSanitizer);

  public heading = 'Hilfe';
  public currentDocument = 'man/index.md';
  public renderedHtml: SafeHtml = '';
  public hasLoadedContent = false;
  public loading = true;
  public error: string | null = null;

  public ngOnInit(): void {
    void this.loadDocument(this.currentDocument);
  }

  public onContentClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const link = target.closest('a');
    const href = link?.getAttribute('href');
    if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
      return;
    }

    const resolvedPath = this.resolveDocumentPath(this.currentDocument, href);
    if (!resolvedPath.endsWith('.md') || !resolvedPath.startsWith('man/')) {
      return;
    }

    event.preventDefault();
    void this.loadDocument(resolvedPath);
  }

  private async loadDocument(path: string): Promise<void> {
    if (!path.startsWith('man/')) {
      if (!this.hasLoadedContent) {
        this.heading = 'Hilfe';
        this.renderedHtml = this.sanitizer.bypassSecurityTrustHtml('');
        this.error = 'Dieses Dokument gehört nicht zur Benutzerhilfe.';
      }
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.error = null;
    this.currentDocument = path;
    this.cdr.markForCheck();

    try {
      const response = await fetch(path, {cache: 'no-cache'});
      if (!response.ok) {
        throw new Error(`Dokument konnte nicht geladen werden: ${response.status}`);
      }

      const markdown = await response.text();
      const {title, html} = this.renderMarkdown(markdown);

      this.currentDocument = path;
      this.heading = title || 'Hilfe';
      this.renderedHtml = this.sanitizer.bypassSecurityTrustHtml(html);
      this.hasLoadedContent = true;
    } catch {
      if (!this.hasLoadedContent) {
        this.heading = 'Hilfe';
        this.renderedHtml = this.sanitizer.bypassSecurityTrustHtml('');
        this.error = 'Die Hilfe konnte nicht geladen werden.';
      }
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  private resolveDocumentPath(basePath: string, href: string): string {
    const [pathWithoutHash] = href.split('#', 1);
    const resolved = new URL(pathWithoutHash, new URL(basePath, 'https://help.local/'));
    let path = resolved.pathname.replace(/^\/+/, '');

    path = path.replace(/^man\/tutorials\/tutorials\//, 'man/tutorials/');
    path = path.replace(/^man\/pages\/pages\//, 'man/pages/');

    return path;
  }

  private renderMarkdown(markdown: string): {title: string; html: string} {
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const htmlParts: string[] = [];
    const paragraphLines: string[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let title = '';

    const flushParagraph = () => {
      if (paragraphLines.length === 0) {
        return;
      }

      const text = paragraphLines.join(' ').trim();
      if (text) {
        if (/^\[[^\]]+\]\([^)]+\)( \| \[[^\]]+\]\([^)]+\))*$/.test(text)) {
          htmlParts.push(`<nav class="doc-nav">${this.renderInlineMarkdown(text)}</nav>`);
        } else {
          htmlParts.push(`<p>${this.renderInlineMarkdown(text)}</p>`);
        }
        }
        paragraphLines.length = 0;
      };

    const flushCodeBlock = () => {
      if (!inCodeBlock) {
        return;
      }
      const code = this.escapeHtml(codeLines.join('\n'));
      htmlParts.push(`<pre><code>${code}</code></pre>`);
      codeLines = [];
      inCodeBlock = false;
    };

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];

      if (line.startsWith('```')) {
        flushParagraph();
        if (inCodeBlock) {
          flushCodeBlock();
        } else {
          inCodeBlock = true;
          codeLines = [];
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      const trimmed = line.trim();
      if (!trimmed) {
        flushParagraph();
        continue;
      }

      const headingMatch = /^(#{1,6})\s+(.*)$/.exec(trimmed);
      if (headingMatch) {
        flushParagraph();

        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();
        if (!title && level === 1) {
          title = this.decodePlainText(text);
          continue;
        }

        htmlParts.push(`<h${level}>${this.renderInlineMarkdown(text)}</h${level}>`);
        continue;
      }

      const listMatch = this.matchListItem(line);
      if (listMatch) {
        flushParagraph();
        const {html, nextIndex} = this.renderListBlock(lines, index);
        htmlParts.push(html);
        index = nextIndex - 1;
        continue;
      }

      paragraphLines.push(trimmed);
    }

    flushParagraph();
    flushCodeBlock();

    return {title, html: htmlParts.join('\n')};
  }

  private renderListBlock(lines: string[], startIndex: number): {html: string; nextIndex: number} {
    const firstMatch = this.matchListItem(lines[startIndex]);
    if (!firstMatch) {
      return {html: '', nextIndex: startIndex + 1};
    }

    const items: string[] = [];
    const listType = firstMatch.type;
    const baseIndent = firstMatch.indent;
    const orderedStart = listType === 'ol' ? firstMatch.number : null;
    let currentItem = this.renderInlineMarkdown(firstMatch.text);
    let index = startIndex + 1;

    const pushCurrentItem = () => {
      items.push(`<li>${currentItem}</li>`);
    };

    while (index < lines.length) {
      const rawLine = lines[index];
      const trimmed = rawLine.trim();

      if (!trimmed) {
        break;
      }

      const match = this.matchListItem(rawLine);
      if (!match) {
        const indent = this.getIndent(rawLine);
        if (indent > baseIndent) {
          currentItem += ` ${this.renderInlineMarkdown(trimmed)}`;
          index += 1;
          continue;
        }

        break;
      }

      if (match.indent < baseIndent) {
        break;
      }

      if (match.indent > baseIndent) {
        const nested = this.renderListBlock(lines, index);
        currentItem += nested.html;
        index = nested.nextIndex;
        continue;
      }

      if (match.type !== listType) {
        break;
      }

      pushCurrentItem();
      currentItem = this.renderInlineMarkdown(match.text);
      index += 1;
    }

    pushCurrentItem();

    const startAttribute = listType === 'ol' && orderedStart && orderedStart > 1 ? ` start="${orderedStart}"` : '';
    return {html: `<${listType}${startAttribute}>${items.join('')}</${listType}>`, nextIndex: index};
  }

  private matchListItem(line: string): {indent: number; type: 'ul' | 'ol'; text: string; number: number | null} | null {
    const match = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(line);
    if (!match) {
      return null;
    }

    const indent = match[1].length;
    const marker = match[2];
    const text = match[3].trim();

    if (marker.endsWith('.')) {
      return {
        indent,
        type: 'ol',
        text,
        number: Number.parseInt(marker, 10),
      };
    }

    return {
      indent,
      type: 'ul',
      text,
      number: null,
    };
  }

  private getIndent(line: string): number {
    return /^(\s*)/.exec(line)?.[1]?.length ?? 0;
  }

  private renderInlineMarkdown(text: string): string {
    let html = this.escapeHtml(text);

    html = html.replace(/`([^`]+)`/g, (_match, code: string) => `<code>${code}</code>`);
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
      const safeHref = this.escapeHtml(href);
      const safeLabel = this.escapeHtml(label);

      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
        return `<a href="${safeHref}" target="_blank" rel="noreferrer">${safeLabel}</a>`;
      }

      return `<a href="${safeHref}">${safeLabel}</a>`;
    });
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(^|[^\*])\*([^*]+)\*/g, '$1<em>$2</em>');

    return html;
  }

  private decodePlainText(text: string): string {
    const html = this.renderInlineMarkdown(text);
    const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, html)?.replace(/<[^>]+>/g, '').trim() ?? text;
    return this.decodeHtmlEntities(sanitized);
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private decodeHtmlEntities(text: string): string {
    if (typeof document === 'undefined') {
      return text;
    }

    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }
}
