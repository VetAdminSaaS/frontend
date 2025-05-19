import { Component, inject } from '@angular/core';
import { SidebarFactusComponent } from "../../../../shared/components/sidebar-factus/sidebar-factus.component";
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { CategoriaResponse } from '../../../../shared/models/categoria-response.model';
import { CommonModule } from '@angular/common';
import { Categoriaservice } from '../../../../core/services/categoria.service';
import { CategoriaRequest } from '../../../../shared/models/categoria-request.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categoria-producto',
  standalone: true,
  imports: [SidebarFactusComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './categoria-producto.component.html',
  styleUrl: './categoria-producto.component.scss'
})
export class CategoriaProductoComponent {
  categorias: CategoriaResponse[] = [];
  categoriasFiltradas: CategoriaResponse[] = [];
  private categoriaService = inject(Categoriaservice);
  filtroNombre: string = '';
  modalAbierto: boolean = false;
  categoriaId: number | null = null; // Identificador de la categoría a actualizar
  categoria: CategoriaRequest = { nombre: '', descripcion: '' };

  ngOnInit(): void {
    this.loadCategorias();
  }

  private loadCategorias(): void {
    this.categoriaService.getAllCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.filtrarCategorias();
      }
    });
  }

  filtrarCategorias(): void {
    this.categoriasFiltradas = this.categorias.filter(categoria =>
      categoria.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }

  abrirModal(categoria?: CategoriaResponse): void {
    this.modalAbierto = true;

    if (categoria) {
      // Editar categoría existente
      this.categoriaId = categoria.id;
      this.categoria = {
        nombre: categoria.nombre,
        descripcion: categoria.descripcion
      };
    } else {
      // Crear nueva categoría
      this.categoriaId = null;
      this.categoria = { nombre: '', descripcion: '' };
    }
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.categoriaId = null;
    this.categoria = { nombre: '', descripcion: '' };
  }

  guardarCategoria(): void {
    if (this.categoriaId) {
      // Actualizar categoría
      this.categoriaService.actualizarCategoria(this.categoriaId, this.categoria).subscribe(() => {
        this.loadCategorias();
        this.cerrarModal();
      });
    } else {
      // Crear nueva categoría
      this.categoriaService.crearCategoria(this.categoria).subscribe(() => {
        this.loadCategorias();
        this.cerrarModal();
      });
    }
  }

  eliminarCategoria(id: number): void {
    this.categoriaService.eliminarCategoria(id).subscribe(() => {
      this.loadCategorias();
    });
  }
}
