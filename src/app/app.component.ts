import {Component} from '@angular/core';
import {from, interval, merge, Subject} from 'rxjs';
import {map, scan, share, takeUntil, tap} from 'rxjs/operators';
import {bufferDelay, customMap1, customMap2, switchCase} from './operators';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="clicks.next($event)">Click</button>
    <button (click)="clicks2.next(+numberInput.value)">Click2</button>
    <button (click)="end.next()">End</button>
    <input #numberInput type="number">


    <div>{{result$ | async | json}}</div>
    <div>Test: {{test$ | async}}</div>
    <div>Test2: {{test2$ | async}}</div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  source$ = from([1, 2, 3, 4]).pipe(share());
  clicks = new Subject();
  clicks2 = new Subject<number>();
  end = new Subject();
  timer$ = interval(1000);

  test$ = this.clicks.asObservable().pipe(
    scan((acc) => acc + 1, 0),
    bufferDelay(1000)
    // switchMap(() => this.timer$)
  );
  test2$ = this.clicks2.asObservable().pipe(
    switchCase((() => {
      const values = {};
      return v => {
        const select = values[v] || interval(v).pipe(tap(console.log.bind(console, `interval (${v}):`)));
        values[v] = select;
        return select;
      };
    })()),
    takeUntil(this.end),
  );

  result0$ = this.source$.pipe(
    map(x => x * 2),
  );

  result1$ = this.source$.pipe(
    customMap1(x => x * 2),
  );

  result2$ = this.source$.pipe(
    customMap2(x => x * 2),
  );

  result$ = merge(
    this.result0$.pipe(map(res0 => ({res0}))),
    this.result1$.pipe(map(res1 => ({res1}))),
    this.result2$.pipe(map(res2 => ({res2}))),
  ).pipe(
    scan((acc, v) => {
      return Object.keys({...acc, ...v}).reduce((vals, key) => ({
        ...vals,
        [key]: (acc[key] ? [...acc[key], v[key]] : [v[key]]).filter(x => !!x),
      }), {});
    }, {}),
  );
}
