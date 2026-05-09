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

  constructor(private http: HttpClient) {}

  getTrendingMovies(page: number = 1): Observable<any> {
    // Make sure the endpoint is /trending/movie/day
    return this.http.get(`${this.baseUrl}/trending/movie/day?api_key=${this.apiKey}&page=${page}`);
  }

  //code to allow searching of movies by name
  searchMovies(query: string, page: number=1): Observable<any> {
    // Ensure the URL has: api_key=${this.apiKey}&query=${query}
    return this.http.get(
      `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}&page=${page}`,
    );
  }

  searchMulti(query: string) {
  return this.http.get(`${this.baseUrl}/search/multi?api_key=${this.apiKey}&query=${query}`);
}

  getMovieDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}?api_key=${this.apiKey}`);
  }

  getMovieCredits(id: string | number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/${id}/credits?api_key=${this.apiKey}`,
    );
  }

  getFavourites() {
    return JSON.parse(localStorage.getItem('fav_movies') || '[]');
  }

  getFavouriteCast() {}

  getPersonDetails(personId: number | string) {
    return this.http.get(
      `${this.baseUrl}/person/${personId}?api_key=${this.apiKey}`,
    );
  }

  getPersonMovieCredits(personId: string | number) {
    return this.http.get(
      `${this.baseUrl}/person/${personId}/movie_credits?api_key=${this.apiKey}`,
    );
  }

  searchPeople(query: string) {
  return this.http.get(`${this.baseUrl}/search/person?api_key=${this.apiKey}&query=${query}`);
}
}
