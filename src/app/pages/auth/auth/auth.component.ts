import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ IMPORTANTE: Agregar ReactiveFormsModule
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  loginForm!: FormGroup;
  passwordType = signal<'password' | 'text'>('password'); // ✅ Ahora 'signal' está correctamente importado

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private readonly CUSTOMER_ROLE = 'CUSTOMER';
  private readonly APODERADO_ROLE = 'APODERADO';
  private readonly EMPLEADO_ROLE = 'EMPLEADO';
  private readonly ADMIN_ROLE = 'ADMIN';
  private readonly CUSTOMER_ROUTE = '/store';
  private readonly ADMIN_ROUTE = '/administrador';
  private readonly EMPLEADO_ROUTE = '/empleado';
  private readonly APODERADO_ROUTE = '/apoderado';
  private readonly DEFAULT_ROUTE = '/store';
  private ngZone = inject(NgZone);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  controlHasError(control: string, error: string) {
    return this.loginForm.controls[control]?.hasError(error);
  }
 ngOnInit() {
  this.route.queryParams.subscribe(params => {
    const token = params['token'];
    if (token) {
      console.log('✅ Token recibido en URL:', token); // Debug

      // Decodificar y guardar en el almacenamiento
      this.authService.saveToken(token);

      // Redirigir según el rol
      this.redirectUserBasedOnRole();
    }
  });
}

  
    
onSubmit() {
  if (this.loginForm.invalid) {
    return;
  }

  const credentials = this.loginForm.value;
  this.authService.login(credentials).subscribe({
    next: () => {
      this.toastr.success('INICIO DE SESIÓN EXITOSO', 'Éxito');
      this.redirectUserBasedOnRole();
    },
    error: (err: HttpErrorResponse) => {
      console.error('Error en el login:', err);

      if (err.message === 'CUENTA_SUSPENDIDA') {
        this.toastr.warning('Tu cuenta está suspendida. Revisa tu correo para reactivarla.', 'Cuenta Suspendida');

        // Forzar la detección de cambios antes de navegar
        this.ngZone.run(() => {
          this.router.navigate(['/reactivar'], {
            state: { email: credentials.email },
          });
        });
      } else {
        this.toastr.error('Error en el inicio de sesión. Por favor, intenta de nuevo.', 'Error');
      }
    },
  });
}






  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
  private redirectUserBasedOnRole(): void {
    const userRole = this.authService.getUserRole();
    console.log('Rol del usuario:', userRole); 
  
    if (userRole === this.CUSTOMER_ROLE) {
      this.router.navigate([this.CUSTOMER_ROUTE]);
    } else if (userRole === this.ADMIN_ROLE) {
      this.router.navigate([this.ADMIN_ROUTE]);
    } else if (userRole === this.APODERADO_ROLE){
      this.router.navigate([this.APODERADO_ROUTE]);
    } else if (userRole === this.EMPLEADO_ROLE) {
      this.router.navigate([this.EMPLEADO_ROUTE]);
    }
    else {
      this.router.navigate([this.DEFAULT_ROUTE]);
    }
  }
  
  

  togglePasswordVisibility(): void {
    this.passwordType.set(this.passwordType() === 'password' ? 'text' : 'password');
  }
}
