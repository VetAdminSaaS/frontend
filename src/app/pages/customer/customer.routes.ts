import { Routes } from "@angular/router";

import { CartComponent } from "../tienda/cart/cart.component";
import { EncabezadoComponent } from "../../shared/components/encabezado/encabezado.component";
import { CustomerComponent } from "./customer/customer.component";
import { PurchasesComponent } from "./purchases/purchases.component";
import { FacturasComponent } from "./facturas/facturas.component";

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
    }
];
