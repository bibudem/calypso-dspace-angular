import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ThemedLoadingComponent } from "../../../app/shared/loading/themed-loading.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from '@ngx-translate/core';
import { Page1Component } from "./page1/page1.component";
import { Page2Component } from "./page2/page2.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-pages',
  templateUrl: './pages.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ThemedLoadingComponent,
    TranslateModule,
    RouterModule,
    NgbModule,
    Page1Component,
    Page2Component
  ],
})
export class PagesComponent implements OnInit {
  currentComponent: any;
  private readonly componentMap: { [key: string]: any } = {
    'page1': Page1Component,
    'page2': Page2Component
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const namePage = params['page'];

      if (namePage && this.componentMap[namePage]) {
        this.currentComponent = this.componentMap[namePage];
      } else {
        this.reload('not-found');
      }

    });
  }

  // Function to reload URL
  reload(url: string): Promise<boolean> {
    return this.router.navigateByUrl('.', { skipLocationChange: true })
      .then(() => this.router.navigateByUrl(url));
  }
}
