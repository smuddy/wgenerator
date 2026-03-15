import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren, inject} from '@angular/core';
import {TextRenderingService} from '../../../modules/songs/services/text-rendering.service';
import {faGripLines} from '@fortawesome/free-solid-svg-icons';
import {songSwitch} from './animation';
import {TransposeMode} from '../../../modules/songs/services/transpose-mode';
import {SectionType} from '../../../modules/songs/services/section-type';
import {LineType} from '../../../modules/songs/services/line-type';
import {Section} from '../../../modules/songs/services/section';
import {Line} from '../../../modules/songs/services/line';
import {ChordValidationIssue} from '../../../modules/songs/services/chord';

import {MatIconButton} from '@angular/material/button';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

export type ChordMode = 'show' | 'hide' | 'onlyFirst';

interface DisplaySegment {
  text: string;
  invalid: boolean;
  isTab: boolean;
}

@Component({
  selector: 'app-song-text',
  templateUrl: './song-text.component.html',
  styleUrls: ['./song-text.component.less'],
  animations: [songSwitch],
  imports: [MatIconButton, FaIconComponent],
})
export class SongTextComponent implements OnInit, OnDestroy {
  private textRenderingService = inject(TextRenderingService);
  private elRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private cRef = inject(ChangeDetectorRef);

  public sections: Section[] = [];
  @Input() public header: string | null = null;
  @Input() public index = -1;
  @Input() public fullscreen = false;
  @Input() public showSwitch = false;
  @Input() public showComments = true;
  @Output() public chordModeChanged = new EventEmitter<ChordMode>();
  @ViewChildren('section') public viewSections: QueryList<ElementRef<HTMLElement>> | null = null;
  public faLines = faGripLines;
  public offset = 0;
  public iChordMode: ChordMode = 'hide';
  public showValidationIssues = false;
  private invalidChordIssuesByLine = new Map<number, ChordValidationIssue[]>();
  private iText = '';
  private iTranspose: TransposeMode | null = null;
  private offsetIntervalId: ReturnType<typeof setInterval> | null = null;

  @Input()
  public set chordMode(value: ChordMode) {
    this.iChordMode = value ?? 'hide';
  }

  @Input()
  public set text(value: string) {
    this.iText = value;
    this.render();
  }

  @Input()
  public set transpose(value: TransposeMode | null) {
    this.iTranspose = value;
    this.render();
  }

  @Input()
  public set validateChordNotation(value: boolean) {
    this.showValidationIssues = value;
    this.updateValidationIssues();
    this.cRef.markForCheck();
  }

  public ngOnInit(): void {
    this.offsetIntervalId = setInterval(() => {
      if (!this.fullscreen || this.index === -1 || !this.viewSections?.toArray()[this.index]) {
        this.offset = 0;
        this.cRef.markForCheck();
        return;
      }
      this.offset = -this.viewSections?.toArray()[this.index].nativeElement.offsetTop;
      this.cRef.markForCheck();
    }, 100);
  }

  public ngOnDestroy(): void {
    if (this.offsetIntervalId) {
      clearInterval(this.offsetIntervalId);
    }
  }

  public getLines(section: Section): Line[] {
    return section.lines.filter(_ => {
      if (_.type !== LineType.chord) {
        return true;
      }

      switch (this.iChordMode) {
        case 'show':
          return true;
        case 'hide':
          return false;
        case 'onlyFirst':
          return section.number === 0 || section.type !== SectionType.Verse;
      }
    });
  }

  public onChordClick(): void {
    const next = this.getNextChordMode();

    this.chordMode = next;
    this.chordModeChanged.emit(next);
  }

  public onClick(): void {
    const nativeElement = this.elRef.nativeElement;
    scrollTo(0, nativeElement.offsetTop - 20);
  }

  public checkDisabled(i: number): boolean {
    return this.index !== -1 && this.index !== i;
  }

  public transform(text: string): string {
    if (this.isComment(text)) text = text.slice(1);
    return text;
  }

  public getDisplaySegments(line: Line, trim = false): DisplaySegment[] {
    const text = trim ? line.text.trim() : this.transform(line.text);
    const lineNumber = line.lineNumber;
    if (!lineNumber) {
      return [{text, invalid: false, isTab: false}];
    }

    const issues = this.invalidChordIssuesByLine.get(lineNumber);
    if (!issues || issues.length === 0) {
      return [{text, invalid: false, isTab: false}];
    }

    const ranges: Array<{start: number; end: number; isTab: boolean}> = [];
    let searchStart = 0;
    issues.forEach(issue => {
      const index = text.indexOf(issue.token, searchStart);
      if (index === -1) {
        return;
      }
      ranges.push({start: index, end: index + issue.token.length, isTab: issue.reason === 'tab_character'});
      searchStart = index + issue.token.length;
    });

    if (ranges.length === 0) {
      return [{text, invalid: false, isTab: false}];
    }

    const segments: DisplaySegment[] = [];
    let cursor = 0;
    ranges.forEach(range => {
      if (range.start > cursor) {
        segments.push({text: text.slice(cursor, range.start), invalid: false, isTab: false});
      }
      segments.push({
        text: range.isTab ? '⇥' : text.slice(range.start, range.end),
        invalid: true,
        isTab: range.isTab,
      });
      cursor = range.end;
    });

    if (cursor < text.length) {
      segments.push({text: text.slice(cursor), invalid: false, isTab: false});
    }

    return segments;
  }

  public isComment(text: string) {
    return text.startsWith('#');
  }

  private render() {
    this.offset = 0;
    this.sections = [];
    this.updateValidationIssues();
    if (this.fullscreen) {
      setTimeout(() => {
        this.sections = this.textRenderingService.parse(this.iText, this.iTranspose, this.showComments);
        this.cRef.markForCheck();
      }, 100);
    } else {
      this.sections = this.textRenderingService.parse(this.iText, this.iTranspose, this.showComments); //.sort((a, b) => a.type - b.type);
      this.cRef.markForCheck();
    }
  }

  private updateValidationIssues(): void {
    if (!this.showValidationIssues) {
      this.invalidChordIssuesByLine = new Map<number, ChordValidationIssue[]>();
      return;
    }

    const issuesByLine = new Map<number, ChordValidationIssue[]>();
    this.textRenderingService.validateChordNotation(this.iText, this.showComments).forEach(issue => {
      const lineIssues = issuesByLine.get(issue.lineNumber) ?? [];
      lineIssues.push(issue);
      issuesByLine.set(issue.lineNumber, lineIssues);
    });
    this.invalidChordIssuesByLine = issuesByLine;
  }

  private getNextChordMode(): ChordMode {
    switch (this.iChordMode) {
      case 'show':
        return 'hide';
      case 'hide':
        return 'onlyFirst';
      case 'onlyFirst':
        return 'show';
    }
  }
}
