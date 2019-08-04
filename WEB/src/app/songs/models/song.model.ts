import {File} from './file.model';

export interface Song {
    ID: number;
    Number: number;
    Name: string;
    Text: string;
    Comments: string;
    Key: string;
    Tempo: number;
    SongType: string;
    Final: boolean;
    Files: File[];
}
