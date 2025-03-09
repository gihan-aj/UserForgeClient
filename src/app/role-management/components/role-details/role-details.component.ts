import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleDetails } from '../../interfaces/role-details.interface';
import { RoleManagementService } from '../../services/role-management.service';
import { RoleDetailsWithPermissions } from '../../interfaces/role-details-with-permissions.interface';

@Component({
  selector: 'app-role-details',
  imports: [],
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.scss',
})
export class RoleDetailsComponent implements OnInit {
  roleId: string | null;
  role: RoleDetailsWithPermissions | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleManagmentService: RoleManagementService
  ) {
    this.roleId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (!this.roleId) {
      this.router.navigate(['/role-management']);
    } else {
      this.roleManagmentService
        .fetchRoleWithPermissions(this.roleId)
        .subscribe((role) => {
          if (role) {
            this.role = role;
          }
        });
    }
  }
}
