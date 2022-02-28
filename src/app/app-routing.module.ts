import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RadioPlayerComponent } from './radio/radio-player.component';
import { RadioRuComponent} from './radio-ru/radio-ru.component';
import { RadioUkrComponent } from './radio-ukr/radio-ukr.component';

const routes: Routes = [
    { path: 'radio', component: RadioPlayerComponent },
    { path: 'radio-ru',component: RadioRuComponent },
    { path: 'radio-ukr',component: RadioUkrComponent },
    { path: '',   redirectTo: '/radio', pathMatch: 'full' },
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
