import {Component} from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-archive-dialog',
    templateUrl: './archive-dialog.component.html',
    styleUrls: ['./archive-dialog.component.less'],
    imports: [
        CdkScrollable,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatDialogClose,
    ],
})
export class ArchiveDialogComponent {
}
