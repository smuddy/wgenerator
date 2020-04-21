import {Injectable} from '@angular/core';
import {Document, HeadingLevel, Packer, Paragraph} from 'docx';
import {ShowService} from './show.service';
import {ShowTypePipe} from '../../../widget-modules/pipes/show-type-translater/show-type.pipe';
import {first} from 'rxjs/operators';
import {ShowSongService} from './show-song.service';
import {Line, LineType, Section, TextRenderingService} from '../../songs/services/text-rendering.service';
import {Song} from '../../songs/services/song';
import {SongService} from '../../songs/services/song.service';
import {ShowSong} from './showSong';
import {Show} from './show';
import {ChordMode} from '../../../widget-modules/components/song-text/song-text.component';


@Injectable({
  providedIn: 'root'
})
export class DocxService {

  constructor(
    private showService: ShowService,
    private showSongService: ShowSongService,
    private songService: SongService,
    private textRenderingService: TextRenderingService
  ) {

  }

  public async create(showId: string): Promise<any> {
    const {show, songs} = await this.prepareData(showId);

    const paragraphs = [
      ...this.renderTitle(show),
      ...this.renderSongs(songs),
    ];
    console.log(paragraphs);

    const document = this.prepareNewDocument();
    document.addSection({
      properties: {top: 400, bottom: 400, left: 400, right: 400},
      children: paragraphs,
    });


    const blob = await Packer.toBlob(document);

    // saveAs from FileSaver will download the file
    this.saveAs(blob, 'example.docx');
  }

  private prepareNewDocument(): Document {
    return new Document({
      creator: 'TODO',
      title: 'Gottesdienst',
      description: '... mit Beschreibung',
      styles: {
        paragraphStyles: [
          {
            id: 'songtext',
            name: 'Song Text',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {font: 'courier new'},
            paragraph: {indent: {left: 0}},
          },
        ]
      }
    })
  }

  private renderSongs(songs: { showSong: ShowSong; song: Song; sections: Section[] }[]): Paragraph[] {
    return songs.reduce((p, song) => [...p, ...this.renderSong(song.showSong, song.song, song.sections)], [])
  }

  private renderSong(showSong: ShowSong, song: Song, sections: Section[]): Paragraph[] {
    const songTitle = this.renderSongTitle(song);
    const songText = this.renderSongText(sections, showSong.chordMode);

    return [
      songTitle,
      ...songText
    ]
  }

  private renderSongText(sections: Section[], chordMode: ChordMode) {
    return sections.reduce((p, section) => [...p, ...this.renderSection(section, chordMode)], []);
  }

  private renderSongTitle(song: Song): Paragraph {
    return new Paragraph({
      text: song.title,
      heading: HeadingLevel.HEADING_2,
      thematicBreak: true,
      spacing: {
        before: 200,
      },
    });
  }


  private renderSection(section: Section, chordMode: ChordMode): Paragraph[] {
    return section.lines
      .filter(line => {
        if (line.type === LineType.text) return true;
        switch (chordMode) {
          case 'show':
            return true;
          case 'hide':
            return false;
          case 'onlyFirst':
            return section.number === 0;
        }
      })
      .map((line, i) => this.renderLine(line, i === 0));
  }

  private renderLine(line: Line, isFirstLine: boolean): Paragraph {
    const spacing = isFirstLine ? {before: 200} : {};
    return new Paragraph({
      text: line.text,
      style: 'songtext',
      spacing
    });

  }

  private renderTitle(show: Show): Paragraph[] {
    const type = new ShowTypePipe().transform(show.showType);

    const songTitle = new Paragraph({
      text: type,
      heading: HeadingLevel.HEADING_1,
      thematicBreak: true,
    });

    return [songTitle]
  }

  private async prepareData(showId: string): Promise<{ songs: ({ showSong: ShowSong, song: Song, sections: Section[] })[]; show: Show }> {
    const show = await this.showService.read$(showId).pipe(first()).toPromise();

    const showSongs = await this.showSongService.list$(showId).pipe(first()).toPromise();
    const songsAsync = await showSongs.map(async showSong => {
      const song = await this.songService.read(showSong.songId).pipe(first()).toPromise();
      const sections = this.textRenderingService.parse(song.text);
      return {
        showSong,
        song,
        sections
      }
    })
    const songs = await Promise.all(songsAsync);
    return {songs, show};
  }

  private saveAs(blob, fileName) {
    const a = document.createElement('a') as any;
    document.body.appendChild(a);
    a.style = 'display: none';

    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);

    document.body.removeChild(a);
  };
}