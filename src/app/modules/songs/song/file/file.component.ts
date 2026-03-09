import {Component, Input} from '@angular/core';
import {File} from '../../services/file';
import {getDownloadURL, ref, Storage} from '@angular/fire/storage';
import {from, Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.less'],
  imports: [AsyncPipe],
})
export class FileComponent {
  public url$: Observable<string> | null = null;
  public name = '';

  public constructor(private storage: Storage) {}

  @Input()
  public set file(file: File) {
    this.url$ = from(getDownloadURL(ref(this.storage, file.path + '/' + file.name)));
    this.name = file.name;
  }
}
