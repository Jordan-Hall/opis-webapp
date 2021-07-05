import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Subject, from } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageUtilService } from '@opis/storage';
import { FirebaseStorageService } from '@opis/firestorage';
import { FirebaseAuthService } from '@opishub/auth-firebase'
import { RxState } from '@rx-angular/state';
import firebase from 'firebase';

interface TeamComponentState {
  photo: FileList
  uploadProgress: number | undefined
}


@Component({
  selector: 'opis-account-team',
  templateUrl: 'team.component.html',
  styleUrls: ['./team.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState]
})

export class TeamComponent {
  constructor(
    private authService: FirebaseAuthService,
    readonly formBuilder: FormBuilder,
    protected readonly state: RxState<TeamComponentState>
  ) { }

}
