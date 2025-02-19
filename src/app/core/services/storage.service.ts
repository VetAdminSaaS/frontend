import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse } from '../../shared/models/auth-response.model';
import { jwtDecode } from "jwt-decode";
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private authKey = 'amigos_auth';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  setAuthData(data: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.authKey, JSON.stringify(data));
    }
  }

  getAuthData(): AuthResponse | null {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.authKey);
      return data ? (JSON.parse(data) as AuthResponse) : null;
    }
    return null;
  }

  clearAuthData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.authKey);
    }
  }
  isTokenValid(token: string): boolean {
    try {
      const { exp } = jwtDecode<{ exp: number}>(token);
      const currenTime = Math.floor(Date.now()/1000)
      return exp > currenTime;
    } catch (error) {
      console.error("Token inváñido: ", error);
      return false;
    }
  }
}