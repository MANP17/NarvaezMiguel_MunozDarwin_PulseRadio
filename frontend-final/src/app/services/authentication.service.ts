import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

interface loginData {
  username: string;
  password: string;
}

interface registerData {
  username: string;
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  isSuccess: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl: string = 'http://localhost:5271/api/Users';
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this._isLoggedIn.asObservable();
  private _username = new BehaviorSubject<string | null>(null);
  public username$ = this._username.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this._isLoggedIn.next(true);
    }
  }

  isLoggedIn() {
    return this._isLoggedIn.value;
  }

  login(credentials: loginData) {
    return this.http
      .post(`${this.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((res: any) => {
          if (res.isSuccess) {
            this._isLoggedIn.next(true);
            window.localStorage.setItem('auth_token', 'yes');
            this._username.next(res.user.username);
          }
        })
      );
  }

  register(credentials: registerData) {
    return this.http
      .post(`${this.apiUrl}/register`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((res: any) => {
          if (res.isSuccess) {
            console.log(res);
            this._isLoggedIn.next(true);
            window.localStorage.setItem('auth_token', 'yes');
            this._username.next(res.user.username);
          }
        })
      );
  }

  logout() {
    return this.http
      .post(
        `${this.apiUrl}/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap((res: any) => {
          console.log(res);
          if (res.isSuccess) {
            window.localStorage.removeItem('auth_token');
            this._isLoggedIn.next(false);
            this._username.next(null);
          }
        })
      );
  }

  checkAuth() {
    return this.http
      .get(`${this.apiUrl}/check`, {
        withCredentials: true,
      })
      .pipe(
        tap((res: any) => {
          if (res.isAuthenticated) {
            this._isLoggedIn.next(true);
            this._username.next(res.user.username);
          } else {
            this._isLoggedIn.next(false);
            window.localStorage.removeItem('auth_token');
            this._username.next(null);
          }
        })
      );
  }
}
