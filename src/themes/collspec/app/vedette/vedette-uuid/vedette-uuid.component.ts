import {
  Component, Input, OnInit, OnDestroy,
  AfterViewInit, ElementRef, ViewChild, HostListener, ChangeDetectorRef
} from '@angular/core';
import { VedetteService } from '../../../service/vedette.service';
import { Vedette } from '../../../models/Vedette';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import {CommonModule} from "@angular/common";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { map } from 'rxjs/operators';

@Component({
  selector: 'ds-vedette-uuid',
  templateUrl: './vedette-uuid.component.html',
  styleUrls: ['./vedette-uuid.component.scss'],
  standalone: true,
  imports: [ThemedLoadingComponent, TranslateModule, RouterModule, CommonModule, NgbModule],
})
export class VedetteUUIDComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() uuid: string;
  @ViewChild('track') track: ElementRef<HTMLDivElement>;

  slides: Vedette[] = [];
  currentIndex = 0;
  itemWidth = 0;
  loading = true;
  error = false;
  autoSlideInterval: any;

  constructor(
    private vedetteService: VedetteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.uuid) {
      console.error('UUID non fourni');
      return;
    }

    this.vedetteService.getImagesColl(this.uuid).pipe(
      map((images) => this.vedetteService.shuffleArray(images).slice(0, 8))
    ).subscribe({
      next: (slides) => {
        this.slides = slides;
        this.loading = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.calculateItemWidth();
          this.startAutoSlide();
        }, 100);
      },
      error: (err) => {
        console.error('Erreur lors du chargement:', err);
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {
    this.calculateItemWidth();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  calculateItemWidth() {
    if (!this.track?.nativeElement) {
      return;
    }

    const containerWidth = this.track.nativeElement.offsetWidth;

    this.itemWidth = containerWidth / 1.5;
    console.log('Largeur calculée par item:', this.itemWidth);

    this.updatePosition();
  }

  updatePosition() {
    if (!this.track?.nativeElement) return;

    const offset = -this.currentIndex * (this.itemWidth + 20); // 20px = gap

    this.track.nativeElement.style.transform = `translateX(${offset}px)`;
  }
  nextSlide() {
    if (this.slides.length <= 1) return;

    this.currentIndex = (this.currentIndex + 1) % this.slides.length;

    this.updatePosition();
  }

  prevSlide() {
    if (this.slides.length <= 1) return;

    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;

    this.updatePosition();
  }

 startAutoSlide() {
    this.stopAutoSlide();

    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 3500);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  trackByFn(index: number, item: Vedette): string {
    return item.id;
  }
}
