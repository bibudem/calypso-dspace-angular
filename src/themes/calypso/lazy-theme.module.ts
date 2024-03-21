import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRegistriesModule } from '../../app/admin/admin-registries/admin-registries.module';
import { AdminSearchModule } from '../../app/admin/admin-search-page/admin-search.module';
import {
  AdminWorkflowModuleModule
} from '../../app/admin/admin-workflow-page/admin-workflow.module';
import {
  BitstreamFormatsModule
} from '../../app/admin/admin-registries/bitstream-formats/bitstream-formats.module';
import {
  CollectionFormModule
} from '../../app/collection-page/collection-form/collection-form.module';
import { CommunityFormModule } from '../../app/community-page/community-form/community-form.module';
import { CoreModule } from '../../app/core/core.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditItemPageModule } from '../../app/item-page/edit-item-page/edit-item-page.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IdlePreloadModule } from 'angular-idle-preload';
import {
  JournalEntitiesModule
} from '../../app/entity-groups/journal-entities/journal-entities.module';
import { MyDspaceSearchModule } from '../../app/my-dspace-page/my-dspace-search.module';
import { MenuModule } from '../../app/shared/menu/menu.module';
import { NavbarModule } from '../../app/navbar/navbar.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfilePageModule } from '../../app/profile-page/profile-page.module';
import { RegisterEmailFormModule } from '../../app/register-email-form/register-email-form.module';
import {
  ResearchEntitiesModule
} from '../../app/entity-groups/research-entities/research-entities.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SearchPageModule } from '../../app/search-page/search-page.module';
import { SharedModule } from '../../app/shared/shared.module';
import { StatisticsModule } from '../../app/statistics/statistics.module';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { TranslateModule } from '@ngx-translate/core';
import { HomePageModule } from '../../app/home-page/home-page.module';
import { AppModule } from '../../app/app.module';
import { ItemPageModule } from '../../app/item-page/item-page.module';
import { RouterModule } from '@angular/router';
import { CommunityListPageModule } from '../../app/community-list-page/community-list-page.module';
import { InfoModule } from '../../app/info/info.module';
import { StatisticsPageModule } from '../../app/statistics-page/statistics-page.module';
import { CommunityPageModule } from '../../app/community-page/community-page.module';
import { CollectionPageModule } from '../../app/collection-page/collection-page.module';
import { SubmissionModule } from '../../app/submission/submission.module';
import { MyDSpacePageModule } from '../../app/my-dspace-page/my-dspace-page.module';
import { SearchModule } from '../../app/shared/search/search.module';
import {
  ResourcePoliciesModule
} from '../../app/shared/resource-policies/resource-policies.module';
import { ComcolModule } from '../../app/shared/comcol/comcol.module';
import { RootModule } from '../../app/root.module';
import { BrowseByPageModule } from '../../app/browse-by/browse-by-page.module';
import { ResultsBackButtonModule } from '../../app/shared/results-back-button/results-back-button.module';
import { SharedBrowseByModule } from '../../app/shared/browse-by/shared-browse-by.module';
import {ItemVersionsModule} from "../../app/item-page/versions/item-versions.module";
import {ItemSharedModule} from "../../app/item-page/item-shared.module";
import { HomePageComponent } from './app/home-page/home-page.component';
import {VedetteListeComponent} from "./app/home-page/vedette-liste/vedette-liste.component";
import {HomeNewsComponent} from "./app/home-page/home-news/home-news.component";
import {CollectionPageComponent} from "./app/collection-page/collection-page.component";
import {VedetteCollListeComponent} from "./app/collection-page/vedette-coll-liste/vedette-coll-liste.component";
import {EditItemTemplatePageComponent} from "./app/collection-page/edit-item-template-page/edit-item-template-page.component";
import { DsoEditMetadataComponent } from './app/dso-shared/dso-edit-metadata/dso-edit-metadata.component';
import { DsoSharedModule } from '../../app/dso-shared/dso-shared.module';
import {SystemWideAlertModule} from "../../app/system-wide-alert/system-wide-alert.module";
import {NgxGalleryModule} from "@kolkov/ngx-gallery";
import {FormModule} from "../../app/shared/form/form.module";
import {RequestCopyModule} from "../../app/request-copy/request-copy.module";
import {DsoPageModule} from "../../app/shared/dso-page/dso-page.module";
import { BrowseByComponent } from './app/shared/browse-by/browse-by.component';
import {ItemPageComponent} from "./app/item-page/simple/item-page.component";
import {SearchResultsComponent} from "./app/shared/search/search-results/search-results.component";
import {AiSearchComponent} from "./app/ai-search/ai-search.component";
import {TopLevelCommunityListComponent} from "./app/home-page/top-level-community-list/top-level-community-list.component";
import {UntypedItemComponent} from "./app/item-page/simple/item-types/untyped-item/untyped-item.component";



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
  AiSearchComponent,
  TopLevelCommunityListComponent,
  UntypedItemComponent
];

@NgModule({
  imports: [
    AdminRegistriesModule,
    AdminSearchModule,
    AdminWorkflowModuleModule,
    AppModule,
    RootModule,
    BitstreamFormatsModule,
    CollectionFormModule,
    CollectionPageModule,
    CommonModule,
    CommunityFormModule,
    CommunityListPageModule,
    CommunityPageModule,
    CoreModule,
    DragDropModule,
    ItemSharedModule,
    ItemPageModule,
    EditItemPageModule,
    ItemVersionsModule,
    FormsModule,
    HomePageModule,
    HttpClientModule,
    IdlePreloadModule,
    InfoModule,
    JournalEntitiesModule,
    MenuModule,
    DsoPageModule,
    MyDspaceSearchModule,
    NavbarModule,
    NgbModule,
    ProfilePageModule,
    RegisterEmailFormModule,
    ResearchEntitiesModule,
    RouterModule,
    ScrollToModule,
    SearchPageModule,
    SharedModule,
    SharedBrowseByModule,
    ResultsBackButtonModule,
    StatisticsModule,
    StatisticsPageModule,
    StoreModule,
    StoreRouterConnectingModule,
    TranslateModule,
    SubmissionModule,
    MyDSpacePageModule,
    MyDspaceSearchModule,
    SearchModule,
    FormsModule,
    ResourcePoliciesModule,
    ComcolModule,
    DsoSharedModule,
    SystemWideAlertModule,
    NgxGalleryModule,
    FormModule,
    RequestCopyModule,
    BrowseByPageModule
  ],
  declarations: DECLARATIONS,
  exports: [
  ]
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
