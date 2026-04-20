import { Injectable } from '@angular/core';
import { Person } from './person';
// Using local server instead of SPARQL endpoint
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root'
})
export class DbpediaApiService {
  public totalEntries: number = 0;
  
  private serverBase = 'http://localhost:3000';

  constructor(private settingsService: SettingsService) {
    this.updateEntryCount()
    .catch(error => {
      console.error('Error fetching entry count:', error);
    });
  }

  public buffer: Person[] = [];

  public updateEntryCount(): Promise<void> {
    const url = `${this.serverBase}/get-random-lines?count=1`;

    return fetch(url).then(response => response.json()).then(data => {
      this.totalEntries = data.total_available || 0;

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
    const url = `${this.serverBase}/get-random-lines?count=1`;

    return fetch(url).then(response => response.json()).then(data => {
      const line = (data.data && data.data[0]) || '';
      // CSV format: resource,name,description,imageURL
      const parts = line.split(',');
      const name = parts[1] || 'Unknown';
      const description = parts[2] || 'No description available.';
      const image = parts.slice(3).join(',') || '';

      return {
        name: name,
        description: description,
        image: image,
        known: undefined
      };
    });
  }
}
