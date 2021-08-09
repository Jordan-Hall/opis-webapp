import { Module, DynamicModule } from '@nestjs/common';
import { FirebaseAuthGuard } from './auth.guard';
import { FirebaseService } from './passport-firebase.service';
import { FirebaseAuthStrategy } from './passport-firebase.strategy';
import type * as firebase from 'firebase-admin';
import { databaseUrlToken, serviceAccountToken } from './token';
@Module({})
export class PassportFirebaseModule {
  static forRoot(config: {
    serviceAccount: string | firebase.ServiceAccount,
    databaseUrlToken: string,
  }): DynamicModule {
    return {
      module: PassportFirebaseModule,
      providers: [
        { provide: databaseUrlToken, useValue: config.databaseUrlToken },
        { provide: serviceAccountToken, useValue: config.serviceAccount },
        FirebaseAuthStrategy,
        FirebaseAuthGuard,
        FirebaseService
      ],
      exports: [FirebaseAuthStrategy, FirebaseAuthGuard, FirebaseService],
    };
  }
}
