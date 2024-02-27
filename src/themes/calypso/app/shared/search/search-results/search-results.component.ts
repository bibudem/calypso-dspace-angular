import { SearchResultsComponent as BaseComponent } from '../../../../../../app/shared/search/search-results/search-results.component';
import { Component } from '@angular/core';
import { fadeIn, fadeInOut } from '../../../../../../app/shared/animations/fade';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'ds-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class SearchResultsComponent extends BaseComponent {
  collectionId: string;
  query: string;

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
      this.query = params['query'] || null;

    });
  }

  openDialog(content): void {
    this.modalService.open(content, { centered: true });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  redirectToClipSearch() {
    this.closeModal();

    const queryParams = {};
    if (this.collectionId) {
      queryParams['scope'] = this.collectionId;
    }
    if (this.query) {
      queryParams['query'] = this.query;
    }

    this.router.navigate(['/clip-search'], { queryParams });
  }
}
