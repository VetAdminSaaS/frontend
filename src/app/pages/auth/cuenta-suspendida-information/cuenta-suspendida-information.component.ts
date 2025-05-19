import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cuenta-suspendida-information',
  standalone: true,
  imports: [],
  templateUrl: './cuenta-suspendida-information.component.html',
  styleUrl: './cuenta-suspendida-information.component.scss'
})
export class CuentaSuspendidaInformationComponent {
  private router = inject(Router);
  private authService =inject(AuthService);
  goToHome(): void {
    this.router.navigate(['/']);
    this.authService.logout();
  }

}
