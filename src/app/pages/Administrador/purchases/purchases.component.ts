import { Component, inject } from '@angular/core';
import { SidebarAdminComponent } from "../../../shared/components/sidebar-admin/sidebar-admin.component";
import { SidebarFactusComponent } from "../../../shared/components/sidebar-factus/sidebar-factus.component";
import { CommonModule } from '@angular/common';
import { PurchaseList } from '../../../shared/models/purchase-list.model';
import { PurchaseService } from '../../../core/services/purchase.service';
import { rangoNumericoService } from '../../../core/services/rango-numerico.service';
import { Facturas } from '../../../shared/models/facturas.model';
import { catchError, tap } from 'rxjs';
import { throwError } from 'rxjs';
import { FacturaResponse } from '../../../shared/models/factura-response.model';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [ SidebarFactusComponent, CommonModule],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss'
})
export class PurchasesComponent {
  
 purchases: PurchaseList[] = [];
  private purchaseService = inject(PurchaseService);
  private facturaService = inject(rangoNumericoService);

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.purchaseService.getAllPurchase().subscribe({
      next: (purchases) => {
        this.purchases = purchases;
      },
      error: (err) => {
        console.error("Error al obtener las compras:", err);
      }
    });
  }

  verFactura(number: string): void {
    if (!number || number.trim() === '') {
      alert('Número de factura inválido');
      return;
    }
  
    this.facturaService.verFactura(number, 'factura').pipe(
      tap((response: { data?: { bill?: { public_url?: string } } }) => { 
        let urlFactura = response?.data?.bill?.public_url; // ✅ Acceder correctamente a la URL
  
        if (urlFactura) {
        
          urlFactura = urlFactura.replace(/^Optional\[(.*)\]$/, "$1");
          window.open(urlFactura, '_blank');
        } else {
          console.error('No se encontró la URL de la factura', response);
          alert('No se encontró la URL de la factura.');
        }
      }),
      catchError((error) => {
        console.error('Error al obtener la factura', error);
        alert('Ocurrió un error al cargar la factura.');
        return throwError(() => new Error('Error al obtener la factura'));
      })
    ).subscribe();
}
verDian(number: string) {
  if (!number) {
    alert('Número de factura inválido');
    return;
  }

  this.facturaService.verFactura(number, 'dian').subscribe(
    (response) => {
   
      if (response && response.data && response.data.bill && response.data.bill.qr) {
        window.open(response.data.bill.qr, '_blank');
      } else {
        console.error('No se pudo obtener el QR de la DIAN', response);
        alert('No se pudo obtener el QR de la DIAN. Por favor, inténtalo de nuevo.');
      }
    },
    (error) => {
  
      console.error('Error al obtener el QR de la DIAN', error);
      alert('Ocurrió un error al cargar el QR. Por favor, verifica tu conexión o intenta más tarde.');
    }
  );
}

  
}
