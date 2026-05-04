import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiKey = environment.apiKey;
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  getTrendingMovies(): Observable<any> {
  // Make sure the endpoint is /trending/movie/day
  return this.http.get(`${this.baseUrl}/trending/movie/day?api_key=${this.apiKey}`);
}

  //code to allow searching of movies by name
 searchMovies(query: string): Observable<any> {
  // Ensure the URL has: api_key=${this.apiKey}&query=${query}
  return this.http.get(`${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}`);
}

  getMovieDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}?api_key=${this.apiKey}`);
  }

  getMovieCredits(id: string | number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}/credits?api_key=${this.apiKey}`);
  }

  getFavourites() {
    return JSON.parse(localStorage.getItem('fav_movies') || '[]');
  }

  getFavouriteCast() {

  }
}


