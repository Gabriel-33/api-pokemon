import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PokemonApiService } from './pokemon-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private pokemonApi: PokemonApiService,
    private router: Router
  ) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(credentials: { email: string; senha: string }): void {
    this.pokemonApi.login(credentials).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.access_token);
        this.isAuthenticatedSubject.next(true);
        this.router.navigate(['/pokemons']);
      },
      error: (error) => {
        console.error('Erro no login:', error);
        alert(error.error?.msg || 'Erro ao fazer login');
      }
    });
  }

  register(userData: { nome: string; login: string; email: string; senha: string }): void {
    this.pokemonApi.register(userData).subscribe({
      next: () => {
        alert('Registro realizado! Faça login.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erro no registro:', error);
        alert(error.error?.msg || 'Erro ao registrar');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}