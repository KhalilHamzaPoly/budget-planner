import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-dialog',
  template: `
  <div class="dialog-content-container">
  <h2 class="dialog-title">Notifications</h2>
  <hr>
    <ul *ngIf="data.notifications.length > 0">
      <li *ngFor="let notification of data.notifications">
        Your current month savings is now in the negative: {{ notification.amount | currency }} 
      </li>
    </ul>
    <p *ngIf="data.notifications.length === 0">Your current month savings is good</p>
    <button mat-button (click)="clearNotifications()" class="button">Clear Notifications</button>
  </div>
    
  `,
  styleUrls: ['./notification-dialog.component.css']
})
export class NotificationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  clearNotifications(): void {
    this.dialogRef.close('clear');
  }
}
