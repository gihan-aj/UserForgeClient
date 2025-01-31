import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserPageLoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  show() {
    this.loadingSubject.next(true);
  }
  hide() {
    this.loadingSubject.next(false);
  }

  loadingStatus(status: boolean) {
    this.loadingSubject.next(status);
  }
}
