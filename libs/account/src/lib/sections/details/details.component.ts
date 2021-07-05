import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Subject, from } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageUtilService } from '@opis/storage';
import { FirebaseStorageService } from '@opis/firestorage';
import { FirebaseAuthService } from '@opishub/auth-firebase'
import { RxState } from '@rx-angular/state';
import firebase from 'firebase';

interface DetailsComponentState {
  photo: FileList
  uploadProgress: number | undefined
}
type SubmitData = { photo: string, firstName: string, lastName: string }

@Component({
  selector: 'opis-account-details',
  templateUrl: 'details.component.html',
  styleUrls: ['./detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState]
})

export class DetailsComponent {
  fileToUpload?: File;
  profilePreview?: string | ArrayBuffer | null = this.authService.userData?.photoURL;
  form: FormGroup


  constructor(
    private authService: FirebaseAuthService,
    readonly formBuilder: FormBuilder,
    private readonly storageService: FirebaseStorageService,
    private readonly utilService: StorageUtilService,
    protected readonly state: RxState<DetailsComponentState>
  ) {
    this.form = this.formBuilder.group({
      photo: [this.authService.userData?.photoURL, [Validators.required]],
      photoSource: [null, [Validators.required, this.image.bind(this)]],
      firstName: this.formBuilder.control(this.authService.userData?.displayName?.split(' ').slice(0, -1).join(' '), [Validators.required]),
      lastName: this.formBuilder.control(this.authService.userData?.displayName?.split(' ').slice(-1).join(' '), [Validators.required])
    })


    const pictureFormChanges$ = (this.form?.get('photoSource') as AbstractControl).valueChanges.pipe(
      tap((newValue) => {
        this.handleFileChange(newValue.files)
      })
    );
    state.hold(pictureFormChanges$);
   }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFileChange(event: any) {
    this.fileToUpload = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (loadEvent) => (this.profilePreview = loadEvent?.target?.result);
    reader.readAsDataURL(event.target.files[0]);
    this.form.patchValue({
      photoSource: this.fileToUpload
    });
  }

  resetImage() {
    this.fileToUpload = undefined;
    this.profilePreview = null;
    this.form.patchValue({
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
    if (this.form.valid) {
      this.uploaImage(this.form.value as SubmitData)
    }
  }


  uploaImage(submitData: SubmitData) {
    if (this.authService.userData) {
      const { downloadUrl$, uploadProgress$ } = this.storageService.uploadFileAndGetMetadata(
        `media/${this.authService.userData?.uid}/media/`,
        this.fileToUpload as File,
      );

      this.state.connect('uploadProgress', uploadProgress$);

      const effect$ = downloadUrl$.pipe(
        switchMap(url =>
          from(
            (this.authService.userData as firebase.User).updateProfile({
              photoURL: url,
              displayName: submitData?.firstName ? `${submitData.firstName} ${submitData.lastName}` : this.authService.userData?.displayName
            })
          )
        ),
        tap(() => {
          this.fileToUpload = undefined;
          this.profilePreview = null;
          this.form.patchValue({
            photo: null,
            photoSource: null
          });
        })
      );
      this.state.hold(effect$);
    }
  }
}
