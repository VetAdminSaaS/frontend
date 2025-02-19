import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { StorageService } from "./storage.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class municipiosService {
    private baserURL = `${environment.apiUrl}/v1/municipalities`;

    constructor(private http: HttpClient, private storageService: StorageService){ }

        getMunicipios(): Observable<any> {
            const accessToken = this.storageService.getAuthData;
            const headers = new HttpHeaders({
                Authorization:`Bearer ${accessToken}`,
            });
            return this.http.get<any>(this.baserURL, { headers});
        }
    }
   