import { Module } from '@nestjs/common';
import { PassportFirebaseModule, databaseUrlToken, serviceAccountToken, FirebaseService } from '@opishub/passport-firebase';
import { environment } from '../environments/environment';
import { AppController } from './app.controller';

@Module({
  imports: [PassportFirebaseModule.forRoot({
    databaseUrlToken: environment.firebase.databaseURL,
    serviceAccount: environment.firebase.serviceAccount,
  })],
  controllers: [AppController],
})
export class AppModule {}
