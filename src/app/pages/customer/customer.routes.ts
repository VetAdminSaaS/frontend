import { Routes } from "@angular/router";

import { CartComponent } from "../tienda/cart/cart.component";
import { EncabezadoComponent } from "../../shared/components/encabezado/encabezado.component";
import { CustomerComponent } from "./customer/customer.component";
import { PurchasesComponent } from "./purchases/purchases.component";
import { FacturasComponent } from "./facturas/facturas.component";
import { DireccionesComponent } from "./direcciones/direcciones.component";
import { authGuard } from "../../core/guards/auth.guard";
import { CuentaSuspendidaInformationComponent } from "../auth/cuenta-suspendida-information/cuenta-suspendida-information.component";
import { PedidosComponent } from "./pedidos/pedidos.component";

export const customerRoutes: Routes = [
    {
        path: '',
        component: EncabezadoComponent,
    },
    {
        path: 'mi-cuenta',
        component: CustomerComponent
    },
    {
        path: 'purchases/list',
        component: PurchasesComponent
    },
    {
        path: 'mis-facturas',
        component:FacturasComponent
    },
    {
        path: 'direccion',
        component:DireccionesComponent,
        canActivate: [authGuard],
                data: { role: 'CUSTOMER' }
        

    },
    {
        path: 'cuenta-suspendida',
        component: CuentaSuspendidaInformationComponent
    },
    {
        path: 'pedidos',
        component: PedidosComponent
    }
    
];
