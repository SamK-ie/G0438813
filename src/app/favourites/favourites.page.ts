import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { SharedHeaderComponent } from '../components/shared-header/shared-header.component';
import { addIcons } from 'ionicons';
import {
  heart,
  heartOutline,
  trash,
  searchOutline,
  heartDislikeOutline,
  peopleOutline,
  trendingUpOutline,
  timeOutline,
} from 'ionicons/icons';
import {
  IonRow,
  IonCol,
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonListHeader,
  IonThumbnail,
  IonSegment,
  IonSegmentButton,
  IonGrid,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  standalone: true,
  imports: [
    SharedHeaderComponent,
    IonContent,
    CommonModule,
    FormsModule,
    RouterModule,
    RouterLink,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonListHeader,
    IonThumbnail,
    IonSegment,
    IonSegmentButton,
    IonRow,
    IonCol,
    IonGrid,
  ],
})
export class FavouritesPage implements OnInit {
  isHistoryMode: boolean = false;
  favMovies: any[] = [];
  favCast: any[] = [];
  filteredMovies: any[] = [];
  filteredCast: any[] = [];
  searchQuery: string = '';
  viewMode: 'movies' | 'cast' = 'movies';

  constructor(
    private movieService: MovieService,
    private router: Router,
    private navCtrl: NavController,
  ) {
    addIcons({
      heart, heartOutline, trash, searchOutline,
      heartDislikeOutline, peopleOutline, trendingUpOutline, timeOutline,
    });
  }

  ngOnInit() {
    this.loadFavourites();
  }

  ionViewWillEnter() {
    this.loadFavourites();
  }

  loadFavourites() {
    const movies = JSON.parse(localStorage.getItem('fav_movies') || '[]');
    this.favMovies = movies.map((m: any) => ({ ...m, isFav: true }));
    const cast = JSON.parse(localStorage.getItem('fav_cast') || '[]');
    this.favCast = cast.map((c: any) => ({ ...c, isFav: true }));
    this.filterResults();
  }

  filterResults() {
    const query = this.searchQuery.toLowerCase().trim();
    if (query === '') {
      this.filteredMovies = [...this.favMovies];
      this.filteredCast = [...this.favCast];
    } else {
      this.filteredMovies = this.favMovies.filter((m) => m.title.toLowerCase().includes(query));
      this.filteredCast = this.favCast.filter((c) => c.name.toLowerCase().includes(query));
    }
  }

  toggleFav(item: any, type: 'movie' | 'cast') {
    item.isFav = !item.isFav;
    if (!item.isFav) {
      setTimeout(() => {
        this.removeFromFav(item.id, type);
      }, 300);
    }
  }

  removeFromFav(id: number, type: 'movie' | 'cast') {
    const key = type === 'movie' ? 'fav_movies' : 'fav_cast';
    let list = JSON.parse(localStorage.getItem(key) || '[]');
    list = list.filter((item: any) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(list));
    this.loadFavourites();
  }

  segmentChanged(event: any) {
    this.viewMode = event.detail.value;
  }

  openHistory() {
    this.router.navigate(['/cast-crew-details']);
  }

  searchMulti(event?: Event) {
    if (event) event.preventDefault();
    const searchText = this.searchQuery.trim();
    if (!searchText) return;
    this.movieService.searchMulti(searchText).subscribe({
      next: (res: any) => {
        if (res.results && res.results.length > 0) {
          const topResult = res.results[0];
          if (topResult.media_type === 'movie') {
            this.navCtrl.navigateForward(['/movie-details', topResult.id]);
          } else if (topResult.media_type === 'person') {
            this.navCtrl.navigateForward(['/cast-crew-details', topResult.id]);
          }
          this.searchQuery = '';
        }
      },
      error: (err: any) => console.error('Search failed:', err),
    });
  }
}