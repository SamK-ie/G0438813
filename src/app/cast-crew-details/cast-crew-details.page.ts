import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { addIcons } from 'ionicons';
import {
  home,
  heart,
  star,
  videocam,
  filmOutline,
  searchOutline,
  trendingUpOutline,
  timeOutline,
  person,
} from 'ionicons/icons';
import {
  IonBadge,

  IonAvatar,
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
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-cast-crew-details',
  templateUrl: './cast-crew-details.page.html',
  styleUrls: ['./cast-crew-details.page.scss'],
  standalone: true,
  imports: [
    IonBadge,
    IonAvatar,
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
    IonGrid,
    IonRow,
    IonCol,
    IonSearchbar,
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
      home,
      heart,
      star,
      videocam,
      filmOutline,
      searchOutline,
      trendingUpOutline,
      timeOutline,
      person,
    });
  }

  openHistory() {
  this.isSearchMode = true;
  this.searchQuery = '';
  this.loadRecentPeople();
}

 ngOnInit() {
  this.route.params.subscribe(params => {
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

  getFormattedBio(bio: string) {
    if (!bio) return [];
    // This splits the long string into an array of strings[cite: 6]
    return bio.split('. ').map(sentence => sentence.trim() + (sentence.endsWith('.') ? '' : '.'));
  }

  toggleBio() {
    this.isBioExpanded = !this.isBioExpanded;
  }

  loadRecentPeople() {
    const saved = localStorage.getItem('recentPeople');
    // Slice to 15 people at a time to prevent overwhelming the user
    this.recentPeople = saved ? JSON.parse(saved).slice(0, 15) : [];
  }

  onSearch() {
    const text = this.searchQuery.trim();
    if (!text) {
      this.searchResults = [];
      return;
    }
    
    this.movieService.searchPeople(text).subscribe((res: any) => {
      this.searchResults = res.results; // Returns both Cast and Crew
    });
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
          // Navigating instead of just loading details keeps the URL in sync
          this.navCtrl.navigateForward(['/movie-details', topResult.id]);
          this.isHistoryMode = false;
        } 
        else if (topResult.media_type === 'person') {
          this.navCtrl.navigateForward(['/person-details', topResult.id]);
        }

        this.searchQuery = ''; 
      } else {
        console.log("No results found for this database entry.");
      }
    },
    error: (err: any) => {
      console.error("Database connection failed:", err);
      // Optional: Add a Toast or Alert here for the user
    }
  });
}

  loadPerson(id: any) {
    this.movieService.getPersonDetails(id).subscribe((res: any) => {
      this.person = res;
      this.isSearchMode = false;
      this.isBioExpanded = false;
      this.searchQuery = '';
      this.loadVideography(id);
      this.saveToRecent(res);
    });
  }

  loadVideography(id: string) {
    this.movieService.getPersonMovieCredits(id).subscribe((res: any) => {
      // Sort by popularity and take the top 20
      this.videography = res.cast
        .sort((a: any, b: any) => b.popularity - a.popularity)
        .slice(0, 20);
    });
  }

  saveToRecent(person: any) {
    let history = JSON.parse(localStorage.getItem('recentPeople') || '[]');
    // Filter duplicates and keep top 10
    history = [person, ...history.filter((p: any) => p.id !== person.id)].slice(
      0,
      10,
    );
    localStorage.setItem('recentPeople', JSON.stringify(history));
    this.recentPeople = history;
  }

  clearHistory() {
  // 1. Wipe the local variable so the screen updates instantly
  this.recentPeople = [];

  // 2. Wipe the storage so it stays empty when you reload the app
  localStorage.removeItem('recentPeople');
  
  console.log('History cleared!');
}
  
}
