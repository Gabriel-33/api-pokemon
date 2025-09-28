import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/pokemons">
          <i class="fas fa-dragon me-2"></i>Pokedex
        </a>
        
        <div class="navbar-nav ms-auto" *ngIf="authService.getToken(); else notLoggedIn">
          <a class="nav-link" routerLink="/pokemons" routerLinkActive="active">
            <i class="fas fa-list me-1"></i>Pokémons
          </a>
          <a class="nav-link" routerLink="/favorites" routerLinkActive="active">
            <i class="fas fa-heart me-1"></i>Favoritos
          </a>
          <a class="nav-link" routerLink="/battle-team" routerLinkActive="active">
            <i class="fas fa-users me-1"></i>Equipe
          </a>
          <button class="btn btn-outline-light btn-sm ms-2" (click)="logout()">
            <i class="fas fa-sign-out-alt me-1"></i>Sair
          </button>
        </div>

        <ng-template #notLoggedIn>
          <div class="navbar-nav">
            <a class="nav-link" routerLink="/login">Login</a>
          </div>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-weight: bold;
      font-size: 1.5rem;
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}