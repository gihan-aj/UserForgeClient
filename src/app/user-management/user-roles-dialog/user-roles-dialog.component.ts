import { Component, inject, signal } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { UserRolesDialog } from './user-roles-dialog.interface';
import { DialogMode } from '../../shared/enums/dialog-mode.enum';
import { FormatTitlePipe } from '../../shared/pipes/format-title.pipe';

@Component({
  selector: 'app-user-roles-dialog',
  imports: [
    MatListModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FormatTitlePipe,
  ],
  templateUrl: './user-roles-dialog.component.html',
  styleUrl: './user-roles-dialog.component.scss',
})
export class UserRolesDialogComponent {
  readonly dialogRef = inject(MatDialogRef<UserRolesDialogComponent>);
  data = inject<UserRolesDialog>(MAT_DIALOG_DATA);

  dialogMode = DialogMode;
  mode = signal<DialogMode>(this.data.mode);
}
