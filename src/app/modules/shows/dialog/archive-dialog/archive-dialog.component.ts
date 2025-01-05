import {Component} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-archive-dialog',
  templateUrl: './archive-dialog.component.html',
  styleUrls: ['./archive-dialog.component.less'],
  imports: [MatDialogContent, MatDialogActions, MatButton, MatDialogClose],
})
export class ArchiveDialogComponent {}
