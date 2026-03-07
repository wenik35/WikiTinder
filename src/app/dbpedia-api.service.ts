import { Injectable } from '@angular/core';
import { Person } from './person';

@Injectable({
  providedIn: 'root'
})
export class DbpediaApiService {
  private countUrl = 'https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+dbo%3A+<http%3A%2F%2Fdbpedia.org%2Fontology%2F>%0D%0A%0D%0ASELECT+COUNT%28%3Fperson%29%0D%0AWHERE+%7B%0D%0A++%3Fperson+a+dbo%3APerson+.%0D%0A++%3Fperson+dbo%3Athumbnail+%3Fpic+.%0D%0A++%3Fperson+dbo%3AbirthName+%3Fname%0D%0A%0D%0A++FILTER%28LANG%28%3Fname%29+%3D+"en"%29%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on';
  private randomPersonUrl = 'https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+dbo%3A+<http%3A%2F%2Fdbpedia.org%2Fontology%2F>%0D%0ASELECT+%3Fperson%2C+%3Fimage%0D%0AWHERE+%7B%0D%0A++%3Fperson+a+dbo%3APerson+.%0D%0A++%3Fperson+dbo%3Athumbnail+%3Fimage%0D%0A%7D%0D%0AOFFSET+{offset}%0D%0ALIMIT+1&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on';

  private totalEntries: number = 0;

  constructor() {
    this.setEntryCount().catch(error => {
      console.error('Error fetching entry count:', error);
    });
  }

  private setEntryCount(): Promise<void> {
    return fetch(this.countUrl).then(response => response.json()).then(data => {
      const count = data.results.bindings[0]['callret-0'].value;
      this.totalEntries = parseInt(count, 10);
    });
  }

  public getRandomPerson(): Promise<Person> {
    const randomOffset = Math.floor(Math.random() * this.totalEntries);
    const url = this.randomPersonUrl.replace('{offset}', randomOffset.toString());
    
    return fetch(url).then(response => response.json()).then(data => {
      const binding = data.results.bindings[0];
      return {
        name: binding['name'] ? binding['name'].value : 'Unknown',
        image: binding['image'] ? binding['image'].value : '',
        known: undefined
      };
    });
  }
}
