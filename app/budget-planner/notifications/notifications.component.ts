import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';
import { NotificationService } from '../notification.service';  
import { FinancialDataService } from '../financial-data.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [MatIconModule, MatBadgeModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  public notificationCount = 0;

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,  
    private financialDataService: FinancialDataService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.notificationCount = this.notificationService.getNotificationCount();
    console.log("this is in notifs component: ",this.notificationCount);
    this.cdr.detectChanges();
    this.checkCurrentMonthSavings();
  }

  public toggleNotifs(): void {
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      width: '300px',
      position: {
        top: '70px',  
        right: '20px' 
      },
      data: { notifications: this.notificationService.getNotifications() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'clear') {
        this.notificationService.clearNotifications();
        this.notificationCount = 0;
      }
    });
  }

  private checkCurrentMonthSavings(): void {
    const currentMonthSavings = this.financialDataService.currentMonthSavings;
    if (currentMonthSavings < 0) {
      // this.notificationService.addNotification(currentMonthSavings);
      // this.notificationCount = this.notificationService.getNotificationCount();
      // this.notificationCount++;
      // console.log("this is inside checkcurrentsavings: ",this.notificationCount); 
    }
  }
}
