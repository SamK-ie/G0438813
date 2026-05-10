import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { filter } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import {
  film,
  chevronBack,
  heart,
  home,
  videocam,
  star,
  searchOutline,
  search,
  person, 
  list    
} from 'ionicons/icons';

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class SharedHeaderComponent implements OnInit {
  @Input() showSearch: boolean = true;
  pageTitle: string = 'G0438813';
  headerIcon: string = 'home';
  headerIconClass: string = 'home-icon';
  searchQuery: string = '';

  constructor(
    private router: Router,
    private movieService: MovieService,
    private navCtrl: NavController
  ) {
    addIcons({
      film,
      chevronBack,
      heart,
      search,
      searchOutline,
      videocam,
      home,
      star,
      person, 
      list    
    });
  }

  ngOnInit() {
    this.updateHeader(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateHeader(event.urlAfterRedirects);
    });
  }

  private updateHeader(url: string) {
    if (url.includes('movie-details')) {
      this.pageTitle = 'Movie Details';
      this.headerIcon = 'videocam';
      this.headerIconClass = 'videoCam-icon';
    } else if (url.includes('cast-crew-details')) {
      this.pageTitle = 'Cast & Crew';
      this.headerIcon = 'star';
      this.headerIconClass = 'star-icon';
    } else if (url.includes('favorites')) {
      this.pageTitle = 'Favourites';
      this.headerIcon = 'heart';
      this.headerIconClass = 'heart-icon';
    } else if (url.includes('full-credits')) {
      this.pageTitle = 'Full Credits';
      this.headerIcon = 'film';
      this.headerIconClass = 'film-icon';
    } else {
      this.pageTitle = 'G0438813';
      this.headerIcon = 'home';
      this.headerIconClass = 'home-icon';
    }
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
          } else {
            this.navCtrl.navigateForward(['/cast-crew-details', topResult.id]);
          }
          this.searchQuery = '';
        }
      },
    });
  }
}