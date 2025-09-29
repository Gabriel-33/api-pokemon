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
    const index = this.favorites.findIndex(p => p.codigo === pokemon.codigo);
    
    if (index !== -1) {
      this.favorites[index] = { ...pokemon };
      try {
        this.pokemonApi.removeFavorite(pokemon.id.toString().padStart(3, '0')).subscribe();
        alert("Pokemon removido dos favoritos!");
        this.loadFavorites();
      } catch (error) {
        
      }
        
    }
  }

  onBattleTeamToggled(pokemon: Pokemon): void {
    const index = this.favorites.findIndex(p => p.id === pokemon.id);

    const payload = {
      idPokemonUsuario: pokemon.id,
      codigo: pokemon.id.toString().padStart(3, '0'),
      imagemUrl: pokemon.imageUrl,
      nome: pokemon.name,
      favorito: true,
      grupoBatalha: pokemon.IsTeamBattle == true ? false : true
    };

    if (index !== -1) {
      this.favorites[index] = { ...pokemon };
      try {
        this.pokemonApi.addToBattleTeam(payload).subscribe();
        pokemon.IsTeamBattle == true ? alert("Pokemon removido do campo de batalha!")
        :alert("Pokemon adicionado ao campo de batalha!");
        this.loadFavorites();
      } catch (error) {
        
      }
        
    }
  }
}