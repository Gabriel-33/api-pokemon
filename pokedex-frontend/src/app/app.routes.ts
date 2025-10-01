import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'pokemons', 
    loadComponent: () => import('./pages/pokemon-list/pokemon-list.component').then(m => m.PokemonListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'favorites', 
    loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'battle-team', 
    loadComponent: () => import('./pages/battle-team/battle-team.component').then(m => m.BattleTeamComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'pokemons' }
];