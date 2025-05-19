import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Productos } from '../../models/productos.model';
import { ProductoDetalles } from '../../models/productoDetalles.model';

@Component({
  selector: 'app-ficha-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ficha-producto.component.html',
  styleUrl: './ficha-producto.component.scss'
})
export class FichaProductoComponent {

  producto: ProductoDetalles[]=[];
  tabs = [
    { id: 'descripcion', label: 'Descripción' },
    { id: 'especificaciones', label: 'Especificaciones' },
    { id: 'condiciones', label: 'Condiciones' },
    { id: 'devoluciones', label: 'Devoluciones' }
  ];
  
  selectedTab = 'descripcion';
  
  features = [
    'Material premium duradero',
    'Garantía de 2 años',
    'Resistente al agua',
    'Diseño ergonómico'
  ];
  
  specifications = [
    {
      category: 'Especificaciones Técnicas',
      specs: [
        { name: 'Material', value: 'Aleación de aluminio' },
        { name: 'Peso', value: '1.5 kg' },
        { name: 'Dimensiones', value: '30 x 20 x 15 cm' }
      ]
    },
    {
      category: 'Certificaciones',
      specs: [
        { name: 'Seguridad', value: 'ISO 9001' },
        { name: 'Medio ambiente', value: 'RoHS' }
      ]
    }
  ];
  
  conditions = [
    'Uso recomendado en interiores',
    'Mantenimiento cada 6 meses',
    'No exponer a temperaturas extremas'
  ];
  
  returnSteps = [
    {
      title: 'Plazo de devolución',
      description: '30 días desde la recepción del producto'
    },
    {
      title: 'Condiciones del producto',
      description: 'Debe estar en su embalaje original y sin uso'
    },
    {
      title: 'Proceso de devolución',
      description: 'Contactar a servicio al cliente para iniciar el proceso'
    }
  ];

}
