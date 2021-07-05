import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Input,
  IterableDiffers,
  NgIterable,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  TrackByFunction,
  ViewContainerRef
} from '@angular/core';
import {
  createListTemplateManager,
  RxListManager,
  RxListViewComputedContext,
  RxListViewContext,
  RxDefaultListViewContext,
  coerceDistinctWith,
  RxStrategyProvider
} from '@rx-angular/cdk';

import { ReplaySubject, Observable, Subscription } from'rxjs';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: "[rxFor]"
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class RxFor<T, U extends NgIterable<T> = NgIterable<T>>
  implements OnInit, OnDestroy {
  static ngTemplateGuard_rxFor: "binding";

  @Input()
  set rxFor(
    potentialObservable:
      | Observable<NgIterable<T>>
      | NgIterable<T>
      | null
      | undefined
  ) {
    if (potentialObservable) {
      this.observables$.next(potentialObservable);
    }
  }

  @Input()
  set rxForOf(
    potentialObservable:
      | Observable<NgIterable<T>>
      | NgIterable<T>
      | null
      | undefined
  ) {
    if (potentialObservable) {
      this.observables$.next(potentialObservable);
    }
  }

  @Input("rxForTrackBy")
  set trackBy(trackByFnOrKey: string | ((idx: number, i: T) => any)) {
    this._trackBy =
      typeof trackByFnOrKey !== "function"
      ? (i: unknown, a: any) => a[trackByFnOrKey]
        : trackByFnOrKey;
  }

  constructor(
    private iterableDiffers: IterableDiffers,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private eRef: ElementRef,
    private readonly templateRef: TemplateRef<RxDefaultListViewContext<T>>,
    private readonly viewContainerRef: ViewContainerRef,
    private strategyProvider: RxStrategyProvider
  ) { }

  private observables$ = new ReplaySubject<
    Observable<NgIterable<T>> | NgIterable<T>
  >(1);

  /** @internal */
  private readonly values$ = this.observables$.pipe(coerceDistinctWith());

  /** @internal */
  private listManager!: RxListManager<T>;

  /** @internal */
  private _subscription = Subscription.EMPTY;

  /** @internal */
  static ngTemplateContextGuard<U>(
    dir: RxFor<U>,
    ctx: unknown | null | undefined
  ): ctx is RxDefaultListViewContext<U> {
    return true;
  }

  /** @internal */
  _trackBy: TrackByFunction<T> = (i, a) => a;

  /** @internal */
  ngOnInit() {
    this.listManager = createListTemplateManager<
      T,
      RxDefaultListViewContext<T>
    >({
      iterableDiffers: this.iterableDiffers,
      renderSettings: {
        cdRef: this.cdRef,
        eRef: this.eRef,
        strategies: this.strategyProvider.strategies as any,
        defaultStrategyName: this.strategyProvider.primaryStrategy,
        parent: false,
        patchZone: false
      },
      templateSettings: {
        viewContainerRef: this.viewContainerRef,
        templateRef: this.templateRef,
        createViewContext: this.createViewContext,
        updateViewContext: this.updateViewContext as never
      },
      trackBy: this._trackBy
    });
    this._subscription = this.listManager.render(this.values$).subscribe();
  }
  /** @internal */
  createViewContext(
    item: T,
    computedContext: RxListViewComputedContext
  ): RxDefaultListViewContext<T> {
    return new RxDefaultListViewContext<T>(item, computedContext);
  }

  /** @internal */
  updateViewContext(
    item: T,
    view: EmbeddedViewRef<RxListViewContext<T>>,
    computedContext: RxListViewComputedContext
  ): void {
    view.context.updateContext(computedContext);
    view.context.$implicit = item;
  }

  /** @internal */
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
