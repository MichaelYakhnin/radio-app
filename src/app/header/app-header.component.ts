import { Component } from '@angular/core';

@Component({
  selector: "app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"]
})

export class AppHeaderComponent{
  headerTitles = ['Radio Israel','Radio  Москва'];
  index = 0;
  navbarOpen = false;

  toggleNavbar(path: string) {
    this.navbarOpen = !this.navbarOpen;
    if(path){
        if(path.includes('ru')) this.index = 1;
        if(path.includes('is')) this.index = 0;
    }
  }
}
