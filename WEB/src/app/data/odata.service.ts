import { Song } from 'src/app/models/song.model';
import { ODataService, ODataQuery } from 'odata-v4-ng';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { base } from './urls';

export class OdataService {
  private url: string;
  constructor(private odataService: ODataService, private entity: string) {
    this.url = base + '/odata/';
  }

  public list$<TResponse>(properties: string[]): Observable<TResponse[]> {
    const query = new ODataQuery(this.odataService, this.url)
      .entitySet(this.entity)
      .select(properties);
    const get = query.get().pipe(map(_ => _.toPropertyValue<TResponse[]>()));

    return get;
  }

  public get$<TResponse>(
    id: number,
    properties: string[]
  ): Observable<TResponse> {
    const query = new ODataQuery(this.odataService, this.url)
      .entitySet(this.entity)
      .entityKey(id)
      .select(properties);
    const get = query.get().pipe(map(_ => _.toEntity<TResponse>()));

    return get;
  }

  public patch$(id: number, control: string, value: any): Observable<boolean> {
    const valueSet = { [control]: value };
    const query = new ODataQuery(this.odataService, this.url)
      .entitySet(this.entity)
      .entityKey(id);
    const get = query.patch(valueSet).pipe(map(() => true));

    return get;
  }

  public post$<TResponse>(values: any): Observable<TResponse> {
    const querry = new ODataQuery(this.odataService, this.url);
    const post = querry
      .entitySet(this.entity)
      .post(values)
      .pipe(
        tap(_ => console.log(_)),
        map(_ => {
          const mapped = _.toEntity<TResponse>();
          return mapped;
        }),
        tap(_ => console.log(_))
      );

    return post;
  }
}
