import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl: string = "http://localhost:5271/api/Favorites";
  favoritesChanged$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }
  getFavorites() {
    return this.http.get<{isSuccess: boolean, favorites: any[]}>(`${this.apiUrl}/favorites`, {
      withCredentials: true
    })
  }

  addFavorite(data: {uuid: string, favicon: string, url: string, urlResolved: string, name: string, location: string, language: string}) {
    return this.http.post(`${this.apiUrl}/new-favorite`, data, {
      withCredentials: true
    }).pipe(
      tap(() => this.favoritesChanged$.next(true))
    );
  }

  deleteFavorite(uuid: string) {
    return this.http.delete(`${this.apiUrl}/delete-favorite/${uuid}`, {
      withCredentials: true
    }).pipe(
      tap(() => this.favoritesChanged$.next(true))
    );
  }
}
