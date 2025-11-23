import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { StationCardComponent } from "../../components/station-card/station-card.component";
import { StationsService } from '../../services/stations.service';
import { SpinnerComponent } from "../../components/spinner/spinner.component";
import { FavoritesService } from '../../services/favorites.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';


@Component({
  selector: 'app-home',
  imports: [StationCardComponent, SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: []
})
export class HomeComponent implements OnInit {
  stations: any[] = []
  favorites: any[] = []
  loading = false;
  constructor(private player: PlayerService, private radioService: StationsService, private favoritesService: FavoritesService) { }

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

  loadStations() {
    this.radioService.getPopular().subscribe({
      next: (data) => {
        this.stations = data;
      },
      error: (err) => {
        console.error('Error al obtener emisoras:', err);
      },
      complete: () => {
        this.loading = false; // termina la carga (éxito o error)
      }
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

}
