
import { Routes } from '@angular/router';
import { RadioPlayerComponent } from './radio/radio-player.component';

export const routes: Routes = [  
    { path: '',   redirectTo: '/radio', pathMatch: 'full' },
    { path: 'radio', component: RadioPlayerComponent },
]; // sets up routes constant where you define your routes


