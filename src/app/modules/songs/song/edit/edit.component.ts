import {Component, ViewChild} from '@angular/core';
import {EditSongComponent} from './edit-song/edit-song.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class EditComponent {
  @ViewChild(EditSongComponent) public editSongComponent: EditSongComponent;
}
