import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';

export interface Transaction {
  id: number;
  date: Date;
  description: string;
  amount: number;
  type: string;
  createdOn: Date;
}


@Component({
  selector: 'maintenance',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit{
  years: number[] = [];
  months: { index: number; name: string }[] = [];


  transaction: FormGroup = this.fb.group({
    id: this.fb.control(0),
    year: this.fb.control(new Date().getFullYear(), [Validators.required]),
    month: this.fb.control(0, [Validators.required]),
    date: this.fb.control(0,[Validators.required]),
    description: this.fb.control('',[Validators.required]),
    amount: this.fb.control('', [Validators.required]),
    type: this.fb.control('Debit', [Validators.required])
  }, { validators: [this.dateValidators.bind(this)] });

  

  
  dataRetrive = new MatTableDataSource<Transaction>();

  columns = [
    
      'id',
      'date',
      'description',
      'amount',
      'type',
      'createdOn',
      'delete'
        
  ]

  constructor(
    private fb: FormBuilder, 
    private dialog: MatDialog , 
    private snackbar: MatSnackBar,
    private apiService: ApiService
   )

   
   
   {
   //#region for date month and year configuration
    for (let year = new Date().getFullYear(); year >= 2018; year--) {
      this.years.push(year);
    }
    this.months = [
      { index: 1, name: 'January' },
      { index: 2, name: 'February' },
      { index: 3, name: 'March' },
      { index: 4, name: 'April' },
      { index: 5, name: 'May' },
      { index: 6, name: 'June' },
      { index: 7, name: 'July' },
      { index: 8, name: 'August' },
      { index: 9, name: 'September' },
      { index: 10, name: 'October' },
      { index: 11, name: 'November' },
      { index: 12, name: 'December' },
    ];

    // this.dataRetrive.data = [
    //   {
    // id: 1,
    // date: new Date(),
    // description: 'Medical tratement',
    // amount: 1000,
    // type: 'Debit',
    // createdOn: new Date
    //   },

    //   {
    //     id: 2,
    //     date: new Date(),
    //     description: 'Bajar',
    //     amount: 1000,
    //     type: 'Credit',
    //     createdOn: new Date(2023,10,12)
    //       }
    // ]

    // Subscribe to changes in month and year to revalidate the form
    this.transaction.get('month')?.valueChanges.subscribe(() => this.transaction.updateValueAndValidity());
    this.transaction.get('year')?.valueChanges.subscribe(() => this.transaction.updateValueAndValidity());
  }

  ngOnInit(): void {
    this.apiService.GetAllTransaction().subscribe({
      next: (res: Transaction[]) =>{
        this.dataRetrive.data = res;
      },
    })     
    }

  
  dateValidators(control: AbstractControl) {
    const date = control.get('date')?.value;
    const month = control.get('month')?.value;
    const year = control.get('year')?.value;
    const daysInMonth = [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (date <= daysInMonth[month - 1]) {
      control.get('date')?.setErrors(null);
    } else {
      control.get('date')?.setErrors({ invalidDate: true });
    }
  }

  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  //#endregion for date  month and year

  //#region for from control getters
  insertForm(){
    var transaction = {
      id:this.IdControl.value,
      date: new Date(
        this.YearControl.value,
        this.MonthControl.value,
        this.DateControl.value
      ),
      description: this.DescriptionControl.value,
      amount: this.AmountControl.value,
      type: this.TypeControl.value,
      createdOn: new Date()
    };
   
    this.apiService.upseTransaction(transaction).subscribe({
      next: (res: Transaction) => {
        this.transaction.reset();
        this.IdControl.setValue(0);
        this.YearControl.setValue(new Date().getFullYear());
        this.MonthControl.setValue(new Date().getMonth());
        this.TypeControl.setValue('Debit')
        console.log(res);
        this.dataRetrive.data = [res, ...this.dataRetrive.data]
      }
    })
  }

  get IdControl(): AbstractControl{
    return this.transaction.get('id') as AbstractControl;
  }

  get YearControl(): AbstractControl{
    return this.transaction.get('year') as AbstractControl;
  }

  get MonthControl(): AbstractControl{
    return this.transaction.get('month') as AbstractControl;
  }

  get DateControl(): AbstractControl{
    return this.transaction.get('date') as AbstractControl;
  }

  get DescriptionControl(): AbstractControl{
    return this.transaction.get('description') as AbstractControl;
  }

  get AmountControl(): AbstractControl{
    return this.transaction.get('amount') as AbstractControl;
  }

  get TypeControl(): AbstractControl{
    return this.transaction.get('type') as AbstractControl;
  }


  //#endregion for form control getters


  edit(transactionToEdit: Transaction) {
    this.dataRetrive.data = this.dataRetrive.data.filter(v => v.id !== transactionToEdit.id);
  
    this.IdControl.setValue(transactionToEdit.id);
    this.YearControl.setValue(new Date(transactionToEdit.date).getFullYear());
    this.MonthControl.setValue(new Date(transactionToEdit.date).getMonth());
    this.DateControl.setValue(new Date(transactionToEdit.date).getDate());
    this.DescriptionControl.setValue(transactionToEdit.description);
    this.AmountControl.setValue(transactionToEdit.amount);
    this.TypeControl.setValue(transactionToEdit.type);
  }
  


  deleteElement(transactionToDelete: Transaction){
    let dialogRef = this.dialog.open(ConfirmDialogComponent,{
      data:{
        title: 'Delete Confirmation',
        message: 'This will delete the transetion'
      },
    }); 

    dialogRef.afterClosed().subscribe({
     next: (res: boolean) => {
      if(res===true){
        this.apiService.deleteTransaction(transactionToDelete.id).subscribe({
          next: (res: string) =>{
            this.snackbar.open(res, 'Ok',{
              duration: 5000
            });
              // Update the table data after deletion
            this.dataRetrive.data = this.dataRetrive.data.filter(transaction => transaction.id !== transactionToDelete.id)
          }
        });
        // this.snackbar.open('Item Deleted', 'Ok')
      }
     }
    })
  }


}

