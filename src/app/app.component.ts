import { Component } from '@angular/core';
import { CardComponent } from './card/card.component';
import { DbpediaApiService } from './api/dbpedia-api.service';
import { Person } from './api/person';
import { SettingsComponent } from "./settings/settings.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CardComponent, SettingsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
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
