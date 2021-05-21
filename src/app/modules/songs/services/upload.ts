export class Upload {
  public $key: string;
  public file: File;
  public name: string;
  public path: string;
  public progress: number;
  public createdAt: Date = new Date();

  public constructor(file: File) {
    this.file = file;
  }
}
