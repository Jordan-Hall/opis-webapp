import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Injectable,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  AfterContentChecked$,
  AfterContentInit$,
  AfterViewChecked$,
  AfterViewInit$,
  HookProps,
  OnChanges$,
  OnDestroy$,
  OnInit$,
} from './model';
import { toHook } from './utils';

@Injectable()
export abstract class Hooks
  implements
  OnChanges,
  OnChanges$,
  OnInit,
  OnInit$,
  AfterViewInit,
  AfterViewInit$,
  AfterViewChecked,
  AfterViewChecked$,
  AfterContentInit,
  AfterContentInit$,
  AfterContentChecked,
  AfterContentChecked$,
  OnDestroy,
  OnDestroy$ {
  readonly _hooks$ = new Subject<Partial<HookProps>>();

  onChanges$ = this._hooks$.pipe(toHook('changes')) as Observable<SimpleChanges>;
  onInit$ = this._hooks$.pipe(toHook('init')) as Observable<boolean>;
  onAfterViewInit$ = this._hooks$.pipe(
    toHook('afterViewInit')
  ) as Observable<boolean>;
  onAfterViewChecked$ = this._hooks$.pipe(
    toHook('afterViewChecked')
  ) as Observable<boolean>;
  onAfterContentInit$ = this._hooks$.pipe(
    toHook('afterContentInit')
  ) as Observable<boolean>;
  onAfterContentChecked$ = this._hooks$.pipe(
    toHook('afterContentChecked')
  ) as Observable<boolean>;
  onDestroy$ = this._hooks$.pipe(toHook('destroy')) as Observable<boolean>;

  ngOnChanges(changes: SimpleChanges): void {
    this._hooks$.next({ changes });
  }

  ngOnInit(): void {
    this._hooks$.next({ init: true });
  }

  ngAfterViewInit(): void {
    this._hooks$.next({ afterViewInit: true });
  }

  ngAfterViewChecked(): void {
    this._hooks$.next({ afterViewChecked: true });
  }

  ngAfterContentInit(): void {
    this._hooks$.next({ afterContentInit: true });
  }

  ngAfterContentChecked(): void {
    this._hooks$.next({ afterContentChecked: true });
  }

  ngOnDestroy(): void {
    this._hooks$.next({ destroy: true });
    this._hooks$.complete();
  }
}
