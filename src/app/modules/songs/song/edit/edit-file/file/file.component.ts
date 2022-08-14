import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {File} from '../../../../services/file';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {FileService} from '../../../../services/file.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.less'],
})
export class FileComponent {
  public url$: Observable<string> | null = null;
  public name = '';
  public faTrash = faTrashAlt;
  @Input() public songId: string | null = null;
  private fileId: string | null = null;
  private path: string | null = null;

  public constructor(private fileService: FileService) {}

  @Input()
  public set file(file: File) {
    this.url$ = this.fileService.getDownloadUrl(file.path + '/' + file.name);
    this.name = file.name;
    this.fileId = file.id;
    this.path = file.path + '/' + file.name;
  }

  public onDelete(): void {
    if (this.path && this.songId && this.fileId) this.fileService.delete(this.path, this.songId, this.fileId);
  }
}
