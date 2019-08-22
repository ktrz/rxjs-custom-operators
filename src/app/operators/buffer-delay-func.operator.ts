import {BehaviorSubject, MonoTypeOperatorFunction, Observable, zip} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';

export const bufferDelayFunc = <T>(time: number): MonoTypeOperatorFunction<T> => (source: Observable<T>): Observable<T> => {
  return new Observable<T>(observer => {
    const ready = new BehaviorSubject<boolean>(true);
    const isReady$ = ready.asObservable().pipe(filter(v => v));

    zip(source, isReady$)
      .pipe(
        tap(() => {
          ready.next(false);
          setTimeout(() => ready.next(true), time);
        }),
        map(([v]) => v),
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
