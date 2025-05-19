import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { AuthResponse } from '../../shared/models/auth-response.model';
import { AuthRequest } from '../../shared/models/auth-request.model';
import { catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UserRegistration } from '../../shared/models/user-registration.model';
import { UserRegistrationResponse } from '../../shared/models/user-registrationResponse.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = `${environment.localUrl}/auth`;

  constructor(private http: HttpClient, private storageService: StorageService) {}

  loginWithGoogle(): void {
    window.location.href = `http://localhost:8080/api/v1/oauth2/authorization/google`;

  }
 
  
  suspendeCuentaUsuario(id: number): Observable<string> {
    return this.http.put(`${this.baseURL}/suspender/${id}`, {}, { responseType: 'text' });
  }
  

  reactivarCuenta(token: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseURL}/reactivar?token=${token}`, {});
  }
  
  handleGoogleCallback(code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseURL}/google-login`, { code }).pipe(
      tap(response => {
        console.log('Respuesta del backend:', response); 
        this.storageService.setAuthData(response);
      })
      ,
      catchError(error => {
        console.error('Error en la autenticación con Google', error);
        return throwError(() => error);
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('authData', token);
  }
  

  logout(): void {
    this.storageService.clearAuthData();
    window.location.href = '/store'; // Redirigir al login
  }

  isAuthenticated(): boolean {
    const authData = this.storageService.getAuthData();
    return authData !== null && !!authData.token;
  }
  
  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseURL}/login`, authRequest).pipe(
      tap((response) => this.storageService.setAuthData(response)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en login:', error); // Para depuración
  
        // Si es un 403, asumimos que la cuenta está suspendida, sin necesidad de validar el mensaje
        if (error.status === 403) {
          return throwError(() => new Error('CUENTA_SUSPENDIDA'));
        } else {
          return throwError(() => error);
        }
      })
    );
  }
  
  
  

  getUserRole(): string | null {
    const authData = this.storageService.getAuthData();
    return authData ? authData.role : null;
  }

  getUser(): AuthResponse | null {
    return this.storageService.getAuthData();
  }
  register(registerRequest: UserRegistration):Observable<UserRegistrationResponse>{
    return this.http.post<UserRegistrationResponse>(`${this.baseURL}/register/customer`, registerRequest);
  }
  
}
