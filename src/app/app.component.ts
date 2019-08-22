import {Component} from '@angular/core';
import {OperatorFunction} from 'rxjs';
import {bufferDelayClass, bufferDelayFunc, customMapClass, customMapFunc} from './operators';

@Component({
  selector: 'app-root',
  template: `
    <app-operator-showcase-header></app-operator-showcase-header>
    <app-operator-showcase-content *ngFor="let showcase of operatorsShowcases" [operators]="showcase"></app-operator-showcase-content>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  operatorsShowcases: OperatorFunction<any, any>[][] = [
    [bufferDelayFunc(1000)],
    [bufferDelayClass(1000)],
    [customMapFunc(s => `f${s}`)],
    [customMapClass(s => `c${s}`)],
  ];
}
