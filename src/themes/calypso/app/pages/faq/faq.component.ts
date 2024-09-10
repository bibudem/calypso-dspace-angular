import { Component} from '@angular/core';
import {ThemedLoadingComponent} from "../../../../../app/shared/loading/themed-loading.component";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'ds-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  standalone: true,
  imports: [ThemedLoadingComponent, TranslateModule, RouterModule, NgbModule],
})
export class FaqComponent {

}
