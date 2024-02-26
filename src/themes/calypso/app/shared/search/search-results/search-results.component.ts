import { SearchResultsComponent as BaseComponent } from '../../../../../../app/shared/search/search-results/search-results.component';
import { Component } from '@angular/core';
import { fadeIn, fadeInOut } from '../../../../../../app/shared/animations/fade';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'ds-search-results',
  templateUrl: './search-results.component.html',
  //templateUrl: '../../../../../../app/shared/search/search-results/search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class SearchResultsComponent extends BaseComponent {
  collectionId: string;

  constructor(private modalService: NgbModal,
              private router: Router,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    // Observer les changements d'URL et extraire l'ID de la collection
    this.route.url.subscribe(segments => {
      const url = segments.map(segment => segment.path).join('/');

      // Vérifier si l'URL correspond à notre modèle
      const regex = /^\/collections\/([a-f\d-]+)$/i;
      const match = url.match(regex);

      if (match) {
        this.collectionId = match[1];
      } else {
        this.collectionId = null;
      }
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

    // Rediriger l'utilisateur vers /clip-recherche en incluant l'ID de la collection s'il existe
    if (this.collectionId) {
      this.router.navigate(['/clip-recherche'], { queryParams: { collectionId: this.collectionId } });
    } else {
      this.router.navigate(['/clip-recherche']);
    }
  }


}
