import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MovieService } from '../services/movie.service';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {
  movies: any[] = [];
  searchQuery: string = '';
  listTitle: string = 'Trending Movies';

  constructor(private movieService: MovieService) {}

  ngOnInit(){
    this.listTitle = 'Trending Movies';
    this.movieService.getTrendingMovies().subscribe((res) => {
      this.movies = res.results;
    });
  }

  OnSearch() {
    if (this.searchQuery.trim() === '') {
      this.loadTrending();
    } else {
      this.listTitle= 'Search Results';
      this.movieService.searchMovies(this.searchQuery).subscribe((res: any) => {
        this.movies = res.results;
      })
    }
  }
}
