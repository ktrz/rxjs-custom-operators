import {Component, Input} from '@angular/core';
import {BehaviorSubject, Observable, OperatorFunction, Subject} from 'rxjs';
import {map, scan, switchMap} from 'rxjs/operators';

const sourceToResult = (source: Observable<any>) => source.pipe(
  scan((acc, v: number) => [...acc, v], []),
  map(arr => arr.join(', '))
);

@Component({
  selector: 'app-operator-showcase-content',
  template: `
    <app-operator-showcase [source]="sourceCombined$ | async" [destination]="result$ | async">
      <button mat-raised-button color="primary" (click)="clicks.next($event)">Click</button>
    </app-operator-showcase>
  `,
})
export class OperatorShowcaseContentComponent {
  private operatorsSubject = new BehaviorSubject<OperatorFunction<any, any>[]>([]);
  private clicks = new Subject();

  private source$ = this.clicks.asObservable().pipe(scan((acc) => acc + 1, 0));
  private sourceCombined$ = this.source$.pipe(sourceToResult);
  private result$ = this.operatorsSubject.asObservable().pipe(
    // @ts-ignore
    switchMap(operators => this.source$.pipe(...operators, sourceToResult))
  );

  @Input() set operators(operators: OperatorFunction<any, any>[]) {
    this.operatorsSubject.next(operators);
  }

}
