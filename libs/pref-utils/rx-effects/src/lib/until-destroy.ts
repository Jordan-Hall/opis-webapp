import { MonoTypeOperatorFunction } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { OnDestroy$ } from '@opis/cdk';

export function untilDestroyed<V>(
  instance: OnDestroy$
): MonoTypeOperatorFunction<V> {
  return (source) => source.pipe(takeUntil<V>(instance.onDestroy$));
}
