import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {ThemedLoadingComponent} from "../../../app/shared/loading/themed-loading.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TranslateModule} from '@ngx-translate/core';
import {Page1Component} from "./page1/page1.component";
import {Page2Component} from "./page2/page2.component";


@Component({
  selector: 'ds-pages',
  templateUrl: './pages.component.html',
  standalone: true,
  imports: [ThemedLoadingComponent, TranslateModule, RouterModule,  NgbModule, Page1Component, Page2Component ],
})
export class PagesComponent implements OnInit {

  // Variables pour le suivi des pages actives
  page1 = false;
  page2 = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer le nom de la page à partir des paramètres de l'URL
    const namePage = this.route.snapshot.paramMap.get("page");

    // Vérifier le nom de la page et activer les variables correspondantes
    switch (namePage) {
      case 'page1':
        this.page1 = true;
        break;
      case 'page2':
        this.page2 = true;
        break;
      default:
        // Redirection vers la page "not-found" en cas de nom de page inconnu
        this.reload('not-found');
        break;
    }
  }

  // Fonction de rechargement d'URL
  reload(url: string): Promise<boolean> {
    this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }
}
