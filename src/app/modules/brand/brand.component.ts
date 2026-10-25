import {Component} from '@angular/core';
import {LogoComponent} from '../../widget-modules/components/logo/logo.component';
import {version} from '../../../../package.json';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.less'],
  imports: [LogoComponent],
})
export class BrandComponent {
  protected readonly version = version;
}
