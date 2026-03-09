import { Injectable } from '@angular/core';
import { Person } from './person';
import { SPARQLContext } from './graphql';

@Injectable({
  providedIn: 'root'
})
export class DbpediaApiService {
  private totalEntries: number = 0;
  private graphQLContext = new SPARQLContext();

  constructor() {
    this.setEntryCount()
    .then(() => {
      this.increaseBuffer(10); // Preload some entries
    })
    .catch(error => {
      console.error('Error fetching entry count:', error);
    });
  }

  public buffer: Person[] = [];

  private setEntryCount(): Promise<void> {
    const url = this.graphQLContext.buildUrl(this.graphQLContext.countQuery);

    return fetch(url).then(response => response.json()).then(data => {
      const count = data.results.bindings[0]['callret-0'].value;
      this.totalEntries = parseInt(count, 10);
    });
  }

  public increaseBuffer(count: number): void {
    for (let i = 0; i < count; i++) {
      this.getRandomPerson().then(person => {
        this.buffer.push(person);
      });
    }
  }

  private getRandomPerson(): Promise<Person> {
    const randomOffset = Math.floor(Math.random() * this.totalEntries);
    const url = this.graphQLContext.buildUrl(this.graphQLContext.personQuery.replace('{offset}', randomOffset.toString()));

    return fetch(url).then(response => response.json()).then(data => {
      const binding = data.results.bindings[0];
      return {
        name: binding['name'] ? binding['name'].value : 'Unknown',
        description: binding['description'] ? binding['description'].value : 'No description available.',
        image: binding['image'] ? binding['image'].value : '',
        known: undefined
      };
    });
  }
}
