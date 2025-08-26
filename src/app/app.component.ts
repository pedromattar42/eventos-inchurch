import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './shared/components/organisms/app-header/app-header.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, AppHeaderComponent],
  standalone: true,
  template: `
    @if (isAuthenticated()) {
      <app-header></app-header>
    }
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'eventos-inchurch';

  constructor(private authService: AuthService) {}

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
