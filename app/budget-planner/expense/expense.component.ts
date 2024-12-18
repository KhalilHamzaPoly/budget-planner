import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FinancialDataService } from '../financial-data.service'; 

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  public expenseForm!: FormGroup;
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
    this.expenseForm = this.fb.group({
      month: ['', Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  public onChangeExpense(event: any): void {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
    this.getFilteredExpenses();
  }

  public monthKeys(): string[] {    
    if (this.financialData && typeof this.financialData === 'object') {
      
        return Object.keys(this.financialData);
    }
    return [];
  }

  public calculateTotalExpense(month: string): number {
    let totalExpense = 0;
    for (const expense of this.getExpensesForMonth(month)) {
      totalExpense += +expense.expenseAmount;
    }
    return totalExpense;
  }

  private getExpensesForMonth(month: string): any[] {
    if (this.financialData && this.financialData[month]) {
      return this.financialData[month].Expenses || [];
    }
    return [];
  }

  public getFilteredExpenses(): any[] {
    if (this.selectedMonth && this.financialData[this.selectedMonth]) {
      return [...this.financialData[this.selectedMonth].Expenses];
    }
    return [];
  }

  public onSubmitExpense(): void {
    if (this.expenseForm.valid && this.selectedMonth) {
      const newExpense = this.expenseForm.value;

      if (this.financialData && this.financialData[this.selectedMonth]) {
        this.financialData[this.selectedMonth].Expenses.push(newExpense);
      }

      const selectedMonthValue = this.selectedMonth;
      this.expenseForm.reset();
      this.expenseForm.patchValue({ month: selectedMonthValue });
    }
  }

  public deleteExpense(index: number): void {
    if (this.selectedMonth && this.financialData[this.selectedMonth]?.Expenses) {
      this.financialData[this.selectedMonth].Expenses.splice(index, 1); 
    } else {
      console.warn('Expenses array is undefined for the selected month:', this.selectedMonth);
    }
  }
  

  public saveForm(): void {
    this.financialDataService.updateFinancialData(this.financialData);
    console.log("Form saved and data persisted");
    this.router.navigate(['/budget-planner/dashboard']);
  }

  public onBack(): void {
    this.router.navigate(['/budget-planner/dashboard']);
  }
}
