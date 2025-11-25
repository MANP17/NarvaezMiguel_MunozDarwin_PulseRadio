import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomService {
  private apiUrl: string = 'http://localhost:5271/api/Custom';
  constructor(private http: HttpClient) {}

  getCustom(): Observable<any> {
    return this.http.get(`${this.apiUrl}/custom`, {
      withCredentials: true,
    });
  }

  addCustom(data: { name: string; url: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/new-custom`, data, {
      withCredentials: true,
    });
  }

  deleteCustom(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/delete-custom/${id}`, {
        withCredentials: true,
      })
  }
}
