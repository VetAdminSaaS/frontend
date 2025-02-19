import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './encabezado.component.html',
  styleUrl: './encabezado.component.scss'
})
export class EncabezadoComponent {
 isAuthenticated: boolean = false;
  isCustomer: boolean = false;
  isAdmin:boolean = false;
  cartItemCount = 0;
  isDropdownOpen = false;
  customerName: string | null = '';


  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isCustomer = this.authService.getUserRole() === 'CUSTOMER';
    this.isAdmin = this.authService.getUserRole() ==='ADMIN';
    const customer = this.authService.getUser();
    this.customerName = customer ? customer.names : null;
  }

  goToCart(): void {
    if (this.isCustomer) {
      this.router.navigate(['/store/cart']);
    }
  }
  toggleDropdown() {
    if (this.isCustomer) {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
    else{
      this.router.navigate(['administrador/dashboard'])
    }
  }
  logout(): void {
    this.authService.logout();

    if (this.router.url === '/store') {
      window.location.reload();
    } else {
      this.router.navigate(['/store']);
    }
  }
  
}
