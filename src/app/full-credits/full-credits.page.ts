import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-full-credits',
  templateUrl: './full-credits.page.html',
  styleUrls: ['./full-credits.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class FullCreditsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
