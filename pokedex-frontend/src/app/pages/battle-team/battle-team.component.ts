import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Pokemon } from '../../interfaces/pokemon';
import { PokemonApiService } from '../../services/pokemon-api.service';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-battle-team',
  standalone: true,
  imports: [CommonModule, RouterLink, PokemonCardComponent],
  template: `
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <h1 class="text-white text-center mb-4">
            <i class="fas fa-users text-warning me-3"></i>Equipe de Batalha
          </h1>
        </div>
      </div>

      <!-- Status da Equipe -->
      <div class="row justify-content-center mb-4" *ngIf="!isLoading">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body text-center">
              <h5 class="card-title">Status da Equipe</h5>
              <div class="progress mb-3" style="height: 25px;">
                <div class="progress-bar" 
                     [class]="getTeamStats().total === 6 ? 'bg-success' : 'bg-warning'"
                     [style.width]="(getTeamStats().total / getTeamStats().max) * 100 + '%'">
                  {{ getTeamStats().total }}/{{ getTeamStats().max }}
                </div>
              </div>
              <p class="card-text" *ngIf="getTeamStats().total === 6" 
                 class="text-success">
                <i class="fas fa-check-circle me-2"></i>Equipe completa!
              </p>
              <p class="card-text" *ngIf="getTeamStats().total < 6" 
                 class="text-muted">
                Adicione mais {{ 6 - getTeamStats().total }} Pokémon à equipe
              </p>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="isLoading" class="text-center py-5">
        <div class="spinner-border text-light" style="width: 3rem; height: 3rem;"></div>
        <p class="text-white mt-3">Carregando equipe...</p>
      </div>

      <div *ngIf="!isLoading && battleTeam.length === 0" class="text-center py-5">
        <div class="card">
          <div class="card-body py-5">
            <i class="fas fa-users fa-3x text-muted mb-3"></i>
            <h3 class="text-muted">Equipe vazia</h3>
            <p class="text-muted">Adicione Pokémon à equipe clicando no ícone de equipe!</p>
            <a routerLink="/pokemons" class="btn btn-primary">
              <i class="fas fa-search me-2"></i>Explorar Pokémon
            </a>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && battleTeam.length > 0" class="row g-4">
        <div class="col-sm-6 col-md-4 col-lg-3 col-xl-2" 
             *ngFor="let pokemon of battleTeam">
          <app-pokemon-card 
            [pokemon]="pokemon"
            (favoriteToggled)="onFavoriteToggled($event)"
            (battleTeamToggled)="onBattleTeamToggled($event)">
          </app-pokemon-card>
        </div>
      </div>
    </div>
  `
})
export class BattleTeamComponent implements OnInit {
  battleTeam: Pokemon[] = [];
  isLoading = false;

  constructor(private pokemonApi: PokemonApiService) {}

  ngOnInit(): void {
    this.loadBattleTeam();
  }

  loadBattleTeam(): void {
    this.isLoading = true;
    this.pokemonApi.getBattleTeam().subscribe({
      next: (team) => {
        this.battleTeam = team;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar equipe:', error);
        this.isLoading = false;
      }
    });
  }

  onBattleTeamToggled(pokemon: Pokemon): void {
    this.battleTeam = this.battleTeam.filter(p => p.id !== pokemon.id);
  }

  onFavoriteToggled(pokemon: Pokemon): void {
    const index = this.battleTeam.findIndex(p => p.id === pokemon.id);
    if (index !== -1) {
      this.battleTeam[index] = { ...pokemon };
    }
  }

  getTeamStats(): { total: number, max: number } {
    return {
      total: this.battleTeam.length,
      max: 6
    };
  }
}