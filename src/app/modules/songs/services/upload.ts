export class Upload {

  $key: string;
  file: Upload;
  name: string;
  path: string;
  progress: number;
  createdAt: Date = new Date();

  constructor(file: Upload) {
    this.file = file;
  }
}
