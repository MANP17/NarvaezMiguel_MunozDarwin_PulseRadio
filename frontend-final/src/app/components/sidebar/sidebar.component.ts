import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isOpen = false;
  isLoggedIn = false;
  username: string | null = null;

  constructor(private auth: AuthenticationService, private router: Router) {
    auth.isLoggedIn$.subscribe(n => this.isLoggedIn = n)
    auth.username$.subscribe(u => this.username = u)
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.auth.logout().subscribe({
      next: res => {
        if(res.isSuccess) {
          this.router.navigate(["/home"])
          window.location.reload()
        }
      }}
    );
  }
}
