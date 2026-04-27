import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faArrowUpRightFromSquare, faCheck, faCompactDisc, faXmark} from '@fortawesome/free-solid-svg-icons';
import {ButtonRowComponent} from '../../../../widget-modules/components/button-row/button-row.component';
import {ButtonComponent} from '../../../../widget-modules/components/button/button.component';

export interface ReportDialogSong {
  title: string;
  ccliNumber: string;
}

export interface ReportDialogData {
  songs: ReportDialogSong[];
}

@Component({
  selector: 'app-report-dialog',
  imports: [MatDialogContent, FaIconComponent, ButtonRowComponent, ButtonComponent],
  templateUrl: './report-dialog.component.html',
  styleUrl: './report-dialog.component.less',
  standalone: true,
})
export class ReportDialogComponent {
  public readonly reportingUrl = 'https://reporting.ccli.com/search';
  public readonly faOpen = faArrowUpRightFromSquare;
  public readonly faCheck = faCheck;
  public data = inject<ReportDialogData>(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<ReportDialogComponent>);

  public faReport = faCompactDisc;
  public faClose = faXmark;

  private readonly openedNumbers = new Set<string>();

  public getSongReportingUrl(ccliNumber: string): string {
    return `${this.reportingUrl}?s=${encodeURIComponent(ccliNumber)}`;
  }

  public markOpened(ccliNumber: string): void {
    this.openedNumbers.add(ccliNumber);
  }

  public wasOpened(ccliNumber: string): boolean {
    return this.openedNumbers.has(ccliNumber);
  }
}
