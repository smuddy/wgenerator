import {Expand, ODataQuery, ODataService} from 'odata-v4-ng';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';

export class ODataBaseService {
    private readonly url: string;

    constructor(private odataService: ODataService, private entity: string) {
        this.url = `${environment.api}/odata/`;
    }

    public list$<TResponse>(properties: string[], skip: number = null, top: number = null): Observable<{ count: number, data: TResponse[] }> {
        const query = new ODataQuery(this.odataService, this.url)
            .entitySet(this.entity)
            .countOption(true)
            .skip(skip)
            .top(top)
            .select(properties);

        const get = query.get().pipe(map(_ => ({
            count: _.getBodyAsJson()['@odata.count'],
            data: _.toPropertyValue<TResponse[]>()
        })));

        return get;
    }

    public get$<TResponse>(
        id: number,
        select: string[],
        expands: string[]
    ): Observable<TResponse> {
        const query = new ODataQuery(this.odataService, this.url)
            .entitySet(this.entity)
            .entityKey(id)
            .expand(expands.map(_ => new Expand(_)))
            .select(select);
        const get = query.get().pipe(map(_ => _.toEntity<TResponse>()));

        return get;
    }

    public patch$(id: number, control: string, value: any): Observable<boolean> {
        const valueSet = {[control]: value};
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
