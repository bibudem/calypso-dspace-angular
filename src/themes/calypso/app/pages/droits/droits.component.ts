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
  selector: 'ds-droits',
  templateUrl: './droits.component.html',
  styleUrls: ['./droits.component.scss'],
  standalone: true,
  imports: [
    ThemedLoadingComponent,
    TranslateModule,
    RouterModule,
    CommonModule,
    NgbModule
  ],
})
export class DroitsComponent implements OnInit {
  droitsData$: Observable<any[]>;
  currentLang: string;

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.currentLang = this.translate.currentLang || 'fr';

    // Load rights data based on current language on init
    this.droitsData$ = this.loadDroits(this.currentLang);

    // Reload data when the language changes
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.droitsData$ = this.loadDroits(this.currentLang);
    });
  }

  // Use Observable to load the rights data
  loadDroits(lang: string): Observable<any[]> {
    return this.http.get<any>('/assets/calypso/bibdata/droits.json').pipe(
      map(data => {
        return data.droits?.[lang]?.sections || [];
      })
    );
  }
}
