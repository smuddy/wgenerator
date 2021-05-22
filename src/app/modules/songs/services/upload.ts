export class Upload {
  public file: File;
  public name = '';
  public path = '';
  public progress = 0;
  public createdAt: Date = new Date();

  public constructor(file: File) {
    this.file = file;
  }
}
