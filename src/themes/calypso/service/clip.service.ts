// clip.service.ts

import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import {Clip} from "../models/Clip";

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  private urlApi = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getImages(query: string, url: string, scope: string, size: number): Observable<Clip[]> {
    const apiUrl = `${this.urlApi}/search`;

    let params = new HttpParams();

    if (query) {
      params = params.set('query', query);
    }
    if (url) {
      params = params.set('url', url);
    }
    if (scope) {
      params = params.set('scope', scope);
    }
    if (size) {
      params = params.set('size', size.toString());
    }

    return this.fetchImages(apiUrl, params).pipe(shareReplay(1));
  }

  private fetchImages(apiUrl: string, params: any): Observable<any> {
    return this.http.get<any>(apiUrl, { params }).pipe(
      map((response: any) => {
        // Assurez-vous que la structure de la réponse correspond à vos besoins
        const indexableObjects = response._embedded.searchResult._embedded._embedded.indexableObject;
        return Array.isArray(indexableObjects) ?
          indexableObjects.map((item: any) => ({
            id: item.id,
            url: item.url,
            itemId: item.itemId,
            uuid: item.uuid,
            itemName: item.itemName,
            itemHandle: item.itemHandle,
            collectionId: item.collectionId,
            imageId: item._embedded.image.id,
            score: item._embedded.image.score,
            name: item._embedded.image.name,
            scope: item._embedded.scope,
          })) : [];
      }),
      catchError((error) => {
        console.error('Error fetching images', error);
        return throwError(error);
      })
    );
  }
}
