import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { FinancialDataService } from '../financial-data.service';  

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
})
export class IncomeComponent implements OnInit {
  public incomeform: any;
  public selectedMonth: string | null = null;
  public financialData: any;
  public monthSelected = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private financialDataService: FinancialDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.financialData = this.financialDataService.getFinancialData();
    this.initializeForm();
    this.cdr.markForCheck()
  }

  private initializeForm(): void {
    this.incomeform = this.fb.group({
      source: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      month: ['', [Validators.required]],

      investments: ['']
    });
  }

  public onChange(event: any): void {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
    this.getFilteredIncomes();
  }

  public monthKeys(): string[] {
    
    return this.financialData ? Object.keys(this.financialData) : [];

  }

  public calculateTotalIncome(month: string): number {
    let totalIncome = 0;
    for (const income of this.getIncomesForMonth(month)) {
      totalIncome += +income.amount;
    }
    return totalIncome;
  }

  private getIncomesForMonth(month: string): any[] {
    if (this.financialData && this.financialData[month]) {
      return this.financialData[month].Income || [];
    }
    return [];
  }

  public getFilteredIncomes(): any[] {
    if (this.selectedMonth && this.financialData[this.selectedMonth]) {
      return [...this.financialData[this.selectedMonth].Income];
    }
    return [];
  }

  public onSubmit(): void {
    if (this.incomeform.valid && this.selectedMonth) {
      const newIncome = this.incomeform.value;

      if (this.financialData && this.financialData[this.selectedMonth]) {
        this.financialData[this.selectedMonth].Income.push(newIncome);
      }
  
      const selectedMonthValue = this.selectedMonth;
      this.incomeform.reset();
      this.incomeform.patchValue({ month: selectedMonthValue });
      
    }
  }

  public deleteIncome(index: number): void {
    if (this.selectedMonth && this.financialData[this.selectedMonth]?.Income) {
      this.financialData[this.selectedMonth].Income.splice(index, 1); 
    } else {
      console.warn('Expenses array is undefined for the selected month:', this.selectedMonth);
    }
  }
  

  public saveForm(): void {
    this.financialDataService.updateFinancialData(this.financialData);
    this.router.navigate(['/budget-planner/dashboard']);
    console.log("Form saved and data persisted");
  }

  public onBack(): void {
    this.router.navigate(['/budget-planner/dashboard']);
  }
}
