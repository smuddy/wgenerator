import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DownloadService {
    constructor(private httpClient: HttpClient) {
    }

    public get(songId: number, fileId: number, filename: string) {
        return this.httpClient
            .get(`${environment.api}/api/songs/${songId}/files/${fileId}`, {
                responseType: 'blob' as 'json',
                observe: 'response'
            })
            .subscribe(
                (response: any) => {
                    const contentType = response.headers.get('Content-Type');
                    const downloadLink = document.createElement('a');
                    const blob = new Blob([response.body], {type: contentType});
                    downloadLink.href = window.URL.createObjectURL(blob);
                    downloadLink.setAttribute('download', filename);
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                },
                error => {
                    console.log('download error:', JSON.stringify(error));
                }
            );
    }
}
