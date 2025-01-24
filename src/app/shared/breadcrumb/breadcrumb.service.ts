import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { BreadcrumbItem } from './breadcrumb-item.interface';
import {
  ActivatedRouteSnapshot,
  Data,
  NavigationEnd,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly breadcrumbsSubject = new BehaviorSubject<BreadcrumbItem[]>(
    []
  );
  readonly breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  private readonly breadcrumb = 'breadcrumb';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const breadcrumbs: BreadcrumbItem[] = [];
        const root = this.router.routerState.snapshot.root;

        this.addBreadcrumb(root, [], breadcrumbs);

        this.breadcrumbsSubject.next(breadcrumbs);
      });
  }

  private addBreadcrumb(
    route: ActivatedRouteSnapshot,
    parentUrl: string[],
    breadcrumbs: BreadcrumbItem[]
  ) {
    if (route) {
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path));

      if (route.data[this.breadcrumb]) {
        const breadcrumbName = this.getName(route.data);
        const breadcrumb: BreadcrumbItem = {
          name: breadcrumbName,
          url: '/' + routeUrl.join('/'),
        };

        breadcrumbs.push(breadcrumb);
      }

      if (route.firstChild) {
        this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
      }
    }
  }

  private getName(data: Data) {
    return typeof data[this.breadcrumb] === 'function'
      ? data[this.breadcrumb](data)
      : data[this.breadcrumb];
  }
}
