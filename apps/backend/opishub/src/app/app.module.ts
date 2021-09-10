import { Module } from '@nestjs/common';
import { PassportFirebaseModule } from '@opishub/passport-firebase';
import { environment } from '../environments/environment';
import { AccountController } from './account.controller';

@Module({
  imports: [PassportFirebaseModule.forRoot({
    databaseUrlToken: environment.firebase.databaseURL,
    serviceAccount: environment.firebase.serviceAccount,
  })],
  controllers: [AccountController],
})
export class AppModule {}
