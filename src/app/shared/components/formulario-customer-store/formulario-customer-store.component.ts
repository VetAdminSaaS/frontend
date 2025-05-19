import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { usuariosStoreService } from '../../../core/services/usuarios.store';
import { UsuarioStoreDTO } from '../../models/usuario.formulario.store.model';
import { rangoNumericoService } from '../../../core/services/rango-numerico.service';
import { RangosNumeracion } from '../../models/rangos-numeracion.model';
import { Municipios } from '../../models/municipios.model';
import { CartComponent } from '../../../pages/tienda/cart/cart.component';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../core/services/customerService.service';
import { UserRegistrationResponse } from '../../models/user-registrationResponse.model';

@Component({
  selector: 'app-formulario-customer-store',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formulario-customer-store.component.html',
  styleUrls: ['./formulario-customer-store.component.scss']
})
export class FormularioCustomerStoreComponent implements OnInit {
  customerForm!: FormGroup;
  municipios: Municipios[] = [];
  isCustomerConfirmed: boolean = false;
  
  private fb = inject(FormBuilder);
  private usuariosStore = inject(usuariosStoreService);
  private rangoNumeracionService = inject(rangoNumericoService);
  private cartcomponent = inject(CartComponent);
  private toastr = inject(ToastrService);
  private customerService = inject(CustomerService);
  selectedNumberingRangeId: number | null = null; // ✅ Declarar la propiedad

  
  rangosNumericos: RangosNumeracion[] = [];
  
  ngOnInit(): void {
    this.customerForm = this.fb.group({
      identification: ['', [Validators.required]],
      dv: [''],
      company: [''],
      trade_name: [''],
      names: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      legal_organization_id: [null, Validators.required],
      tribute_id: ['', Validators.required],
      identification_document_id: ['', Validators.required],
      municipality_id: ['', Validators.required],
      numbering_range_id: ['', Validators.required], // Campo para seleccionar el rango numérico
    });
    this.loadUserData();
    this.loadRangos();
    this.loadMunicipios();
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      console.log('Datos del formulario:', this.customerForm.value);
    } else {
    }
  }


  confirmCustomer(): void {
    if (!this.customerForm.valid) {
      this.toastr.warning('Por favor, complete todos los campos obligatorios.');
      console.log('Formulario inválido:', this.customerForm.value);
  
      console.log('Errores del formulario:', this.customerForm.errors);
      Object.keys(this.customerForm.controls).forEach(field => {
        const control = this.customerForm.get(field);
        if (control && control.invalid) {
          console.log(`Error en ${field}:`, control.errors);
        }
      });
  
      return;
    }
  
    let customerData = { ...this.customerForm.value };
  
    console.log('Datos antes de filtrar:', customerData);
  
    if (customerData.legal_organization_id === 1) {
      delete customerData.company;
      delete customerData.trade_name;
    }
    
    if (customerData.legal_organization_id === 2) {
      delete customerData.names;
      delete customerData.dv;
    }
  
    Object.keys(customerData).forEach(key => {
      if (customerData[key] === null) {
        delete customerData[key];
      }
    });
  
    console.log('Datos enviados:', customerData);
  
    // ✅ Marcar cliente como confirmado a través del servicio
    this.customerService.confirmCustomer(); 
  
    this.toastr.success('Cliente confirmado. Ahora puedes proceder con la compra.');
  }
  
  onNumberingRangeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target?.value) {
      const selectedId = Number(target.value);
      this.customerService.setNumberingRangeId(selectedId);
      console.log('📌 Rango de numeración seleccionado:', selectedId);
    }
  }
  
  
  
  
  
  private loadRangos(): void {
    this.rangoNumeracionService.getRangosNumericos().subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.rangosNumericos = response;
          const defaultRange = this.rangosNumericos[0]?.id || null;
          
          if (!this.customerForm.value.numbering_range_id) {
            this.customerForm.patchValue({ numbering_range_id: defaultRange });
            this.selectedNumberingRangeId = defaultRange; // ✅ Asegura que se asigna
          }
  
          console.log('📌 Rango de numeración seleccionado:', this.selectedNumberingRangeId);
        } else {
          console.error('No se encontraron rangos numéricos en la respuesta');
        }
      },
      error: (error) => {
        console.error('Error al cargar los rangos numéricos', error);
      }
    });
  }
  
  
  loadMunicipios():void {
    this.rangoNumeracionService.getMunicipios().subscribe({
      next: (response) => {
        if(response && response) {
          this.municipios = response;
        }
      },
    })
  }
  get isCartNotEmpty(): boolean {
    return this.cartcomponent.cartItems.length < 1;
  
  }

  

  
  loadUserData(): void {
    this.usuariosStore.getUsuariosStore().subscribe({
      next: (user: UsuarioStoreDTO) => {
        // Si los datos del usuario están disponibles, asignarlos al formulario
        this.customerForm.patchValue({
          identification: user.identification,
          names: user.names,
          address: user.address,
          email: user.email,
          phone: user.phone,
          legal_organization_id: user.legalOrganizationId,
          tribute_id: user.tributeId,
          identification_document_id: user.identificationDocumentId,
          municipality_id: user.municipalityId,
          company: user.company,
          trade_name: user.tradeName,
          dv: user.dv
        });
        this.customerForm.get('legal_organization_id')?.disable();
      },
      error: (err) => {
        console.error('Error al cargar los datos del usuario:', err);
      }
    });
  }
}
