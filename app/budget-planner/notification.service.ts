import { Injectable } from '@angular/core';
import { FinancialDataService } from './financial-data.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: { amount: number }[] = [];

  constructor(private financialDataService: FinancialDataService) {}

  public addNotification(amount: number): void {
    this.notifications.push({ amount });
    this.financialDataService.resetChanges();
    console.log('this func has worked: ', this.financialDataService.hasChanges);
  }

  public get notifarray(): any {
    return this.notifications;
  }

  public getNotifications(): { amount: number }[] {
    return this.notifications;
  }

  public clearNotifications(): void {
    this.notifications = [];
  }

  public getNotificationCount(): number {
    return this.notifications.length;
  }
}
