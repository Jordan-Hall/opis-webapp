import { Body, Controller, Get, Post, Query, Headers, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '@opishub/passport-firebase';
import { SignupDto } from './model/signup';
import fetch from 'node-fetch';
import { environment } from '../environments/environment';
import md5 from 'crypto-js/md5';
import { Parser } from 'xml2js';

const USER_DOC = 'USERS';

@Controller('/account')
export class AccountController {

  constructor(private readonly firebase: FirebaseService) {
  }

  @Post("signup")
  async signup(@Body() newUser: SignupDto) {
    if (!(newUser.email && newUser.password && newUser.displayName)) {
      throw new BadRequestException("All inputs are required");
    }

    const passHash = this.getPasswordMd5(newUser.password, newUser.email);
    const url = `${environment.boincServer}/create_account.php?email_addr=${newUser.email}&passwd_hash=${passHash}&user_name=${newUser.displayName}`;
    const res = await fetch(url);
    const result = await res.text();
    const apiResult = await new Promise<any>((res, rej) => {
      const parser = new Parser(
        {
          trim: true,
          explicitArray: true
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parser.parseString(result, (err: any, parsed: any) => {
        if (err) {
          rej(err);
        }
        res(parsed);
      });
    }).then(result => {
      return result.account_out?.authenticator[0];
    });

    if (apiResult) {
      const createAccount = await this.firebase.firebaseApp.auth().createUser(newUser);
      if (createAccount) {
        await this.firebase.firebaseApp.firestore().collection(USER_DOC).doc(createAccount.uid).set({
          boincAuth: apiResult,
          credit: 0
        });
        const loggedInUser = await this.firebase.firebaseClient.auth().signInWithEmailAndPassword(newUser.email, newUser.password);
        const token = await loggedInUser.user.getIdToken(false);
        return {
          name: newUser.displayName,
          token: token
        }
      }
    }
    throw new BadRequestException("Account already exists");
  }

  @Get("login")
  async login(@Query('email') email: string, @Query('password') password: string) {
    if (!(email && password)) {
      throw new BadRequestException("All inputs are required");
    }

    const validUser = await this.firebase.firebaseClient.auth().signInWithEmailAndPassword(email, password);
    if (!validUser) {
      throw new BadRequestException("Invalid email or password");
    }

    const passHash = this.getPasswordMd5(password, email);
    const res = await fetch(`${environment.boincServer}/lookup_account.php?email_addr=${email}&passwd_hash=${passHash}&get_opaque_auth=1`);
    const text = await res.text();
    const result = await new Promise<{ account_out: { authenticator: string[] } }>((res, rej) => {
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

    await this.firebase.firebaseApp.firestore().collection(USER_DOC).doc(validUser.user.uid).set({
      boincAuth: result.account_out?.authenticator[0]
    });
    const token = await validUser.user.getIdToken(true);

    return {
      name: validUser.user.displayName,
      token: token
    }
  }

  @Get('info')
  async info(@Headers('Authorization') token): Promise<{ credit: number, time: number }> {
    if (!token) {
      throw new UnauthorizedException();
    }

    const loggedInUser = await this.firebase.firebaseApp.auth().verifyIdToken(token);
    if (!loggedInUser) {
      throw new UnauthorizedException();
    }

    const validUser = await this.firebase.firebaseApp.firestore().collection(USER_DOC).doc(loggedInUser.uid).get();
    if (!validUser) {
      throw new UnauthorizedException();
    }

    const res = await fetch(`${environment.boincServer}/show_user.php?userid=${validUser.data().boincAuth}&format=xml`);
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

    if (result.error) {
      throw new UnauthorizedException();
    }

    return {
      credit: parseFloat(validUser.data().credit),
      time: parseInt(result.user?.expavg_time[0])
    };
  }

  getPasswordMd5(email: string, password: string) {
    return md5(password + email.toLowerCase());
  }

}

