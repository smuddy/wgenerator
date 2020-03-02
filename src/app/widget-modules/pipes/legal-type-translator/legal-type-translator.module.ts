import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalTypePipe } from './legal-type.pipe';



@NgModule({
    declarations: [LegalTypePipe],
    exports: [
        LegalTypePipe
    ],
    imports: [
        CommonModule
    ]
})
export class LegalTypeTranslatorModule { }
