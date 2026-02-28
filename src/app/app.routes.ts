
import { Routes } from '@angular/router';
import { RadioPlayerComponent } from './radio/radio-player.component';

export const routes: Routes = [
    { path: 'radio', component: RadioPlayerComponent },
    { path: '',   redirectTo: '/radio', pathMatch: 'full' },
]; // sets up routes constant where you define your routes


