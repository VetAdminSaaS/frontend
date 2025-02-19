import { Component, inject } from '@angular/core';
import { SidebarAdminComponent } from "../../../shared/components/sidebar-admin/sidebar-admin.component";
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { UnidadMedidaService } from '../../../core/services/unidad-Medida.service';
import { UnidadMedidaResponse } from '../../../shared/models/unidad-medida-response.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { tributosProductoService } from '../../../core/services/tributo-Producto.service';
import { TributosProductos } from '../../../shared/models/tributos-productos.model';
import { SidebarFactusComponent } from "../../../shared/components/sidebar-factus/sidebar-factus.component";
import { rangoNumericoService } from '../../../core/services/rango-numerico.service';
import { FormArray } from '@angular/forms';
import { ProductoService } from '../../../core/services/producto.service';
import { Productos } from '../../../shared/models/productos.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [ NavbarComponent, NgFor, NgIf, SidebarFactusComponent, FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);

  private factusconexion = inject(rangoNumericoService);
  imagePreview: string | ArrayBuffer | null = null;
  isDragging = false;

  unidades: UnidadMedidaResponse[] = [];
  tributos: TributosProductos[] =[];  
  

  isRetentionEnabled = false;
  retentionCode: string = '';
  retentionPercentage: number | null = null;


  form: FormGroup = this.fb.group({
    unitMeasureId: ['', Validators.required],
    tributeId: ['', Validators.required],
    code_reference: ['', Validators.required],
    name: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.min(1)]],
    discountRate: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    price: ['', [Validators.required, Validators.min(0.01)]],
    taxRate: ['', Validators.required],
    standardCodeId: ['', Validators.required],
    isExcluded: [false, Validators.required],
    coverPath: ['', Validators.required],
    withholdingTaxes: this.fb.group({
      code: [{ value: '', disabled: true }, Validators.required],
      withholdingTaxRate: [{ value: '', disabled: true }, [Validators.required, Validators.min(0), Validators.max(100)]]
    })
  });

  ngOnInit(): void {
    this.loadTributosProducto();
    this.loadUnidadesMedida();
  }

  get withholdingTaxesGroup(): FormGroup {
    return this.form.get('withholdingTaxes') as FormGroup;
  }

  toggleRetention(event: Event): void {
    this.isRetentionEnabled = (event.target as HTMLInputElement).checked;
    const withholdingTaxesGroup = this.withholdingTaxesGroup;

    if (this.isRetentionEnabled) {
      withholdingTaxesGroup.enable();
    } else {
      withholdingTaxesGroup.reset();
      withholdingTaxesGroup.disable();
    }
  }

  crearProducto(): void {
    if (this.form.valid) {
      console.log('Datos enviados:', this.form.value); // Debug antes de enviar

      this.productoService.crearProductos(this.form.value).subscribe({
        next: (response) => {
          console.log('Producto creado con éxito', response);
        },
        error: (err) => {
          console.error('Error al crear el producto:', err);
        }
      });
    } else {
      console.error('El formulario no es válido');
    }
  }

   
    
  
  onSubmit(): void {
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);
      this.crearProducto(); 
    } else {
      console.log('Formulario inválido');
    }
  }

  private loadUnidadesMedida(): void{
    this.factusconexion.getUnidadesMedida().subscribe({
      next: (data) => {
        this.unidades = data;
      },
      error: (error) => {
        console.error("Error cargando unidades de medida:", error);
      }
    });
  }
  private loadTributosProducto():void {
    this.factusconexion.getTributos().subscribe({
      next: (data) => {
        this.tributos = data;
      },
      error: (error) => {
        console.error("Error cargando unidades de medida:", error);
      }
    });
  }
  
  onRetentionCodeChange(event: Event): void {
    this.retentionCode = (event.target as HTMLInputElement).value;
  }
  onRetentionPercentageChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.retentionPercentage = value ? parseFloat(value) : null;
  }
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Vista previa en Base64
        this.form.patchValue({ coverPath: reader.result }); // Guardar solo en el formulario
        this.form.get('coverPath')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }
  
  
  processFile(file?: File) {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.form.patchValue({ coverPath: reader.result });
        this.form.get('coverPath')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files?.[0];
    this.processFile(file);
  }

  

  removeImage() {
    this.imagePreview = null;
    this.form.patchValue({ image: null });
  }

}
