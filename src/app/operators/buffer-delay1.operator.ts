import {MonoTypeOperatorFunction, Observable} from 'rxjs';

export const bufferDelay = <T>(time: number): MonoTypeOperatorFunction<T> => (source: Observable<T>): Observable<T> => {
  return new Observable<T>(observer => {
    source
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

