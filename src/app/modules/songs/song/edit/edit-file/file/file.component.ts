import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {File} from '../../../../services/file';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import {FileService} from '../../../../services/file.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.less']
})
export class FileComponent {
  public url$: Observable<string>;
  public name: string;
  public faTrash = faTrashAlt;
  @Input() songId: string;
  private fileId: string;
  private path: string;

  constructor(private fileService: FileService) {
  }

  @Input() set file(file: File) {
    this.url$ = this.fileService.getDownloadUrl(file.path + '/' + file.name);
    this.name = file.name;
    this.fileId = file.id;
    this.path = file.path + '/' + file.name;
  }

  public async onDelete(): Promise<void> {
    await this.fileService.delete(this.path, this.songId, this.fileId);
  }
}
