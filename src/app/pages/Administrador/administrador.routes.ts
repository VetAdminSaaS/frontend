import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProductosComponent } from "./productos/productos.component";
import { FacturasComponent } from "./factus/facturas/facturas.component";
import { FacturaslistComponent } from "./factus/facturaslist/facturaslist.component";
import { PurchasesComponent } from "./purchases/purchases.component";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { authGuard } from "../../core/guards/auth.guard";
import { ProductosListComponent } from "./productos/productos-list/productos-list.component";
import { CategoriaProductoComponent } from "./productos/categoria-producto/categoria-producto.component";
import { SucursalesComponent } from "./tiendas/sucursales/sucursales.component";
import path from "path";
import { InvitadoComponent } from "./Emiliano/invitado/invitado.component";
import { MesaComponent } from "./Emiliano/mesa/mesa.component";
import { AsignarMesaComponent } from "./Emiliano/asignar-mesa/asignar-mesa.component";
import { ServiciosComponent } from "./ServiciosVeterinarios/servicios/servicios.component";
import { EmpleadosComponent } from "./usuarios/empleados/empleados.component";
import { ApoderadosComponent } from "./usuarios/apoderados/apoderados.component";
import { CitasComponent } from "./ServiciosVeterinarios/citas/citas.component";
import { AsistenciaComponent } from "./asistencia/asistencia/asistencia.component";

export const administradorRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'products',
        children: [
            { path: 'create', component: ProductosComponent },
            {path:'view', component: ProductosListComponent},
            {path:'actualizar/:id', component: ProductosComponent}
        ],
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'invoices',
        children: [
            { path: 'create', component: FacturasComponent },
            { path: 'view', component: FacturaslistComponent }
        ],
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'sucursales',
        children: [
            {path: 'view', component:SucursalesComponent}
        ]
    },
    {
        path:'categorias',
        children: [
            {path:'view', component:CategoriaProductoComponent}
        ]
    },
    {
        path:'emiliano',
        children:[
            {path: 'invitados', component: InvitadoComponent},
            {path: 'mesas',component:MesaComponent},
            {path: 'asignar', component:AsignarMesaComponent}
        ]
    },
    {
        path: 'purchases',
        children: [
            { path: 'list', component: PurchasesComponent }
        ],
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'usuarios',
        children: [
            { path: 'list', component: UsuariosComponent }
        ],
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'servicios',
        children:[
            {path: 'list', component: ServiciosComponent}
        ]
    },
    {
        path: 'empleados', component: EmpleadosComponent
    },
    {
        path:'apoderados', component: ApoderadosComponent
    },
    {
        path: 'citas', 
        children:[
            {path: 'create', component : CitasComponent}
        ]
    },
    {
        path: 'asistencia',
        component: AsistenciaComponent
    }
];
