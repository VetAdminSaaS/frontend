import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComentarioResponse } from '../../models/comentario-response';
import { ComentarioService } from '../../../core/services/comentario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.scss'
})
export class ComentariosComponent implements OnInit {
  @Input() productoId!: number; // ID del producto recibido como input

  comentarios: ComentarioResponse[] = [];
  mostrarModal: boolean = false;
  ratingSeleccionado: number = 0;
  comentarioForm!: FormGroup;
  promedioRating: number = 0;
  ratingDistribucion: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  totalVotos: number = 0;

  private comentarioService = inject(ComentarioService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerComentarios();
    this.obtenerPromedio();
  }

  inicializarFormulario(): void {
    this.comentarioForm = this.fb.group({
      comentario: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  obtenerComentarios(): void {
    this.comentarioService.getAllComentariosPorProducto(this.productoId).subscribe({
      next: (data) => {
        this.comentarios = data;
        this.calcularEstadisticas(); // Llamar después de cargar los comentarios
      },
      error: (err) => {
        console.error('Error al obtener comentarios:', err);
      }
    });
  }

  calcularEstadisticas(): void {
    this.totalVotos = this.comentarios.length;
    this.ratingDistribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    let suma = 0;
    this.comentarios.forEach(c => {
      this.ratingDistribucion[c.rating]++; // Contar cada rating
      suma += c.rating;
    });

    this.promedioRating = this.totalVotos > 0 ? suma / this.totalVotos : 0;
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.comentarioForm.reset();
    this.ratingSeleccionado = 0;
  }
  

  seleccionarRating(rating: number): void {
    this.ratingSeleccionado = rating;
    this.comentarioForm.patchValue({ rating });
  }

  enviarComentario(): void {
    if (this.comentarioForm.invalid) {
      console.warn('Formulario inválido, revisa los campos');
      return;
    }
  
    const comentarioData = { 
      ...this.comentarioForm.value, 
      productoId: this.productoId 
    };
  
    console.log('Enviando comentario:', comentarioData);
  
    this.comentarioService.crearComentario(this.productoId, comentarioData).subscribe({
      next: () => {
        console.log('Comentario enviado con éxito');
        this.toastr.success('Tu comentario ha sido enviado correctamente.', 'Éxito');
        this.obtenerComentarios(); // Actualiza la lista de comentarios
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al enviar comentario:', err);
        
        if (err.status === 500 || err.status === 409) {
          // ⚠️ Notificación con Toastr si el usuario ya comentó
          this.toastr.warning('Ya has comentado sobre este producto. Solo puedes dejar una reseña.', 'Advertencia');
          window.location.reload();
        } else {
          this.toastr.error('Ocurrió un error al enviar el comentario. Inténtalo de nuevo.', 'Error');
        }
      }
    });
  }
  
  

  obtenerPromedio(): void {
    this.comentarioService.promedioProductoRating(this.productoId).subscribe({
      next: (promedio) => {
        this.promedioRating = promedio;
      },
      error: (err) => {
        console.error('Error al obtener el promedio:', err);
      }
    });
  }
}
