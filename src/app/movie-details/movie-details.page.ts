import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, heart, star, videocam } from 'ionicons/icons';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonIcon,
  IonChip,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonThumbnail,
  IonListHeader
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonBackButton,
    IonItem,
    IonLabel,
    IonList,
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule,
    IonChip,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonThumbnail,
    IonListHeader,
  ],
})
export class MovieDetailsPage implements OnInit {
  movie: any = null;
  recentMovies: any[] = [];
  isHistoryMode: boolean = false;
  cast: any[] = [];
  crew: any[] = [];
  searchQuery: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private movieService: MovieService,
  ) {
    addIcons({ home, heart, star, videocam });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id || id === 'null') {
      this.isHistoryMode = true;
      const saved = localStorage.getItem('recentSearches'); // or 'viewedMovies'
      this.recentMovies = saved ? JSON.parse(saved) : [];
    } else {
      this.isHistoryMode = false;
      this.loadDetails(Number(id));
    }
  }

  loadHistory() {
    const saved = localStorage.getItem('viewedMovies');
    this.recentMovies = saved ? JSON.parse(saved) : [];
  }

  loadDetails(id: number) {
    // Get movie details
    this.movieService.getMovieDetails(id).subscribe((res: any) => {
      this.movie = res;
      this.saveToHistory(res); // Save this movie to history when viewed
    });
    // Get credits of cast/crew
    this.movieService.getMovieCredits(id).subscribe((res: any) => {
      this.cast = res.cast;
      this.crew = res.crew;
    });
  }

  saveToHistory(movie: any) {
    let history = JSON.parse(localStorage.getItem('viewedMovies') || '[]');
    // Filter out the movie if it's already there, then add to start
    history = [movie, ...history.filter((m: any) => m.id !== movie.id)].slice(
      0,
      10,
    );
    localStorage.setItem('viewedMovies', JSON.stringify(history));
  }

  onSearch(event?: Event) {
    if (event) {
      event.preventDefault(); // This stops the page from refreshing
    }
    if (this.searchQuery.trim() !== '') {
      this.router.navigate(['/home'], {
        queryParams: { q: this.searchQuery },
      });
    }
  }
}
