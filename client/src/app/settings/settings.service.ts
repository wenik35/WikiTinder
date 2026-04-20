import { Injectable } from '@angular/core';
import { SettingsModel } from './settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private appSettings: SettingsModel = new SettingsModel();

  get settings(): SettingsModel {
    return this.appSettings;
  }

  public updateSettings(newSettings: Partial<SettingsModel>): void {
    this.appSettings = { ...this.appSettings, ...newSettings };
  }

  public resetSettings(): void {
    this.appSettings = new SettingsModel();
  }
}
