import { FileType } from './files-types.model.ts';
export interface File {
  ID: number;
  Name: string;
  FileType: FileType;
}
