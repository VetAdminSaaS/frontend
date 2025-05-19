import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { EspecialidadRequest } from "../../shared/models/especialidad-request.model";
import { PageableResponse } from "../../shared/models/pageable.response.model";
import { HttpParams } from "@angular/common/http";
import { EspecialidadResponse } from "../../shared/models/especialidadResponse.model";

@Injectable({
    providedIn: 'root'
})
export class EspecialidadService {
    private apiUrl = `${environment.localUrl}/especialidades`

    constructor(private http:HttpClient){}

    getAllEspecialidades(): Observable<EspecialidadResponse[]>{
        return this.http.get<EspecialidadResponse[]>(`${this.apiUrl}`)
    }
    getEspecialidaByID(id:number): Observable<EspecialidadResponse>{
        return this.http.get<EspecialidadResponse>(`${this.apiUrl}/${id}`)
    }
    crearEspecialidad(especialidad: EspecialidadRequest): Observable<EspecialidadRequest>{
        return this.http.post<EspecialidadRequest>(`${this.apiUrl}`,especialidad)
    }
    actualizarEspecialidad(id:number, especialidad: EspecialidadRequest): Observable<EspecialidadResponse>{
        return this.http.put<EspecialidadResponse>(`${this.apiUrl}/${id}`, especialidad)
    }
    eliminarEspecialidad(id:number): Observable<void>{
       return this.http.delete<void>(`${this.apiUrl}/${id}`)
    }
    paginateEspecialidad(page: number, size: number): Observable<PageableResponse<EspecialidadResponse>> {
          const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
      
          return this.http.get<PageableResponse<EspecialidadResponse>>(`${this.apiUrl}/page`, {params});
        }

}