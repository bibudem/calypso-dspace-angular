import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ThemedLoadingComponent } from "../../../../../app/shared/loading/themed-loading.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  standalone: true,
  imports: [ThemedLoadingComponent, TranslateModule, RouterModule, CommonModule, NgbModule],
})
export class FaqComponent implements OnInit {
  faqData$: Observable<any[]>;
  currentLang: string;

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.currentLang = this.translate.currentLang || 'fr';  // Langue par défaut 'fr'

    // Charger les FAQ lors de l'initialisation avec la langue actuelle
    this.faqData$ = this.loadFAQ(this.currentLang);

    // Recharger les FAQ lorsque la langue change
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.faqData$ = this.loadFAQ(this.currentLang);
    });
  }

  // Utilisation d'Observable pour charger les FAQ
  loadFAQ(lang: string): Observable<any[]> {
    return this.http.get<any>('/assets/calypso/bibdata/faq.json').pipe(
      map(data => {
        if (data.faq && data.faq[lang]) {
          return data.faq[lang].items;
        } else {
          return [];
        }
      })
    );
  }
}
