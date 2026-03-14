import { Injectable } from '@angular/core';
import { Person } from './person';
import { SPARQLContext } from './sparql';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root'
})
export class DbpediaApiService {
  public totalEntries: number = 0;
  
  private sparqlContext = new SPARQLContext();

  constructor(private settingsService: SettingsService) {
    this.updateEntryCount()
    .catch(error => {
      console.error('Error fetching entry count:', error);
    });
  }

  public buffer: Person[] = [];

  public updateEntryCount(): Promise<void> {
    const url = this.sparqlContext.queryCount(this.settingsService.settings);

    return fetch(url).then(response => response.json()).then(data => {
      const count = data.results.bindings[0]['callret-0'].value;
      this.totalEntries = parseInt(count, 10);

      this.buffer = [];
      this.increaseBuffer(10);
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
    const url = this.sparqlContext.queryPerson(this.settingsService.settings, randomOffset);

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
