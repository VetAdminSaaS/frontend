import { Component } from '@angular/core';
import { NgFor, NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-carousel-tienda',
  standalone: true,
  imports: [NgFor, NgClass, NgStyle], // Importamos NgFor, NgClass y NgStyle
  templateUrl: './carousel-tienda.component.html',
  styleUrls: ['./carousel-tienda.component.scss'] // Corregir aquí
})
export class CarouselTiendaComponent {
  images = [
    'https://www.superpet.pe/on/demandware.static/-/Library-Sites-SuperPetSharedLibrary/default/dwcecf5fde/SuperPet/Homepage/2025/main_banner/superdays/superdays-antipulgas-desktop.jpg',
    'https://www.superpet.pe/on/demandware.static/-/Library-Sites-SuperPetSharedLibrary/default/dw09b338fa/SuperPet/Homepage/2025/main_banner/semana-natural/natural-humedo-desktop.jpg',
    'https://www.superpet.pe/on/demandware.static/-/Library-Sites-SuperPetSharedLibrary/default/dw70fe7ba0/SuperPet/Homepage/2025/main_banner/semana-natural/natural-alimento-desktop.jpg'
  ];

  currentIndex = 0;

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
