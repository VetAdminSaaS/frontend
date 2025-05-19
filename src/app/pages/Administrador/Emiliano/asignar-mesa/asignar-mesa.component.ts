import { Component, OnInit } from '@angular/core';
import { MesaService } from '../../../../core/services/mesa.service';
import { InvitadoService } from '../../../../core/services/invitado.service';
import { SidebarFactusComponent } from "../../../../shared/components/sidebar-factus/sidebar-factus.component";
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MesaResponse } from '../../../../shared/models/mesa-response.model';

@Component({
  selector: 'app-asignar-mesa',
  standalone: true,
  imports: [SidebarFactusComponent, FormsModule, CommonModule],
  templateUrl: './asignar-mesa.component.html',
  styleUrls: ['./asignar-mesa.component.scss']
})
export class AsignarMesaComponent implements OnInit {
  mesas: MesaResponse[] = [];
  filteredInvitados: any[] = [];
  searchQuery: string = '';
  modalVisible: boolean = false;
  selectedMesa: any;
  nombresInput: string = ''; 
  mesaNumber: string = '';   
  selectedImage: File | null = null;
  imageTemplate: string | null = null;
  modalSeleccion: boolean = false;
  modalImagenVisible: boolean = false;
  imagenSeleccionada: string | null = null;

  

  constructor(
    private mesaService: MesaService,
    private invitadoService: InvitadoService
  ) {}

  ngOnInit(): void {
    this.loadMesas();
    this.loadInvitados();
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0]; 
  
