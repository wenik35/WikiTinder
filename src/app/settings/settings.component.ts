import { Component } from '@angular/core';
import { SettingsService } from './settings.service';
import { SettingsModel } from './settings.model';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, CdkDrag, CdkDropList],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  public settings: SettingsModel;
  public settingsService: SettingsService;

  constructor(settingsService: SettingsService) {
    this.settingsService = settingsService;
    this.settings = this.settingsService.settings;
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.settings.languagePreferences, event.previousIndex, event.currentIndex);
  }

  public save() {
    this.settingsService.updateSettings(this.settings);
  }
}
