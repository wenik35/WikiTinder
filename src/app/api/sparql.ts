import { SettingsModel } from "../settings/settings.model";

export class SPARQLContext {
    constructor() {}

    public queryCount(settings: SettingsModel): string {
        return this.buildUrl(`
            ${this.prefixes}

            ${this.selectCount}
            WHERE {
                ${this.standardWhereClause}
                ${settings.onlyLivingPeople ? this.filterLivingPeople : ''}
                ${settings.onlyWithImages ? this.filterWithImages : ''}
                ${settings.onlyWithPreferredLanguage ? this.filterPreferredLanguage.replace('{languages}', settings.languagePreferences.map(lang => `"${lang}"`).join(', ')) : ''}
            }
        `);
    }

    public queryPerson(settings: SettingsModel, offset: number): string {
        return this.buildUrl(`
            ${this.prefixes}

            ${this.selectPerson} ${settings.onlyWithImages ? ', ?image' : ''}
            WHERE {
                ${this.standardWhereClause}
                ${settings.onlyLivingPeople ? this.filterLivingPeople : ''}
                ${settings.onlyWithImages ? this.filterWithImages : ''}
                ${settings.onlyWithPreferredLanguage ? this.filterPreferredLanguage.replace('{languages}', settings.languagePreferences.map(lang => `"${lang}"`).join(', ')) : ''}
            }
            ${this.randomOffset.replace('{offset}', offset.toString())}
        `);
    }

    public buildUrl(query: string): string {
        const compactQuery = this.collapseWhitespace(query);
        const encodedQuery = encodeURIComponent(compactQuery);
        return `${this.endpoint}${this.queryTemplate}${encodedQuery}${this.options}`;
    }

    private collapseWhitespace(input: string): string {
        return input.replace(/\s+/g, ' ').trim();
    }
    private endpoint: string = 'https://dbpedia.org/sparql';
    private options: string = '&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on';
    private queryTemplate: string = '?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=';

    private prefixes: string = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
    `;

    private selectCount: string = 'SELECT COUNT(?person)';
    private selectPerson: string = 'SELECT ?person, ?name, ?description';

    private standardWhereClause: string = `
            ?person a dbo:Person .
            ?person dbo:description ?description .
            ?person dbp:name ?name .
    `;

    private filterLivingPeople: string = '?person dbo:deathDate ?deathDate . FILTER(!BOUND(?deathDate)) .';
    private filterPreferredLanguage: string = 'FILTER(LANG(?description) IN ({languages})) .';
    private filterWithImages: string = '?person dbo:thumbnail ?image .';

    private randomOffset: string = `
        OFFSET {offset}
        LIMIT 1
    `
}