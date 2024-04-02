import { Component, OnInit } from '@angular/core';
import { VedetteService } from '../../../service/vedette.service';
import { Vedette } from '../../../models/Vedette';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-vedette-liste',
  templateUrl: './vedette-liste.component.html',
  styleUrls: ['./vedette-liste.component.scss'],
  standalone: true,
  imports: [ThemedLoadingComponent, TranslateModule, RouterModule, CommonModule, NgbModule],
})
export class VedetteListeComponent implements OnInit{
  images$: Observable<Vedette[]>;

  constructor(
    private vedetteService: VedetteService
  ) {

  }

  ngOnInit(): void {
    this.images$ = this.vedetteService.getImagesHome().pipe(
      map(images => this.vedetteService.shuffleArray(images)), // Mélanger le tableau d'images
      map(shuffledImages => shuffledImages.slice(0, 5)) // Prendre les 5 premières images du tableau mélangé
    );
  }

}
