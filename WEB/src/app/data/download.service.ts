import { base } from './urls';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  constructor(private httpClient: HttpClient) {}

  public get(id: number, withKey: boolean) {
    return this.httpClient
      .get(base + '/' + id + '?withKey=' + withKey, {
        responseType: 'blob' as 'json'
      })
      .subscribe(
        (response: any) => {
          const dataType = response.type;
          const binaryData = [];
          binaryData.push(response);
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(
            new Blob(binaryData)
          );
          downloadLink.setAttribute('download', id + '.doc');
          document.body.appendChild(downloadLink);
          downloadLink.click();
        },
        error => {
          console.log('download error:', JSON.stringify(error));
        }
      );
  }
}
