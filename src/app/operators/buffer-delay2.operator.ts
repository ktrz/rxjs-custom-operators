import {MonoTypeOperatorFunction, Observable, Operator, Subscriber, TeardownLogic} from 'rxjs';

export const bufferDelay = <T>(time: number): MonoTypeOperatorFunction<T> => (source: Observable<T>): Observable<T> => {
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
  constructor(destination: Subscriber<T>, private time: number) {
    super(destination);
  }

  protected _next(value: T): void {
    this.destination.next(value);
  }
}
