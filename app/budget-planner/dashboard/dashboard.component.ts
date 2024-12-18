import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FinancialDataService } from '../financial-data.service';
import { NotificationService } from '../notification.service';
import { NotificationsComponent } from "../notifications/notifications.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, SideNavComponent, CommonModule, NotificationsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public financialData: any;

  public lastMonthsIncome: string[] = [];
  public currentMonthIncome: string = '';

  public lastMonthsExpenses: string[] = [];
  public currentMonthExpenses: string = '';

  public totalCurrentMonthIncome = 0;
  public totalCurrentMonthExpenses = 0;

  public todoTransactions = [
    { description: 'Pay electricity bill' },
    { description: 'Submit monthly report' },
    { description: 'Buy groceries' },
    { description: 'Call insurance company' }
  ];

  constructor(
    private router: Router,
    private financialDataService: FinancialDataService,
    private notificationService: NotificationService  
  ) {}

  ngOnInit(): void {
    this.financialData = this.financialDataService.getFinancialData();

    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    const currentMonth = new Intl.DateTimeFormat('en-US', options).format(currentDate);

    this.calculateIncomeAndExpenses(currentMonth);

    const notifArray = this.notificationService.notifarray;
    const lastNotifItem = notifArray.length > 0 ? notifArray[notifArray.length - 1].amount : undefined;

    if (lastNotifItem !== this.currentMonthSavings) {
      this.updateCurrentMonthSavings();
      const savings = this.currentMonthSavings;
      if (savings < 0) {
        this.notificationService.addNotification(savings);
        this.financialDataService.resetChanges(); 
      }else {
        this.notificationService.clearNotifications();
      }
    }
  }

  private calculateIncomeAndExpenses(currentMonth: string): void {
    const months = Object.keys(this.financialData);
    const currentIndex = months.indexOf(currentMonth);

    if (currentIndex !== -1) {
      const currentMonthData = this.financialData[currentMonth];
      this.totalCurrentMonthIncome = currentMonthData.Income.reduce((sum: number, income: any) => sum + +income.amount, 0);
      this.totalCurrentMonthExpenses = currentMonthData.Expenses.reduce((sum: number, expense: any) => sum + +expense.expenseAmount, 0);

      this.currentMonthIncome = `$${this.totalCurrentMonthIncome}`;
      this.currentMonthExpenses = `$${this.totalCurrentMonthExpenses}`;

      for (let i = currentIndex - 1; i >= Math.max(0, currentIndex - 3); i--) {
        const month = months[i];
        const incomeSum = this.financialData[month].Income.reduce((sum: number, income: any) => sum + +income.amount, 0);
        const expensesSum = this.financialData[month].Expenses.reduce((sum: number, expense: any) => sum + +expense.expenseAmount, 0);

        this.lastMonthsIncome.push(`${month}: $${incomeSum}`);
        this.lastMonthsExpenses.push(`${month}: $${expensesSum}`);
      }
    } else {
      console.warn(`Current month "${currentMonth}" is not found in financial data.`);
    }
  }

  private updateCurrentMonthSavings(): void {
    const savings = this.totalCurrentMonthIncome - this.totalCurrentMonthExpenses;
    this.financialDataService.currentMonthSavings = savings;
  }

  public get currentMonthSavings(): number {
    return this.totalCurrentMonthIncome - this.totalCurrentMonthExpenses;
  }

  public onIncome(): void {
    this.router.navigate(['/budget-planner/income']);
  }

  public onExpenses(): void {
    this.router.navigate(['/budget-planner/expense']);
  }

  public onTodo(): void {
    this.router.navigate(['/budget-planner/todo']);
  }
}
