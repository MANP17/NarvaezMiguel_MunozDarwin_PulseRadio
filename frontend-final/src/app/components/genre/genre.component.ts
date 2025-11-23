import { Component, Input, OnInit } from '@angular/core';
import { StationsService } from '../../services/stations.service';
import { StationCardComponent } from '../station-card/station-card.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FavoritesService } from '../../services/favorites.service';
import { MessageService } from 'primeng/api';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-genre',
  imports: [StationCardComponent, SpinnerComponent, RouterLink],
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.css'
})
export class GenreComponent implements OnInit{
  loading: boolean = false;
  stations: any[] = []
  favorites: any[] = []

  isFavorite(uuid: string): boolean {
    return this.favorites.some(f => f.uuid === uuid);
  }

  ngOnInit(): void {
    this.loading = true; // empieza la carga
    this.loadStations()
    this.loadFavorites()
    this.favoritesService.favoritesChanged$.subscribe(() => {
      this.loadFavorites();
      this.loadStations();
    });
  }

  constructor(private radioService: StationsService, private favoritesService: FavoritesService, private ms: MessageService) {}
  @Input() genre: string = '';

  loadStations() {
    this.radioService.searchStationsByTag(this.genre, 11).subscribe({
      next: (data) => {
        this.stations = Array.isArray(data) ? data : [];
      },
      error: (err) => this.ms.add({
        severity: 'error',
        summary: 'error',
        detail: 'Error al obtener emisoras',
        life: 5000
      }),
      complete: () => this.loading = false
    });
  }

  loadFavorites() {
    this.favoritesService.getFavorites().subscribe({
      next: (data: { isSuccess: boolean, favorites: any[] }) => {
        this.favorites = data.favorites
      },
      error: (err) => {
        this.favorites = [];
      }
    })
  }

  capitalize(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

  capitalizeWords(text: string) {
  return text
    .split(" ")
    .map(word => this.capitalize(word))
    .join(" ");
}
}
