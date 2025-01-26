import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Alert } from './alert.interface';

@Component({
  selector: 'app-alert',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AlertComponent>);
  readonly data = inject<Alert>(MAT_DIALOG_DATA);

  constructor() {
    this.dialogRef.addPanelClass('danger');
  }

  ngOnInit(): void {
    this.dialogRef.addPanelClass('danger');
  }

  onOk(): void {
    this.dialogRef.close();
  }
}
