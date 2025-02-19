import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProductosComponent } from "./productos/productos.component";
import { FacturasComponent } from "./factus/facturas/facturas.component";
import { FacturaslistComponent } from "./factus/facturaslist/facturaslist.component";
import { PurchasesComponent } from "./purchases/purchases.component";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { authGuard } from "../../core/guards/auth.guard";

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
            { path: 'create', component: ProductosComponent }
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
    }
];
