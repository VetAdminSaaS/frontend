import { Component, inject } from '@angular/core';
import { SidebarAdminComponent } from "../../../../shared/components/sidebar-admin/sidebar-admin.component";
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { rangoNumericoService } from '../../../../core/services/rango-numerico.service';
import { RangosNumeracion } from '../../../../shared/models/rangos-numeracion.model';
import { response } from 'express';
import { Municipios } from '../../../../shared/models/municipios.model';
import { municipiosService } from '../../../../core/services/municipios.service';
import { UnidadMedidaService } from '../../../../core/services/unidad-Medida.service';
import { UnidadMedidaResponse } from '../../../../shared/models/unidad-medida-response.model';
import { TributosProductos } from '../../../../shared/models/tributos-productos.model';
import { tributosProductoService } from '../../../../core/services/tributo-Producto.service';
import { SidebarFactusComponent } from "../../../../shared/components/sidebar-factus/sidebar-factus.component";
import { ProductoService } from '../../../../core/services/producto.service';
import { Productos } from '../../../../shared/models/productos.model';
import { FormArray } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [ NavbarComponent, NgFor, NgClass, NgIf, SidebarFactusComponent,ReactiveFormsModule,FormsModule, CommonModule,NgxMaterialTimepickerModule],
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.scss'
})
export class FacturasComponent {
  private fb = inject(FormBuilder);
  private rangoNumeracionService = inject(rangoNumericoService);
  private municipiosService = inject(municipiosService);
  private unidadeMedidaService = inject(UnidadMedidaService);
  private tributosProductoService = inject(tributosProductoService);
  private factusconexion = inject(rangoNumericoService);
  private productosService = inject(ProductoService);

  total: number = 0;
  rangosNumericos : RangosNumeracion[] = [];
  municipios : Municipios[] = [];
  unidades : UnidadMedidaResponse[]=[];
  tributos: TributosProductos[] =[];  
  isCreditPayment = false;
  isNITSelected = false;
  selectedOrganizationType: string ='';
  productos: Productos[] = [];
  productosFiltrados: Productos[] = [];
  productosSeleccionados: Productos[] = [];
  filtro: string = '';
  startTimeWithSeconds: string = '';

  form!: FormGroup; 

  ngOnInit(): void {
   
    console.log("Inicializando formulario...");

    // Asegurar que el formulario está inicializado antes de la vista
    this.form = this.fb.group({
      numbering_range_id: ['', Validators.required], // Asegurar que este campo existe
      reference_code: ['', Validators.required],
      observation: [''],
      payment_form: [''],
      payment_method_code: [''],
      billing_period: this.fb.group({
        start_time: [this.getCurrentTime(), Validators.required], // Hora actual
        start_date: ['', Validators.required],
        end_date: ['', Validators.required],
        end_time: ['23:59:59', Validators.required]
      }),
      customer: this.fb.group({
        identification: ['', Validators.required],
        dv: [''],
        company: [''],
        trade_name: [''],
        names: ['', Validators.required],
        address: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        legal_organization_id: ['', Validators.required],
        tribute_id: ['', Validators.required],
        identification_document_id: ['', Validators.required],
        municipality_id: ['', Validators.required]
      }),
      payment_due_date: [''],
      items: this.fb.array([]) // Inicializar siempre el FormArray
    });

    console.log("Formulario inicializado correctamente:", this.form);
  

  
  
    // Cargar datos después de inicializar el formulario
    this.loadRangos();
    this.loadMunicipios();
    this.loadunidadesMedida();
    this.loadTributosProducto();
  
    this.productosService.getProductos().subscribe(data => {
      this.productos = data;
      this.productosFiltrados = data;
    });
  
    this.productosArray.valueChanges.subscribe(() => {
      console.log('Nuevo total:', this.totalFactura);
    });
  }
  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  // Método para validar y ajustar el formato al cambiar
  ajustarHoraFinal(): void {
    const time = this.form.value.end_time;
    if (time.length === 5) {
      this.form.patchValue({ end_time: `${time}:59` }); // Agrega los segundos
    }
    console.log('Hora de Fin:', this.form.value.end_time);
  }
  // Método para obtener la hora completa con segundos
  obtenerHoraCompleta(): void {
    const inputTime = this.form.value.start_time;
    this.startTimeWithSeconds = `${inputTime}:00`; // Agrega segundos
    console.log('Hora completa con segundos:', this.startTimeWithSeconds);
  }
  formatTimeFields() {
    let endTime = this.form.get('end_time')?.value;
  
   
    if (endTime) {
      this.form.patchValue({ end_time: this.formatToHHMMSS(endTime) });
    }
  }
  
  formatToHHMMSS(time: string): string {
    let parts = time.split(':');
    
    if (parts.length === 2) {

      return `${parts[0]}:${parts[1]}:00`;
    }
    
    return time; 
  }
  
  




