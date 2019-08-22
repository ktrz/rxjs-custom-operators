import {BehaviorSubject, identity, MonoTypeOperatorFunction, Observable, Operator, Subscriber, TeardownLogic, zip} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {notNull} from './not-null.operator';


// function based implementation

export const bufferDelayFunc = <T>(time: number): MonoTypeOperatorFunction<T> => (source: Observable<T>): Observable<T> => {
  return new Observable<T>(observer => {
    const ready = new BehaviorSubject(true);
    const isReady$ = ready.asObservable().pipe(filter(v => v));

    zip(source, isReady$)
      .pipe(
        map(([s]) => s),
        tap(() => {
          setTimeout(() => {
            ready.next(true);
          }, time);
        })
      )
      .subscribe({
        next: (x) => {
          observer.next(x);
        },
        error: (err) => {
          observer.error(err);
        },
        complete: () => {
          observer.complete();
        }
      });
  });
};


// class based implementation

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
  private ready = new BehaviorSubject(true);
  private isReady$ = this.ready.asObservable().pipe(filter(identity));
  private source = new BehaviorSubject(null);
  private source$ = this.source.asObservable().pipe(notNull);

  constructor(destination: Subscriber<T>, private time: number) {
    super(destination);

    zip(this.source$, this.isReady$)
      .pipe(
        map(([s]) => s),
        tap(() => {
          setTimeout(() => {
            this.ready.next(true);
          }, this.time);
        })
      )
      .subscribe(this.destination);
  }

  protected _next(value: T): void {
    this.source.next(value);
  }
}


