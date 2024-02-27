import {Component, OnInit} from '@angular/core';
import {ClipService} from "../../service/clip.service";
import {Clip} from "../../models/Clip";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'ds-clip-search',
  templateUrl: './clip-search.component.html',
  styleUrls: ['./clip-search.component.scss']
})
export class ClipSearchComponent implements OnInit {
  images$: Observable<Clip[]>;
  query: string = null;
  scope: string = null;
  size: number = 12;

  constructor(private clipService: ClipService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Extraire les variables de l'URL pour la recherche
      if (params['query']) {
        this.query = params['query'];
      }
      if (params['scope']) {
        this.scope = params['scope'];
      }
    });

    // Appeler la méthode du service pour récupérer les images
    this.images$ = this.clipService.getImages(this.query, null, this.scope, this.size);
  }
}
