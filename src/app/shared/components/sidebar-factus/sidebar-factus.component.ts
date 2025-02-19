import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar-factus',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar-factus.component.html',
  styleUrl: './sidebar-factus.component.scss'
})
export class SidebarFactusComponent {
  isAuthenticated: boolean = false;
  isCollapsed = false;



  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
  this.isAuthenticated = this.authService.isAuthenticated();
    
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