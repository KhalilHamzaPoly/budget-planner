import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';

import { BudgetPlannerRoutingModule } from './budget-planner-routing.module';
import { NotificationDialogComponent } from './notification-dialog/notification-dialog.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  imports: [
    CommonModule,
    BudgetPlannerRoutingModule,
    MatDialogModule,
    MatBadgeModule,
    NotificationsComponent,
  ],

  declarations: [NotificationDialogComponent],
})
export class BudgetPlannerModule {}
