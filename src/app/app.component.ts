import { Component } from '@angular/core';
import { CardComponent } from './card/card.component';
import { DbpediaApiService } from './dbpedia-api.service';
import { Person } from './person';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private dbpediaService: DbpediaApiService) {
    this.dbpediaService.getRandomPerson().then(person => this.next.push(person));
    this.dbpediaService.getRandomPerson().then(person => this.next.push(person));
  }

  private log: Person[] = [];
  public next: Person[] = [];

  onSwiped(direction: 'left' | 'right') {
    let person = this.next.shift()!;
    person.known = direction === 'right';
    this.log.push(person);
    this.dbpediaService.getRandomPerson().then(person => this.next.push(person));
  }
}
