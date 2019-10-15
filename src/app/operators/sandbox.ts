import {MonoTypeOperatorFunction, Observable, Operator, Subscriber, TeardownLogic} from 'rxjs';


// function based implementation

export const bufferDelayFunc = <T>(time: number): MonoTypeOperatorFunction<T> => (source: Observable<T>): Observable<T> => {
  return new Observable<T>(observer => {
    source.subscribe(observer);
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
  constructor(destination: Subscriber<T>, private time: number) {
    super(destination);
  }
}


