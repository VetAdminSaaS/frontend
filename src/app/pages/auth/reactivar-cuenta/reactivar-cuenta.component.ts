import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reactivar-cuenta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reactivar-cuenta.component.html',
  styleUrl: './reactivar-cuenta.component.scss'
})
export class ReactivarCuentaComponent implements OnInit {
  email: string = '';
  mensaje: string = 'Tu cuenta ha sido suspendida. Revisa tu correo para reactivarla.';
  cuentaReactivada = false;
  cargando = false; // Para mostrar un spinner si es necesario

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      this.email = params['email'] || '';

      if (token) {
        this.reactivarCuenta(token);
      }
    });
  }

  reactivarCuenta(token: string) {
    this.cargando = true;
    this.authService.reactivarCuenta(token).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        this.mensaje = response.message || 'Tu cuenta ha sido reactivada con éxito. Serás redirigido al login.';
        this.cuentaReactivada = true;
        this.cargando = false;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        console.error('Error al reactivar cuenta:', err);
        this.mensaje = err.error?.message || 'El enlace de reactivación no es válido o ha expirado.';
        this.cargando = false;
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
    
  }
}
