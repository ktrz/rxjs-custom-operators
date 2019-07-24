import {Observable, Operator, OperatorFunction, Subscriber, Subscription, TeardownLogic} from 'rxjs';
import {InnerSubscriber, OuterSubscriber, subscribeToResult} from 'rxjs/internal-compatibility';

export const switchCase = <T, R>(caseSelector: (value: T) => Observable<R>): OperatorFunction<T, [T, R]> =>
  (source: Observable<T>): Observable<[T, R]> => {
    return source.lift(new CaseSelectorOperator(caseSelector));
  };

class CaseSelectorOperator<T, R> implements Operator<T, [T, R]> {

  constructor(private caseSelector: (value: T) => Observable<R>) {
  }

  call(subscriber: Subscriber<[T, R]>, source: any): TeardownLogic {
    return source.subscribe(new CaseSelectorSubscriber(subscriber, this.caseSelector));
  }
}

class CaseSelectorSubscriber<T, R> extends OuterSubscriber<T, R> {
  private activeResults: Array<{ observable: Observable<R>, innerSub: InnerSubscriber<T, R> }> = [];
  private currentSubscriber: InnerSubscriber<T, R>;

  constructor(destination: Subscriber<[T, R]>, private caseSelector: (value: T) => Observable<R>) {
    super(destination);
  }

  protected _next(value: T) {
    let result: Observable<R>;
    try {
      result = this.caseSelector(value);
    } catch (error) {
      this.destination.error(error);
      return;
    }
    this._innerSub(result, value);
  }

  private _innerSub(observable: Observable<R>, value: T) {
    const activeResult = this.activeResults.find(r => r.observable === observable);
    const innerSub = !activeResult ? new InnerSubscriber(this, value, undefined) : activeResult.innerSub;
    this.currentSubscriber = innerSub;
    if (!activeResult) {
      const destination = this.destination as Subscription;
      destination.add(innerSub);
      this.activeResults.push({observable, innerSub});
      subscribeToResult(this, observable, value, undefined, innerSub);
    }
  }

  protected _complete(): void {
    this.unsubscribe();
  }

  protected _unsubscribe() {
    // this.innerSubscription = null;
  }

  notifyComplete(innerSub: Subscription): void {
    const destination = this.destination as Subscription;
    destination.remove(innerSub);
    if (this.isStopped) {
      super._complete();
    }
  }

  notifyNext(outerValue: T, innerValue: R,
             outerIndex: number, innerIndex: number,
             innerSub: InnerSubscriber<T, R>): void {
    if (innerSub === this.currentSubscriber) {
      this.destination.next([outerValue, innerValue]);
    }
  }
}
