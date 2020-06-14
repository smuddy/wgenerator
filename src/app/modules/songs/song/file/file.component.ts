import {Component, Input, OnInit} from '@angular/core';
import {File} from '../../services/file';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.less']
})
export class FileComponent implements OnInit {
  public url$: Observable<string>;
  public name: string;

  constructor(private storage: AngularFireStorage) {
  }

  @Input() set file(file: File) {

    const ref = this.storage.ref(file.path + '/' + file.name);
    this.url$ = ref.getDownloadURL();
    this.name = file.name;

  }

  ngOnInit(): void {
  }

}
