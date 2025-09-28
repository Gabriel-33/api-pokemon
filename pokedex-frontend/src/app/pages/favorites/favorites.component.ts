import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Pokemon } from '../../interfaces/pokemon';
import { PokemonApiService } from '../../services/pokemon-api.service';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, PokemonCardComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: Pokemon[] = [];
  isLoading = false;

  constructor(private pokemonApi: PokemonApiService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.pokemonApi.getFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar favoritos:', error);
        this.isLoading = false;
      }
    });
  }

  onFavoriteToggled(pokemon: Pokemon): void {
    this.favorites = this.favorites.filter(p => p.id !== pokemon.id);
  }

  onBattleTeamToggled(pokemon: Pokemon): void {
    const index = this.favorites.findIndex(p => p.id === pokemon.id);
    if (index !== -1) {
      this.favorites[index] = { ...pokemon };
    }
  }
}