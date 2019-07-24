import {Observable, Operator, OperatorFunction, Subscriber, TeardownLogic} from 'rxjs';

export const customMap2 = <T, R>(project: (value: T) => R): OperatorFunction<T, R> => (source: Observable<T>): Observable<R> => {
  return source.lift(new CustomMapOperator<T, R>(project));
};

class CustomMapOperator<T, R> implements Operator<T, R> {

  constructor(private project: (value: T) => R) {}

  call(subscriber: Subscriber<R>, source: any): TeardownLogic {
    return source.subscribe(new CustomMapSubscriber(subscriber, this.project));
  }
}

class CustomMapSubscriber<T, R> extends Subscriber<T> {
  constructor(destination: Subscriber<R>, private project: (value: T) => R) {
    super(destination);
  }

  protected _next(value: T): void {
    this.destination.next(this.project(value));
  }
}
