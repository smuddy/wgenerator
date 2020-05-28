import {Injectable} from '@angular/core';
import {Document, HeadingLevel, Packer, Paragraph} from 'docx';
import {ShowService} from './show.service';
import {ShowTypePipe} from '../../../widget-modules/pipes/show-type-translater/show-type.pipe';
import {first} from 'rxjs/operators';
import {ShowSongService} from './show-song.service';
import {Line, LineType, Section, TextRenderingService} from '../../songs/services/text-rendering.service';
import {Song} from '../../songs/services/song';
import {SongService} from '../../songs/services/song.service';
import {ShowSong} from './show-song';
import {Show} from './show';
import {ChordMode} from '../../../widget-modules/components/song-text/song-text.component';
import {UserService} from '../../../services/user/user.service';
import {User} from '../../../services/user/user';
import {ConfigService} from '../../../services/config.service';
import {Config} from '../../../services/config';

export interface DownloadOptions {
  copyright?: boolean;
  chordMode?: ChordMode;
}

@Injectable({
  providedIn: 'root'
})
export class DocxService {

  constructor(
    private showService: ShowService,
    private showSongService: ShowSongService,
    private songService: SongService,
    private textRenderingService: TextRenderingService,
    private userService: UserService,
    private configService: ConfigService,
  ) {
  }

  public async create(showId: string, options: DownloadOptions = {}): Promise<any> {
    const {show, songs, user, config} = await this.prepareData(showId);
    const type = new ShowTypePipe().transform(show.showType);
    const title = `${type} ${show.date.toDate().toLocaleDateString()}`;

    const paragraphs = [
      ...this.renderTitle(title),
      ...this.renderSongs(songs, options, config),
    ];

    const document = this.prepareNewDocument(type, user.name, options);
    document.addSection({
      properties: {top: 400, bottom: 400, left: 400, right: 400},
      children: paragraphs,
    });

    const blob = await Packer.toBlob(document);

    // saveAs from FileSaver will download the file
    this.saveAs(blob, `${title}.docx`);
  }

  private prepareNewDocument(type: string, name: string, options: DownloadOptions): Document {
    return new Document({
      creator: name,
      title: type,
      description: '... mit Beschreibung',
      styles: {
        paragraphStyles: [
          {
            id: 'songtext',
            name: 'Song Text',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: options?.chordMode === 'hide' ? {} : {font: 'courier new'},
            paragraph: {indent: {left: 0}},
          }, {
            id: 'licence',
            name: 'Lizenz',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {size: 15, color: 'grey'},
            paragraph: {indent: {left: 0}},
          },
        ]
      }
    })
  }

  private renderSongs(songs: { showSong: ShowSong; song: Song; sections: Section[] }[], options: DownloadOptions, config: Config): Paragraph[] {
    return songs.reduce((p, song) => [...p, ...this.renderSong(song.showSong, song.song, song.sections, options, config)], [])
  }

  private renderSong(showSong: ShowSong, song: Song, sections: Section[], options: DownloadOptions, config: Config): Paragraph[] {
    const songTitle = this.renderSongTitle(song);
    const copyright = this.renderCopyright(song, options, config);
    const songText = this.renderSongText(sections, options?.chordMode ?? showSong.chordMode);

    return [
      songTitle,
      copyright,
      ...songText
    ].filter(_ => _);
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

  private renderCopyright(song: Song, options: DownloadOptions, config: Config): Paragraph {
    if (!options?.copyright) return null;

    const label = song.label ? song.label + ', ' : '';
    const artist = song.artist ? song.artist + ', ' : '';
    const termsOfUse = song.termsOfUse ? song.termsOfUse + ', ' : '';
    const origin = song.origin ? song.origin + ', ' : '';
    const licence = song.legalOwner === 'CCLI'
      ? 'CCLI-Liednummer: ' + song.legalOwnerId + ', CCLI-Lizenz: ' + config.ccliLicenseId
      : 'CCLI-Liednummer: ' + song.legalOwnerId;

    return new Paragraph({
      text: artist + label + termsOfUse + origin + licence,
      style: 'licence',
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

  private renderTitle(type: string): Paragraph[] {

    const songTitle = new Paragraph({
      text: type,
      heading: HeadingLevel.HEADING_1,
      thematicBreak: true,
    });

    return [songTitle]
  }

  private async prepareData(showId: string): Promise<{ songs: ({ showSong: ShowSong, song: Song, sections: Section[] })[]; show: Show, user: User, config: Config }> {
    const show = await this.showService.read$(showId).pipe(first()).toPromise();
    const user = await this.userService.getUserbyId(show.owner);
    const config = await this.configService.get();

    const showSongs = await this.showSongService.list(showId);
    const songsAsync = await showSongs.map(async showSong => {
      const song = await this.songService.read(showSong.songId);
      const sections = this.textRenderingService.parse(song.text);
      return {
        showSong,
        song,
        sections
      }
    })
    const songs = await Promise.all(songsAsync);
    return {songs, show, user, config};
  }

  private saveAs(blob, fileName) {
    const a = document.createElement('a') as any;

    document.body.appendChild(a);
    a.setAttribute('target', '_self');
    a.style = 'display: none';

    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 1000);
  };
}
