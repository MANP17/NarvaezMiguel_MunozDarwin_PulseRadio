import { Component, OnInit } from '@angular/core';
import { CustomService } from '../../services/custom.service';
import { AuthenticationService } from '../../services/authentication.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { StationCardComponent } from '../../components/station-card/station-card.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-custom',
  imports: [SpinnerComponent, StationCardComponent, RouterModule],
  templateUrl: './custom.component.html',
  styleUrl: './custom.component.css',
})
export class CustomComponent implements OnInit {
  stations: any[] = [];
  loading: boolean = false;
  username: string | null = '';

  constructor(
    private customService: CustomService,
    private auth: AuthenticationService
  ) {}
  ngOnInit(): void {
    this.auth.username$.subscribe((u) => (this.username = u));
    this.loading = true;
    this.loadCustom();
  }

  loadCustom() {
    this.customService.getCustom().subscribe({
      next: (res) => {
        this.stations = res.custom;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onStationDeleted(id: number) {
    this.loadCustom();
  }
}
