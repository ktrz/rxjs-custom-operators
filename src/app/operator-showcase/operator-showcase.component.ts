import {Component, Input} from '@angular/core';
import {BehaviorSubject, Observable, OperatorFunction, Subject} from 'rxjs';
import {map, scan, switchMap} from 'rxjs/operators';

const sourceToResult = (source: Observable<any>) => source.pipe(
  // scan((acc) => acc + 1, 0),
  scan((acc, v: number) => [...acc, v], []),
  map(arr => arr.join(', '))
);

@Component({
  selector: 'app-operator-showcase',
  template: `
    <mat-card>
      <mat-card-content>
        <div class="content">
          <div class="column">{{sourceCombined$ | async }}</div>
          <div class="column">{{result$ | async}}</div>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="clicks.next($event)">Click</button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./operator-showcase.component.scss']
})
export class OperatorShowcaseComponent<R> {
  private operatorsSubject = new BehaviorSubject<OperatorFunction<any, any>[]>([]);
  private clicks = new Subject();

  private source$ = this.clicks.asObservable().pipe(scan((acc) => acc + 1, 0));
  private sourceCombined$ = this.source$.pipe(sourceToResult);
  private result$ = this.operatorsSubject.asObservable().pipe(
    switchMap(o => {
      // @ts-ignore
      return this.source$.pipe(...o, sourceToResult);
    })
  );

  @Input() set operators(operators: OperatorFunction<any, any>[]) {
    this.operatorsSubject.next(operators);
  }
}
