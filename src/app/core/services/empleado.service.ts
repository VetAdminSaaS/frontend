import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { EmpleadosDetails } from "../../shared/models/empledosDetails.model";
import { EmpleadoRegistration } from "../../shared/models/empleado-registration.model";
import { Empleados } from "../../shared/models/empleados.model";

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService { 
    private apiUrl =`${environment.localUrl}/empleados`

    constructor(private http: HttpClient){}

    getAllEmpleados(): Observable<EmpleadosDetails[]> {
      return this.http.get<EmpleadosDetails[]>(`${this.apiUrl}`);
    }
    getEmpleadoById(id:number): Observable<EmpleadosDetails>{
      return this.http.get<EmpleadosDetails>(`${this.apiUrl}/${id}`);
    }
    crearEmpleado(empleado:EmpleadoRegistration): Observable<EmpleadoRegistration>{
      return this.http.post<EmpleadoRegistration>(`${this.apiUrl}`, empleado);
    }
    updateEmpleadoByAdmin(id:number, empleado:Empleados): Observable<EmpleadosDetails>{
      return this.http.put<EmpleadosDetails>(`${this.apiUrl}/${id}`,empleado);
    }
    registerEmpleadobyAdmin(empleado: EmpleadoRegistration) : Observable<EmpleadoRegistration> {
      return this.http.post<EmpleadoRegistration>(`${this.apiUrl}/register`, empleado);
    }
    completarRegistrobyEmpleado(id:number, empleado:Empleados):Observable<Empleados>{
      return this.http.put<Empleados>(`${this.apiUrl}/${id}/completar-registro`, empleado)
    }
    eliminarEmpleado(id:number):Observable<void>{
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    

}