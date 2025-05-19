import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
providedIn: "root"
})
export class MascotaService {
    private apiUrl =`${environment.localUrl}/mascotas`
    constructor(private http: HttpClient){}

    

}