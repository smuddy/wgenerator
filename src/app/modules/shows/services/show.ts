import {Timestamp} from '@angular/fire/firestore';

export type PresentationBackground = 'none' | 'blue' | 'green' | 'leder' | 'praise' | 'bible';
export type ReportedType = null | 'pending' | 'reported' | 'not-required';

export interface Show {
  id: string;
  showType: string;
  date: Timestamp;
  owner: string;
  songIds?: string[];
  public: boolean;
  reportedType: ReportedType;
  published: boolean;
  archived: boolean;
  order: string[];
  shareId: string;

  presentationSongId: string;
  presentationDynamicCaption: string;
  presentationDynamicText: string;
  presentationSection: number;
  presentationZoom: number;
  presentationBackground: PresentationBackground;
}
