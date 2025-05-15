import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { VedetteService } from '../../../service/vedette.service';
import { map } from 'rxjs/operators';
import { Vedette } from '../../../models/Vedette';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
export class VedetteListeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('track') track: ElementRef<HTMLUListElement>;
  slides: Vedette[] = [];
  currentIndex = 0;
  itemWidth = 0;
  loading = true;
  error = false;
  autoSlideInterval: any;
  isBrowser: boolean;

  constructor(
    private vedetteService: VedetteService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Laisse le DOM se stabiliser, initCarousel sera appelé après le loadData()
  }

  // Appelle le service pour charger les vedettes, puis initialise le carrousel
  private loadData(): void {
    this.vedetteService.getImagesHome().pipe(
      map(images => this.vedetteService.shuffleArray(images).slice(0, 8))
    ).subscribe({
      next: (images) => {
        this.slides = images;
        this.loading = false;
        this.error = false;

        // On attend un tick pour que le DOM soit prêt avant d'initialiser
        if (this.isBrowser) {
          setTimeout(() => {
            this.initCarousel();
            this.cdr.detectChanges();
          });
        }
      },
      error: (err) => {
        console.error('Erreur chargement vedettes :', err);
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Initialise le carrousel (calcul de largeur, position, démarrage auto-slide)
  private initCarousel(): void {
    if (!this.isBrowser) return;

    this.calculateItemWidth();
    this.updatePosition();
    this.startAutoSlide();

    window.addEventListener('resize', this.calculateItemWidth.bind(this));
  }

  // Calcule dynamiquement la largeur d'un item en utilisant le DOM
  calculateItemWidth(): void {
    if (!this.isBrowser) return;

    requestAnimationFrame(() => {
      const firstSlide = this.track?.nativeElement?.querySelector('.slider__slide') as HTMLElement;
      if (firstSlide) {
        this.itemWidth = firstSlide.offsetWidth;
        this.updatePosition();
      }
    });
  }

  // Applique une translation horizontale en fonction de l'index courant
  updatePosition(): void {
    if (!this.track?.nativeElement || this.slides.length === 0) return;
    const offset = -this.currentIndex * (this.itemWidth + 20);
    this.track.nativeElement.style.transform = `translateX(${offset}px)`;
  }

  // Passe à la slide suivante avec effet de boucle
  nextSlide(): void {
    if (this.slides.length <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updatePosition();
  }

  // Revient à la slide précédente avec effet de boucle
  prevSlide(): void {
    if (this.slides.length <= 1) return;
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updatePosition();
  }

  // Lance le défilement automatique du carrousel
  startAutoSlide(): void {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => this.nextSlide(), 4000);
  }

  // Arrête le défilement automatique
  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  // Fonction de tracking Angular pour optimiser les itérations
  trackByFn(index: number, item: Vedette): string {
    return item.id;
  }

  // Nettoyage : arrêt de l’auto-slide et retrait des listeners
  ngOnDestroy(): void {
    this.stopAutoSlide();
    if (this.isBrowser) {
      window.removeEventListener('resize', this.calculateItemWidth.bind(this));
    }
  }
}
