import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { rangoNumericoService } from '../../../core/services/rango-numerico.service';
import { Municipios } from '../../../shared/models/municipios.model';
import { municipiosService } from '../../../core/services/municipios.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  currentStep: number = 1;
  totalSteps: number = 3;
  private municipiosService = inject(municipiosService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  showDVField: boolean = false;
  municipios: Municipios[]=[];
  private router = inject(Router);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      identification: ['', Validators.required],
      dv: [''],
      tradeName: [''],
      company:[''],
      password:['',Validators.required],
      names: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      legalOrganizationId: ['', Validators.required],
      tributeId: ['', Validators.required],
      identificationDocumentId: ['', Validators.required],
    });
    
  }
  


  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  setStep(step: number) {
    this.currentStep = step;
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
  
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      this.authService.register(userData).subscribe({
        next: (response) => {
          this.toastr.success('Usuario registrado correctamente', "Éxito");
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error("Error en el registro:", error);
          this.toastr.error("Error al registrar el usuario, Inténtalo nuevamente", "Error");
        }
      });
    } else {
      console.warn("Formulario inválido, revisa los campos.");
      this.toastr.error("Error al registrar el usuario, Inténtalo nuevamente", "Error");
      this.registerForm.markAllAsTouched();
    }
  }
  
  

  getProgressWidth(): string {
    const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
    return `${progress}%`;
  }

  isStepValid(step: number): boolean {
    const legalOrganizationValue = this.registerForm.get('legalOrganizationId')?.value;
    const identificationDocumentValue = this.registerForm.get('identificationDocumentId')?.value;
  
    const stepValidations: { [key: number]: string[] } = {
      1: legalOrganizationValue === '1'
        ? ['legalOrganizationId', 'identificationDocumentId', 'identification', 'company', 'tradeName']
        : ['legalOrganizationId', 'identificationDocumentId', 'identification', 'names'],
        
      2: ['email', 'password'],
  
      3: ['tributeId', 'address', 'phone']
    };
  
    // Si `identificationDocumentId` es '6', agregar `dv` a la validación del paso 1
    if (identificationDocumentValue === '6') {
      stepValidations[1].push('dv');
    }
  
    const fields = stepValidations[step] || [];
    return fields.every(field => this.registerForm.get(field)?.valid);
  }
  
  
}