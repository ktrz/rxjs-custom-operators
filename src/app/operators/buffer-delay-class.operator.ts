import {BehaviorSubject, MonoTypeOperatorFunction, Observable, Operator, Subject, Subscriber, TeardownLogic, zip} from 'rxjs';
import {filter, map, takeUntil, tap} from 'rxjs/operators';
import {notNull} from './not-null.operator';

export const bufferDelayClass = <T>(time: number): MonoTypeOperatorFunction<T> => (source: Observable<T>): Observable<T> => {
  return source.lift(
    new BufferDelayOperator<T>(time)
  );
};

class BufferDelayOperator<T> implements Operator<T, T> {
  constructor(private time: number) {
  }

  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    return source.subscribe(new BufferDelaySubscriber(subscriber, this.time));
  }
}

class BufferDelaySubscriber<T> extends Subscriber<T> {
  private ready = new BehaviorSubject<boolean>(true);
  private valueSubject = new BehaviorSubject<T>(null);
  private isReady$ = this.ready.asObservable().pipe(filter(v => v));
  private buffer$ = this.valueSubject.pipe(notNull);

  private completeSubject = new Subject();

  constructor(destination: Subscriber<T>, private time: number) {
    super(destination);

    zip(this.buffer$, this.isReady$)
      .pipe(
        tap(() => {
          this.ready.next(false);
          setTimeout(() => this.ready.next(true), time);
        }),
        map(([v]) => v),
        takeUntil(this.completeSubject.asObservable()),
      )
      .subscribe({
        next: (x) => {
          this.destination.next(x);
        },
        error: (err) => {
          this.destination.error(err);
        },
        complete: () => {
          this.destination.complete();
        }
      });
  }

  protected _next(value: T): void {
    this.valueSubject.next(value);
  }

  protected _complete(): void {
    this.completeSubject.next();
  }
}
