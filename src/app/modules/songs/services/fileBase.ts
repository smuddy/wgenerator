export class FileBase {
  protected basePath = '/attachments';
  protected directory: (songId: string) => string = (songId: string) => `${this.basePath}/${songId}`;
}
