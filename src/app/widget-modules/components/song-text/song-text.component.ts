import {Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {
  Line,
  LineType,
  Section,
  SectionType,
  TextRenderingService
} from '../../../modules/songs/services/text-rendering.service';
import {faGripLines} from '@fortawesome/free-solid-svg-icons/faGripLines';
import {songSwitch} from './animation';

export type ChordMode = 'show' | 'hide' | 'onlyFirst'

@Component({
  selector: 'app-song-text',
  templateUrl: './song-text.component.html',
  styleUrls: ['./song-text.component.less'],
  animations: [songSwitch],
})
export class SongTextComponent implements OnInit {
  public sections: Section[];
  @Input() public index = -1;
  @Input() public fullscreen = false;
  @Input() public showSwitch = false;
  @Output() public chordModeChanged = new EventEmitter<ChordMode>();
  @ViewChildren('section') viewSections: QueryList<ElementRef>;
  public faLines = faGripLines;
  public offset = 0;

  constructor(private textRenderingService: TextRenderingService, private elRef: ElementRef) {
  }

  public _chordMode: ChordMode = 'hide';

  @Input()
  public set chordMode(value: ChordMode) {
    this._chordMode = value ?? 'hide';
  }

  @Input()
  public set text(value: string) {
    this.sections = null;
    this.offset = 0;
    setTimeout(() =>
      this.sections = this.textRenderingService.parse(value).sort((a, b) => a.type - b.type), 100);
  }


  ngOnInit(): void {
    setInterval(() => {
        if (!this.fullscreen || this.index === -1) {
          this.offset = 0;
          return;
        }
        this.offset = -this.viewSections.toArray()[this.index].nativeElement.offsetTop;
      }
      , 100);
  }

  public getLines(section: Section): Line[] {
    return section.lines.filter(_ => {
      if (_.type !== LineType.chord) return true;

      switch (this._chordMode) {
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

  public onClick() {
    scrollTo(0, this.elRef.nativeElement.offsetTop - 20);
  }

  private getNextChordMode(): ChordMode {
    switch (this._chordMode) {
      case 'show':
        return 'hide';
      case 'hide':
        return 'onlyFirst';
      case 'onlyFirst':
        return 'show';
    }
  }

  checkDisabled(i: number) {
    return this.index !== -1 && this.index !== i;

  }
}
