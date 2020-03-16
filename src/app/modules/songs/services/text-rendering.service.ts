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

  private regexSection = /(Strophe|Refrain|Bridge)/;
  private regexChords = /\b([CDEFGAHBcdefgahb](#|##|b|bb|sus|maj|maj7|min|aug|\d+|\/[CDEFGAHBcdefgahb])?\b)/;

  public parse(text: string): Section[] {
    const arrayOfLines = text.split(/\r?\n/).filter(_ => _);
    const sections = arrayOfLines.reduce((array, line) => {
      if (line.match(this.regexSection)) return [...array, {
        type: this.getSectionTypeOfLine(line),
        number: -1,
        lines: []
      }];
      array[array.length - 1].lines.push(this.getLineOfLineText(line));
      return array;
    }, [] as Section[]);

    return sections;
  }

  private getLineOfLineText(text: string): Line {
    const matches = !!text.match(this.regexChords);
    const type = matches ? LineType.chrod : LineType.text;
    return {type, text}
  }

  private getSectionTypeOfLine(line: string): SectionType {
    const typeString = line.match(this.regexSection)[1];
    switch (typeString) {
      case  "Strophe":
        return SectionType.Verse;
      case  "Refrain":
        return SectionType.Chorus;
      case  "Bridge":
        return SectionType.Bridge;
    }
  }

}
