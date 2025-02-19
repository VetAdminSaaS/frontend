import { Component } from '@angular/core';
import { SidebarAdminComponent } from "../../../shared/components/sidebar-admin/sidebar-admin.component";

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [SidebarAdminComponent],
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.scss'
})
export class FacturasComponent {

}
