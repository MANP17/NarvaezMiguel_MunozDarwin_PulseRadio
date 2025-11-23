import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CustomService } from '../../services/custom.service';

@Component({
  selector: 'app-station-card',
  templateUrl: './station-card.component.html',
  styleUrl: './station-card.component.css',
  providers: []
})
export class StationCardComponent implements OnInit {
  @Input() name: string = '';
  @Input() uuid: string = '';
  @Input() favicon: string = '';
  @Input() language: string = '';
  @Input() url: string = '';
  @Input() urlDecoded: string = '';
  @Input() country: string = '';
  @Input() favorite: boolean = false;
  @Input() custom: boolean = false;
  @Output() deleted = new EventEmitter<number>();
  isPlaying: boolean = false;
  station: any;
  error: string = '';
  constructor(private player: PlayerService, private favoritesService: FavoritesService, private auth: AuthenticationService, private router: Router, private ms: MessageService, private customService: CustomService) { }
  ngOnInit(): void {
    this.player.isPlaying.subscribe(p => this.isPlaying = p)
    this.player.currentStation.subscribe(e => this.station = e)
  }
  play() {
    this.player.play(this.url, this.name, this.urlDecoded, this.uuid, this.favicon)
  }

  pause() {
    this.player.toggle()
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    // usa ruta relativa a assets
    img.src = 'src/assets/no-image.png';
  }

  toggleFavorite() {
    if (this.auth.isLoggedIn()) {
      if (this.favorite) {
        this.favoritesService.deleteFavorite({ uuid: this.uuid }).subscribe({
          next: (res: any) => {
            if (res.isSuccess) {
              this.ms.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Estación eliminada de favoritos',
                life: 3000
              })
            }
          },
          error: (err: any) => {
            this.ms.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar de favoritos',
              life: 3000
            })
          }
        })
      } else {
        this.favoritesService.addFavorite({ uuid: this.uuid, favicon: this.favicon, url: this.url, urlResolved: this.urlDecoded, name: this.name, location: this.country, language: this.language }).subscribe({
          next: (res) => {
            this.ms.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Estación agregada a favoritos',
                life: 3000
              })
          },
          error: (err) => {
            this.ms.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al agregar a favoritos',
              life: 3000
            })
          }
        })
      }
    } else {
      this.router.navigate(['/login'])
    }
  }
  deleteCustom() {
    this.customService.deleteCustom({id: Number(this.uuid)}).subscribe({
      next: (res) => {
        if(res.isSuccess) {
          this.deleted.emit(Number(this.uuid))
          this.ms.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Estación personalizada eliminada',
            life: 3000
          })
        }
      },
      error: (err) => {
        this.ms.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar la estación personalizada',
            life: 3000
          })
      }
    })
  }
}
