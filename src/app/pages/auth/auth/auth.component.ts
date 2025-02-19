import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  private readonly CUSTOMER_ROLE = 'CUSTOMER';
  private readonly ADMIN_ROLE = 'ADMIN';
  private readonly CUSTOMER_ROUTE = '/store';
  private readonly ADMIN_ROUTE = '/administrador';
  private readonly DEFAULT_ROUTE = '/store';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  controlHasError(control: string, error: string) {
    return this.loginForm.controls[control]?.hasError(error);
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
      error: () => {
        this.toastr.error('Error en el inicio de sesión. Por favor, intenta de nuevo.', 'Error');
      },
    });
  }
  private redirectUserBasedOnRole(): void {
    const userRole = this.authService.getUserRole();
  
    if (userRole === this.CUSTOMER_ROLE) {
      this.router.navigate([this.CUSTOMER_ROUTE]);
    } else if (userRole === this.ADMIN_ROLE) {
      this.router.navigate([this.ADMIN_ROUTE]);
    } else {
      this.router.navigate([this.DEFAULT_ROUTE]);
    }
  }
  

  togglePasswordVisibility(): void {
    this.passwordType.set(this.passwordType() === 'password' ? 'text' : 'password');
  }
}
