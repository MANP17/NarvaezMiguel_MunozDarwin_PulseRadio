import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './pages/register/register.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { GenreComponent } from './pages/genre/genre.component';
import { CustomComponent } from './pages/custom/custom.component';
import { NewCustomComponent } from './pages/new-custom/new-custom.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'explore',
    component: ExploreComponent
  },  
  {
    path: 'explore/genre/:tag',
    component: GenreComponent
  },  
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard] // evitar acceso si ya está logueado
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authGuard] // evitar acceso si ya está logueado
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [authGuard] // ruta protegida
  },
  {
    path: 'custom',
    component: CustomComponent,
    canActivate: [authGuard] // ruta protegida
  },
  {
    path: 'custom/new-custom',
    component: NewCustomComponent,
    canActivate: [authGuard] // ruta protegida
  },
  // {
  //   path: 'profile',
  //   component: ProfileComponent,
  //   canActivate: [authGuard] // ruta protegida
  // },
  {
    path: '**',
    redirectTo: 'home'
  }
];

