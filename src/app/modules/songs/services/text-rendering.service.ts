import {Injectable} from '@angular/core';

export enum SectionType {
  Verse,
  Chorus,
  Bridge,
}

export enum LineType {
  title,
  chrod,
  text,
}

export interface Line {
  type: LineType;
  text: string;
}


export interface Section {
  type: SectionType;
  number: number;
  lines: Line[];
}

@Injectable({
  providedIn: 'root'
})
export class TextRenderingService {

  constructor() {
  }


}
