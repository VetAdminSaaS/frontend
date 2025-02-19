import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UsuarioStoreDTO } from "../../shared/models/usuario.formulario.store.model";
import { UserProfile } from "../../shared/models/usuarios-profile.model";

@Injectable ({
    providedIn: 'root',
})
export class usuariosStoreService{
     private baseURL = `${environment.localUrl}/usuarios`;
    constructor(private http: HttpClient){}

     getUsuariosStore():Observable<UsuarioStoreDTO>{
        return this.http.get<UsuarioStoreDTO>(`${this.baseURL}/listar`);
     }
     getUsuarios():Observable<UserProfile[]>{
        return this.http.get<UserProfile[]>(`${this.baseURL}`);

     }
     getTotalUsuarios():Observable<any>{
      return this.http.get<any>(`${this.baseURL}/total`)
     }


}