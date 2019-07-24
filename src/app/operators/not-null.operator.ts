import {filter} from 'rxjs/operators';

export const notNull = filter(v => v !== null);
