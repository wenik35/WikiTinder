import { Injectable } from '@angular/core';
import { Person } from './person';

@Injectable({
  providedIn: 'root'
})
export class DbpediaApiService {
  private countUrl = 'https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+dbo%3A+<http%3A%2F%2Fdbpedia.org%2Fontology%2F>%0D%0A%0D%0ASELECT+COUNT%28%3Fperson%29%0D%0AWHERE+%7B%0D%0A++%3Fperson+a+dbo%3APerson+.%0D%0A++%3Fperson+dbo%3Athumbnail+%3Fpic+.%0D%0A++%3Fperson+dbo%3AbirthName+%3Fname%0D%0A%0D%0A++FILTER%28LANG%28%3Fname%29+%3D+"en"%29%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on';
  private personQuery = 'https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=++PREFIX+dbo%3A+<http%3A%2F%2Fdbpedia.org%2Fontology%2F>%0D%0A++PREFIX+dbp%3A+<http%3A%2F%2Fdbpedia.org%2Fproperty%2F>%0D%0A++SELECT+%3Fperson%2C+%3Fimage%2C+%3Fname%2C+%3Fdescription%0D%0A++WHERE+%7B%0D%0A++++%3Fperson+a+dbo%3APerson+.%0D%0A++++%3Fperson+dbo%3Athumbnail+%3Fimage+.%0D%0A++++%3Fperson+dbo%3Adescription+%3Fdescription+.%0D%0A++++%3Fperson+dbp%3Aname+%3Fname%0D%0A++%7D%0D%0A++OFFSET+{offset}%0D%0A++LIMIT+1&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on';

  private totalEntries: number = 0;
  public buffer: Person[] = [];

  constructor() {
    this.setEntryCount()
    .then(() => {
      this.increaseBuffer(10); // Preload some entries
    })
    .catch(error => {
      console.error('Error fetching entry count:', error);
    });
  }

  private setEntryCount(): Promise<void> {
    return fetch(this.countUrl).then(response => response.json()).then(data => {
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
    const url = this.personQuery.replace('{offset}', randomOffset.toString());

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
