import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: "app-tv",
  templateUrl: "./tv.component.html",
  styleUrls: ["./tv.component.scss"]
})

export class TvComponent implements OnInit {
  url: string[] = [
    "https://www.dailymotion.com/embed/video/x7wjmog?autoplay=1"
  ];
  urlSafe: SafeResourceUrl;
  displayTV = false;

  constructor(public sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.displayTV = true;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url[0]);
  }
  openCh(ch: number): void{
    setTimeout(() => this.displayTV = false,50);
    this.displayTV = true;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url[ch]);
  }
}
