import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { SharedHeaderComponent } from '../components/shared-header/shared-header.component';
import { ViewChild } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  heart,
  heartOutline,
  person,
  videocam,
  peopleOutline,
  filmOutline,
} from 'ionicons/icons';
import {
  IonFabButton,
  IonFab,
  IonRow,
  IonCol,
  IonGrid,
  IonIcon,
  IonContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular';

@Component({
  selector: 'app-full-credits',
  templateUrl: './full-credits.page.html',
  styleUrls: ['./full-credits.page.scss'],
  standalone: true,
  imports: [
    IonFabButton,
    IonFab,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonContent,
    CommonModule,
    FormsModule,
    RouterModule,
    SharedHeaderComponent,
    IonContent,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
})
export class FullCreditsPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  showBackToTop = false;
  id: string | null = null;
  type: 'movie' | 'person' | null = null;
  activeTab: 'cast' | 'crew' = 'cast';
  headerData: any = null;
  castData: any[] = [];
  crewData: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
  ) {
    addIcons({
      heart,
      heartOutline,
      person,
      videocam,
      peopleOutline,
      filmOutline,
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.type = this.route.snapshot.paramMap.get('type') as 'movie' | 'person';

    if (this.type === 'person') {
      this.loadPersonData();
    } else {
      this.loadMovieData();
    }
  }

  loadPersonData() {
    this.movieService.getPersonDetails(this.id!).subscribe((res: any) => {
      this.headerData = {
        name: res.name,
        info: res.known_for_department,
        img: res.profile_path,
      };
    });
    this.movieService.getPersonMovieCredits(this.id!).subscribe((res: any) => {
      this.castData = this.sortByYear(res.cast);
      this.crewData = this.sortByYear(res.crew);
    });
  }

  loadMovieData() {
    this.movieService
      .getMovieDetails(Number(this.id!))
      .subscribe((res: any) => {
        this.headerData = {
          name: res.title,
          info: res.release_date,
          img: res.poster_path,
        };
      });
    this.movieService.getMovieCredits(this.id!).subscribe((res: any) => {
      this.castData = res.cast;
      this.crewData = res.crew;
    });
  }

  private sortByYear(list: any[]) {
    return list.sort((a, b) => {
      const yearA = a.release_date ? new Date(a.release_date).getFullYear() : 0;
      const yearB = b.release_date ? new Date(b.release_date).getFullYear() : 0;
      return yearB - yearA;
    });
  }

  loadMore(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 500);
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

  handleScroll(ev: any) {
    this.showBackToTop = ev.detail.scrollTop > 400;
  }

  scrollToTop() {
    this.content.scrollToTop(500);
  }
}  

