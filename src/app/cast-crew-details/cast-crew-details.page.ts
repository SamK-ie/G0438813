import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, RouterLink } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { SharedHeaderComponent } from '../components/shared-header/shared-header.component';
import { addIcons } from 'ionicons';
import {
  heart,
  filmOutline,
  searchOutline,
  trendingUpOutline,
  timeOutline,
  person,
  informationCircleOutline,
  heartOutline,
} from 'ionicons/icons';
import {
  IonBadge,
  IonContent,
  IonButton,
  IonIcon,
  IonListHeader,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-cast-crew-details',
  templateUrl: './cast-crew-details.page.html',
  styleUrls: ['./cast-crew-details.page.scss'],
  standalone: true,
  imports: [
    SharedHeaderComponent,
    IonBadge,
    IonContent,
    CommonModule,
    FormsModule,
    RouterModule,
    RouterLink,
    IonButton,
    IonIcon,
    IonListHeader,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class CastCrewDetailsPage implements OnInit {
  isHistoryMode: boolean = false;
  person: any = null;
  recentPeople: any[] = [];
  videography: any[] = [];
  searchResults: any[] = [];
  searchQuery: string = '';
  isSearchMode: boolean = false;
  public isBioExpanded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private navCtrl: NavController,
  ) {
    addIcons({
      heart,
      filmOutline,
      searchOutline,
      trendingUpOutline,
      timeOutline,
      person,
      informationCircleOutline,
      heartOutline,
    });
  }

  // ... rest of your logic functions (ngOnInit, loadPerson, etc.) remain the same
  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (!id || id === 'null') {
        this.isSearchMode = true;
        this.person = null;
        this.loadRecentPeople();
      } else {
        this.loadPerson(id);
      }
    });
  }

  loadPerson(id: any) {
    this.isSearchMode = false;
    this.person = null;
    this.videography = [];

    this.movieService.getPersonDetails(id).subscribe({
      next: (res: any) => {
        this.person = res;
        this.isBioExpanded = false;
        this.searchQuery = '';
        this.loadVideography(id);
        this.saveToRecent(res);
      },
      error: (err) => {
        console.error('Failed to load person:', err);
        // Optional: reset to search mode if the API fails
        this.isSearchMode = true;
      },
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

  getFormattedBio(bio: string) {
    if (!bio || bio.trim().length === 0) return []; // Explicitly return empty array
    return bio.split(/\n|\. /).filter((p) => p.trim().length > 0);
  }

  toggleBio() {
    this.isBioExpanded = !this.isBioExpanded;
  }

  loadRecentPeople() {
    const saved = localStorage.getItem('recentPeople');
    this.recentPeople = saved ? JSON.parse(saved).slice(0, 15) : [];
  }

  loadVideography(id: string) {
    this.movieService.getPersonMovieCredits(id).subscribe((res: any) => {
      const combined = [...(res.cast || []), ...(res.crew || [])];
      const unique = combined.filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
      );
      this.videography = unique
        .sort((a: any, b: any) => b.popularity - a.popularity)
        .slice(0, 20);
      console.log('Credits loaded:', this.videography);
    });
  }

  saveToRecent(person: any) {
    let history = JSON.parse(localStorage.getItem('recentPeople') || '[]');
    history = [person, ...history.filter((p: any) => p.id !== person.id)].slice(
      0,
      10,
    );
    localStorage.setItem('recentPeople', JSON.stringify(history));
    this.recentPeople = history;
  }

  clearHistory() {
    this.recentPeople = [];
    localStorage.removeItem('recentPeople');
  }
}
