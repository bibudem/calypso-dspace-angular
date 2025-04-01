import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import { VedetteService } from '../../../service/vedette.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Vedette} from "../../../models/Vedette";
import {ThemedLoadingComponent} from "../../../../../app/shared/loading/themed-loading.component";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

declare var bootstrap: any;

@Component({
  selector: 'ds-vedette-liste',
  templateUrl: './vedette-liste.component.html',
  styleUrls: ['./vedette-liste.component.scss'],
  standalone: true,
  imports: [ThemedLoadingComponent, TranslateModule, RouterModule, CommonModule, NgbModule],
})
export class VedetteListeComponent implements OnInit, AfterViewInit {
  imagesGrouped$: Observable<Vedette[]>;
  isBrowser: boolean;

  constructor(
    private vedetteService: VedetteService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.imagesGrouped$ = this.vedetteService.getImagesHome().pipe(
      map(images => this.vedetteService.shuffleArray(images)),
      map(shuffledImages => shuffledImages.slice(0, 6)) // ✅ Garde une liste simple
    );
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        const carouselElement = document.getElementById('carouselHome');

        if (carouselElement) {
          console.log('Bootstrap:', typeof bootstrap.Carousel);

          try {
            const carousel = new bootstrap.Carousel(carouselElement, {
              interval: 5000,
              ride: 'carousel',
              wrap: true,
            });
            console.log('Carousel initialisé:', carousel);
          } catch (error) {
            console.error('Erreur lors de l’init du carousel:', error);
          }
        }
      }, 500);
    }
  }

  trackByFn(index: number, item: Vedette) {
    return item.id;
  }
}
