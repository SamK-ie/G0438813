import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { addIcons } from 'ionicons';
import { home, heart, star, videocam, filmOutline, searchOutline, trendingUpOutline, timeOutline } from 'ionicons/icons';
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
  isHistoryMode: boolean = false;
  movies: any[] = [];
  searchQuery: string = '';
  listTitle: string = 'Trending Movies';
  searchHistory: string[] = [];

  constructor(private movieService: MovieService) {
    addIcons({ home, heart, star, videocam, filmOutline,searchOutline, trendingUpOutline, timeOutline });
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
    event.preventDefault(); // Prevents page refresh on form submit
  }

  const searchText = this.searchQuery.trim();

  if (searchText === '') {
    this.loadTrending();
    return; // Exit early if search is empty
  }

  // 1. Update Search History
  this.searchHistory.unshift(searchText);
  // Filter to keep only unique items and limit to 5
  this.searchHistory = [...new Set(this.searchHistory)].slice(0, 5);
  localStorage.setItem('recentSearches', JSON.stringify(this.searchHistory));

  // 2. Perform the Search
  this.listTitle = `Search Results for: ${searchText}`;
  this.movieService.searchMovies(searchText).subscribe({
    next: (res: any) => {
      this.movies = res.results;
      console.log('Search results:', this.movies);
    },
    error: (err) => console.error('Search failed:', err)
  });
}
}
