import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongListComponent} from './song-list.component';
import {ListItemComponent} from './list-item/list-item.component';
import {CardModule} from '../../widget-modules/components/card/card.module';
import {RouterModule} from '@angular/router';
import {LegalTypeTranslatorModule} from '../../widget-modules/pipes/legal-type-translator/legal-type-translator.module';


@NgModule({
  declarations: [SongListComponent, ListItemComponent],
  exports: [SongListComponent],
    imports: [
        CommonModule,
        RouterModule,

        CardModule,
        LegalTypeTranslatorModule
    ]
})
export class SongListModule {
}
