import { Component} from '@angular/core';
import {ThemedLoadingComponent} from "../../../../../app/shared/loading/themed-loading.component";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'ds-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss'],
  standalone: true,
  imports: [ThemedLoadingComponent, TranslateModule, RouterModule, NgbModule],
})
export class Page1Component {

}
