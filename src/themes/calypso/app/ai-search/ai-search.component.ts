import { Component, OnInit, OnDestroy } from '@angular/core';
import { AiService } from '../../service/ai.service';
import { Ai } from '../../models/Ai';
import {ActivatedRoute, Router} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {config} from "../../config/config";
import { Location } from '@angular/common';

@Component({
  selector: 'ds-ai-search',
  templateUrl: './ai-search.component.html',
  styleUrls: ['./ai-search.component.scss']
})
export class AiSearchComponent implements OnInit, OnDestroy {
  images$: Observable<Ai[]>;
  query: string = null;
  scope: string = null;
  url: string = null;
  size: number = config.sizeElementsClip;
  defaultItemCount: number = 6;
  listeAi: Ai[] = [];
  backendApiFile: string = config.backendApiFile;
  searchQuery: string = '';

  private subscription: Subscription;

  constructor(private aiService: AiService, private route: ActivatedRoute, private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Extraire les variables de l'URL pour la recherche
      if (params['query']) {
        this.query = params['query'];
        if(this.query!= 'all'){
          this.searchQuery = this.query;
        }
      }
      if (params['scope']) {
        this.scope = params['scope'];
      }

      if (params['url']) {
        this.query = null;
        this.url = params['url'];
      }

      try {
        // Récupérer les images en fonction des paramètres de recherche
        this.images$ = this.aiService.getImages(this.query, this.url, this.scope);

        this.subscription = this.images$.subscribe(
          (data: any) => {
            // Extraire et mapper les données pertinentes vers des objets Clip
            this.listeAi = data?._embedded?.searchResult?._embedded?._embedded?.indexableObject?.map((indexableObject: any) => {
              const image = indexableObject?._embedded?.image;
              const scope = indexableObject?._embedded?.scope;
              const pathFile = indexableObject.url ? indexableObject.url : `${this.backendApiFile}${indexableObject.id}/content`;

              // Mapper les données vers un objet Clip
              return {
                id: indexableObject.id,
                url: indexableObject.url,
                pathFile: pathFile,
                itemId: indexableObject.itemId,
                uuid: indexableObject.uuid,
                itemName: indexableObject.itemName,
                itemHandle: indexableObject.itemHandle,
                collectionId: indexableObject.collectionId,
                score: image?.score,
                name: image?.name,
                scope: scope
              } as Ai;
            }) || [];

            //console.log(this.clips);
          });
      } catch (error) {
        console.error('An error occurred:', error);
        // Handle the error as needed
      }
    });
  }

  onSearch(): void {
    // Mettez à jour la valeur de l'URL avec la nouvelle recherche
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { query: this.searchQuery, url:null },
      queryParamsHandling: 'merge',
    });
    this.listeAi = [];
    // Récupérez les images en fonction de la nouvelle recherche
    this.images$ = this.aiService.getImages(this.searchQuery, null, this.scope);
  }

  clearSearchQuery(): void {
    this.searchQuery = '';
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Fonction pour retourner à la page précédente
  retour(): void {
    this.location.back();
  }

  // Fonction pour charger plus des elements sur la page
  loadMore() {
    this.defaultItemCount += 6;
  }

  // Ajouter une marque sur l'image pour la recherhe par url
  selectedImageId(aiId: string): boolean {
    // Extrait l'ID de l'URL
    const url = decodeURIComponent(window.location.href);
    // Recherche de la sous-chaîne "bitstreams/" dans l'URL
    const startIndex = url.indexOf("bitstreams/") + "bitstreams/".length;
    // Si startIndex est -1, cela signifie que la sous-chaîne n'a pas été trouvée
    if (startIndex === -1) {
      return false;
    }
    // Extrait l'ID après "bitstreams%2F"
    let idFromUrl = url.substring(startIndex);
    // Enlève la dernière partie de l'ID s'il y a "/content"
    const contentIndex = idFromUrl.indexOf("/content");
    if (contentIndex !== -1) {
      idFromUrl = idFromUrl.substring(0, contentIndex);
    }
    // Compare les ID
    return aiId === idFromUrl;
  }

}
