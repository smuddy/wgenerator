import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { FileType } from './../../../models/files-types.model.ts';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { EditSongService } from 'src/app/data/edit-song.service';

@Component({
  selector: 'app-song-file-edit',
  templateUrl: './song-file-edit.component.html',
  styleUrls: ['./song-file-edit.component.less']
})
export class SongFileEditComponent implements OnInit, OnDestroy {
  @Input() fileId: number;
  @Output() back = new EventEmitter();
  public form: FormGroup;
  public fileTypes = [
    {value: FileType.None, text: null},
    {value: FileType.Sheet, text: 'Text'},
    {value: FileType.Chords, text: 'Text + Akkorde'},
    {value: FileType.MuseScore, text: 'MuseScore'},
  ];

  constructor(private editSongService: EditSongService) { }

  public ngOnInit(): void {
    this.form = this.editSongService.initFileEditForm(this.fileId);
  }

  public ngOnDestroy(): void {
    this.form = null;

  }

}
