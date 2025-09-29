import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon, PokemonGeneration, LoginData, RegisterData } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonApiService {
  private apiUrl = 'http://127.0.0.1:5000'; // Sua API Flask

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // AUTENTICAÇÃO
  login(credentials: LoginData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(userData: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  //POKÉMON
  searchPokemon(query: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/pokemon/search/${query}`);
  }

  getPokemonByGeneration(generation: string): Observable<PokemonGeneration> {
    return this.http.get<PokemonGeneration>(`${this.apiUrl}/pokemon/generation/${generation}`,{
      headers: this.getAuthHeaders() 
    });
  }

  //FAVORITOS
  getFavorites(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(`${this.apiUrl}/pokemon/favoritos`, { 
      headers: this.getAuthHeaders() 
    });
  }

  addFavorite(payload: object): Observable<any> {
    return this.http.post(`${this.apiUrl}/pokemon/adicionarFavorito`, 
      payload, 
      { headers: this.getAuthHeaders() }
    );
  }

  removeFavorite(pokemonId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pokemon/favoritos/${pokemonId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // EQUIPE
  getBattleTeam(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(`${this.apiUrl}/pokemon/campoBatalha`, {
      headers: this.getAuthHeaders()
    });
  }

  addToBattleTeam(payload: object): Observable<any> {
    return this.http.post(`${this.apiUrl}/pokemon/adicionarCampoBatalha`, 
      payload, 
      { headers: this.getAuthHeaders() }
    );
  }

  removeFromBattleTeam(pokemonId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/equipe/${pokemonId}`, {
      headers: this.getAuthHeaders()
    });
  }
}