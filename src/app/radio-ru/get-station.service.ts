import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetStationService {

  constructor(private http: HttpClient) { }

  getStation(src: string): Observable<string> {
    return this.http.get<string>(src);
  }
}
