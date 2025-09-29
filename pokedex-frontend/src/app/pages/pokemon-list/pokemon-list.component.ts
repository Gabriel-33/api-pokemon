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
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
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
          this.filteredPokemons = [data];
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
    const index = this.pokemons.findIndex(p => p.codigo === pokemon.codigo);
    console.log(pokemon.id)
    if (index !== -1) {
      this.pokemons[index] = { ...pokemon };
      try {
        if(pokemon.IsFav == true){
          this.pokemonApi.removeFavorite(pokemon.id.toString().padStart(3, '0')).subscribe();
          alert("Pokemon removido dos favoritos!");
        }else{
          const payload = {
            idTipoPokemon: pokemon.id,
            idPokemonUsuario: pokemon.id,
            codigo: pokemon.id.toString().padStart(3, '0'),
            imagemUrl: pokemon.imageUrl,
            nome: pokemon.name,
            favorito: true,
            grupoBatalha: pokemon.IsTeamBattle == true ? false : true
          };

          this.pokemonApi.addFavorite(payload).subscribe();
          alert("Pokemon adicionado aos favoritos!");
        }
        this.loadGeneration(this.selectedGeneration);
      } catch (error) {
        
      }
        
    }
  }

  onBattleTeamToggled(pokemon: Pokemon): void {
    const index = this.pokemons.findIndex(p => p.id === pokemon.id);
    
    const payload = {
      idPokemonUsuario: pokemon.id,
      idTipoPokemon: pokemon.id,
      codigo: pokemon.id.toString().padStart(3, '0'),
      imagemUrl: pokemon.imageUrl,
      nome: pokemon.name,
      favorito: pokemon.IsFav,
      grupoBatalha: pokemon.IsTeamBattle == true ? false : true
    };

    if (index !== -1) {
      this.pokemons[index] = { ...pokemon };
      try {
        if(pokemon.IsTeamBattle == true){
          this.pokemonApi.removeFromBattleTeam(pokemon.id.toString().padStart(3, '0')).subscribe();
          alert("Pokemon removido do campo de batalha!")
        }else{
          this.pokemonApi.addToBattleTeam(payload).subscribe(); 
          alert("Pokemon adicionado ao campo de batalha!");
        }
        this.loadGeneration(this.selectedGeneration);
      } catch (error) {
        
      }
        
    }
  }
}