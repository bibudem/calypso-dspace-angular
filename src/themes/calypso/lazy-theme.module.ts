import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { TranslateModule } from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import { RootModule } from '../../app/root.module';
import { HomePageComponent } from './app/home-page/home-page.component';
import {VedetteListeComponent} from "./app/home-page/vedette-liste/vedette-liste.component";
import {HomeNewsComponent} from "./app/home-page/home-news/home-news.component";
import {CollectionPageComponent} from "./app/collection-page/collection-page.component";
import {VedetteCollListeComponent} from "./app/collection-page/vedette-coll-liste/vedette-coll-liste.component";
import {EditItemTemplatePageComponent} from "./app/collection-page/edit-item-template-page/edit-item-template-page.component";
import { DsoEditMetadataComponent } from './app/dso-shared/dso-edit-metadata/dso-edit-metadata.component';
import {NgxGalleryModule} from "@kolkov/ngx-gallery";
import { BrowseByComponent } from './app/shared/browse-by/browse-by.component';
import {ItemPageComponent} from "./app/item-page/simple/item-page.component";
import {SearchResultsComponent} from "./app/shared/search/search-results/search-results.component";
import {TopLevelCommunityListComponent} from "./app/home-page/top-level-community-list/top-level-community-list.component";
import {AiSearchComponent} from "./app/ai-search/ai-search.component";
import {PagesComponent} from "./pages/pages.component";
import {Page1Component} from "./pages/page1/page1.component";
import {Page2Component} from "./pages/page2/page2.component";
import {FeedbackComponent} from "./app/info/feedback/feedback.component";
import {FeedbackFormComponent} from "./app/info/feedback/feedback-form/feedback-form.component";
import {NavbarComponent} from "./app/navbar/navbar.component";


const DECLARATIONS = [
  HomePageComponent,
  VedetteListeComponent,
  HomeNewsComponent,
  CollectionPageComponent,
  EditItemTemplatePageComponent,
  VedetteCollListeComponent,
  DsoEditMetadataComponent,
  BrowseByComponent,
  ItemPageComponent,
  SearchResultsComponent,
  TopLevelCommunityListComponent,
  NavbarComponent,
  FeedbackComponent,
  FeedbackFormComponent,
  AiSearchComponent,
  PagesComponent,
  Page1Component,
  Page2Component
];

@NgModule({
  imports: [
    RootModule,
    CommonModule,
    DragDropModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule,
    ScrollToModule,
    StoreModule,
    StoreRouterConnectingModule,
    TranslateModule,
    FormsModule,
    NgxGalleryModule,
    ...DECLARATIONS,
  ],

})

  /**
   * This module serves as an index for all the components in this theme.
   * It should import all other modules, so the compiler knows where to find any components referenced
   * from a component in this theme
   * It is purposefully not exported, it should never be imported anywhere else, its only purpose is
   * to give lazily loaded components a context in which they can be compiled successfully
   */
class LazyThemeModule {
}

