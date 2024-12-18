import { Injectable } from '@angular/core';
import { financialData } from '../financial-data';  

@Injectable({
  providedIn: 'root'
})
export class FinancialDataService {
  private data: any;
  private _currentMonthSavings: number = 0;
  private _hasChanges: boolean = false; // this var is not used too lazy to delete everything related to it

  constructor() {
    this.data = this.loadFinancialData();
  }

  get currentMonthSavings(): number {
    return this._currentMonthSavings;
  }

  set currentMonthSavings(value: number) {
    this._currentMonthSavings = value;
    this._hasChanges = true;
  }

  get hasChanges(): boolean {
    return this._hasChanges;
  }

  public resetChanges(): void {
    this._hasChanges = false; 
  }

  private loadFinancialData() {
    const savedData = localStorage.getItem('financialData');
    if (savedData) {
      console.log('Loaded from localStorage:', JSON.parse(savedData));
      return JSON.parse(savedData);
    } else {
      console.log('Initialized with default financialData:', financialData);
      return financialData;
    }
  }

  public getFinancialData() {
    return this.data;
  }

  public updateFinancialData(updatedData: any) {
    this.data = updatedData;
    this.saveFinancialData();
    this._hasChanges = true;
  }

  private saveFinancialData() {
    console.log('Saving to localStorage:', this.data);
    localStorage.setItem('financialData', JSON.stringify(this.data));
  }
}
