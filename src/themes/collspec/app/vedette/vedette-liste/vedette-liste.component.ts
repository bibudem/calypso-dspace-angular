import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class VedetteListeComponent implements OnInit, AfterViewInit {
  @ViewChild('track', { static: false }) track: ElementRef<HTMLUListElement>;

  slides: Vedette[] = [];
  currentIndex = 0;
  itemWidth = 0;
  loading = true;
  error = false;
  autoSlideInterval: any;
  private carouselInitialized = false;

  constructor(
    private vedetteService: VedetteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (this.slides.length > 0 && !this.carouselInitialized) {
      this.initCarousel();
    }
  }

  private loadData(): void {
    this.vedetteService.getImagesHome().pipe(
      map((images) => {
        const shuffled = this.vedetteService.shuffleArray(images);
        return shuffled.slice(0, 8);
      })
    ).subscribe({
      next: (images) => {
        this.slides = images;
        this.loading = false;
        this.cdr.detectChanges();

        if (this.track?.nativeElement) {
          this.initCarousel();
        }
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error loading featured items:', err);
      }
    });
  }

  initCarousel(): void {
    if (this.carouselInitialized) return;

    this.calculateItemWidth();
    this.startAutoSlide();
    this.carouselInitialized = true;
  }

  calculateItemWidth(): void {
    const firstSlide = this.track?.nativeElement?.querySelector('.slider__slide') as HTMLElement;
    if (firstSlide) {
      this.itemWidth = firstSlide.offsetWidth;
      this.updatePosition();
    } else {
      setTimeout(() => this.calculateItemWidth(), 100);
    }
  }

  updatePosition(): void {
    if (!this.track?.nativeElement || this.slides.length === 0) return;
    const offset = -this.currentIndex * (this.itemWidth + 20);
    this.track.nativeElement.style.transform = `translateX(${offset}px)`;
  }

  nextSlide(): void {
    if (this.slides.length <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updatePosition();
  }

  prevSlide(): void {
    if (this.slides.length <= 1) return;
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updatePosition();
  }

  startAutoSlide(): void {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => this.nextSlide(), 3500);
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  trackByFn(index: number, item: Vedette): string {
    return item.id;
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }
}
