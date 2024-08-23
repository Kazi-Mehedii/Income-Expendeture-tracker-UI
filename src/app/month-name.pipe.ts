import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthName',
  standalone: true
})
export class MonthNamePipe implements PipeTransform {

  transform(monthIndex: number): string {
   if (monthIndex < 0 || monthIndex > 11) return 'Invalid Month';
   var monthName = [
     'January', 
    'February' ,
    'March' ,
    'April' ,
     'May' ,
     'June' ,
     'July' ,
    'August' ,
     'September' ,
    'October' ,
     'November' ,
     'December' 

   ];
   return monthName[monthIndex]
  }


}
