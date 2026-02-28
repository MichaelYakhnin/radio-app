import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Add this import

@Component({
    selector: "app-header",
    templateUrl: "./app-header.component.html",
    styleUrls: ["./app-header.component.scss"],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule  // Add RouterModule to imports array
    ]
})

export class AppHeaderComponent{
  headerTitles = ['Radio Israel','Radio Ukraine'];
  index = 0;
  navbarOpen = false;

  toggleNavbar(path: string) {
    this.navbarOpen = !this.navbarOpen;
    if(path){
      if(path.includes('ukr')) this.index = 1;
        if(path.includes('isr')) this.index = 0;
    }
  }
}
