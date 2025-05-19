import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarAdminComponent } from "../../../shared/components/sidebar-admin/sidebar-admin.component";
import { PurchaseService } from '../../../core/services/purchase.service';
import { PurchaseResponse } from '../../../shared/models/purchase-response-model';
import { CustomerStoreService } from '../../../core/services/customerstore.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, SidebarAdminComponent],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {

  purchases: PurchaseResponse[] = [];
  loading: boolean = true;
  private customerStoreService = inject(CustomerStoreService);

  ngOnInit(): void {
    this.getLastPaidPurchases();
  }

  getLastPaidPurchases(): void {
    this.customerStoreService.getLastSixPurchases().subscribe({
      next: (data) => {
        this.purchases = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener compras:', err);
        this.loading = false;
      }
    });
  }
}
