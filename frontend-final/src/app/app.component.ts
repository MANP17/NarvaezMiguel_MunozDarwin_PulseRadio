import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from "./components/footer/footer.component";
import { AuthenticationService } from './services/authentication.service';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";
import { PlayerService } from './services/player.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, FooterComponent, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  title = 'PulseRadio';
  constructor(private authService: AuthenticationService, private player: PlayerService, private ms: MessageService) {}
  ngOnInit(): void {
    this.player.errorMessage.subscribe(e => {
      if(e) {
        this.ms.add({
          severity: 'error',
          summary: 'Error',
          detail: e,
          life: 5000
        })
      }
    })
    this.authService.checkAuth().subscribe();
  }
}
