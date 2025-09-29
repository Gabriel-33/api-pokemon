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

  async onFavoriteToggled(pokemon: Pokemon): Promise<void> {
    const index = this.favorites.findIndex(p => p.codigo === pokemon.codigo);
    console.log(pokemon.codigo)
    if (index !== -1) {
      this.favorites[index] = { ...pokemon };
      try {
        await this.pokemonApi.removeFavorite(pokemon.codigo).subscribe();
        alert("Pokemon removido dos favoritos!");
        this.loadFavorites();
      } catch (error) {
        
      }
        
    }
  }

  async onBattleTeamToggled(pokemon: Pokemon): Promise<void> {
    const index = this.favorites.findIndex(p => p.codigo === pokemon.codigo);
    
    const payload = {
      idPokemonUsuario: pokemon.id,
      idTipoPokemon: pokemon.id,
      codigo: pokemon.codigo,
      imagemUrl: pokemon.imageUrl,
      nome: pokemon.name,
      favorito: true,
      grupoBatalha: pokemon.IsTeamBattle == true ? false : true
    };
    
    if (index !== -1) {
      this.favorites[index] = { ...pokemon };
      try {
        if(pokemon.IsTeamBattle == true){
          await this.pokemonApi.removeFromBattleTeam(pokemon.codigo).subscribe();
          alert("Pokemon removido do campo de batalha!")
        }else{
          await this.pokemonApi.addToBattleTeam(payload).subscribe(); 
          alert("Pokemon adicionado ao campo de batalha!");
        }
        this.loadFavorites();
      } catch (error) {
        
      }
        
    }
  }
}