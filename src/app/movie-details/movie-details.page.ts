import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MovieService } from '../services/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { SharedHeaderComponent } from '../components/shared-header/shared-header.component';
import { addIcons } from 'ionicons';
import {
  videocam,
  heart,
  heartOutline,
  trendingUpOutline,
  person,
  informationCircleOutline
} from 'ionicons/icons';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonButton,
  IonIcon,
  IonListHeader,
  IonBadge,
} from '@ionic/angular';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,
  imports: [
    SharedHeaderComponent, 
    IonContent,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule,
    IonListHeader,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
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
    private http: HttpClient,
    private navCtrl: NavController,
  ) {
 
    addIcons({
      videocam,
      heart,
      heartOutline,
      trendingUpOutline,
      person,
      informationCircleOutline
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
    const id = params['id'];
    
    if (!id || id === 'null') {
      this.isHistoryMode = true;
      this.loadHistory();
      this.movie = null;
    } else {
      this.isHistoryMode = false;
      this.loadDetails(Number(id));
      this.getCast(id);
    }
  });
}


  isFavorite(id: number, type: 'movie' | 'cast'): boolean {
    const key = type === 'movie' ? 'fav_movies' : 'fav_cast';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    return list.some((item: any) => item.id === id);
  }

  toggleFav(item: any, type: 'movie' | 'cast') {
    const key = type === 'movie' ? 'fav_movies' : 'fav_cast';
    let list = JSON.parse(localStorage.getItem(key) || '[]');
    const index = list.findIndex((i: any) => i.id === item.id);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(item);
    }
    localStorage.setItem(key, JSON.stringify(list));
  }

  loadDetails(id: number) {
    this.isHistoryMode = false;
    this.movieService.getMovieDetails(id).subscribe((res: any) => {
      this.movie = res;
      this.getCast(id);
      let history = JSON.parse(localStorage.getItem('recentlyViewedMovies') || '[]');
      history.unshift(res);
      history = history
        .filter((v: any, i: number, a: any[]) =>
          a.findIndex((t: any) => Number(t.id) === Number(v.id)) === i
        )
        .slice(0, 5);
      localStorage.setItem('recentlyViewedMovies', JSON.stringify(history));
      this.recentlyViewedMovies = history;
    });
  }

 getCast(id: any) {
  this.movieService.getMovieCredits(id).subscribe({
    next: (res: any) => {
      this.cast = res.cast.slice(0, 15);
      this.crew = res.crew.filter((m: any) => 
        ['Director', 'Producer', 'Writer', 'Screenplay'].includes(m.job)
      ).slice(0, 10);
    },
    error: (err) => console.error('Fetch error:', err)
  });
}

  loadHistory() {
    const saved = localStorage.getItem('recentlyViewedMovies');
    this.recentlyViewedMovies = saved ? JSON.parse(saved) : [];
  }

  clearHistory() {
    this.recentlyViewedMovies = [];
    localStorage.removeItem('recentlyViewedMovies');
  }

  goToCredits(id: number) {
    this.router.navigate(['/cast-crew-details', id]);
  }
}
