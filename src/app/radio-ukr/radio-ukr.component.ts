import { Component, OnInit } from '@angular/core';
import radioStRu from '../ukr.json';
import {Station} from '../models/station';

@Component({
  selector: 'app-radio-ukr',
  templateUrl: './radio-ukr.component.html',
  styleUrls: ['./radio-ukr.component.scss']
})
export class RadioUkrComponent implements OnInit {
  public stationList:{Name:string, Title:string, Src: string,Image: string}[] = radioStRu;
  src: Station = new Station();
  favorities: any[] = [];
  constructor() { }

  ngOnInit(): void {

    let arr = localStorage.getItem('stationsUkr');
    if(arr){
     this.favorities = JSON.parse(arr);
    }
   }

   play(id):void {
    setTimeout(() => this.src = this.getSrcById(id), 100);
   }
   getSrcById(id): any {
     let st = this.stationList[id];

     return st;
   }
   addToFavorities(id): void {
     const st = this.getSrcById(id);
    this.favorities.push({path: 'assets/ukr/' + st.Image, id: id});
     localStorage.setItem('stationsUkr',JSON.stringify(this.favorities));
   }

 }
