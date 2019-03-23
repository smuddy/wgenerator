import { SongListItemModel } from './song-list-item.model';

export interface SongListModel {
  Page: number;
  Pages: number;
  SongList: SongListItemModel[];
}
