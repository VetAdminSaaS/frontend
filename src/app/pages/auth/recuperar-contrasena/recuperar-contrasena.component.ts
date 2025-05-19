import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Mailservice } from '../../../core/services/mail.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss'],
})
export class RecuperarContrasenaComponent {
  forgotPasswordForm: FormGroup;
  resetPasswordForm!: FormGroup;
  token: string | null = null;
  submitted = false;
  successMessage = '';
  isLoading = false; // Para el loading spinner
  showModal = false; // Para el modal de éxito
  showPassword = false;

  private mailService = inject(Mailservice);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || null;
      if (this.token) {
        this.initResetPasswordForm();
      } else {
        this.initForgotPasswordForm();
      }
    });
  }

  initForgotPasswordForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  initResetPasswordForm() {
    this.resetPasswordForm = this.fb.group(
      {
        newContrasena: ['', [Validators.required, Validators.minLength(8)]],
        confirmContrasena: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newContrasena')!.value === form.get('confirmContrasena')!.value
      ? null
      : { mismatch: true };
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  get newPassword() {
    return this.resetPasswordForm.get('newContrasena');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmContrasena');
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';

    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.isLoading = true; // Activar el loading spinner

      this.mailService.enviarRecuperarContrasenaEmail(email).subscribe({
        next: () => {
          this.isLoading = false; // Desactivar el loading spinner
          this.showModal = true; // Mostrar el modal de éxito
        },
        error: () => {
          this.isLoading = false; // Desactivar el loading spinner
          this.toastr.error('No hemos encontrado el correo ingresado. Intenta nuevamente', 'Error');
        },
      });
    }
  }

  onSubmitResetPassword() {
    if (this.resetPasswordForm.valid && this.token) {
      const newPassword = this.resetPasswordForm.value.newContrasena;
      this.isLoading = true; // Activar el loading spinner

      this.mailService.recuperarContraseña(newPassword, this.token).subscribe({
        next: () => {
          this.isLoading = false; // Desactivar el loading spinner
          this.toastr.success('Contraseña restablecida con éxito', 'Éxito');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.isLoading = false; // Desactivar el loading spinner
          this.toastr.error('Error al restablecer la contraseña', 'Error');
        },
      });
    } else {
      this.toastr.warning('Por favor, completa correctamente el formulario', 'Advertencia');
    }
  }

  closeModalAndNavigate() {
    this.showModal = false; // Cierra el modal
    setTimeout(() => {
      this.router.navigate(['/store']); 
    }, 100); 
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}