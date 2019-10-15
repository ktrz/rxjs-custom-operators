import {BehaviorSubject, MonoTypeOperatorFunction, Observable, Operator, Subject, Subscriber, TeardownLogic, zip} from 'rxjs';
import {filter, map, takeUntil, tap} from 'rxjs/operators';
import {notNull} from './not-null.operator';


// function based implementation

export const bufferDelayFunc = <T>(time: number): MonoTypeOperatorFunction<T> => (source: Observable<T>): Observable<T> => {
  return new Observable<T>(observer => {
    const isOpenSubject = new BehaviorSubject(true);
    const isOpen$ = isOpenSubject.asObservable().pipe(filter(v => v));

    zip(source, isOpen$)
      .pipe(
        map(([s]) => s),
        tap(() => {
          isOpenSubject.next(false);
          setTimeout(() => {
            isOpenSubject.next(true);
          }, time);
        })
      )
      .subscribe(observer);
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
  private isOpenSubject = new BehaviorSubject(true);
  private isOpen$ = this.isOpenSubject.asObservable().pipe(filter(v => v));
  private sourceSubject = new BehaviorSubject(null);
  private source$ = this.sourceSubject.asObservable().pipe(notNull);
  private completeSubject = new Subject();

  constructor(destination: Subscriber<T>, private time: number) {
    super(destination);

    zip(this.source$, this.isOpen$)
      .pipe(
        map(([s]) => s),
        tap(() => {
          this.isOpenSubject.next(false);
          setTimeout(() => {
            this.isOpenSubject.next(true);
          }, time);
        }),
        takeUntil(this.completeSubject)
      )
      .subscribe(destination);
  }

  protected _next(value: T): void {
    this.sourceSubject.next(value);
  }

  protected _complete(): void {
    this.completeSubject.next();
  }
}


