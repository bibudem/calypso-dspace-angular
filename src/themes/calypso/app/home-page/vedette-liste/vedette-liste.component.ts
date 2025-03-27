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
export class VedetteListeComponent implements OnInit {
  imagesGrouped$: Observable<Vedette[][]>;

  constructor(private vedetteService: VedetteService) {}

  ngOnInit(): void {
    this.imagesGrouped$ = this.vedetteService.getImagesHome().pipe(
      map(images => this.vedetteService.shuffleArray(images)), // Mélanger les images
      map(shuffledImages => shuffledImages.slice(0, 6)), // Prendre 6 images max
      map(images => this.groupImages(images, 2)) // Regrouper par paires
    );
  }

  // Fonction pour grouper les images par taille de `size`
  private groupImages(images: Vedette[], size: number): Vedette[][] {
    const grouped: Vedette[][] = [];
    for (let i = 0; i < images.length; i += size) {
      grouped.push(images.slice(i, i + size));
    }
    return grouped;
  }


  trackByFn(index: number, item: Vedette[]) {
    return item.map(img => img.id).join('-');
  }

}
