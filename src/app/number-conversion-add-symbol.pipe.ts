import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberConversionAddSymbol',
  standalone: true
})
export class NumberConversionAddSymbolPipe implements PipeTransform {

  transform(value: number): string {

    var valueToconvert = value.toString().split('').reverse().join('');
    var final = '';
    var count = 3;
    for(var i = 0; i < valueToconvert.length; i++){
      var digit = valueToconvert.at(i);
      final = digit + final;
      count --;

      if (count == 0 && i < valueToconvert.length -1) {
        final = ',' + final;
        count = 2;
      }
    }


    return '\u09F3' + final;

  }

}
