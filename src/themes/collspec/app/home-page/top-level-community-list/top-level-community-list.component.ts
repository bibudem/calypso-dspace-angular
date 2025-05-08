import { AsyncPipe } from '@angular/common';
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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-themed-top-level-community-list',
  styleUrls: ['./top-level-community-list.component.scss'],
  //styleUrls: ['../../../../../app/home-page/top-level-community-list/top-level-community-list.component.scss'],
  templateUrl: './top-level-community-list.component.html',
  //templateUrl: '../../../../../app/home-page/top-level-community-list/top-level-community-list.component.html',
  standalone: true,
  imports: [VarDirective, ObjectCollectionComponent, ErrorComponent, ThemedLoadingComponent, AsyncPipe, TranslateModule, RouterModule, CommonModule],
})

export class TopLevelCommunityListComponent extends BaseComponent  implements OnInit, OnDestroy{
  collections: any[] = [];
  allSousommunities: any[] = [];
  displayedSouscommunities: any[] = [];
  souscommunitiesPerPage = 4;

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
      if (community && community._links && community._links.subcommunities) {
        // Appelez la méthode findByHref de CollectionDataService pour récupérer les données de la collection
        this.collService.findByHref(community._links.subcommunities.href).pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe((subcommunitieData) => {
          if(subcommunitieData && subcommunitieData.payload){
            const subcommunitiesPageLinks = (subcommunitieData.payload._links as any).page;
            //console.log(subcommunitiesPageLinks);
            subcommunitiesPageLinks.forEach((subcommunitieLink) => {
              const subcommunitieUrl = subcommunitieLink.href;
              // Effectuez une requête HTTP pour récupérer les données de la collection individuelle
              this.collService.findByHref(subcommunitieUrl).pipe(
                takeUntil(this.unsubscribe$)
              ).subscribe((individualSubcommunitieData) => {
                if (individualSubcommunitieData && individualSubcommunitieData.payload && individualSubcommunitieData.payload._links) {
                  let description = null;
                  if(individualSubcommunitieData.payload.metadata['dc.description']){
                    description = individualSubcommunitieData.payload.metadata['dc.description'][0].value;
                  }
                  const subcommunitie = {
                    title: individualSubcommunitieData.payload.metadata['dc.title'][0].value,
                    description: description,
                    id: individualSubcommunitieData.payload.id,
                    vedette: null
                  };
                  // Récupérez les images vedette de la collection
                  this.vedetteService.getImagesColl(subcommunitie.id).pipe(
                    takeUntil(this.unsubscribe$)
                  ).subscribe(
                    (images: Vedette[]) => {
                      if (images.length !== 0) {
                        subcommunitie.vedette = images[0].imageUrl;
                      }
                    },
                    (erreur) => {
                      console.error('Une erreur s\'est produite lors de la récupération des images vedette', erreur);
                    }
                  );
                  // Mettez à jour la variable collections$ avec les nouvelles collections
                  this.allSousommunities.push(subcommunitie);
                  this.displayedSouscommunities = this.allSousommunities.slice(0, this.souscommunitiesPerPage);
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
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadMore() {
    alert(this.allSousommunities.length +'-'+ this.souscommunitiesPerPage);
    const next = this.displayedSouscommunities.length + this.souscommunitiesPerPage;
    this.displayedSouscommunities = this.allSousommunities.slice(0, next);
  }

}

