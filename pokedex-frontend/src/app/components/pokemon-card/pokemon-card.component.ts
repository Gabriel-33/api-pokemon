import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../interfaces/pokemon';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pokemon-card card h-100">
      <div class="card-body text-center">
        <img [src]="pokemon.imageUrl" [alt]="pokemon.name" class="pokemon-img">
        
        <h5 class="card-title mt-3">{{ pokemon.name | titlecase }}</h5>
        <p class="text-muted">#{{ pokemon.codigo }}</p>
        
        <div class="types mb-3">
          <span *ngFor="let type of pokemon.types" 
                class="type-badge" 
                [class]="'type-' + type">
            {{ type }}
          </span>
        </div>

        <div class="actions">
          <button class="btn btn-outline-danger btn-sm me-2"
                  (click)="toggleFavorite()"
                  [class.active]="pokemon.isFav"
                  title="Favorito">
            <i class="fas fa-heart"></i>
          </button>
          
          <button class="btn btn-outline-primary btn-sm"
                  (click)="toggleBattleTeam()"
                  [class.active]="pokemon.isTeamBattle"
                  title="Equipe de Batalha">
            <i class="fas fa-users"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pokemon-card {
      border: none;
      border-radius: 15px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      }
      
      .pokemon-img {
        width: 120px;
        height: 120px;
        object-fit: contain;
      }
      
      .card-title {
        color: #333;
        font-weight: bold;
      }
      
      .actions {
        .btn {
          transition: all 0.3s ease;
          
          &.active {
            background-color: #dc3545;
            border-color: #dc3545;
            color: white;
          }
          
          &:hover:not(.active) {
            transform: scale(1.1);
          }
        }
      }
    }
  `]
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