import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  station: any;
  isPlaying = false;
  error: string | null = null;
  constructor(private player: PlayerService) { }

  ngOnInit(): void {
    this.player.currentStation.subscribe(s => this.station = s)
    this.player.isPlaying.subscribe(p => this.isPlaying = p)
    this.player.errorMessage.subscribe(e => this.error = e)
  }

  togglePlay() {
    this.player.toggle()
  }

  setVolume(event: any) {
    this.player.setVolume(event.target.value / 100)
  }

}
