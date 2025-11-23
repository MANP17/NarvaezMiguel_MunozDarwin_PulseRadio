import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audio = new Audio();
  currentStation = new BehaviorSubject<any>(null);
  isPlaying = new BehaviorSubject<boolean>(false);
  errorMessage = new BehaviorSubject<string>('');

  constructor() { }

  play(url: string, name: string, urlDecoded: string, uuid: string, favicon?: string) {
    if (this.audio.src !== url) {
      this.audio.src = url;
    }
    this.audio.play().then(() => {
      this.isPlaying.next(true);
      this.currentStation.next({ name, favicon, url, uuid });
    }).catch(err => {
      this.isPlaying.next(false);
      this.errorMessage.next(`La emisora ${name} no se puede reproducir`)
    });
  }

  toggle() {
    if (this.isPlaying.value) {
      this.audio.pause();
      this.audio.src = '';
      this.isPlaying.next(false);
    } else if (this.currentStation.value) {
      this.audio.src = this.currentStation.value.url;
      this.audio.load(); 
      this.audio.play().then(() => {
        this.isPlaying.next(true);
      }).catch(err => console.error('Error al reproducir:', err));
    }
  }

  setVolume(v: number) {
    this.audio.volume = v;
  }
}
