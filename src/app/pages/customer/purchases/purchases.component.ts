import { Component, inject, OnInit } from '@angular/core';
import { SidebarAdminComponent } from "../../../shared/components/sidebar-admin/sidebar-admin.component";
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
  imports: [SidebarAdminComponent, CommonModule],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss'
})
export class PurchasesComponent implements OnInit {
  purchases: PurchaseList[] = [];
  private purchaseService = inject(PurchaseService);
  private facturaService = inject(rangoNumericoService);
  

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.purchaseService.getPurchaseByUser().subscribe({
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

  
  
}

  

