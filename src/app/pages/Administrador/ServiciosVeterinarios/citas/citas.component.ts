import { Component } from '@angular/core';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { SidebarFactusComponent } from "../../../../shared/components/sidebar-factus/sidebar-factus.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [NavbarComponent, SidebarFactusComponent, CommonModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.scss'
})
export class CitasComponent {
  

}
