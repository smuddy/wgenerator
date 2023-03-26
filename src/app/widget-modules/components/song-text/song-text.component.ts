import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {TextRenderingService} from '../../../modules/songs/services/text-rendering.service';
import {faGripLines} from '@fortawesome/free-solid-svg-icons';
import {songSwitch} from './animation';
import {TransposeMode} from '../../../modules/songs/services/transpose-mode';
import {SectionType} from '../../../modules/songs/services/section-type';
import {LineType} from '../../../modules/songs/services/line-type';
import {Section} from '../../../modules/songs/services/section';
import {Line} from '../../../modules/songs/services/line';

export type ChordMode = 'show' | 'hide' | 'onlyFirst';

@Component({
  selector: 'app-song-text',
  templateUrl: './song-text.component.html',
  styleUrls: ['./song-text.component.less'],
  animations: [songSwitch],
})
export class SongTextComponent implements OnInit {
  public sections: Section[] = [];
  @Input() public header: string | null = null;
  @Input() public index = -1;
  @Input() public fullscreen = false;
  @Input() public showSwitch = false;
  @Output() public chordModeChanged = new EventEmitter<ChordMode>();
  @ViewChildren('section') public viewSections: QueryList<ElementRef<HTMLElement>> | null = null;
  public faLines = faGripLines;
  public offset = 0;
  public iChordMode: ChordMode = 'hide';
  private iText = '';
  private iTranspose: TransposeMode | null = null;

  public constructor(private textRenderingService: TextRenderingService, private elRef: ElementRef<HTMLElement>, private cRef: ChangeDetectorRef) {}

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

  public ngOnInit(): void {
    setInterval(() => {
      if (!this.fullscreen || this.index === -1 || !this.viewSections?.toArray()[this.index]) {
        this.offset = 0;
        this.cRef.markForCheck();
        return;
      }
      this.offset = -this.viewSections?.toArray()[this.index].nativeElement.offsetTop;
      this.cRef.markForCheck();
    }, 100);
  }

  private render() {
    this.offset = 0;
    this.sections = [];
    if (this.fullscreen) {
      setTimeout(() => {
        this.sections = this.textRenderingService.parse(this.iText, this.iTranspose);
        this.cRef.markForCheck();
      }, 100);
    } else {
      this.sections = this.textRenderingService.parse(this.iText, this.iTranspose); //.sort((a, b) => a.type - b.type);
      this.cRef.markForCheck();
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
