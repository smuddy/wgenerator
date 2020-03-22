import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  Line,
  LineType,
  Section,
  SectionType,
  TextRenderingService
} from '../../../modules/songs/services/text-rendering.service';
import {faGripLines} from '@fortawesome/free-solid-svg-icons/faGripLines';

export type ChordMode = 'show' | 'hide' | 'onlyFirst'

@Component({
  selector: 'app-song-text',
  templateUrl: './song-text.component.html',
  styleUrls: ['./song-text.component.less']
})
export class SongTextComponent implements OnInit {
  public sections: Section[];
  public _chordMode: ChordMode = 'hide';
  @Input()
  public set chordMode(value: ChordMode) {
    this._chordMode = value ?? 'hide';
  }

  @Output() public chordModeChanged = new EventEmitter<ChordMode>();
  public faLines = faGripLines;

  constructor(private textRenderingService: TextRenderingService, private elRef: ElementRef) {
  }

  @Input()
  public set text(value: string) {
    this.sections = this.textRenderingService.parse(value).sort((a, b) => a.type - b.type);
    console.log(this.sections)
  }

  ngOnInit(): void {
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

  public onClick() {
    scrollTo(0, this.elRef.nativeElement.offsetTop - 20);
  }
}
