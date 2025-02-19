import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoDetailsComponent } from "../../../shared/components/producto-details/producto-details.component";
import { EncabezadoComponent } from "../../../shared/components/encabezado/encabezado.component";

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [ProductoDetailsComponent, EncabezadoComponent],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.scss'
})
export class DetallesComponent {
  productoId: number;
  private route = inject(ActivatedRoute);
  constructor() {
    this.productoId = +this.route.snapshot.paramMap.get('id')!;
    console.log(this.productoId);
  }

}
