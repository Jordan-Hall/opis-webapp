import { Module } from '@nestjs/common';
import { PassportFirebaseModule } from '@opishub/passport-firebase';
import { environment } from '../environments/environment';
import { AppController } from './app.controller';
import { BoincController } from './boinc.controller';

@Module({
  imports: [PassportFirebaseModule.forRoot({
    databaseUrlToken: environment.firebase.databaseURL,
    serviceAccount: environment.firebase.serviceAccount,
  })],
  controllers: [AppController, BoincController],
})
export class AppModule {}
