import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { addIcons } from 'ionicons';
import { home, heart, star, videocam } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonListHeader,
  IonThumbnail,
  IonChip,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonListHeader,
    IonThumbnail,
    IonChip,
  ],
})
export class HomePage implements OnInit {
  movies: any[] = [];
  searchQuery: string = '';
  listTitle: string = 'Trending Movies';
  searchHistory: string[] = [];

  constructor(private movieService: MovieService) {
    addIcons({ home, heart, star, videocam });
  }

  ngOnInit() {
    this.loadTrending();
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      this.searchHistory = JSON.parse(saved);
    }
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
      },
    });
  }

  onSearch(event?: Event) {
    if (event) {
      event.preventDefault(); // This stops the page from refreshing
    }

    const searchText = this.searchQuery.trim();

    if (this.searchQuery.trim() === '') {
      this.loadTrending();
    } else {
      this.searchHistory.unshift(searchText);
      this.searchHistory = [...new Set(this.searchHistory)].slice(0, 5);
      localStorage.setItem(
        'recentSearches',
        JSON.stringify(this.searchHistory),
      );
      this.listTitle = 'Search Results for: ' + searchText;
      this.movieService.searchMovies(searchText).subscribe((res: any) => {
        this.movies = res.results;
        console.log('Search results:', this.movies);
      });
    }

    if (this.searchQuery.trim() !== '') {
      this.searchHistory.unshift(this.searchQuery);
      this.searchHistory = [...new Set(this.searchHistory)].slice(0, 5);
      localStorage.setItem(
        'recentSearches',
        JSON.stringify(this.searchHistory),
      );
      this.movieService.searchMovies(this.searchQuery).subscribe((res: any) => {
        this.movies = res.results;
        this.listTitle = 'Search Results for: ' + this.searchQuery;
      });
    }
  }
}
