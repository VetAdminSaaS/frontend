import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class tributosProductoService {
  private baseURL = `${environment.apiUrl}/v1/tributes/products?name=`;

  constructor(private http: HttpClient, private storageService: StorageService) {}

  getTributosProductos(): Observable<any> {
    const accessToken = this.storageService.getAuthData();

  

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get<any>(this.baseURL, { headers });
  }
}
