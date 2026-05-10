import { Component, Input } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { addIcons } from 'ionicons';
import {
  chevronBack,
  heart,
  home,
  videocam,
  star,
  searchOutline,
  search,
} from 'ionicons/icons'; // Added the missing 'from' and closing semicolon

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class SharedHeaderComponent {
  @Input() pageTitle: string = 'G0438813';
  @Input() showSearch: boolean = true;
  searchQuery: string = '';

  constructor(
    private movieService: MovieService,
    private navCtrl: NavController
  ) {
    addIcons({
      chevronBack,
      heart,
      search,
      searchOutline,
      videocam,
      home,
      star,
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