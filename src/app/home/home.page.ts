import { Component, OnInit, ViewChild } from '@angular/core'; // Added ViewChild
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { addIcons } from 'ionicons';
import {
  home, heart, star, videocam, filmOutline, searchOutline,
  trendingUpOutline, timeOutline, arrowUp // Added arrowUp
} from 'ionicons/icons';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonButton, IonIcon, IonItem, IonLabel, IonInput, IonListHeader,
  IonThumbnail, IonChip, IonGrid, IonRow, IonCol, IonInfiniteScroll,
  IonInfiniteScrollContent, IonFab, IonFabButton // Added Grid and Scroll components
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonButton, IonIcon, IonItem, IonLabel, IonInput, IonListHeader,
    IonThumbnail, IonChip, IonGrid, IonRow, IonCol, IonInfiniteScroll,
    IonInfiniteScrollContent, IonFab, IonFabButton
  ],
})
export class HomePage implements OnInit {
  @ViewChild(IonContent) content!: IonContent; // Reference for Back to Top

  movies: any[] = [];
  searchQuery: string = '';
  listTitle: string = 'Trending Movies';
  searchHistory: string[] = [];
  
  // New Pagination & UI properties
  currentPage: number = 1;
  showBackToTop: boolean = false;

  constructor(private movieService: MovieService, private router: Router) {
    addIcons({
      home, heart, star, videocam, filmOutline, searchOutline,
      trendingUpOutline, timeOutline, arrowUp
    });
  }

  ngOnInit() {
    this.loadTrending();
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      this.searchHistory = JSON.parse(saved);
    }
  }

  // Handle Scroll Events to toggle Back to Top button
  handleScroll(ev: any) {
    const scrollTop = ev.detail.scrollTop;
    this.showBackToTop = scrollTop > 500; // Show after scrolling 500px
  }

  scrollToTop() {
    this.content.scrollToTop(500); // 500ms smooth scroll
  }

  openHistory() {
    this.router.navigate(['/cast-crew-details']);
  }

  // Modified to support pagination
  loadTrending(event?: any) {
    this.movieService.getTrendingMovies(this.currentPage).subscribe({
      next: (res: any) => {
        // Append movies to the existing array
        this.movies = [...this.movies, ...res.results];
        this.listTitle = 'Trending Movies';
        
        if (event) event.target.complete();
        
        // Disable scroll if no more pages
        if (event && this.currentPage >= res.total_pages) {
          event.target.disabled = true;
        }
      },
      error: (err) => {
        console.error('Load failed:', err);
        if (event) event.target.complete();
      },
    });
  }

  onSearch(event?: Event) {
    if (event) event.preventDefault();
    const searchText = this.searchQuery.trim();

    // Reset list and page for new search
    this.movies = [];
    this.currentPage = 1;

    if (searchText === '') {
      this.loadTrending();
      return;
    }

    // Update History
    this.searchHistory = [searchText, ...this.searchHistory.filter(h => h !== searchText)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(this.searchHistory));

    this.performSearch();
  }

  performSearch(event?: any) {
    const searchText = this.searchQuery.trim();
    this.listTitle = `Search Results for: ${searchText}`;
    
    this.movieService.searchMovies(searchText, this.currentPage).subscribe({
      next: (res: any) => {
        this.movies = [...this.movies, ...res.results];
        if (event) event.target.complete();
      },
      error: (err) => {
        console.error('Search failed:', err);
        if (event) event.target.complete();
      }
    });
  }

  loadMore(event: any) {
    this.currentPage++;
    if (this.searchQuery.trim() !== '') {
      this.performSearch(event);
    } else {
      this.loadTrending(event);
    }
  }
}