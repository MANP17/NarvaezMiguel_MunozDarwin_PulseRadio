import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { StationCardComponent } from '../../components/station-card/station-card.component';
import { StationsService } from '../../services/stations.service';
import { FavoritesService } from '../../services/favorites.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterModule } from "@angular/router";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-genre',
  imports: [SpinnerComponent, StationCardComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.css'
})
export class GenreComponent {
  stations: any[] = []
  favorites: any[] = []
  loading = false;
  searching = false;
  name: string | null = '';
  searchValue: string | null = '';
  searchForm = new FormGroup({
    name: new FormControl('', [Validators.required])
  })
  constructor(private radioService: StationsService, private favoritesService: FavoritesService, private route: ActivatedRoute) { }

  isFavorite(uuid: string): boolean {
    return this.favorites.some(f => f.uuid === uuid);
  }


  ngOnInit(): void {
    this.name = this.route.snapshot.paramMap.get('tag')
    this.loading = true; // empieza la carga
    this.searchStations()
    this.loadFavorites()
    this.favoritesService.favoritesChanged$.subscribe(() => {
      if(this.searchForm.get('name')!.value?.trim() !== ''){
        this.searchStationsByName(this.searchValue ? this.searchValue : '')
      } else {
        this.searchStations()
      }
      this.loadFavorites()
    });
    this.searchForm.get('name')!.valueChanges.subscribe(value => {
      if (value && value.trim() !== '') {
        this.searchValue = value;
        this.searching = true;
        this.loading = true;
        this.searchStationsByName(value);
      } else {

        this.searching = true;
        this.searchValue = null;
        this.searchStations()
      }
    });
  }

  searchStationsByName(name: string) {
     this.radioService.searchStationsByName(name, this.name ? this.name : '', 100).subscribe({
      next: (data) => {
        this.stations = data
        this.loading = false;
      }
    })
  }

  searchStations() {
    this.radioService.searchStationsByTag(this.name ? this.name  : '', 100).subscribe({
      next: (data) => {
        this.stations = data
        this.loading = false;
        console.log(this.stations)
      }
    })
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
