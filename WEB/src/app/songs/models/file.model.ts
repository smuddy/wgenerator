import {FileType} from './files-types.model';

export interface File {
    ID: number;
    Name: string;
    FileType: FileType;
}