  seleccionarProducto(items: Productos) {
    console.log("Antes de agregar producto:", this.productosArray.value);
  
    const existe = this.productosArray.controls.some(control => 
      control.value.code_reference === items.codeReference
    );
  
    if (!existe) {
      const quantity = 1; 
      const price = items.price || 0;
  
      const totalConDescuento = (items.price * (items.discountRate / 100)) * items.quantity;
  
      
      const productoForm = this.fb.group({
        id: [items.id],
        code_reference: [items.codeReference],
        name: [items.name],
        price: [price],
        quantity: [quantity, [Validators.required, Validators.min(1)]],
        unit_measure_id: [items.unitMeasureId],
        tax_rate: [items.taxRate],
        tribute_id: [items.tributeId],  
        discount_rate: [items.discountRate],
        coverPath: [items.coverPath],
        standard_code_id: [items.standardCodeId],
        is_excluded: [items.isExcluded],
        withholding_taxes: this.fb.array(items.withholdingTaxes || []),
        selectedQuantity: [quantity],
        total: [totalConDescuento] // ✅ Agregar total calculado
      });
  
      this.productosArray.push(productoForm);
    }
  
    console.log("Después de agregar producto:", this.productosArray.value);
  }
  

  get productosArray(): FormArray<FormGroup> {
    return this.form.get('items') as FormArray<FormGroup>;
  }
  
  enviarFormulario() {
    if (this.form.valid) {
      const datosFactura = {
        ...this.form.value,
        total: this.totalFactura,
        items: this.productosArray.value
      };

      console.log("Factura enviada:", datosFactura);
 
    } else {
      console.log("Formulario inválido", this.form.value);
    }
  }

  crearFactura(): void {
    if (this.form.valid) {
      const datosFactura = { ...this.form.value, items: this.productosArray.value, total:this.totalFactura };

      this.factusconexion.crearFacturaManual(datosFactura).subscribe({
        next: (response) => {
          console.log('Factura creada con éxito', response);
          window.location.reload()
        },
        error: (error) => {
          console.error('Error al crear la factura', error);
        }
      });
    } else {
      console.log('Formulario inválido', this.form.value);
    }
  }
get totalFactura(): number {
  return this.productosArray.controls.reduce((total, control) => {
    const precio = control.value.price || 0;
    const cantidad = control.value.quantity || 1;
    const impuesto = control.value.tax_rate || 0;
    const descuento = control.value.discount_rate || 0;

    const subtotal = precio * cantidad;
    const totalConImpuesto = subtotal + (subtotal * impuesto / 100);
    const totalConDescuento = subtotal - (subtotal* (descuento/100));

    return total + totalConDescuento;
  }, 0);
}

onSubmit(): void {
  if (!this.form) {
    console.error("Error: El formulario no está inicializado.");
    return;
  }

  if (this.form.invalid) {
    console.log("Formulario inválido", this.form.value);
    return;
  }

  console.log("Formulario enviado:", this.form.value);
  this.crearFactura();
}


  private loadRangos(): void {
    this.rangoNumeracionService.getRangosNumericos().subscribe({
      next: (response) => {
        if (response) {  
          this.rangosNumericos = response;  
        }
      },
      error: (err) => {
        console.error("Error al obtener los rangos numéricos", err);
      }
    });
  }
  
  private loadMunicipios(): void{
    this.factusconexion.getMunicipios().subscribe({
      next: (data) => {
        this.municipios = data;
      },
      error: (error) => {
        console.error("Error cargando unidades de medida:", error);
      }
    });
  }
  private loadunidadesMedida(): void{
    this.factusconexion.getUnidadesMedida().subscribe({
      next: (data) => {
        this.unidades = data;
      },
      error: (error) => {
        console.error("Error cargando unidades de medida:", error);
      }
    });
  }
  
  filtrarProductos() {
    this.productosFiltrados = this.productos.filter(p =>
      p.name.toLowerCase().includes(this.filtro.toLowerCase()) || 
      p.codeReference.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
  calcularSubtotal(productoForm: FormGroup): number {
  const cantidad = productoForm.get('quantity')?.value || 1;
  const precio = productoForm.get('price')?.value || 0;
  return cantidad * precio;
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
  onPaymentFormChange(event: any) {

    this.isCreditPayment = event.target.value === '2';
  
  
  }
  onIdentificationTypeChange(event: any) {
    this.isNITSelected = event.target.value === '6';
  }
  onOrganizationTypeChange(event: any) {
    this.selectedOrganizationType = event.target.value;
  }
 
  
  
  

  eliminarProducto(index: number) {
    this.productosArray.removeAt(index);
    console.log("Producto eliminado, productos restantes:", this.productosArray.value);
  }
  
  

}
