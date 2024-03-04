import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClipService } from '../../service/clip.service';
import { Clip } from '../../models/Clip';
import {ActivatedRoute, Router} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap } from "rxjs/operators";
import {config} from "../../config/config";

@Component({
  selector: 'ds-clip-search',
  templateUrl: './clip-search.component.html',
  styleUrls: ['./clip-search.component.scss']
})
export class ClipSearchComponent implements OnInit, OnDestroy {
  images$: Observable<Clip[]>;
  query: string = null;
  scope: string = null;
  size: number = 12;
  clips: Clip[] = [];
  backendApiFile: string = config.backendApiFile;
  searchQuery: string = '';

  private subscription: Subscription;

  constructor(private clipService: ClipService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Extraire les variables de l'URL pour la recherche
      if (params['query']) {
        this.query = params['query'];
      }
      if (params['scope']) {
        this.scope = params['scope'];
      }

      // Récupérer les images en fonction des paramètres de recherche
      this.images$ = this.clipService.getImages(this.query, null, this.scope, this.size);

      this.subscription = this.images$.subscribe(
        (data: any) => {
          // Extraire et mapper les données pertinentes vers des objets Clip
          this.clips = data?._embedded?.searchResult?._embedded?._embedded?.indexableObject?.map((indexableObject: any) => {
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
            } as Clip;
          }) || [];

          console.log(this.clips);
        },
        error => {
          //console.error('Error fetching images', error);
          // Handle the error as needed
        }
      );
    });
  }

  onSearch(): void {
    // Mettez à jour la valeur de l'URL avec la nouvelle recherche
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { query: this.searchQuery },
      queryParamsHandling: 'merge',
    });

    // Récupérez les images en fonction de la nouvelle recherche
    this.images$ = this.clipService.getImages(this.searchQuery, null, this.scope, this.size);
  }

  clearSearchQuery(): void {
    this.searchQuery = '';
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
