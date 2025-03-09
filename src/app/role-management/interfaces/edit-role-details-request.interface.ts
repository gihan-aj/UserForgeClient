export interface EditRoleDetailsRequest {
  roleId: string;
  roleName: string;
  description: string | null | undefined;
  appId: number;
}
