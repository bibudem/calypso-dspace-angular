import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterModule} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {
  fadeIn,
  fadeInOut,
} from '../../../../../../app/shared/animations/fade';
import { ErrorComponent } from '../../../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../../../app/shared/loading/themed-loading.component';
import { ObjectCollectionComponent } from '../../../../../../app/shared/object-collection/object-collection.component';
import { SearchExportCsvComponent } from '../../../../../../app/shared/search/search-export-csv/search-export-csv.component';
import { SearchResultsComponent as BaseComponent } from '../../../../../../app/shared/search/search-results/search-results.component';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'ds-search-results',
  templateUrl: './search-results.component.html',
  //templateUrl: '../../../../../../app/shared/search/search-results/search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  animations: [
    fadeIn,
    fadeInOut,
  ],
  standalone: true,
  imports: [NgIf, SearchExportCsvComponent, ObjectCollectionComponent, ThemedLoadingComponent, ErrorComponent, RouterLink, TranslateModule, RouterModule],
})
export class SearchResultsComponent extends BaseComponent {
  collectionId: string;
  query: string ;

  constructor(private modalService: NgbModal,
              private router: Router,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    // Récupérer l'ID de l'élément à partir de l'URL
    this.collectionId = this.route.snapshot.paramMap.get('id')|| null;

    // Observer les changements d'URL et extraire les paramètres
    this.route.queryParams.subscribe(params => {
      // Extraire la variable 'query' de l'URL pour la recherche
      this.query = params['query'] || 'all';
    });
  }


  redirectToAiSearch() {

    const queryParams = {};
    if (this.collectionId) {
      queryParams['scope'] = this.collectionId;
    }
    if (this.query) {
      queryParams['query'] = this.query;
    }

    this.router.navigate(['/ai-search'], { queryParams });
  }
}
