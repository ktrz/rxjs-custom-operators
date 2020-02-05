import {Component} from '@angular/core';
import {OperatorFunction} from 'rxjs';
import {bufferDelayClass, bufferDelayFunc} from './operators/sandbox';

@Component({
  selector: 'app-root',
  template: `
    <app-operator-showcase-header></app-operator-showcase-header>
    <app-operator-showcase-content
      *ngFor="let showcase of operatorsShowcases"
      [header]="showcase.header"
      [operators]="showcase.operators"
    ></app-operator-showcase-content>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  operatorsShowcases: { header: string, operators: OperatorFunction<any, any>[] }[] = [
    {header: 'Buffer Delay Func', operators: [bufferDelayFunc(1000)]},
    {header: 'Buffer Delay Class', operators: [bufferDelayClass(1000)]},
  ];
}
