import { Router } from '@angular/router';

import { AppConfig } from '../../../config/app-config.interface';
import { DefaultAppConfig } from '../../../config/default-app-config';
import { reloadGuard } from './reload.guard';

describe('reloadGuard', () => {
  let guard: any;
  let router: Router;
  let appConfig: AppConfig;

  beforeEach(() => {
    router = jasmine.createSpyObj('router', ['parseUrl', 'createUrlTree']);
    appConfig = new DefaultAppConfig();
    guard = reloadGuard;
  });

  describe('canActivate', () => {
    let route;

    describe('when the route\'s query params contain a redirect url', () => {
      let redirectUrl;

      beforeEach(() => {
        redirectUrl = '/redirect/url?param=extra';
        route = {
          queryParams: {
            redirect: redirectUrl,
          },
        };
      });

      it('should create a UrlTree with the redirect URL', () => {
        guard(route, undefined, appConfig, router);
        expect(router.parseUrl).toHaveBeenCalledWith(redirectUrl.substring(1));
      });
    });

    describe('when the route\'s query params doesn\'t contain a redirect url', () => {
      beforeEach(() => {
        route = {
          queryParams: {},
        };
      });

      it('should create a UrlTree to home', () => {
        guard(route, undefined, appConfig, router);
        expect(router.createUrlTree).toHaveBeenCalledWith(['home']);
      });
    });
  });
});
