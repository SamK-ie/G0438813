import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton } from '@ionic/angular/standalone';


@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MovieDetailsPage implements OnInit {
  movie: any;
  cast: any[] = [];
  crew: any[] = [];

  constructor(
    private route: ActivatedRoute, 
    private movieService: MovieService
  ) {}

  ngOnInit() {
    // Get the ID from the URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDetails(Number(id));
    }
  }

  loadDetails(id: number) {
    // Get credits of cast/crew
    this.movieService.getMovieCredits(id).subscribe(res => {
      this.cast = res.cast;
      this.crew = res.crew;
    });
  }
}
