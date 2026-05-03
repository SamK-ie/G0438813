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

  constructor(private http: HttpClient){}

  getTrendingMovies(): Observable<any> {
    return this.http.get('${this.baseUrl}/trending/movie/day?query=${query}&api_key=&{this.apiKey}');
  }

  searchMovies(query: string): Observable<any> {
    return this.http.get('${this.baseUrl}/search/movie?query=${query}&api_key=&{this.apiKey}');
  }
  }

  
}
