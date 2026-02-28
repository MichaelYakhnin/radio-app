import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import{AppHeaderComponent} from './header/app-header.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,AppHeaderComponent],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  title = 'radio-app';
}