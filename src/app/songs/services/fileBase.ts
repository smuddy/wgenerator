export class FileBase {

  protected basePath = '/attachments';
  protected directory = (songId: string) => `${this.basePath}/${songId}`;
}
