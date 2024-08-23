import { Injectable } from '@angular/core';
import { Transaction } from './maintenance/maintenance.component';
import { HttpClient } from '@angular/common/http';
import { MonthlyTransaction } from './view-data/view-data.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl: string = 'https://localhost:7225/api/Transaction/'

  constructor(private http: HttpClient) { }

  upseTransaction(transaction: Transaction){
    return this.http.post<Transaction>(
      this.baseUrl + 'Upsert',
      transaction)
  }

  GetAllTransaction(){
    return this.http.get<Transaction[]>(
      this.baseUrl +'GetAll'
      )
  }

  deleteTransaction(id: number){
    return this.http.delete(this.baseUrl + 'Delete/' + id,{
      responseType: 'text'
    });
  }

  getMonthlyTransaction(){
    return this.http.get<MonthlyTransaction[]>(
      this.baseUrl + 'GetMonthlyTransactions'
    )
  }

}
