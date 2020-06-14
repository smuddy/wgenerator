import {SectionType} from './section-type';
import {Line} from './line';

export interface Section {
  type: SectionType;
  number: number;
  lines: Line[];
}
