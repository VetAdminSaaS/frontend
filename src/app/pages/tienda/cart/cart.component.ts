import { Component, OnInit, inject } from '@angular/core';
import { PurchaseCreateUpdateRequest, PurchaseItemCreateUpdateRequest } from '../../../shared/models/purchase-create.update-request';
import { PurchaseService } from '../../../core/services/purchase.service';
import { CheckoutService } from '../../../core/services/checkout.service';
import { CartService } from '../../../core/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormularioCustomerStoreComponent } from "../../../shared/components/formulario-customer-store/formulario-customer-store.component";
import { EncabezadoComponent } from "../../../shared/components/encabezado/encabezado.component";
import { ToastrService } from 'ngx-toastr';
import { response } from 'express';
import { rangoNumericoService } from '../../../core/services/rango-numerico.service';
import { UnidadMedidaResponse } from '../../../shared/models/unidad-medida-response.model';
import { switchMap, forkJoin } from 'rxjs';
import { PaymentStatus, PurchaseResponse } from '../../../shared/models/purchase-response-model';
import { RangosNumeracion } from '../../../shared/models/rangos-numeracion.model';
import { UsuarioStoreDTO } from '../../../shared/models/usuario.formulario.store.model';
import { BillingPeriod } from '../../../shared/models/billing-period.model';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { CustomerService } from '../../../core/services/customerService.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PurchaseItemResponse } from '../../../shared/models/purchase-response-model';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormularioCustomerStoreComponent, EncabezadoComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: PurchaseItemCreateUpdateRequest[] = [];
  isCustomerConfirmed: boolean = false;
  total: number = 0;
  discount_rate: number =0;
  customerId!:number;
  customer: UsuarioStoreDTO = {
    identification: '',
    names: '',
    address: '',
    email: '',
    phone: '',
    legalOrganizationId: 0,
    tributeId: 0,
    municipalityId: 0,
    identificationDocumentId: 0,
    company: '',
    tradeName: '',
    dv: 0,
    userId:0
  }; 
   private purchaseService = inject(PurchaseService);
  private checkoutService = inject(CheckoutService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  isAuthenticated: boolean = false;
  private toastr = inject(ToastrService);
    private factusconexion = inject(rangoNumericoService);
    private cdr = inject(ChangeDetectorRef);
    private customerService = inject(CustomerService);
    unidadMedidas: UnidadMedidaResponse[] = [];
    isCustomerConfirmed$!: Observable<boolean>;
    selectedNumberingRangeId: number | null = null; // 🔹 Inicialmente null
    paymentConfirmed: boolean = false;
    private paymentCheckSubscription!: Subscription;
  loading: boolean = false;
loadingMessage: string = "Procesando la compra...";

constructor() {
  this.isCustomerConfirmed$ = this.customerService.isCustomerConfirmed$.pipe(
    tap(value => console.log("Estado del cliente confirmado:", value))
  );
}

ngOnInit(): void {
  this.checkPaymentStatusOnReturn();
  this.customerService.numberingRange$.subscribe(id => {
    this.selectedNumberingRangeId = id;
    console.log('📌 Rango de numeración actualizado en Cart:', this.selectedNumberingRangeId);
  });
  this.loadCart();
  this.cargarUnidadesMedida();

  const user = this.authService.getUser();
  if (user) {
    this.customer = {
      identification: user.identification || '',
      names: user.names || '',
      address: user.address || '',
      email: user.email || '',
      phone: user.phone || '',
      legalOrganizationId: user.legalOrganizationId || 0,
      tributeId: user.tributeId || 0,
      municipalityId: user.municipalityId || 0,
      identificationDocumentId: user.identificationDocumentId || 0,
      company: user.company !== null && user.company !== undefined ? user.company : '',
tradeName: user.tradeName !== null && user.tradeName !== undefined ? user.tradeName : '',
      userId: user.id,
      

      dv: user.dv || 0,
    };
  }

  const token = this.route.snapshot.queryParamMap.get('token');
  const payerId = this.route.snapshot.queryParamMap.get('PayerID');
  if (token && payerId) {
    this.loading = true;
    this.checkoutService.capturePaypalOrder(token).subscribe({
      next: (response) => {
        if (response.completed) {
          this.clearCart();
          this.router.navigate(['/store']);
        }
      },
      error: (err) => {
        console.error('Error capturando orden de PayPal:', err);
        this.loading = false;
      }
    });
  }

  const purchaseIdParam = this.route.snapshot.queryParamMap.get('purchaseId');
  if (!purchaseIdParam) {
    return;
  }

  const purchaseId = Number(purchaseIdParam);
  if (isNaN(purchaseId) || purchaseId <= 0) {
    return;
  }

  this.purchaseService.getPurchaseStatus(purchaseId).subscribe(
    purchase => {
      if (purchase.paymentStatus?.toUpperCase() === 'PAID') {
        this.toastr.success("Compra realizada con éxito", 'Éxito');
      } else {
        this.toastr.error("El pago no se completó correctamente", 'Error');
      }
    }
  );
}

cargarUnidadesMedida(): void {
  this.factusconexion.getUnidadesMedida().subscribe({
    next: (data) => {
      this.unidadMedidas = data;
    },
    error: (error) => {
      console.error("Error cargando unidades de medida:", error);
    }
  });
}

calculateDiscount(): number {
  return this.cartItems.reduce((totalDiscount, item) => {
    const itemDiscount = (item.price * (item.discount_rate / 100)) * item.quantity;
    return totalDiscount + itemDiscount;
  }, 0);
}

getNombreUnidadMedida(unitMeasureId: number): string {
  const unidad = this.unidadMedidas?.find(u => u.id === unitMeasureId);
  return unidad ? unidad.name : '';
}

trackByProductoId(index: number, item: PurchaseItemCreateUpdateRequest): number {
  return item.productoId;
}

loadCart(): void {
  const items = this.cartService.getCartItems();
  this.cartItems = items ?? []; 
  this.total = this.cartService.getCartTotal();
  this.discount_rate = this.calculateDiscount(); 
  console.log(items);
}

removeItem(productoId: number): void {
  this.cartService.removeFromCart(productoId);
  this.loadCart();
}

clearCart(): void {
  this.cartService.clearCart();
  this.loadCart();
}

confirmCustomer(): void {

  this.customerService.confirmCustomer(); 
  this.toastr.success('Cliente confirmado. Ahora puedes proceder con la compra.');

  setTimeout(() => {
    this.cdr.detectChanges();
  }, 0);
}


  
  
  
async proceedToCheckout(): Promise<void> {
  try {
    const cartItems = this.cartService.getCartItems();
    if (!cartItems.length) {
      this.toastr.warning('El carrito está vacío.');
      return;
    }

    if (!this.customer?.identification) {
      this.toastr.warning('El cliente no está correctamente definido.');
      return;
    }

    this.selectedNumberingRangeId = this.customerService.getNumberingRangeId();
    if (!this.selectedNumberingRangeId) {
      this.toastr.warning('Debe seleccionar un rango de numeración.');
      return;
    }

    this.loading = true;
    this.loadingMessage = 'Procesando la compra...';

    const purchaseRequest: PurchaseCreateUpdateRequest = {
      total: this.total- this.discount_rate,
      numberingRangeId: this.selectedNumberingRangeId,
      customer: this.customer,
      items: cartItems.map(item => ({
        productoId: item.productoId,
        coverPath: item.coverPath ?? '',
        name: item.name,
        code_reference: item.code_reference ?? '',
        unit_measure_id: item.unit_measure_id ?? 0,
        quantity: item.quantity,
        price: item.price,
        discount_rate: item.discount_rate ?? 0,
        tax_rate: item.tax_rate ?? 0,
        standard_code_id: item.standard_code_id ?? null,
        is_excluded: item.is_excluded ?? false,
        tribute_id: item.tribute_id ?? null,
        withholding_taxes: Array.isArray(item.withholding_taxes) ? item.withholding_taxes : [],
        costoDespacho: item.costoDespacho,
        selectedQuantity: item.selectedQuantity,
        stock: item.stock,
      })),
    };

    const purchase = await firstValueFrom(this.purchaseService.createPurchase(purchaseRequest));
    if (!purchase?.id) throw new Error('❌ Error al crear la compra');

    console.log('📌 Compra creada con éxito:', purchase);

    // Guardar datos en localStorage
    localStorage.setItem('pendingPurchaseId', String(purchase.id));
    localStorage.setItem('pendingPurchase', JSON.stringify(purchase));

    // Asegurar que los datos fueron almacenados
    console.log('📌 Datos de compra almacenados en localStorage.');

    this.loadingMessage = 'Redirigiendo a PayPal...';

    const paypalOrder = await firstValueFrom(this.checkoutService.createPaypalOrder(purchase.id));
    if (!paypalOrder?.paypalUrl) throw new Error('❌ Error procesando el pago.');

    console.log('📌 Redirigiendo a PayPal:', paypalOrder.paypalUrl);

    // Asegurar que la URL es válida antes de redirigir
    if (!paypalOrder.paypalUrl.startsWith('https://')) {
      throw new Error('❌ URL de PayPal inválida.');
    }

    window.location.href = paypalOrder.paypalUrl;
  } catch (error) {
    console.error('❌ Error en el proceso de checkout:', error);
    this.toastr.error('Hubo un error durante el proceso de compra', 'Error');
    this.loading = false;
  }
}




async checkPaymentStatusOnReturn(): Promise<void> {
  const purchaseId = localStorage.getItem('pendingPurchaseId');

  if (!purchaseId) {
    console.warn('⚠️ No hay una compra pendiente.');
    return;
  }

  console.log('📌 Iniciando verificación periódica del estado del pago...');

  this.paymentCheckSubscription = interval(5000) // ⏳ Consulta cada 5 segundos
    .pipe(
      takeWhile(() => !this.paymentConfirmed), // 🔹 Detiene cuando se confirma el pago
      switchMap(() => this.checkoutService.verificarEstadoCompra(Number(purchaseId)))
    )
    .subscribe(
      (response) => {
        const paymentStatus = response.status;
        console.log('📌 Estado actualizado de la compra:', paymentStatus);

        if (paymentStatus === 'PAID') {
          console.log('✅ Pago confirmado, generando factura...');
          this.paymentConfirmed = true;
          this.generateInvoice(Number(purchaseId));


          if (this.paymentCheckSubscription) {
            this.paymentCheckSubscription.unsubscribe();
          }
        } else {
          console.warn(`⏳ Aún esperando confirmación de PayPal... Estado: ${paymentStatus}`);
        }
      },
      (error) => {
        console.error('❌ Error al verificar el estado del pago:', error);
        this.toastr.error('Hubo un error al verificar el pago.');
      }
    );
     
}



async generateInvoice(purchaseId: number): Promise<void> {
  const generateReferenceCode = (): string => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${date}-${random}`;
  };

  try {
    console.log('📌 Generando factura para la compra:', purchaseId);

    const purchaseData = localStorage.getItem('pendingPurchase');
    const purchase = purchaseData ? JSON.parse(purchaseData) : null;

    if (!purchase) throw new Error('❌ No se encontró la compra en el almacenamiento local.');
    if (!purchase.numberingRangeId || !purchase.customer) throw new Error('❌ Datos de facturación incompletos.');

    console.log('📌 Datos de la compra obtenidos:', purchase);

    const referenceCode = purchase.referenceCode || generateReferenceCode();
    console.log('📌 Código de referencia generado:', referenceCode);

    const facturaRequest = {
      numbering_range_id: purchase.numberingRangeId,
      reference_code: referenceCode,
      observation: 'Compra realizada',
      payment_form: purchase.payment_form || 0,
      payment_due_date: new Date(),
      payment_method_code: purchase.payment_method_code || 0,
      billing_period: purchase.billing_period?.[0] || {
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      },
      customer: purchase.customer,
      items: purchase.items.map((item: PurchaseItemResponse) => ({
        productoId: item.productoId ?? item.productoId,
        coverPath: item.coverPath ?? '',
        name: item.name,
        code_reference: item.code_reference ?? '',
        unit_measure_id: item.unit_measure_id ?? 0,
        quantity: item.quantity,
        price: item.price,
        discount_rate: item.discount_rate ?? 0,
        tax_rate: item.tax_rate ?? 0,
        standard_code_id: item.standard_code_id ?? null,
        is_excluded: item.is_excluded ?? false,
        tribute_id: item.tribute_id ?? null,
        withholding_taxes: Array.isArray(item.withholdingTaxes) ? item.withholdingTaxes : [],
      })),
    };

    console.log('📌 Enviando datos para Factura:', facturaRequest);
    
    // ✅ 🔹 Asegurar eliminación de localStorage
    console.log('🗑️ Eliminando datos de localStorage...');
    localStorage.removeItem('pendingPurchaseId');
    localStorage.removeItem('pendingPurchase');

    let attempts = 1;
    let factura: any = null;

    while (attempts > 0) {
      try {
        factura = await firstValueFrom(this.factusconexion.crearFactura(facturaRequest, purchaseId));

        console.log('📌 Respuesta de la API de Facturación:', factura);

        if (factura && factura.id) break; // ✅ Validar si la factura tiene un ID
      } catch (err) {
        console.warn(`⚠️ Reintento ${2 - attempts}/1 para generar factura...`);
        attempts--;
        if (attempts === 0) throw new Error('❌ Error generando la factura después de 1 intento.');
        await new Promise(res => setTimeout(res, 1000));
      }
    }

    if (!factura || !factura.id) throw new Error('❌ Error generando la factura.');

    console.log('📌 Factura generada con éxito:', factura);

    // 📌 **Actualizar la compra con el número de factura**
    if (factura.number) {
      console.log('📌 Guardando número de factura en la compra:', factura.number);
     
    } else {
      console.warn('⚠️ La API de facturación no devolvió un número de factura.');
    }

    this.toastr.success('✅ Factura generada y asociada a la compra.');

    // 🔍 **Verificar si se eliminaron los datos**
    setTimeout(() => {
      if (!localStorage.getItem('pendingPurchase') && !localStorage.getItem('pendingPurchaseId')) {
        console.log('✅ Datos eliminados correctamente del localStorage.');
      } else {
        console.warn('⚠️ Los datos siguen en localStorage después de intentar eliminarlos.');
        
        // 🚨 **Solución de emergencia**
        console.log('🛑 Forzando eliminación completa...');
        localStorage.clear();
        
        // 🔄 **Recargar la página para asegurar que los datos no se regeneren**
        setTimeout(() => {
          console.log('🔄 Recargando la página para limpiar caché...');
          window.location.reload();
        }, 300);
      }
    }, 500); // Esperamos 500ms para asegurarnos

  } catch (error) {
    console.error('❌ Error al generar la factura:', error);
    this.toastr.error('Hubo un error al generar la factura.');
  }
}














  
  
  
  
  
  
  
  

  

goBackToStore(): void {
  this.router.navigate(['/store']);
}

}
