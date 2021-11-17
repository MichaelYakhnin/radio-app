import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module'; // CLI imports
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import {RadioPlayerComponent} from './radio/radio-player.component';
import { TvComponent } from './tv/tv.component';
import {AppHeaderComponent} from './header/app-header.component';
import { AudioComponent } from './audio/audio-component/audio-component.component';
import { RadioRuComponent } from './radio-ru/radio-ru.component';


@NgModule({
  declarations: [
    AppComponent,
    RadioPlayerComponent,
    AppHeaderComponent,
    TvComponent,
    AudioComponent,
    RadioRuComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
