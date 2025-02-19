import { Component, inject, OnInit } from '@angular/core';
import { SidebarAdminComponent } from '../../../../shared/components/sidebar-admin/sidebar-admin.component';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { NgFor, NgIf } from '@angular/common';
import { FacturaService } from '../../../../core/services/factura.Service';
import { FacturasAdmi } from '../../../../shared/models/factura-Admi.model';
import { response } from 'express';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { of } from 'rxjs';
import { SidebarFactusComponent } from '../../../../shared/components/sidebar-factus/sidebar-factus.component';
import { rangoNumericoService } from '../../../../core/services/rango-numerico.service';

@Component({
  selector: 'app-facturaslist',
  standalone: true,
  imports: [NavbarComponent, NgFor, NgIf, FormsModule, SidebarFactusComponent],
  templateUrl: './facturaslist.component.html',
  styleUrl: './facturaslist.component.scss'
})
export class FacturaslistComponent implements OnInit {
  

    private facturaConexion = inject(rangoNumericoService);
    private facturaService = inject(FacturaService);
  facturas: FacturasAdmi[] = [];
  totalResults: number = 0;
  currentPage: number = 1;
  resultsPerPage: number = 20;
  totalPages: number = 1;
  pageNumbers: number[] = [];
  isModalOpen = false; 
  isLoading = false;
  errorMessage: string = ''; 
  facturaNumber: string = '';
  facturaUrl: SafeResourceUrl | null = null;
  filtros = {
    identification: '',
    names: '',
    number: '',
    reference_code: '',
    status: '',
  }
 



  // Métodos de paginación
  startItem: number = 1;
  endItem: number = 10;

  ngOnInit(): void {
    this.loadFacturas();
   
  }

 
  aplicarFiltro() {
    this.currentPage = 1
    this.loadFacturas(); 
  }

  loadFacturas() {
    this.isLoading = true;
    const filters: any = {};

    if (this.filtros.identification) filters['filter[identification]'] = this.filtros.identification;
    if (this.filtros.names) filters['filter[names]'] = this.filtros.names;
    if (this.filtros.number) filters['filter[number]'] = this.filtros.number;
    if (this.filtros.reference_code) filters['filter[reference_code]'] = this.filtros.reference_code;
    if (this.filtros.status) filters['filter[status]'] = this.filtros.status;

    const filterQuery = new URLSearchParams(filters).toString();

    this.facturaConexion.getFacturas(this.currentPage, this.resultsPerPage, filterQuery).subscribe(
      (response) => {
        
        if (response && response.facturas && Array.isArray(response.facturas)) {
          this.facturas = response.facturas;
          this.totalResults = response.total || 0;
          this.totalPages = Math.ceil(this.totalResults / this.resultsPerPage);
        } else {
          this.facturas = [];
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar las facturas:', error);
        this.facturas = [];
        this.isLoading = false;
      }
    );
}

  // Resetear filtros
  resetFiltros() {
    this.filtros = {
      identification: '',
      names: '',
      number: '',
      reference_code: '',
      status: ''
    };
    this.loadFacturas(); // Cargar facturas sin filtros
  }


  isStatusActive(status: string): boolean {
    return Number(status) === 1;
  }
  
  isStatusInactive(status: string): boolean {
    return Number(status) === 0;
  }
  
  goToPage(page: number) {
    this.currentPage = page;
    this.loadFacturas();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadFacturas();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadFacturas();
    }
  }
  getPageRange(): number[] {
    const range = [];
    const start = Math.max(1, this.currentPage - 2); 
    const end = Math.min(this.totalPages, this.currentPage + 2); 
  
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }
  verFactura(number: string) {
    if (!number) {
      alert('Número de factura inválido');
      return;
    }

    this.isLoading = true; // Activar el spinner
    this.facturaConexion.verFactura(number, 'factura').subscribe(
      (response) => {
        this.isLoading = false; // Desactivar el spinner
        if (response && response.data && response.data.bill && response.data.bill.public_url) {
          window.open(response.data.bill.public_url, '_blank');
        } else {
          console.error('No se pudo obtener la URL de la factura', response);
          alert('No se pudo obtener la URL de la factura. Por favor, inténtalo de nuevo.');
        }
      },
      (error) => {
        this.isLoading = false; // Desactivar el spinner
        console.error('Error al obtener la factura', error);
        alert('Ocurrió un error al cargar la factura. Por favor, verifica tu conexión o intenta más tarde.');
      }
    );
  }

  // Método para ver el QR de la DIAN
  verDian(number: string) {
    if (!number) {
      alert('Número de factura inválido');
      return;
    }

    this.isLoading = true; 
    this.facturaConexion.verFactura(number, 'dian').subscribe(
      (response) => {
        this.isLoading = false; 
        if (response && response.data && response.data.bill && response.data.bill.qr) {
          window.open(response.data.bill.qr, '_blank');
        } else {
          console.error('No se pudo obtener el QR de la DIAN', response);
          alert('No se pudo obtener el QR de la DIAN. Por favor, inténtalo de nuevo.');
        }
      },
      (error) => {
        this.isLoading = false; 
        console.error('Error al obtener el QR de la DIAN', error);
        alert('Ocurrió un error al cargar el QR. Por favor, verifica tu conexión o intenta más tarde.');
      }
    );
  }

  descargarFactura(number: string) {
    console.log('📥 Solicitando descarga de factura:', number);
  
    this.facturaConexion.descargarFactura(number).subscribe({
      next: (response: Blob) => {
        console.log('📄 Factura recibida, iniciando descarga...');
  
        // Crear un enlace para la descarga
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura_${number}.pdf`; // Nombre del archivo
        document.body.appendChild(a);
        a.click();
  
        // Limpiar después de la descarga
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
  
        console.log('✅ Factura descargada correctamente.');
      },
      error: (err) => {
        console.error('❌ Error al descargar la factura:', err);
      },
    });
  }
  
  
  eliminarFactura(reference_code: string): void {
    // Buscar la factura en la lista de facturas cargadas
    const factura = this.facturas.find(f => f.reference_code === reference_code);
  
    // Verificar si la factura ya ha sido validada
    if (factura && factura.status === 1) {
      alert('No se puede eliminar una factura que ya ha sido validada.');
      return; // Detener la ejecución
    }
  
  
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta factura?');
    if (!confirmacion) return;
  

    this.facturaConexion.eliminarFactura(reference_code).subscribe({
      next: () => {
        alert('Factura eliminada con éxito.');
        this.loadFacturas(); 
      },
      error: (error) => {
        console.error('Error al eliminar la factura:', error);
        alert('Ocurrió un error al intentar eliminar la factura.');
      }
    });
  }

 
  
  closeModal() {
    this.isModalOpen = false;
    this.facturaUrl = null; 
  }
}
  


