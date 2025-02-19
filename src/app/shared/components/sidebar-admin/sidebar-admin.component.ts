import { Component, inject} from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.scss'
})
export class SidebarAdminComponent {
  isAuthenticated: boolean = false;
  isCollapsed = false;
  customerName: string | null = '';
  initials: string = '';



  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    const customer = this.authService.getUser();
    
    // Validamos que customer no sea null o undefined
    if (customer && customer.names) {
      this.customerName = customer.names;
      this.initials = this.getInitials(this.customerName);
    } else {
      this.customerName = 'Usuario'; // Valor por defecto
      this.initials = 'U'; // Inicial por defecto
    }
  }
  
  getInitials(name: string): string {
    if (!name) return 'U'; // Si no hay nombre, se devuelve una inicial por defecto
  
    let initials = name
      .split(' ') // Dividir el nombre en palabras
      .filter(word => word.length > 0) // Filtrar posibles espacios en blanco extra
      .map(word => word[0]) // Tomar la primera letra de cada palabra
      .join('') // Unirlas en una sola cadena
      .toUpperCase(); // Convertirlas en mayúsculas
  
    return initials.length > 2 ? initials.substring(0, 2) : initials; // Limitar a dos caracteres
  }
  
  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }
  


}
