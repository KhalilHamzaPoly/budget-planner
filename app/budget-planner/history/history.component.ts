import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FinancialDataService } from '../financial-data.service';
import { SideNavComponent } from "../side-nav/side-nav.component";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, SideNavComponent],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public todoform!: FormGroup;
  public selectedMonth: string | null = null;
  public financialData: any;
  public monthSelected = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private financialDataService: FinancialDataService
  ) {}

  ngOnInit(): void {
    this.financialData = this.financialDataService.getFinancialData();
    this.initializeForm();
  }

  private initializeForm(): void {
    this.todoform = this.fb.group({
      month: ['', Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: ['', Validators.required],
    });
  }

  public toggleSelection(expense: any): void {
    expense.selected = !expense.selected;
  }

  public onChangeExpense(event: any): void {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
    this.getFilteredExpense();
    console.log('Selected month:', this.selectedMonth);
  }

  public monthKeys(): string[] {    
    if (this.financialData && typeof this.financialData === 'object') {
      
        return Object.keys(this.financialData);
    }
    return [];
  }

  private getExpensesForMonth(month: string): any[] {
    if (this.financialData && this.financialData[month]) {
      return this.financialData[month].Expenses || [];
    }
    return [];
  }

  public calculateTotalExpense(month: string | null): number {
    if (!month) return 0;
    let totalExpense = 0;
    for (const expense of this.getExpensesForMonth(month)) {
      totalExpense += expense.expenseAmount;
    }
    return totalExpense;
  }

  public getFilteredExpense(): any[] {
    if (!this.selectedMonth) return [];
    return this.getExpensesForMonth(this.selectedMonth);
  }

  public onSubmitExpense(): void {
    if (this.todoform.valid && this.selectedMonth) {
      const newExpense = this.todoform.value;

      if (this.financialData && this.financialData[this.selectedMonth]) {
        this.financialData[this.selectedMonth].Expenses.push(newExpense);
      }

      const selectedMonthValue = this.selectedMonth;
      this.todoform.reset();
      this.todoform.patchValue({ month: selectedMonthValue });
    }
  }

  public saveForm(): void {
    this.financialDataService.updateFinancialData(this.financialData);
    console.log('Form saved and data persisted');
  }

  public onBack(): void {
    this.router.navigate(['/budget-planner/dashboard']);
  }
}
