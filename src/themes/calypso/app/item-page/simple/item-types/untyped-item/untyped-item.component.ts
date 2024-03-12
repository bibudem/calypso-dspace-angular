import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import { Item } from '../../../../../../../app/core/shared/item.model';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../../../app/core/shared/context.model';
import {
  UntypedItemComponent as BaseComponent
} from '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component';
import {ActivatedRoute, Router} from "@angular/router";
import {RouteService} from "../../../../../../../app/core/services/route.service";
import {ItemDataService} from "../../../../../../../app/core/data/item-data.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {config} from "../../../../../config/config";

/**
 * Component that represents an untyped Item page
 */
@listableObjectComponent(Item, ViewMode.StandalonePage, Context.Any, 'calypso')
@Component({
  selector: 'ds-untyped-item',
  styleUrls: ['./untyped-item.component.scss'],
  //styleUrls: ['../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component.scss'],
  templateUrl: './untyped-item.component.html',
  //templateUrl: '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UntypedItemComponent extends BaseComponent implements OnInit {
  activeTab: number = 1;
  metadata: any[] = [];  // Tableau pour stocker les métadonnées de l'élément
  itemRD : any;
  backendApi: string = config.backendApi;
  idItem: string;
  activeTabParam: string;

  constructor(
    protected routeService: RouteService,
    protected router: Router,
    protected route: ActivatedRoute,
    private itemDataService: ItemDataService,
    private modalService: NgbModal
  ) {
    super(routeService, router);
  }

  ngOnInit() {
    super.ngOnInit();

    // Récupérer l'ID de l'élément à partir de l'URL
    this.idItem = this.route.snapshot.paramMap.get('id');

    // Récupérer le paramètre d'URL 'tab' (ou un autre nom que vous préférez)
    this.activeTabParam = this.route.snapshot.queryParamMap.get('tab');

    // Définir l'onglet actif en fonction du paramètre d'URL
    this.activeTab = this.activeTabParam ? +this.activeTabParam : 1;

    // Appeler le service pour récupérer l'élément avec les métadonnées
    this.itemDataService.findById(this.idItem).subscribe(
      (item) => {
        this.itemRD = item;
        // Accéder aux métadonnées de l'élément
        this.metadata = Object.entries(item.payload.metadata).map(([key, value]) => ({
          label: key,
          value: this.extractMetadataValues(value),
        }));
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'élément :', error);
      }
    );
  }

  /**
   * Extraire les valeurs des métadonnées
   */
  extractMetadataValues(metadataValue: any): any {
    if (Array.isArray(metadataValue) && metadataValue.length > 0) {
      return metadataValue.map((mv) => mv.value);
    } else {
      return null;
    }
  }

  /**
   * Masquer une section de l'interface utilisateur
   */
  hideSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = 'none';
    }
  }

  /**
   * Afficher une section de l'interface utilisateur
   */
  displaySection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = 'block';
    }
  }

  openDialog(content): void {
    this.modalService.open(content, { centered: true });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  async redirectToClipSearch() {
    this.closeModal();

    try {
      // Récupérer les informations sur les bundles de l'élément
      const response = await fetch(this.backendApi + 'items/' + this.idItem + '/bundles');
      const infoUrlBundles = await response.json();

      // Rechercher le bundle "ORIGINAL"
      const originalBundle = infoUrlBundles._embedded.bundles.find(bundle => bundle.name === 'ORIGINAL');

      if (originalBundle) {
        // Récupérer le lien vers le premier bitstream du bundle "ORIGINAL"
        const bitstreamsResponse = await fetch(originalBundle._links.bitstreams.href);
        const bitstreamsInfo = await bitstreamsResponse.json();

        // Extraire le lien du premier bitstream
        const firstBitstreamUrl = bitstreamsInfo._embedded.bitstreams[0]._links.content.href;
        //console.log(firstBitstreamUrl);
        // Définissez les paramètres de requête
        const queryParams = {
          query: null,
          url: firstBitstreamUrl
        };

        // Naviguez vers la page de recherche de clips avec les paramètres de requête
        this.router.navigate(['/clip-search'], { queryParams });
      } else {
        console.error('Bundle "ORIGINAL" introuvable.');
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération des bundles :', error);
    }
  }
}
