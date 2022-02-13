import {Component, Input} from '@angular/core';
import {File} from '../../services/file';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.less'],
})
export class FileComponent {
  public url$: Observable<string> | null = null;
  public name = '';

  public constructor(private storage: AngularFireStorage) {}

  @Input()
  public set file(file: File) {
    const ref = this.storage.ref(file.path + '/' + file.name);
    this.url$ = ref.getDownloadURL() as Observable<string>;
    this.name = file.name;
  }
}
