import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module'; // CLI imports


import { AppComponent } from './app.component';
import {RadioPlayerComponent} from './radio/radio-player.component';

import {AppHeaderComponent} from './header/app-header.component';
import { AudioComponent } from './audio/audio-component/audio-component.component';
import { RadioRuComponent } from './radio-ru/radio-ru.component';


@NgModule({
  declarations: [
    AppComponent,
    RadioPlayerComponent,
    AppHeaderComponent,

    AudioComponent,
    RadioRuComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
