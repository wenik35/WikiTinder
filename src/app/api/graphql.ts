export class SPARQLContext {
    private endpoint: string = 'https://dbpedia.org/sparql';
    private options: string = '&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on';
    private queryTemplate: string = '?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=';

    constructor() {}

    public buildUrl(query: string): string {
        const encodedQuery = encodeURIComponent(query);
        return `${this.endpoint}${this.queryTemplate}${encodedQuery}${this.options}`;
    }

    public countQuery: string = `
        PREFIX dbo: <http://dbpedia.org/ontology/>

        SELECT COUNT(?person)
        WHERE {
        ?person a dbo:Person .
        ?person dbo:thumbnail ?pic .
        ?person dbo:birthName ?name

        FILTER(LANG(?name) = "en")
        }
    `;

    public personQuery: string = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
        SELECT ?person, ?image, ?name, ?description
        WHERE {
            ?person a dbo:Person .
            ?person dbo:thumbnail ?image .
            ?person dbo:description ?description .
            ?person dbp:name ?name
        }
        OFFSET {offset}
        LIMIT 1
    `;
}