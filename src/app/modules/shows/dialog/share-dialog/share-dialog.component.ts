import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {ShowTypePipe} from '../../../../widget-modules/pipes/show-type-translater/show-type.pipe';
import {Show} from '../../services/show';

export interface ShareDialogData {
  url: string;
  show: Show;
}

@Component({
  selector: 'app-share-dialog',
  imports: [MatButton, MatDialogActions, MatDialogContent, MatDialogClose],
  templateUrl: './share-dialog.component.html',
  styleUrl: './share-dialog.component.less',
})
export class ShareDialogComponent {
  public data = inject<ShareDialogData>(MAT_DIALOG_DATA);

  public qrCode = '';

  public constructor() {
    const data = this.data;

    void this.generateQrCode(data.url).then(qrCode => (this.qrCode = qrCode));
  }

  public async share(): Promise<void> {
    if (navigator.clipboard) await navigator.clipboard.writeText(this.data.url);

    if (navigator.share)
      await navigator.share({
        title: new ShowTypePipe().transform(this.data.show.showType),
        text: new ShowTypePipe().transform(this.data.show.showType) + ' am ' + this.data.show.date.toDate().toLocaleString('de'),
        url: this.data.url,
      });
  }

  private async generateQrCode(url: string): Promise<string> {
    const {default: QRCode} = await import('qrcode');
    return await QRCode.toDataURL(url, {
      type: 'image/jpeg',
      quality: 0.92,
      width: 1280,
      height: 1280,
      color: {
        dark: '#010414',
        light: '#ffffff',
      },
    });
  }
}
