import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { VedetteService } from '../../../service/vedette.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vedette } from '../../../models/Vedette';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

declare var bootstrap: any;

@Component({
  selector: 'ds-vedette-liste',
  templateUrl: './vedette-liste.component.html',
  styleUrls: ['./vedette-liste.component.scss'],
  standalone: true,
  imports: [
    ThemedLoadingComponent,
    TranslateModule,
    RouterModule,
    CommonModule,
    NgbModule,
  ],
})
export class VedetteListeComponent implements OnInit, AfterViewInit {
  imagesGrouped$: Observable<Vedette[]>;
  isBrowser: boolean;
  private carousel: any;

  constructor(
    private vedetteService: VedetteService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // Vérifie si on est dans un environnement navigateur
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Initialise l'observable contenant les vedettes.
   * Duplique les éléments pour permettre un effet de boucle dans le carrousel.
   */
  ngOnInit(): void {
    this.imagesGrouped$ = this.vedetteService.getImagesHome().pipe(
      map((images) => {
        const duplicated = this.vedetteService.shuffleArray(images);
        return [...duplicated, ...duplicated].slice(0, 8);
      })
    );
  }

  /**
   * Initialise le carrousel une fois la vue chargée (si navigateur).
   * Gère l'effet de boucle et la visibilité des éléments.
   */
    ngAfterViewInit(): void {
      if (this.isBrowser) {
        setTimeout(() => this.initializeCarousel(), 100);
      }
    }

  /**
   * Initialise le carrousel Bootstrap et configure la boucle "circulaire" manuelle.
   */
  private initializeCarousel(): void {
    const carouselElement = document.getElementById('carouselHome');
    if (!carouselElement) return;

    const inner = carouselElement.querySelector('.carousel-inner');
    const items = carouselElement.querySelectorAll('.carousel-item');

    if (items.length < 2 || !inner) return;

    // Duplique les deux premiers éléments à la fin pour simuler une boucle
    [0, 1].forEach(i => inner.appendChild(items[i].cloneNode(true)));

    this.carousel = new bootstrap.Carousel(carouselElement, {
      interval: 5000,
      wrap: false,
      touch: true,
    });

    this.updateVisibility(carouselElement);

    carouselElement.addEventListener('slid.bs.carousel', (event: any) => {
      this.onSlideChange(event, carouselElement);
    });
  }

  /**
   * Met à jour les éléments visibles dans le carrousel :
   * seuls l'actif et le suivant sont affichés.
   */
  private updateVisibility(carouselElement: HTMLElement): void {
    const active = carouselElement.querySelector('.carousel-item.active') as HTMLElement;
    const next = active?.nextElementSibling as HTMLElement;

    carouselElement.querySelectorAll('.carousel-item').forEach((el) => {
      const item = el as HTMLElement;
      const isVisible = item === active || item === next;
      item.classList.toggle('d-none', !isVisible);
      item.style.display = isVisible ? 'block' : 'none';
    });
  }

  /**
   * Callback exécuté après chaque transition de slide.
   * Si on atteint le dernier "faux" slide, on rebascule sans transition au début.
   */
  private onSlideChange(event: any, carouselElement: HTMLElement): void {
    const activeIndex = event?.to;
    const items = carouselElement.querySelectorAll('.carousel-item');

    this.updateVisibility(carouselElement);

    if (activeIndex === items.length - 3) {
      setTimeout(() => {
        this.carousel.to(0, { duration: 0 });
        setTimeout(() => this.updateVisibility(carouselElement), 10);
      }, 50);
    }
  }

  /**
   * Fonction de suivi pour optimiser les performances de ngFor.
   * @param index Index de l'élément
   * @param item Élément Vedette
   * @returns ID unique de la vedette
   */
  trackByFn(index: number, item: Vedette): string {
    return item.id;
  }
}
