import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  home,
  heart,
  star,
  videocam,
  videocamOffOutline,
  trendingUpOutline,
  timeOutline,
} from 'ionicons/icons';
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
  IonListHeader,
  IonBadge,
  IonAvatar,
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
    IonBadge,
    IonAvatar,
  ],
})
export class MovieDetailsPage implements OnInit {
  movie: any = null;
  recentlyViewedMovies: any[] = [];
  isHistoryMode: boolean = false;
  cast: any[] = [];
  crew: any[] = [];
  searchQuery: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private movieService: MovieService,
  ) {
    addIcons({
      home,
      heart,
      star,
      videocam,
      videocamOffOutline,
      trendingUpOutline,
      timeOutline,
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log("Current ID from URL:", id);

    if (!id || id === 'null') {
      this.isHistoryMode = true;
      const saved = localStorage.getItem('recentlyViewedMovies');
      this.recentlyViewedMovies = saved ? JSON.parse(saved) : [];
      console.log("Loaded History:", this.recentlyViewedMovies);
    } else {
      this.isHistoryMode = false;
      this.loadDetails(Number(id));
      this.getCast(id);
    }
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'null') {
      this.loadDetails(Number(id)); // This triggers the save to history
    } else {
      this.loadHistory(); // Just refresh the list from storage
    }
  }

  loadHistory() {
    const saved = localStorage.getItem('recentlyViewedMovies');
    this.recentlyViewedMovies = saved ? JSON.parse(saved) : [];
  }

  loadDetails(id: number) {
  this.movieService.getMovieDetails(id).subscribe((res: any) => {
    this.movie = res;

    let history = JSON.parse(localStorage.getItem('recentlyViewedMovies') || '[]');
    
    // Add the new movie to the start
    history.unshift(res);

    // FIX: Ensure we compare IDs strictly as numbers to remove duplicates
    history = history.filter((v: any, i: number, a: any[]) => 
      a.findIndex((t: any) => Number(t.id) === Number(v.id)) === i
    ).slice(0, 5);

    localStorage.setItem('recentlyViewedMovies', JSON.stringify(history));
    this.recentlyViewedMovies = history; // Update the local variable immediately
  });
}

  getCast(id: string | number) {
    // Get credits of cast/crew
    this.movieService.getMovieCredits(id).subscribe((res: any) => {
      this.cast = res.cast.slice(0, 15);
      this.crew = res.crew
        .filter((m: any) =>
          ['Director', 'Producer', 'Writer', 'Screenplay'].includes(m.job),
        )
        .slice(0, 10);
    });
  }

  saveToHistory(movie: any) {
    let history = JSON.parse(
      localStorage.getItem('recentlyViewedMovies') || '[]',
    );
    // Filter out the movie if it's already there, then add to start
    history = [movie, ...history.filter((m: any) => m.id !== movie.id)].slice(
      0,
      10,
    );
    localStorage.setItem('recentlyViewedMovies', JSON.stringify(history));
  }

  onSearch(event?: Event) {
    if (event) {
      event.preventDefault(); // Allows 'Enter' key without refreshing
    }

    const searchText = this.searchQuery.trim();
    if (!searchText) return;

    this.movieService.searchMovies(searchText).subscribe((res: any) => {
      if (res.results && res.results.length > 0) {
        const firstMovieId = res.results[0].id;
        this.loadDetails(firstMovieId); // Load the first match
        this.isHistoryMode = false; // Hide the history list
      }
    });
  }

  // Helper to keep logic clean
  addToHistory(term: string) {
    this.recentlyViewedMovies.unshift(term); // Assuming recentlyViewedMovies is your list[cite: 8]
    this.recentlyViewedMovies = [...new Set(this.recentlyViewedMovies)].slice(
      0,
      5,
    );
    localStorage.setItem(
      'recentlyViewedMovies',
      JSON.stringify(this.recentlyViewedMovies),
    );
  }
}
