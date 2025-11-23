import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { StationCardComponent } from '../../components/station-card/station-card.component';
import { StationsService } from '../../services/stations.service';
import { FavoritesService } from '../../services/favorites.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenreComponent } from '../../components/genre/genre.component';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-explore',
  imports: [SpinnerComponent, StationCardComponent, ReactiveFormsModule, GenreComponent, RouterModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit {
  stations: any[] = []
  favorites: any[] = []
  loading = false;
  searching = false;
  tags: any[] = [];
  searchValue: string | null = ''
  searchForm = new FormGroup({
    name: new FormControl('', [Validators.required])
  })
  constructor(private radioService: StationsService, private favoritesService: FavoritesService) { }

  isFavorite(uuid: string): boolean {
    return this.favorites.some(f => f.uuid === uuid);
  }


  ngOnInit(): void {
    this.loading = true; // empieza la carga
    this.loadTags()
    this.loadFavorites()
    this.favoritesService.favoritesChanged$.subscribe(() => {
      this.loadFavorites();
      if(this.searchValue) {
        this.searchStations(this.searchValue)
      } else {
          this.loadTags()
      }
    });
    this.searchForm.get('name')!.valueChanges.subscribe(value => {
      if (value && value.trim() !== '') {
        this.searching = true;
        this.loading = true;
        this.searchValue = value;
        this.searchStations(value);
      } else {
        this.searchValue = null;
        this.searching = false;
      }
    });
  }

  searchStations(name: string) {
    this.radioService.searchStations(name).subscribe({
      next: (data) => {
        this.stations = data
        this.loading = false;
      }
    })
  }

  loadTags() {
    this.radioService.getTags().subscribe({
      next: (data) => {
        this.tags = data;
        console.log(data)
      },
      error: (err) => {
        console.error('Error al obtener emisoras:', err);
      },
      complete: () => {
        this.loading = false;
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
