import { ODataService, ODataQuery } from 'odata-v4-ng';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { base } from './urls';

export class OdataService {
  private url: string;
  constructor(private odataService: ODataService, private entity: string) {
    this.url = base + '/odata/';
  }

  public list<TResponse>(): Observable<TResponse[]> {
    const query = new ODataQuery(this.odataService, this.url).entitySet(
      this.entity
    );
    const get = query.get().pipe(map(_ => _.toPropertyValue<TResponse[]>()));

    return get;
  }

  public get<TResponse>(id: number): Observable<TResponse> {
    const query = new ODataQuery(this.odataService, this.url)
      .entitySet(this.entity)
      .entityKey(id);
    const get = query.get().pipe(map(_ => _.toEntity<TResponse>()));

    return get;
  }
}
