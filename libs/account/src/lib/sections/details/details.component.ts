import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {  from } from 'rxjs';
import { tap, switchMap, map, filter } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageUtilService } from '@opis/storage';
import { FirebaseStorageService } from '@opis/firestorage';
import { FirebaseAuthService, User } from '@opishub/auth-firebase'
import { RxState } from '@rx-angular/state';
import firebase from 'firebase';
import { RxEffects } from '@opis/rx-effects';

interface DetailsComponentState {
  photo: FileList
  uploadProgress: number | undefined;
  user: User | null;
  profilePreview: string | ArrayBuffer | null | undefined
}
type SubmitData = { photo: string, firstName: string, lastName: string }

@Component({
  selector: 'opis-account-details',
  templateUrl: 'details.component.html',
  styleUrls: ['./detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, RxEffects]
})

export class DetailsComponent {
  fileToUpload?: File;
  form?: FormGroup
  readonly profilePreview$ = this.state.select('profilePreview');

  constructor(
    private authService: FirebaseAuthService,
    readonly formBuilder: FormBuilder,
    private readonly storageService: FirebaseStorageService,
    private readonly utilService: StorageUtilService,
    protected readonly state: RxState<DetailsComponentState>,
    effects: RxEffects,
    changeDetectRef: ChangeDetectorRef
  ) {
    state.connect('user', this.authService.userData$.pipe(filter((user) => !!user)));
    state.connect('profilePreview', this.authService.userData$.pipe(filter((user) => !!user) ,map(user => user.photoURL)));
    effects.register(state.select('user'), user => {
      this.form = this.formBuilder.group({
        photo: [user?.photoURL, [Validators.required]],
        photoSource: [null, [Validators.required, this.image.bind(this)]],
        firstName: this.formBuilder.control(user?.displayName?.split(' ').slice(0, -1).join(' '), [Validators.required]),
        lastName: this.formBuilder.control(user?.displayName?.split(' ').slice(-1).join(' '), [Validators.required])
      });
      const pictureFormChanges$ = (this.form?.get('photoSource') as AbstractControl).valueChanges.pipe(
        tap((newValue) => {
          this.handleFileChange(newValue.files)
        })
      );
      state.hold(pictureFormChanges$);
      changeDetectRef.markForCheck();
    })
   }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFileChange(event: any) {
    this.fileToUpload = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (loadEvent) => (this.state.set({ profilePreview: loadEvent?.target?.result }));
    reader.readAsDataURL(event.target.files[0]);
    this.form?.patchValue({
      photoSource: this.fileToUpload
    });
  }

  resetImage() {
    this.fileToUpload = undefined;
    this.state.set({ profilePreview: null })
    this.form?.patchValue({
      photo: null,
      photoSource: null
    });
  }

  private image(photoControl: AbstractControl): { [key: string]: boolean } | null {
    if (photoControl.value) {
      if (typeof photoControl.value === 'string') {
        return null;
      }
      return this.utilService.validateFile(photoControl.value)
        ? null
        : {
          image: true,
        };
    }
    return null;
  }


  submit() {
    if (this.form?.valid) {
      this.uploaImage(this.form.value as SubmitData)
    }
  }


  uploaImage(submitData: SubmitData) {
    const user = this.state.get('user');
    if (user) {
      const { downloadUrl$, uploadProgress$ } = this.storageService.uploadFileAndGetMetadata(
        `media/${user?.uid}/media/`,
        this.fileToUpload as File,
      );

      this.state.connect('uploadProgress', uploadProgress$);

      const effect$ = downloadUrl$.pipe(
        switchMap(url =>
          from(
            (user as unknown as firebase.User).updateProfile({
              photoURL: url,
              displayName: submitData?.firstName ? `${submitData.firstName} ${submitData.lastName}` : user?.displayName
            })
          )
        ),
        tap(() => {
          this.fileToUpload = undefined;
          this.state.set({profilePreview: null})
          this.form?.patchValue({
            photo: null,
            photoSource: null
          });
        })
      );
      this.state.hold(effect$);
    }
  }
}
