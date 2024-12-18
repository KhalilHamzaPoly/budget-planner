import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FinancialDataService } from '../financial-data.service';  // Adjust the path if needed

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],  // Note: styleUrls (plural) not styleUrl
})
export class TodoComponent implements OnInit {
  public todoform: any;
  public selectedMonth: string | null = null;
  public financialData: any;
  public monthSelected = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private financialDataService: FinancialDataService
  ) {}

  ngOnInit(): void {
    this.todoform = this.fb.group({
      month: ['', Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: ['', Validators.required],
    });

    // Load financial data from the service
    this.financialData = this.financialDataService.getFinancialData();
  }

  public onSubmitExpense(): void {
    if (this.todoform.valid && this.selectedMonth) {
      const newExpense = { ...this.todoform.value, selected: false };
  
      // Add the new expense to the selected month's data
      if (this.financialData[this.selectedMonth]) {
        this.financialData[this.selectedMonth].Expenses.push(newExpense);
      }
  
      // Reset the form but keep the selected month
      const selectedMonthValue = this.selectedMonth;
      this.todoform.reset();
      this.todoform.patchValue({ month: selectedMonthValue });
    }
  }
  

  public toggleSelection(expense: any): void {
    expense.selected = !expense.selected;
  }

  public onChangeExpense(event: any): void {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
  }

  public monthKeys(): string[] {    
    if (this.financialData && typeof this.financialData === 'object') {
      
        return Object.keys(this.financialData);
    }
    return [];
  }

  public getFilteredExpense(): any[] {
    if (this.selectedMonth && this.financialData[this.selectedMonth]) {
      return [...this.financialData[this.selectedMonth].Expenses];
    }
    return [];
  }

  public calculateTotalExpense(month: string): number {
    if (this.financialData[month]) {
      return this.financialData[month].Expenses.reduce((sum: number, expense: any) => sum + expense.expenseAmount, 0);
    }
    return 0;
  }

  public deleteTodo(index: number): void {
    if (this.selectedMonth && this.financialData[this.selectedMonth]?.Expenses) {
      this.financialData[this.selectedMonth].Expenses.splice(index, 1); 
    } else {
      console.warn('Expenses array is undefined for the selected month:', this.selectedMonth);
    }
  }

  public saveForm(): void {
    this.financialDataService.updateFinancialData(this.financialData);
    console.log('Form saved and data persisted');
    this.router.navigate(['/budget-planner/dashboard']);
  }

  public onBack(): void {
    this.router.navigate(['/budget-planner/dashboard']);
  }
}
