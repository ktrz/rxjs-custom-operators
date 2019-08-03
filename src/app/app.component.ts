import {Component} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {map, scan} from 'rxjs/operators';
import {bufferDelay} from './operators';
import {bufferDelay as bd1} from './operators/buffer-delay1.operator';
import {bufferDelay as bd2} from './operators/buffer-delay2.operator';

const sourceToResult = (source: Observable<any>) => source.pipe(
  scan((acc) => acc + 1, 0),
  scan((acc, v: number) => [...acc, v], []),
  map(arr => arr.join(', '))
);


@Component({
  selector: 'app-root',
  template: `
    <mat-card>
      <mat-card-content>
        <div class="content content-title">
          <div class="column">Source</div>
          <div class="column">Result</div>
        </div>
      </mat-card-content>
    </mat-card>
    <mat-card>
      <mat-card-content>
        <div class="content">
          <div class="column">{{source1$ | async }}</div>
          <div class="column">{{result1$ | async}}</div>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="clicks1.next($event)">Click</button>
      </mat-card-actions>
    </mat-card>
    <mat-card>
      <mat-card-content>
        <div class="content">
          <div class="column">{{source2$ | async }}</div>
          <div class="column">{{result2$ | async}}</div>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="clicks2.next($event)">Click</button>
      </mat-card-actions>
    </mat-card>
    <mat-card>
      <mat-card-content>
        <div class="content">
          <div class="column">{{source3$ | async }}</div>
          <div class="column">{{result3$ | async}}</div>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="clicks3.next($event)">Click</button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  clicks1 = new Subject();
  clicks2 = new Subject();
  clicks3 = new Subject();

  source1$ = this.clicks1.asObservable().pipe(
    sourceToResult
  );
  source2$ = this.clicks2.asObservable().pipe(
    sourceToResult
  );
  source3$ = this.clicks3.asObservable().pipe(
    sourceToResult
  );

  result1$ = this.source1$.pipe(
    bufferDelay(1000)
  );
  result2$ = this.source2$.pipe(
    bd1(1000)
  );
  result3$ = this.source3$.pipe(
    bd2(1000)
  );
}
