import { RoleDetails } from "../../interfaces/role-details.interface";
import { RoleDetailsDialog } from "./role-details-dialog.type";

export interface RoleDetailsDialogData {
  mode: RoleDetailsDialog;
  roleDetails? : RoleDetails;
}
