import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getUser(); // Obtiene el usuario autenticado
  const requiredRole = route.data?.['role']; // Obtiene el rol requerido para la ruta

  if (user && authService.isAuthenticated()) {
    if (requiredRole && user.role !== requiredRole) {
      // Redirige al usuario según su rol
      if (user.role === 'CUSTOMER') {
        router.navigate(['/customer/dashboard']);
      } else if (user.role === 'ADMIN') {
        router.navigate(['/dashboard']);
      } else if (user.role === 'EMPLEADO') {
        router.navigate(['/empleado/dashboard']);
      } 
      else {
        router.navigate(['/login']);
      }
      return false;
    }
    return true;
  } else {
    router.navigate(['/login']); // Redirige si no está autenticado
    return false;
  }
};
