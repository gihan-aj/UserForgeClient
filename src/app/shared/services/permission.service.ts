import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PermissionDetails } from '../../permissions/interfaces/permission-details.interface';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { APP_ID } from '../constants/query-params';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  permissions$ = this.permissionsSubject.asObservable();

  private baseUrl = `${environment.baseUrl}/permissions`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

  getAllPermssions(appId: number): Observable<PermissionDetails[]> {
    const url = this.baseUrl;
    let queryParams = new HttpParams();
    queryParams = queryParams.append(APP_ID, appId.toString());

    return this.http
      .get<PermissionDetails[]>(url, { params: queryParams })
      .pipe(
        catchError((error) => {
          this.errorHandler.handle(error);
          return throwError(() => error);
        })
      );
  }

  setpermissions(permissions: string[]) {
    this.permissionsSubject.next(permissions);
  }

  userHasPermissions(): boolean {
    return this.permissionsSubject.value.length > 0;
  }

  hasPermission(permission: string): boolean {
    // console.log('user checked for permission: ', permission);
    return this.permissionsSubject.value.includes(permission);
  }

  hasAnyPermission(prefix: string): boolean {
    return this.permissionsSubject.value.some((p) => p.startsWith(prefix));
  }

  clearAllPermissions() {
    this.permissionsSubject.next([]);
  }
}
