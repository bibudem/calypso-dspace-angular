import {
  AsyncPipe,
  CommonModule,
  NgIf,
} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TopLevelCommunityListComponent as BaseComponent } from '../../../../../app/home-page/top-level-community-list/top-level-community-list.component';
import { ErrorComponent } from '../../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { ObjectCollectionComponent } from '../../../../../app/shared/object-collection/object-collection.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subject, forkJoin} from 'rxjs';
import { CommunityDataService } from '../../../../../app/core/data/community-data.service';
import { CollectionDataService } from '../../../../../app/core/data/collection-data.service';
import { APP_CONFIG, AppConfig } from '../../../../../config/app-config.interface';
import { PaginatedList } from '../../../../../app/core/data/paginated-list.model';
import { RemoteData } from '../../../../../app/core/data/remote-data';
import { PaginationService } from '../../../../../app/core/pagination/pagination.service';
import { VedetteService } from '../../../service/vedette.service';
import {map, takeUntil} from 'rxjs/operators';
import { Vedette } from '../../../models/Vedette';
import {hasValue} from "../../../../../app/shared/empty.util";
import { RouterModule } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'ds-top-level-community-list',
  styleUrls: ['./top-level-community-list.component.scss'],
  //styleUrls: ['../../../../../app/home-page/top-level-community-list/top-level-community-list.component.scss'],
  templateUrl: './top-level-community-list.component.html',
  //templateUrl: '../../../../../app/home-page/top-level-community-list/top-level-community-list.component.html',
  standalone: true,
  imports: [VarDirective, NgIf, ObjectCollectionComponent, ErrorComponent, ThemedLoadingComponent, AsyncPipe, TranslateModule, RouterModule, CommonModule],
})

export class TopLevelCommunityListComponent extends BaseComponent  implements OnInit, OnDestroy{
  collections$: Observable<any[]> = of([]);
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private cdsCalypso: CommunityDataService,
    private collService: CollectionDataService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private paginationServiceCalypso: PaginationService,
    private vedetteService: VedetteService
  ) {
    super(appConfig, cdsCalypso, paginationServiceCalypso);
  }

  ngOnInit() {
    super.ngOnInit();

    this.communitiesRD$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((data: RemoteData<PaginatedList<any>>) => {
      if (data.hasSucceeded) {
        data.payload?.page?.forEach((community) => {
          this.findCollections(community);
        });
      }
    });
  }

// Récupérez les collections en fonction de l'ID d'une communauté
  findCollections(community: any) {
    try {
      if (community && community._links && community._links.collections) {
        // Appelez la méthode findByHref de CollectionDataService pour récupérer les données de la collection
        this.collService.findByHref(community._links.collections.href).pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe((collectionData) => {
          if(collectionData && collectionData.payload){
            const collectionsPageLinks = (collectionData.payload._links as any).page;
            collectionsPageLinks.forEach((collectionLink) => {
              const collectionUrl = collectionLink.href;
              // Effectuez une requête HTTP pour récupérer les données de la collection individuelle
              this.collService.findByHref(collectionUrl).pipe(
                takeUntil(this.unsubscribe$)
              ).subscribe((individualCollectionData) => {
                if (individualCollectionData && individualCollectionData.payload && individualCollectionData.payload._links) {
                  let description = null;
                  if(individualCollectionData.payload.metadata['dc.description']){
                    description = individualCollectionData.payload.metadata['dc.description'][0].value;
                  }
                  const collections = {
                    title: individualCollectionData.payload.metadata['dc.title'][0].value,
                    description: description,
                    id: individualCollectionData.payload.id,
                    vedette: null
                  };
                  // Récupérez les images vedette de la collection
                  this.vedetteService.getImagesColl(collections.id).pipe(
                    takeUntil(this.unsubscribe$)
                  ).subscribe(
                    (images: Vedette[]) => {
                      if (images.length !== 0) {
                        collections.vedette = images[0].imageUrl;
                      }
                    },
                    (erreur) => {
                      console.error('Une erreur s\'est produite lors de la récupération des images vedette', erreur);
                    }
                  );
                  // Mettez à jour la variable collections$ avec les nouvelles collections
                  this.collections$ = this.collections$.pipe(
                    map(collectionsArray => [...collectionsArray, collections])
                  );
                }
              });
            });
          }
        });
      }
    } catch (error) {
      console.error('Une erreur s\'est produite :', error);
    }
  }

  ngOnDestroy() {
    if (hasValue(this.currentPageSubscription)) {
      this.currentPageSubscription.unsubscribe();
    }
    this.paginationServiceCalypso.clearPagination(this.config.id);
  }
}


