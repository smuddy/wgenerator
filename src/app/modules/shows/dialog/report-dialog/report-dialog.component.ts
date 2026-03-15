import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faArrowUpRightFromSquare, faCheck} from '@fortawesome/free-solid-svg-icons';

export interface ReportDialogSong {
  title: string;
  ccliNumber: string;
}

export interface ReportDialogData {
  songs: ReportDialogSong[];
}

@Component({
  selector: 'app-report-dialog',
  imports: [MatButton, MatDialogActions, MatDialogContent, MatDialogClose, FaIconComponent],
  templateUrl: './report-dialog.component.html',
  styleUrl: './report-dialog.component.less',
  standalone: true,
})
export class ReportDialogComponent {
  public readonly reportingUrl = 'https://reporting.ccli.com/search';
  public readonly faOpen = faArrowUpRightFromSquare;
  public readonly faCheck = faCheck;
  public data = inject<ReportDialogData>(MAT_DIALOG_DATA);
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
