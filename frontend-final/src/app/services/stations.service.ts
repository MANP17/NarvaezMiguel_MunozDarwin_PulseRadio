import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StationsService {
  private url = "https://de1.api.radio-browser.info/json"
  constructor(private http: HttpClient) { }

  getPopular(): Observable<any> {
    return this.http.get(`${this.url}/stations/topvote/50`)
  }

  searchStations(name: string): Observable<any> {
    const params = {
      name: name,
      limit: 100
    };
    return this.http.get(`${this.url}/stations/search`, {params})
  }

  getTags(): Observable<any> {
    return this.http.get(`${this.url}/tags?order=stationcount&reverse=true&limit=10`)
  }

  searchStationsByTag(tag: string, limit: number): Observable<any> {
    const params = {
      tag: tag,
      limit: limit
    };
    return this.http.get(`${this.url}/stations/search`, {params})
  }

  searchStationsByName(name: string, tag: string, limit: number): Observable<any> {
    const params = {
      tag: tag,
      name: name,
      limit: limit
    };
    return this.http.get(`${this.url}/stations/search`, {params})
  }
}
