import {Observable} from 'rxjs';

export const customMapFunc = <T, R>(
  project: (value: T) => R) => (source: Observable<T>
) =>
  new Observable<R>(observer =>
    source.subscribe({
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
    })
  );
