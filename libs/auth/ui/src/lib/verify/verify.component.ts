import { Component } from '@angular/core';
import { FirebaseAuthService } from '@opishub/auth-firebase';

@Component({
  selector: 'opis-auth-verify',
  templateUrl: 'verify.component.html'
})
export class VerifyComponent {
  constructor(public authService: FirebaseAuthService) { }

  resend() {
    this.authService.sendVerificationMail()
  }
}
