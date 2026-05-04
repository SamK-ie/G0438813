import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { addIcons } from 'ionicons';
import { home, heart, star, videocam, trash, searchOutline, heartDislikeOutline, peopleOutline, trendingUpOutline, timeOutline  } from 'ionicons/icons';
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
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterModule,
    RouterLink,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonListHeader,
    IonThumbnail,
    IonBackButton,
    IonSegment,
    IonSegmentButton,
    IonItemSliding,
    IonItemOption,
    IonItemOptions,
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

  constructor() {
    addIcons({ home, heart, star, videocam, trash, searchOutline, heartDislikeOutline, peopleOutline, trendingUpOutline, timeOutline });
  }

  ngOnInit() {
    this.loadFavourites();
  }

  ionViewWillEnter() {
    this.loadFavourites();
  }

  loadFavourites() {
    this.favMovies = JSON.parse(localStorage.getItem('fav_movies') || '[]');
    this.favCast = JSON.parse(localStorage.getItem('fav_cast') || '[]');
  
    this.filterResults();
  }

  onSearch() {
    this.filterResults();
  }

  filterResults() {
    const query = this.searchQuery.toLowerCase().trim();

    if (query === '') {
      this.filteredMovies = [...this.favMovies];
      this.filteredCast = [...this.favCast];
    } else {
      this.filteredMovies = this.favMovies.filter(m => 
        m.title.toLowerCase().includes(query)
      );
      this.filteredCast = this.favCast.filter(c => 
        c.name.toLowerCase().includes(query)
      );
    }
  }

  segmentChanged(event: any) {
    this.viewMode = event.detail.value;
  }

  removeFromFav(id: number, type: 'movie' | 'cast') {
    const key = type === 'movie' ? 'fav_movies' : 'fav_cast';
    let list = JSON.parse(localStorage.getItem(key) || '[]');
    list = list.filter((item: any) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(list));
    this.loadFavourites();
  }
}

