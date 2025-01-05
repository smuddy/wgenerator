import {Component} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.less'],
  imports: [MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
})
export class SaveDialogComponent {}
