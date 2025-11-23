import { Component } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { FavoritesService } from '../../services/favorites.service';
import { StationCardComponent } from '../../components/station-card/station-card.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { AuthenticationService } from '../../services/authentication.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-favorites',
  imports: [StationCardComponent, SpinnerComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
  providers: []
})
export class FavoritesComponent {
  stations: any[] = []
  favorites: any[] = []
  loading = false;
  userName: string | null = '';
  constructor(private player: PlayerService, private favoritesService: FavoritesService, private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.loading = true;

    this.auth.username$.subscribe(u => this.userName = u);

    this.loadFavorites();

    this.favoritesService.favoritesChanged$.subscribe(() => {
      this.loadFavorites();
    });
  }

  loadFavorites() {
    this.loading = true;

    this.favoritesService.getFavorites().subscribe({
      next: (data) => {
        this.stations = data.favorites;
      },
      error: (err) => {
        console.error('Error al obtener favoritos:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
