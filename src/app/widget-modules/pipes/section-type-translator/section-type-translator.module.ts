import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SectionTypePipe} from './section-type.pipe';

@NgModule({
  declarations: [SectionTypePipe],
  exports: [SectionTypePipe],
  imports: [CommonModule],
})
export class SectionTypeTranslatorModule {}
