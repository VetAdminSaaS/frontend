import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
export class AuthCallbackComponent {
  private  authService = inject(AuthService);
  private  router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.authService.handleGoogleCallback(code).subscribe({
          next: () => console.log('Sesión iniciada con Google'),
          error: err => console.error('Error iniciando sesión', err),
        });
      }
    });
  }
  
  
  

}
