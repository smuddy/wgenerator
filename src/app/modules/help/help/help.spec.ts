import {ComponentFixture, TestBed} from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {HelpComponent} from './help';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;
  let fetchMock: ReturnType<typeof vi.fn>;
  type FetchResponse = {ok: boolean; text: () => Promise<string>};

  beforeEach(async () => {
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('# Benutzeranleitung\n\n[Zurück zur Übersicht](index.md)\n\n## Start\n\nText'),
    });

    vi.stubGlobal('fetch', fetchMock);

    await TestBed.configureTestingModule({
      imports: [HelpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load man index on init', () => {
    expect(fetchMock).toHaveBeenCalledWith('man/index.md', {cache: 'no-cache'});
    expect(component.heading).toBe('Benutzeranleitung');
  });

  it('should keep the current content visible while the next page loads', async () => {
    let resolveFetch!: (value: FetchResponse) => void;

    fetchMock.mockImplementationOnce(
      () =>
        new Promise<FetchResponse>(resolve => {
          resolveFetch = resolve;
        })
    );

    const oldHtml = component.renderedHtml;
    const oldHeading = component.heading;

    const loadPromise = (component as unknown as {loadDocument(path: string): Promise<void>}).loadDocument(
      'man/pages/lieder-liste.md'
    );
    fixture.detectChanges();

    expect(component.loading).toBe(true);
    expect(component.renderedHtml).toBe(oldHtml);
    expect(component.heading).toBe(oldHeading);

    resolveFetch({
      ok: true,
      text: () => Promise.resolve('# Liedliste\n\nInhalt'),
    });

    await loadPromise;
    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.heading).toBe('Liedliste');
    expect(component.renderedHtml).not.toBe(oldHtml);
  });

  it('should decode html entities in the title', () => {
    const result = (component as unknown as {renderMarkdown(markdown: string): {title: string; html: string}}).renderMarkdown(
      '# Veranstaltung ver&#246;ffentlichen und teilen'
    );

    expect(result.title).toBe('Veranstaltung veröffentlichen und teilen');
  });

  it('should preserve ordered list start values from markdown', () => {
    const result = (component as unknown as {renderMarkdown(markdown: string): {title: string; html: string}}).renderMarkdown(
      '# Test\n\n## Schritte\n\n7. Siebter Schritt\n8. Achter Schritt\n9. Neunter Schritt'
    );

    expect(result.html).toContain('<ol start="7">');
    expect(result.html).toContain('<li>Siebter Schritt</li>');
    expect(result.html).toContain('<li>Achter Schritt</li>');
    expect(result.html).toContain('<li>Neunter Schritt</li>');
  });

  it('should render nested lists inside ordered steps', () => {
    const result = (component as unknown as {renderMarkdown(markdown: string): {title: string; html: string}}).renderMarkdown(
      '# Test\n\n## Schritte\n\n1. Erster Schritt\n   - Unterpunkt A\n   - Unterpunkt B\n2. Zweiter Schritt'
    );

    expect(result.html).toContain('<ol>');
    expect(result.html).toContain('<ul>');
    expect(result.html).toContain('<li>Erster Schritt<ul><li>Unterpunkt A</li><li>Unterpunkt B</li></ul></li>');
    expect(result.html).toContain('<li>Zweiter Schritt</li>');
  });

  it('should normalize duplicated tutorials paths', () => {
    const resolved = (component as unknown as {resolveDocumentPath(basePath: string, href: string): string}).resolveDocumentPath(
      'man/tutorials/index.md',
      'tutorials/lied-finden-und-nutzen.md'
    );

    expect(resolved).toBe('man/tutorials/lied-finden-und-nutzen.md');
  });
});
