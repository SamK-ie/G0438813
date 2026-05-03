import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { addIcons } from 'ionicons';
import { heart } from 'ionicons/icons';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonButton, IonIcon, IonItem, IonLabel, IonInput, 
  IonList, IonListHeader, IonThumbnail
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
    IonButton, IonIcon, IonItem, IonLabel, IonInput, 
    IonList, IonListHeader, IonThumbnail
  ],
})
export class HomePage implements OnInit {
  movies: any[] = [];
  searchQuery: string = '';
  listTitle: string = 'Trending Movies';

  constructor(private movieService: MovieService) {
    addIcons({ heart });
  }

  ngOnInit() {
    this.loadTrending();
  }

  loadTrending() {
  this.movieService.getTrendingMovies().subscribe({
    next: (res: any) => {
      console.log('Trending data arrived:', res);
      this.movies = res.results;
      this.listTitle = 'Trending Movies';
    },
    error: (err) => {
      console.error('Initial load failed:', err);
    }
  });
  }

onSearch() {
  if (this.searchQuery.trim() === '') {
    this.loadTrending();
  } else {
    this.listTitle = 'Search Results';
    this.movieService.searchMovies(this.searchQuery).subscribe((res: any) => {
      // And you MUST have '.results' here too
      this.movies = res.results;
      console.log('Search results:', this.movies);
    });
  }
}
}
