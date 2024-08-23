import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Transaction } from '../maintenance/maintenance.component';
import { MaterialModule } from '../material/material.module';
import { NumberConversionAddSymbolPipe } from '../number-conversion-add-symbol.pipe';

@Component({
  selector: 'income-expendetur-table',
  standalone: true,
  imports: [MaterialModule, NumberConversionAddSymbolPipe],
  templateUrl: './income-expendetur-table.component.html',
  styleUrls: ['./income-expendetur-table.component.scss'],
})
export class IncomeExpendeturTableComponent implements OnInit {
  @Input() type: 'CREDIT' | 'DEBIT' = 'CREDIT';
  @Input() transactions: Transaction[] = [];

  columns: string[] = ['id', 'date', 'description', 'amount'];
  dataSource = new MatTableDataSource<Transaction>();
  transactionsToDisplay: Transaction[] = [];

  ngOnInit(): void {
    this.transactionsToDisplay = this.transactions.filter(
      (t) => t.type == this.type
    );
    this.dataSource.data = this.transactionsToDisplay;
  }
}
