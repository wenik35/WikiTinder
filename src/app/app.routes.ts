import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
    { path: '', component: GameComponent },
    { path: 'settings', component: SettingsComponent },
];
