import {BehaviorSubject, MonoTypeOperatorFunction, Observable, Operator, Subscriber, TeardownLogic, zip} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {notNull} from './not-null.operator';


// function based implementation

export const bufferDelayFunc = <T>(time: number): MonoTypeOperatorFunction<T> => (source: Observable<T>): Observable<T> => {
  return new Observable<T>(observer => {
    const openSubject = new BehaviorSubject(true);
    const open$ = openSubject.asObservable().pipe(filter(v => v));

    return zip(source, open$)
      .pipe(
        tap(() => {
            openSubject.next(false);
            setTimeout(() => {
              openSubject.next(true);
            }, time);
          }
        ),
        map(([src]) => src)
      ).subscribe(observer);
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
  private sourceSubject = new BehaviorSubject(null);
  private source = this.sourceSubject.asObservable().pipe(notNull);
  private openSubject = new BehaviorSubject(true);
  private open$ = this.openSubject.asObservable().pipe(filter(v => v));


  constructor(destination: Subscriber<T>, private time: number) {
    super(destination);

    zip(this.source, this.open$)
      .pipe(
        tap(() => {
            this.openSubject.next(false);
            setTimeout(() => {
              this.openSubject.next(true);
            }, time);
          }
        ),
        map(([src]) => src)
      ).subscribe(destination);
  }


  protected _next(value) {
    this.sourceSubject.next(value);
  }
}


