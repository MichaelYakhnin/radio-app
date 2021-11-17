import { Component, OnInit } from '@angular/core';
import radioStRu from '../msk.json';


@Component({
  selector: 'app-radio-ru',
  templateUrl: './radio-ru.component.html',
  styleUrls: ['./radio-ru.component.scss']
})
export class RadioRuComponent implements OnInit {
  public stationList:{Name:string, Title:string, Src: string,Image: string}[] = radioStRu;
  src: any;
  favorities: any[] = [];
  constructor() { }

  ngOnInit(): void {

    let arr = localStorage.getItem('stationsRu');
    if(arr){
     this.favorities = JSON.parse(arr);
    }
   }
 
   play(id):void {
     this.src = '';
     //this.src = this.getSrcById(id);
    setTimeout(() => this.src = this.getSrcById(id), 100);
   }
   getSrcById(id): any {
     let st = this.stationList[id];
     
     return st;
   }
   addToFavorities(id): void {
     const st = this.getSrcById(id);
    this.favorities.push({path: 'assets/msk/images/' + st.Image, id: id});
     localStorage.setItem('stationsRu',JSON.stringify(this.favorities));
   }

 }
