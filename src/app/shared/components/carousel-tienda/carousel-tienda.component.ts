import { Component, HostListener } from '@angular/core';
import { NgFor, NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-carousel-tienda',
  standalone: true,
  imports: [NgFor, NgClass, NgStyle], // Importamos NgFor, NgClass y NgStyle
  templateUrl: './carousel-tienda.component.html',
  styleUrls: ['./carousel-tienda.component.scss'] // Asegúrate de que este archivo existe
})
export class CarouselTiendaComponent {
  images = [
    'https://www.superpet.pe/on/demandware.static/-/Library-Sites-SuperPetSharedLibrary/default/dw17d225f4/SuperPet/Homepage/2025/main_banner/solox72/72-horas-cyber-desktop.jpg',
    'https://www.superpet.pe/on/demandware.static/-/Library-Sites-SuperPetSharedLibrary/default/dwa3f1da4e/SuperPet/Homepage/2025/main_banner/cyberwow/cyber-camas-d.webp',
    'https://www.superpet.pe/on/demandware.static/-/Library-Sites-SuperPetSharedLibrary/default/dw9bc91793/SuperPet/Homepage/2025/main_banner/cyberwow/cyber-secoperro-d.webp'
  ];

  currentIndex = 0;
  screenWidth = window.innerWidth;

  // Escucha cambios de tamaño en la ventana
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.images.length - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex < this.images.length - 1) ? this.currentIndex + 1 : 0;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }
}
