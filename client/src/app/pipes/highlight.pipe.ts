import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: string, args: string): any {
    if (args && value) {
        let startIndex = value.toLowerCase().indexOf(args.toLowerCase());
        if (startIndex != -1) {
            let endLength = args.length;
            let matchingString = value.substr(startIndex, endLength);
            return value.replace(matchingString, "<mark>" + matchingString + "</mark>");
        }

    }
    return value;
  }

}//export


/*
 transform(value: any, args: any): any {
    if (!args) {return value;}
    var re = new RegExp(args, 'gi'); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
    return value.replace(re, "<mark>$&</mark>");
*/


/*
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
*/