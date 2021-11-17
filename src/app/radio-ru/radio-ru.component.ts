import { Component, OnInit } from '@angular/core';
import radioStRu from '../msk.json';
import {GetStationService} from './get-station.service';


@Component({
  selector: 'app-radio-ru',
  templateUrl: './radio-ru.component.html',
  styleUrls: ['./radio-ru.component.scss']
})
export class RadioRuComponent implements OnInit {
  public stationList:{Title:string, Genre:string,Src: string}[] = radioStRu;
  src: any;
  favorities: any[] = [];
  constructor(private getStationService: GetStationService) { }

  ngOnInit(): void {

    let arr = localStorage.getItem('stationsRu');
    if(arr){
     this.favorities = JSON.parse(arr);
    }
   }
 
   play(id):void {
     this.src = '';
    // this.src = this.getSrcById(id);
 
    setTimeout(() => this.src = this.getSrcById(id), 50);
   }
   async getSrcById(id): Promise<any> {
     let st = this.stationList[id];
     st.Src = await this.getSrc(st.Src);
     return st;
   }
   async addToFavorities(id): Promise<void> {
     const st = await this.getSrcById(id);
    this.favorities.push({path: 'assets/msk/images/' + st.Name + '.gif', id: id});
     localStorage.setItem('stationsRu',JSON.stringify(this.favorities));
   }
   getType(src: string): string{
     return src.includes("m3u") ? "audio/mpegURL":"audio/mpeg";
   } 
   async getSrc(src: string): Promise<string>{
     if(src && src.includes("m3u")){
      let st = await this.getStationService.getStation(src).toPromise();
      return st;
     } 
     return src;
    }
 }
