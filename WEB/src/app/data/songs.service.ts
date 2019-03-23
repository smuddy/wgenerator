import { Injectable } from '@angular/core';
import { ODataService } from 'odata-v4-ng';
import { OdataService } from './odata.service';
@Injectable({
  providedIn: 'root'
})
export class SongsService extends OdataService {
  constructor(odataService: ODataService) {
    super(odataService, 'songs');
  }
}
