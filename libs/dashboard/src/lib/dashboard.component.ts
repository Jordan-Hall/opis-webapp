import { Component, ChangeDetectionStrategy, Inject, Optional } from '@angular/core';
import { FirebaseAuthService } from '@opishub/auth-firebase';
import { switchMap, filter, map } from 'rxjs/operators';
import { RxState } from '@rx-angular/state';
import { User } from '@opishub/auth-firebase';
import { BoincService, TOTALCREDITMATHS } from '@opishub/boinc';

interface DashboardComponentState {
  user: User;
  credits?: {
    amount: number;
    time: number;
    avgCredit: number;
  };
}

@Component({
  selector: 'opis-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState]
})

export class DashboardComponent {

  readonly user$ = this.state.select('user');
  readonly credits$ = this.state.select('credits');

  constructor(
    authService: FirebaseAuthService,
    boincService: BoincService,
    protected state: RxState<DashboardComponentState>,
    @Optional() @Inject(TOTALCREDITMATHS) totalCreditMaths: number = 0.001
  ) {
    state.connect('user', authService.userData$);
    state.connect('credits', this.user$.pipe(
      filter(user => !!user),
      switchMap(user => boincService.getCreditInformation(user.credit as string)),
      map(credit => ({
        time: credit.time,
        amount: parseFloat(credit.amount || '0') * totalCreditMaths,
        avgCredit: parseFloat(credit.avgCredit || '0') * totalCreditMaths,
      }))
    ))
   }
}
