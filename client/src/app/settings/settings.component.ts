import { Component } from '@angular/core';
import { SettingsService } from './settings.service';
import { SettingsModel } from './settings.model';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DbpediaApiService } from '../api/dbpedia-api.service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, CdkDrag, CdkDropList],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  public settings: SettingsModel;
  public settingsService: SettingsService;
  public apiService: DbpediaApiService;

  constructor(settingsService: SettingsService, apiService: DbpediaApiService) {
    this.settingsService = settingsService;
    this.apiService = apiService;
    this.settings = this.settingsService.settings;
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.settings.languagePreferences, event.previousIndex, event.currentIndex);
  }

  public save() {
    this.settingsService.updateSettings(this.settings);
    this.apiService.updateEntryCount();
  }

  public reset() {
    this.settingsService.resetSettings();
    this.settings = this.settingsService.settings;
  }

  public removeLanguage(language: string) {
    this.settings.languagePreferences = this.settings.languagePreferences.filter(lang => lang !== language);
  }

  public addLanguage(event: Event) {
    const input = event.target as HTMLInputElement;
    const newLanguage = input.value.trim();

    if (newLanguage && !this.settings.languagePreferences.includes(newLanguage)) {
      this.settings.languagePreferences.push(newLanguage);
    }

    input.value = '';
  }
}
