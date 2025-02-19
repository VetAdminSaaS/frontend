import { Routes } from "@angular/router";
import { StorevetComponent } from "./storevet/storevet.component";
import { DetallesComponent } from "./detalles/detalles.component";
import { CartComponent } from "./cart/cart.component";

export const tiendaRoutes: Routes = [
  {
    path: '', // Parent route
    component: StorevetComponent,
  },
  {
    path: 'producto-details/:id',
    component: DetallesComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  }
 
];