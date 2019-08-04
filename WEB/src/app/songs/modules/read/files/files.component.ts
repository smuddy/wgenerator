import {Component, Input, OnInit} from '@angular/core';
import {Song} from 'src/app/songs/models/song.model';
import {SongsService} from 'src/app/data/songs.service';
import {DownloadService} from 'src/app/data/download.service';
import {faDownload, faEdit, faFileUpload, faLongArrowAltLeft, faTrash} from '@fortawesome/free-solid-svg-icons';
import {FileuploadFactory} from 'src/app/songs/services/fileupload.factory';
import {FileUploader} from 'ng2-file-upload';

@Component({
    selector: 'app-song-files',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.less']
})
export class SongFilesComponent implements OnInit {
    @Input() public song: Song;
    public faFileUpload = faFileUpload;
    public faTrash = faTrash;
    public faArrow = faLongArrowAltLeft;
    public faDownload = faDownload;
    public faEdit = faEdit;
    public columns = ['name', 'action'];
    public newFileUploader: FileUploader;
    public fileEditId: number;

    public fileOverNew = false;

    constructor(
        private downloadService: DownloadService,
        private fileuploadFactory: FileuploadFactory,
        private songService: SongsService
    ) {
    }

    public ngOnInit(): void {
        this.newFileUploader = FileuploadFactory.provideForNewFiles(this.song.ID);
    }

    public onClickDownload(fileId: number, filename): void {
        this.downloadService.get(this.song.ID, fileId, filename);
    }

    public onFileOverNew(hover: boolean): void {
        this.fileOverNew = hover;
    }

    public onClickEdit(fileId: number): void {
        this.fileEditId = fileId;
    }

    public onClickDelete(fileId: number): void {
        const songId = this.song.ID;
        this.songService
            .deleteFile$(songId, fileId)
            .subscribe();
    }
}
