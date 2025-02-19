import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authInverseGuard } from './core/guards/auth-inverse.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'store', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.authRoutes),
    canActivate: [authInverseGuard],
  },
  {
    path: 'store',
    loadChildren: () => import('./pages/tienda/tienda.routes').then(m => m.tiendaRoutes),
  },
  {
    path: 'customer',
    loadChildren: () => import('./pages/customer/customer.routes').then(m => m.customerRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'administrador',
    loadChildren: () => import('./pages/Administrador/administrador.routes').then(a => a.administradorRoutes),
    canActivate: [authGuard]
}
];
