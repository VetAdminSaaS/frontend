import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ServiciosVeterinariosResponse } from "../../shared/models/serviciosVeterinarios-model";
import { ServiciosVeterinariosRequest } from "../../shared/models/servicioVeterinario-request.model";
import { PageableResponse } from "../../shared/models/pageable.response.model";
import { EspecialidadResponse } from "../../shared/models/especialidadResponse.model";

@Injectable({
    providedIn: 'root'
})
export class ServiciosVeterinarios {
     private apiUrl =`${environment.localUrl}/servicios`

     constructor(private http: HttpClient){}

     getAllServices(): Observable<ServiciosVeterinariosResponse[]>{
        return this.http.get<ServiciosVeterinariosResponse[]>(`${this.apiUrl}`);
     }
     getServicesById(id:number): Observable<ServiciosVeterinariosResponse>{
        return this.http.get<ServiciosVeterinariosResponse>(`${this.apiUrl}/${id}`);
     }
     crearServicioVeterinario(servicio: ServiciosVeterinariosRequest): Observable<ServiciosVeterinariosResponse>{
        return this.http.post<ServiciosVeterinariosResponse>(`${this.apiUrl}/crear`,servicio);
     }
     actualizarServicioVeterinario(id:number, servicio:ServiciosVeterinariosRequest): Observable<ServiciosVeterinariosResponse>{
        return this.http.put<ServiciosVeterinariosResponse>(`${this.apiUrl}/${id}`,servicio);
     }
     eliminarServicioVeterinario(id:number): Observable<void>{
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
     }
     paginateServicio(page:number, size:number): Observable<PageableResponse<ServiciosVeterinariosResponse>>{
      const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      return this.http.get<PageableResponse<ServiciosVeterinariosResponse>>(`${this.apiUrl}/page`, {params});
     }
}