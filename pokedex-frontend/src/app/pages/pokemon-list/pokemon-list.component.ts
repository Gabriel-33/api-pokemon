import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pokemon, PokemonGeneration } from '../../interfaces/pokemon';
import { PokemonApiService } from '../../services/pokemon-api.service';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PokemonCardComponent],
  template: `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="text-white text-center mb-4">
            <i class="fas fa-dragon me-3"></i>Pokédex
          </h1>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row justify-content-center mb-4">
        <div class="col-md-8">
          <div class="card filter-card">
            <div class="card-body">
              <div class="row g-3 align-items-center">
                <div class="col-md-4">
                  <label class="form-label">Geração</label>
                  <select class="form-select" [(ngModel)]="selectedGeneration" 
                          (change)="loadGeneration(selectedGeneration)">
                    <option *ngFor="let gen of generations" [value]="gen">
                      Geração {{gen}}
                    </option>
                  </select>
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Buscar Pokémon</label>
                  <div class="input-group">
                    <input type="text" class="form-control" 
                           [(ngModel)]="searchQuery" 
                           placeholder="Digite nome ou ID..."
                           (keyup.enter)="searchPokemon()">
                    <button class="btn btn-primary" (click)="searchPokemon()">
                      <i class="fas fa-search"></i>
                    </button>
                    <button class="btn btn-outline-secondary" (click)="clearSearch()">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                
                <div class="col-md-2">
                  <label class="form-label">&nbsp;</label>
                  <div class="d-grid">
                    <button class="btn btn-success" (click)="loadGeneration(selectedGeneration)">
                      <i class="fas fa-sync-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading" class="text-center py-5">
        <div class="spinner-border text-light" style="width: 3rem; height: 3rem;"></div>
        <p class="text-white mt-3">Carregando Pokémon...</p>
      </div>

      <!-- Erro -->
      <div *ngIf="errorMessage && !isLoading" class="alert alert-danger text-center">
        {{ errorMessage }}
      </div>

      <!-- Grid de Pokémon -->
      <div *ngIf="!isLoading && !errorMessage" class="row g-4">
        <div class="col-12" *ngIf="filteredPokemons.length === 0">
          <div class="alert alert-info text-center">
            Nenhum Pokémon encontrado.
          </div>
        </div>
        
        <div class="col-sm-6 col-md-4 col-lg-3 col-xl-2" 
             *ngFor="let pokemon of filteredPokemons">
          <app-pokemon-card 
            [pokemon]="pokemon"
            (favoriteToggled)="onFavoriteToggled($event)"
            (battleTeamToggled)="onBattleTeamToggled($event)">
          </app-pokemon-card>
        </div>
      </div>

      <!-- Contador -->
      <div *ngIf="!isLoading && filteredPokemons.length > 0" class="row mt-4">
        <div class="col-12 text-center">
          <span class="badge bg-primary fs-6">
            {{ filteredPokemons.length }} Pokémon(s) encontrado(s)
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-card {
      border: none;
      border-radius: 15px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
  `]
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  selectedGeneration = 1;
  searchQuery = '';
  isLoading = false;
  errorMessage = '';

  constructor(private pokemonApi: PokemonApiService) {}

  ngOnInit(): void {
    this.loadGeneration(this.selectedGeneration);
  }

  loadGeneration(generation: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.pokemonApi.getPokemonByGeneration(generation.toString()).subscribe({
      next: (data: PokemonGeneration) => {
        this.pokemons = data.pokemons;
        this.filteredPokemons = [...this.pokemons];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar Pokémon';
        this.isLoading = false;
        console.error('Erro:', error);
      }
    });
  }

  searchPokemon(): void {
    if (this.searchQuery.trim()) {
      this.isLoading = true;
      this.pokemonApi.searchPokemon(this.searchQuery.trim()).subscribe({
        next: (data) => {
          this.filteredPokemons = [data.pokemon];
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Pokémon não encontrado';
          this.isLoading = false;
        }
      });
    } else {
      this.filteredPokemons = [...this.pokemons];
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredPokemons = [...this.pokemons];
    this.errorMessage = '';
  }

  onFavoriteToggled(pokemon: Pokemon): void {
    const index = this.pokemons.findIndex(p => p.id === pokemon.id);
    if (index !== -1) {
      this.pokemons[index] = { ...pokemon };
    }
  }

  onBattleTeamToggled(pokemon: Pokemon): void {
    const index = this.pokemons.findIndex(p => p.id === pokemon.id);
    if (index !== -1) {
      this.pokemons[index] = { ...pokemon };
    }
  }
}