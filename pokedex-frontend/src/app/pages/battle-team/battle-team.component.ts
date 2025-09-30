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
  templateUrl: './battle-team.component.html',
  styleUrls: ['./battle-team.component.scss']
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

  async onBattleTeamToggled(pokemon: Pokemon): Promise<void> {
    const index = this.battleTeam.findIndex(p => p.codigo === pokemon.codigo);
    
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
      this.battleTeam[index] = { ...pokemon };
      try {
        if(pokemon.IsTeamBattle == true){
          await this.pokemonApi.removeFromBattleTeam(pokemon.codigo).subscribe();
          alert("Pokemon removido do campo de batalha!")
        }else{
          await this.pokemonApi.addToBattleTeam(payload).subscribe(); 
          alert("Pokemon adicionado ao campo de batalha!");
        }
        this.loadBattleTeam();
      } catch (error) {
        
      }
        
    }
  }

  async onFavoriteToggled(pokemon: Pokemon): Promise<void> {
    const index = this.battleTeam.findIndex(p => p.codigo === pokemon.codigo);
    console.log(pokemon.codigo)
    if (index !== -1) {
      this.battleTeam[index] = { ...pokemon };
      try {
        if(pokemon.IsFav == true){
          await this.pokemonApi.removeFavorite(pokemon.codigo).subscribe();
          alert("Pokemon removido dos favoritos!");
        }else{
          
          const payload = {
            idTipoPokemon: pokemon.id,
            idPokemonUsuario: pokemon.id,
            codigo: pokemon.codigo,
            imagemUrl: pokemon.imageUrl,
            nome: pokemon.name,
            favorito: true,
            grupoBatalha: pokemon.IsTeamBattle
          };
          console.log(payload)
          await this.pokemonApi.addFavorite(payload).subscribe();
          alert("Pokemon adicionado aos favoritos!");
        }
        this.loadBattleTeam();
      } catch (error) {
        
      }
        
    }
  }

  getTeamStats(): { total: number, max: number } {
    return {
      total: this.battleTeam.length,
      max: 6
    };
  }
}