import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FirebaseAuthService } from '@opishub/auth-firebase';

@Component({
  selector: 'opis-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DashboardComponent {

  get displayName() {
    return this.authService.userData?.displayName;
  }
  get accountVerified() {
    return this.authService.userData?.emailVerified;
  }
  get photoUrl() {
    return this.authService.userData?.photoURL;
  }
  constructor(
    private authService: FirebaseAuthService,
  ) { }
}
