import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  UnauthorizedException
} from '@nestjs/common';
import { FirebaseService } from '@opishub/passport-firebase';
import { SignupDto } from './model/signup';
import { ApiBearerAuth } from '@nestjs/swagger';
import fetch from 'node-fetch';
import { environment } from '../environments/environment';
import { Parser } from 'xml2js';
import { generate } from 'randomstring';

const USER_DOC = 'USERS';

@Controller('/account')
export class AccountController {

  constructor(private readonly firebase: FirebaseService) {
  }

  @Post('signup')
  async signup(@Body() newUser: SignupDto) {
    if (!(newUser.email && newUser.password && newUser.displayName)) {
      throw new BadRequestException('All inputs are required');
    }

    const uniqueUsername = generate();
    const boincEmail = (uniqueUsername + '@opishub.org');

    const createAccount = await this.firebase.firebaseApp.auth().createUser(newUser).catch(err => {
      throw new BadRequestException(err.message);
    });

    await this.firebase.firebaseApp.firestore().collection(USER_DOC).doc(createAccount.uid).set({
      boincUsername: uniqueUsername,
      boincEmail: boincEmail,
      credit: 10
    });

    const loggedInUser = await this.firebase.firebaseClient.auth().signInWithEmailAndPassword(newUser.email, newUser.password);
    const token = await loggedInUser.user.getIdToken(false);
    return {
      boincUsername: uniqueUsername,
      boincEmail: boincEmail,
      token: token
    };
  }

  @Get('login')
  async login(@Query('email') email: string, @Query('password') password: string) {
    if (!(email && password)) {
      throw new BadRequestException('All inputs are required');
    }

    const validUser = await this.firebase.firebaseClient.auth().signInWithEmailAndPassword(email, password).catch((err) => {
      throw new BadRequestException(err.message);
    });

    const token = await validUser.user.getIdToken(true);
    const loggedInUser = await this.authUserToken(token);
    const boincEmail = loggedInUser.boincEmail;

    return {
      boincUsername: loggedInUser.boincUsername,
      boincEmail: boincEmail,
      token: token
    };
  }

  @Post('boincAuth')
  @ApiBearerAuth('access-token')
  async boincAuth(@Headers('Authorization') token, @Query('auth') auth: string) {
    if (!(auth)) {
      throw new BadRequestException('All inputs are required');
    }

    const validUser = await this.authUserToken(token);
    await this.firebase.firebaseApp.firestore().collection(USER_DOC).doc(validUser.uid).update({
      boincAuth: auth
    });
  }

  @Get('info')
  @ApiBearerAuth('access-token')
  async info(@Headers('Authorization') token): Promise<{ tokens: number, amount: number, time: number, avgCredit: number }> {
    const validUser = await this.authUserToken(token).catch(err => {
      throw new UnauthorizedException(err.message);
    });

    const res = await fetch(`${environment.boincServer}/show_user.php?auth=${validUser.boincAuth}&format=xml`);
    const text = await res.text();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await new Promise<any>((res, rej) => {
      const parser = new Parser(
        {
          trim: true,
          explicitArray: true
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parser.parseString(text, (err: any, parsed: any) => {
        if (err) {
          rej(err);
        }
        res(parsed);
      });
    });

    return {
      tokens: parseFloat(validUser.credit),
      amount: parseFloat(result.user?.total_credit[0]),
      time: parseInt(result.user?.expavg_time[0]),
      avgCredit: parseFloat(result.user?.expavg_credit[0])
    };
  }

  @Post('withdraw')
  @ApiBearerAuth('access-token')
  async withdraw(@Headers('Authorization') token, @Query('amount') amount: number, @Query('address') address: string) {
    if (!(amount && address)) {
      throw new BadRequestException('All inputs are required');
    }

    const validUser = await this.authUserToken(token);

    if (amount > validUser.credit) {
      throw new BadRequestException('Insufficient funds');
    }

    await this.firebase.firebaseApp.firestore().collection(USER_DOC).doc(validUser.uid).update({
      credit: validUser.credit - amount
    });
  }

  async authUserToken(token: string) {
    if (!token) {
      throw new UnauthorizedException('Authorization header required');
    }

    const loggedInUser = await this.firebase.firebaseApp.auth().verifyIdToken(token).catch(err => {
      throw new UnauthorizedException(err.message);
    });

    const validUser = await this.firebase.firebaseApp.firestore().collection(USER_DOC).doc(loggedInUser.uid).get().catch(err => {
      throw new UnauthorizedException(err.message);
    });

    const data = validUser.data();
    data.uid = loggedInUser.uid;
    return data;
  }

}

