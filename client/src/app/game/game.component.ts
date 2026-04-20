import { Component } from '@angular/core';
import { CardComponent } from './card/card.component';
import { DbpediaApiService } from '../api/dbpedia-api.service';
import { Person } from '../api/person';

@Component({
  selector: 'app-game',
  imports: [CardComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  public dbPediaService: DbpediaApiService;

  constructor(dbpediaService: DbpediaApiService) {
    this.dbPediaService = dbpediaService;
  }

  private log: Person[] = [];

  onSwiped(direction: 'left' | 'right') {
    let person = this.dbPediaService.buffer.shift()!;
    person.known = direction === 'right';
    this.log.push(person);

    this.dbPediaService.increaseBuffer(1);
  }
}
