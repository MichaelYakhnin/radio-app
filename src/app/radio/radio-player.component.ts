import { Component, OnInit} from "@angular/core";
import { RadioSt} from '../radio';

@Component({
  selector: "app-radio-player",
  templateUrl: "./radio-player.component.html",
  styleUrls: ["./radio-player.component.scss"]
})

export class RadioPlayerComponent implements OnInit {

  radioStations = RadioSt;
  src: any;
  stImages: any[] = [];

  constructor() { }

  ngOnInit(): void {

   let arr = localStorage.getItem('stations');
   if(arr){
    this.stImages = JSON.parse(arr);
   }
  }

  play(id):void {
    this.src = '';
    this.src = this.getSrcById(id);

    //setTimeout(() => this.src = this.getSrcById(id), 50);
  }
  getSrcById(id): any {
    return this.radioStations[id];
  }
  addToFavorities(id): void {
    this.stImages.push({path: 'assets/images/small/' + this.getSrcById(id)[0] + '.jpg', id: id});
    localStorage.setItem('stations',JSON.stringify(this.stImages));
  }
}

