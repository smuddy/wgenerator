import {Component, ViewChild} from '@angular/core';
import {EditSongComponent} from './edit-song/edit-song.component';
import {EditFileComponent} from './edit-file/edit-file.component';
import {HistoryComponent} from './history/history.component';
import {PageFrameComponent} from '../../../../widget-modules/components/sidebar/page-frame.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
  imports: [EditSongComponent, EditFileComponent, HistoryComponent, PageFrameComponent],
})
export class EditComponent {
  @ViewChild(EditSongComponent) public editSongComponent: EditSongComponent | null = null;
}
