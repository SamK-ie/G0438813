import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { addIcons } from 'ionicons';
import { home, heart, star, videocam } from 'ionicons/icons';
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
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-movie-credits',
  templateUrl: './movie-credits.page.html',
  styleUrls: ['./movie-credits.page.scss'],
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
  ],
})
export class MovieCreditsPage implements OnInit {
  isHistoryMode: boolean = false;
  constructor() {}

  ngOnInit() {}
}
