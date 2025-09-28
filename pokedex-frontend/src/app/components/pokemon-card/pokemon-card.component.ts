import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../interfaces/pokemon';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Output() favoriteToggled = new EventEmitter<Pokemon>();
  @Output() battleTeamToggled = new EventEmitter<Pokemon>();

  toggleFavorite(): void {
    this.favoriteToggled.emit(this.pokemon);
  }

  toggleBattleTeam(): void {
    this.battleTeamToggled.emit(this.pokemon);
  }
}