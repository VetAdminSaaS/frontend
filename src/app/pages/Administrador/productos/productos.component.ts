import { Component, inject } from '@angular/core';
import { SidebarAdminComponent } from "../../../shared/components/sidebar-admin/sidebar-admin.component";
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { UnidadMedidaService } from '../../../core/services/unidad-Medida.service';
import { UnidadMedidaResponse } from '../../../shared/models/unidad-medida-response.model';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { tributosProductoService } from '../../../core/services/tributo-Producto.service';
import { TributosProductos } from '../../../shared/models/tributos-productos.model';
import { SidebarFactusComponent } from "../../../shared/components/sidebar-factus/sidebar-factus.component";
import { rangoNumericoService } from '../../../core/services/rango-numerico.service';
import { FormArray } from '@angular/forms';
import { ProductoService } from '../../../core/services/producto.service';
import { Productos, TiposDeEntrega } from '../../../shared/models/productos.model';
import { Observable } from 'rxjs';
import { ProductoDetalles } from '../../../shared/models/productoDetalles.model';
import { HomeService } from '../../../core/services/home.service';
import { ActivatedRoute } from '@angular/router';
import { CategoriaResponse } from '../../../shared/models/categoria-response.model';
import { Categoriaservice } from '../../../core/services/categoria.service';
import { SucursalResponse } from '../../../shared/models/sucursal-response.model';
import { Sucursalesservice } from '../../../core/services/sucursales.service';
import { error } from 'console';
import { Router } from '@angular/router';
import { SucursalStock } from '../../../shared/models/sucursalStock.model';
import { ToastrService } from 'ngx-toastr';

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
  private homeService = inject(HomeService);
  private route = inject(ActivatedRoute);
  private categoriaService = inject(Categoriaservice);
  private toastr = inject(ToastrService);
 
  private sucursalesService = inject(Sucursalesservice);
  private router = inject(Router);
 

  private factusconexion = inject(rangoNumericoService);
  imagePreview: string | ArrayBuffer | null = null;
  isDragging = false;
  productoId?: number;
  producto!: ProductoDetalles;
  tiposEntrega = TiposDeEntrega; 


  unidades: UnidadMedidaResponse[] = [];
  tributos: TributosProductos[] =[]; 
  categorias: CategoriaResponse[] =[]; 
  sucursal:SucursalResponse[] =[];
  sucursalesProducto:SucursalStock[]=[];
  

  isRetentionEnabled = false;
  retentionCode: string = '';
  retentionPercentage: number | null = null;


  form: FormGroup = this.fb.group({
    unit_measure_id: ['', Validators.required],
    tributeId: ['', Validators.required],
    code_reference: ['', Validators.required],
    name: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.min(1)]],
    discount_rate: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    price: ['', [Validators.required, Validators.min(0.01)]],
    tax_rate: ['', Validators.required],
    standardCodeId: ['', Validators.required],
    isExcluded: [false, Validators.required],
    coverPath: ['', Validators.required],
    descripcion:['', Validators.required],
    categoryId:[Validators.required],
    tiposEntrega: this.fb.array([]),
    costoDespacho: [null, this.validateCostoDespacho()],
    sucursalesStock: this.fb.array([]),
    withholdingTaxes: this.fb.group({
      code: [{ value: '', disabled: true }, Validators.required],
      withholdingTaxRate: [{ value: '', disabled: true }, [Validators.required, Validators.min(0), Validators.max(100)]]
    })
  });
  

  ngOnInit(): void {
    this.loadTributosProducto();
    this.loadUnidadesMedida();
    this.loadCategoriaProducto();
    this.loadSucursales();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productoId = +id;
        this.loadProductoData(this.productoId);
      }
    });
  }
  toggleEntrega(tipo: TiposDeEntrega) {
    const tiposEntregaControl = this.form.get('tiposEntrega') as FormArray;
    const index = tiposEntregaControl.value.indexOf(tipo);
  
    if (index !== -1) {
      tiposEntregaControl.removeAt(index);
      
      // Si se deselecciona "Despacho a Domicilio", resetear costoDespacho
      if (tipo === TiposDeEntrega.DESPACHO_A_DOMICILIO) {
        this.form.get('costoDespacho')?.setValue(0);
      }
    } else {
      tiposEntregaControl.push(this.fb.control(tipo));
      
      // Si se selecciona "Despacho a Domicilio", asegurar que costoDespacho tenga un valor
      if (tipo === TiposDeEntrega.DESPACHO_A_DOMICILIO && !this.form.get('costoDespacho')?.value) {
        this.form.get('costoDespacho')?.setValue(0);
      }
    }
  }
  validateCostoDespacho(): ValidatorFn {
    return (control: AbstractControl) => {
      const tiposEntrega = this.form?.get('tiposEntrega')?.value || [];
      if (tiposEntrega.includes('DESPACHO_A_DOMICILIO') && (control.value === null || control.value < 0)) {
        return { requiredCosto: true }; // Esto activa un error en el formulario
      }
      return null;
    };
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
  // Asegúrate de importar el enum

  private loadProductoData(id: number): void {
    this.homeService.getProductoDetallesPorId(id).subscribe(producto => {
        console.log("Producto recibido:", producto);

        const category = this.categorias.find(cat => cat.nombre === producto.categoryName);

        const sucursalesStock = producto.sucursalesStock?.map(sucursal => ({
            id: sucursal.id ?? null,
            quantity: sucursal.quantity
        })) || [];

        console.log("Sucursales procesadas:", sucursalesStock);

        // Limpia y actualiza tipos de entrega
        const tiposEntregaArray = this.form.get('tiposEntrega') as FormArray;
        tiposEntregaArray.clear();
        (producto.tiposEntrega || []).forEach(tipo => {
            tiposEntregaArray.push(this.fb.control(tipo));
        });

        // Verifica si el producto incluye "Despacho a domicilio"
        const incluyeDespacho = (producto.tiposEntrega || []).includes(TiposDeEntrega.DESPACHO_A_DOMICILIO);

        this.form.patchValue({
            ...producto,
            categoryId: category ? category.id : null,
            sucursalesStock: sucursalesStock,
            costoDespacho: producto.costoDespacho ?? null // 🔥 Mostrar siempre el costo si existe
        });

        this.imagePreview = producto.coverPath;

        // 🔥 Agregar validaciones dinámicas según el tipo de entrega
        const costoDespachoControl = this.form.get('costoDespacho');
        const tiposEntregaControl = this.form.get('tiposEntrega') as FormArray;

        if (incluyeDespacho) {
            costoDespachoControl?.setValidators([Validators.required, Validators.min(0)]);
        } else {
            costoDespachoControl?.clearValidators();
            costoDespachoControl?.setValue(null);
        }
        costoDespachoControl?.updateValueAndValidity();

        // Detectar cambios en los tipos de entrega
        tiposEntregaControl.valueChanges.subscribe((tipos: TiposDeEntrega[]) => {
            const incluyeDespacho = tipos.includes(TiposDeEntrega.DESPACHO_A_DOMICILIO);

            if (incluyeDespacho) {
                costoDespachoControl?.setValidators([Validators.required, Validators.min(0)]);
            } else {
                costoDespachoControl?.clearValidators();
                costoDespachoControl?.setValue(null);
            }

            costoDespachoControl?.updateValueAndValidity();
        });
    });
}


  
  
  
  

crearProducto(): void {
  if (this.form.valid) {
    let data = { ...this.form.value }; // Clonamos el objeto para evitar modificar el formulario directamente

    // Si el usuario no selecciona "DESPACHO_A_DOMICILIO", eliminamos costoDespacho antes de enviarlo
    if (!data.tiposEntrega.includes('DESPACHO_A_DOMICILIO')) {
      delete data.costoDespacho;
    }

    console.log('Datos enviados:', data); // Debug antes de enviar

    this.productoService.crearProductos(data).subscribe({
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
    const sucursalesConError = this.form.value.sucursalesStock.filter((stock: any) => !stock.sucursalId);
    if (sucursalesConError.length > 0) {
      console.error('Error: Algunas sucursales no tienen un sucursalId asignado.', sucursalesConError);
      return;
    }
  
    console.log('Formulario enviado:', this.form.value);
  
    if (this.productoId) {
      console.log('Datos enviados para actualizar:', this.form);
      this.productoService.actualizarProductos(this.productoId, this.form.value).subscribe({
        next: (response) => {
          console.log('Producto actualizado con éxito', response);
          this.toastr.success(`Producto: ${this.form.value.name} actualizado correctamente.`);
          this.router.navigate(['/administrador/products/view'])
        },
        error: (err) => {
          console.error('Error al actualizar el producto:', err);
        }
      });
    } else {
      // Modo Creación
      console.log('Datos enviados para crear el producto:', this.form);
      this.productoService.crearProductos(this.form.value).subscribe({
        next: (response) => {
          console.log('Producto creado con éxito', response);
          this.toastr.success(`Producto: ${this.form.value.name} Creado correctamente.`);
          this.router.navigate(['/administrador/products/view'])
          
        },
        error: (err) => {
          console.error('Error al crear el producto:', err);
        }
      });
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
  private loadCategoriaProducto(): void{
    this.categoriaService.getAllCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        
      },
      error: (error) => {
        console.error("Error cargando las categorias de los productos", error);
      }
    })
  }
 
  private loadSucursales(): void {
    this.sucursalesService.getAllSucursales().subscribe({
      next: (sucursales) => {
        if (!sucursales || sucursales.length === 0) {
          console.warn('No se encontraron sucursales.');
          return;
        }
  
        this.sucursal = sucursales; // Guardamos las sucursales en la variable
  
        console.log('Sucursales recibidas:', sucursales);
  
        const stockArray = this.sucursalesStock;
        const stockMap = new Map<number, number>();
  
        // Guardar valores actuales del formulario para no perder datos
        stockArray.controls.forEach(control => {
          const sucursalId = control.get('sucursalId')?.value;
          const quantity = control.get('quantity')?.value;
          if (sucursalId) {
            stockMap.set(sucursalId, quantity);
          }
        });
  
        stockArray.clear(); // Limpiar correctamente el FormArray
  
        sucursales.forEach(sucursal => {
          const stock = this.producto?.sucursalesStock?.find((s: SucursalStock) => s.sucursalId === sucursal.id);
  
          stockArray.push(this.fb.group({
            sucursalId: [sucursal.id, [Validators.required]],
            quantity: [stock ? stock.quantity : 0, [Validators.required, Validators.min(0)]]
          }));
        });
  
        console.log('Formulario con sucursalesStock:', this.form.value);
      },
      error: (error) => {
        console.error("Error cargando sucursales:", error);
      }
    });
  }
  
  
   


  
  

  // Getter para acceder al FormArray desde la plantilla
  get sucursalesStock(): FormArray<FormGroup> {
    return this.form.get('sucursalesStock') as FormArray<FormGroup>;
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