    if (file) {
      this.selectedImage = file;  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageTemplate = e.target.result;  
      };
      reader.readAsDataURL(file); 
    } else {
      console.error('No se ha seleccionado una imagen.');
    }
  }
  


  loadMesas(): void {
    this.mesaService.getAllMesas().subscribe({
      next: (data) => {
        this.mesas = data;
      },
      error: (err) => console.error('❌ Error cargando mesas:', err)
    });
  }


  loadInvitados(): void {
    this.invitadoService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Todos los invitados:', data);
  
        
        this.filteredInvitados = data.filter(invitado => !invitado.numeroMesa);
        
        console.log('🔹 Invitados sin mesa asignada:', this.filteredInvitados);
      },
      error: (err) => console.error('❌ Error cargando invitados:', err)
    });
  }
  
  

  abrirModalSeleccion(mesa: any): void {
    this.selectedMesa = mesa;
    this.modalSeleccion = true;  
  }
  abrirModalImagen(imagen: string | null) {
    if (imagen) {
      this.imagenSeleccionada = imagen;
      this.modalImagenVisible = true;
    }
  }
  
  
  cerrarModalImagen() {
    this.modalImagenVisible = false;
    this.imagenSeleccionada = null;
  }
  
  descargarImagen() {
    if (this.imagenSeleccionada) {
      const link = document.createElement('a');
      link.href = this.imagenSeleccionada;
      link.download = 'imagen_generada.png';
      link.click();
    }
  }
  
  abrirModal(mesa: any): void {
    this.selectedMesa = mesa;
    this.obtenerInvitadosDeMesa(mesa.numero);
    this.modalVisible = true;
  }

  obtenerInvitadosDeMesa(numero: number): void {
    this.mesaService.obtenerNombresInvitadosPorMesa(numero).subscribe({
      next: (nombres: string[] | null) => {
        console.log('✅ Invitados obtenidos para mesa:', numero, nombres);
  
        this.selectedMesa.invitados = nombres ?? [];
  
        const invitadosMesaSet = new Set(this.selectedMesa.invitados);
        this.filteredInvitados = this.filteredInvitados.filter(invitado =>
          !invitadosMesaSet.has(invitado.nombre)
        );
      },
      error: (err) => {
        console.error('❌ Error obteniendo invitados:', err);
        this.selectedMesa.invitados = [];
      }
    });
  }
  
  

  cerrarModal(tipo: 'seleccion' | 'asignados'): void {
    console.log('Antes de cerrar:', { modalSeleccion: this.modalSeleccion, modalVisible: this.modalVisible });
  
    if (tipo === 'seleccion') {
      this.modalSeleccion = false;
    } else if (tipo === 'asignados') {
      this.modalVisible = false;
    }
  
    console.log('Después de cerrar:', { modalSeleccion: this.modalSeleccion, modalVisible: this.modalVisible });
  }
  
  asignarInvitados(): void {
    if (this.selectedMesa) {
      const invitadosSeleccionados = this.filteredInvitados.filter(invitado => invitado.selected);
      for (const invitado of invitadosSeleccionados) {
        this.mesaService.asignarMesa(invitado.id, this.selectedMesa.numero).subscribe({
          next: () => {
            this.selectedMesa.invitados.push(invitado.nombre);
          },
          error: (err) => console.error('❌ Error asignando invitado:', err)
        });
      }
      this.modalSeleccion = false; 
    }
  }
  
  filterInvitados(): void {
    const search = this.searchQuery.toLowerCase();
    
    if (this.selectedMesa?.invitados) {
      const invitadosMesaSet = new Set(this.selectedMesa.invitados);
      this.filteredInvitados = this.filteredInvitados.filter(invitado =>
        invitado.nombre.toLowerCase().includes(search) &&
        !invitadosMesaSet.has(invitado.nombre)
      );
    } else {
      this.filteredInvitados = this.filteredInvitados.filter(invitado =>
        invitado.nombre.toLowerCase().includes(search)
      );
    }
  }
  
  

  toggleDetalles(mesa: any): void {
    mesa.mostrarDetalles = !mesa.mostrarDetalles;
  }
  moverInvitado(mesa: any, fromIndex: number, toIndex: number): void {
    if (toIndex >= 0 && toIndex < mesa.invitados.length) {
      const invitados = [...mesa.invitados]; 
      const temp = invitados[fromIndex];
      invitados[fromIndex] = invitados[toIndex];
      invitados[toIndex] = temp;
      
      mesa.invitados = invitados;
    }
  }
  

  generarImagen(mesa: any, event: MouseEvent): void {
    event.stopPropagation();
    if (!this.selectedImage) {
      console.error('❌ No se ha seleccionado una imagen.');
      return;
    }
  
    const canvas = <HTMLCanvasElement>document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
  
    const nombres: string[] = mesa.invitados || []; 
    const mesaNumber = mesa.numero;
  
    if (nombres.length === 0) {
      console.error('❌ No hay invitados asignados a la mesa.');
      return;
    }
  
    canvas.width = 800;
    canvas.height = 1200;
  
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        console.log('Imagen cargada correctamente');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          ctx.font = '190px "Pinyon Script", cursive';
          ctx.fillStyle = '#936b42'; 
          ctx.textAlign = 'center';
          ctx.fillText(`Mesa ${mesaNumber}`, canvas.width / 2, 340);
  
          const fondoWidth = 600;
          const fondoHeight = nombres.length * 70 + 60;
          const fondoX = (canvas.width - fondoWidth) / 2; 
          const fondoY = 350; 
  
          ctx.fillStyle = 'rgba(255, 255, 255, 0.0)'; 
          ctx.fillRect(fondoX, fondoY, fondoWidth, fondoHeight);
  
          ctx.font = '55px "Barlow", sans-serif';
          ctx.fillStyle = '#545454';
          ctx.textAlign = 'center';
        
  

          const nombreYInicio = fondoY + 110; 
          nombres.forEach((nombre: string, index: number) => { 
            const y = nombreYInicio + index * 90;
            ctx.fillText(nombre, canvas.width / 2, y);
          });
  

          mesa.imagenGenerada = canvas.toDataURL('image/png');
        } else {
          console.error('❌ El contexto del canvas no es válido.');
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(this.selectedImage);
  }
 
  retirarInvitado(mesa: any, invitado: any): void {
    if (invitado) {
      if (confirm(`¿Seguro que deseas retirar a ${invitado} de la mesa ${mesa.numero}?`)) {
        this.mesaService.retirarDeMesa(invitado).subscribe({
          next: () => {
            mesa.invitados = mesa.invitados.filter((i: any) => i !== invitado);
            this.loadInvitados();
          },
          error: (err) => console.error('❌ Error retirando invitado:', err)
        });
      }
    }
  }
  verInvitados(mesa: any): void {
    this.selectedMesa = mesa; 
    this.modalVisible = true; 
  }
  mostrarInvitados(mesa: any): void {
    
    mesa.mostrarInvitados = !mesa.mostrarInvitados;
  }
  
}
