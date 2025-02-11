import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PermissionDetails } from '../../permissions/interfaces/permission-details.interface';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  permissions$ = this.permissionsSubject.asObservable();

  private baseUrl = `${environment.baseUrl}/permissions`;
  
  constructor(private http: HttpClient) {}

  getAllPermssions(): Observable<PermissionDetails[]> {
    const url = this.baseUrl;
    return this.http.get<PermissionDetails[]>(url);
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
