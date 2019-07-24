import {Observable} from 'rxjs';

export const customMap1 = <T, R>(project: (value: T) => R) => (source: Observable<T>) =>
  new Observable<R>(observer => {
    return source.subscribe({
      next(x) {
        observer.next(
          project(x)
        );
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      }
    });
  });
