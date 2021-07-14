import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mstotime'
})

export class Ms2TimePipe implements PipeTransform {
  transform(ms?: number): string {
    if (!ms) return 'Never computed';
    const seconds = (ms / 1000).toFixed(1);
    const minutes = (ms / (1000 * 60)).toFixed(1);
    const hours = (ms / (1000 * 60 * 60)).toFixed(1);
    const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (parseInt(seconds) < 60) return seconds + " Sec";
    else if (parseInt(minutes) < 60) return minutes + " Min";
    else if (parseInt(hours) < 24) return hours + " Hrs";
    else return days + " Days"
  }
}
