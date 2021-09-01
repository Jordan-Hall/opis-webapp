import { Controller, Post, Body } from '@nestjs/common';
import { FirebaseService } from '@opishub/passport-firebase';
import { SignupDto } from './model/signup';
import fetch from 'node-fetch';
import { environment } from '../environments/environment';
import md5 from 'crypto-js/md5';
import { Parser } from 'xml2js';

@Controller('/')
export class AppController {
  constructor(private readonly firebase: FirebaseService) {}

  @Post()
  async signup(@Body() newUser: SignupDto) {
    const pass = md5(newUser.password + newUser.email.toLowerCase());
    const url = `${environment.boincServer}/create_account.php?email_addr=${newUser.email}&passwd_hash=${pass}&user_name=${newUser.email}`;
    const res = await fetch(url)
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
          rej(err)
        }
        res(parsed);
      })
    }).then(result => {
      return result.account_out?.authenticator[0]
    });

    if (apiResult) {
      const result = await this.firebase.firebaseApp.auth().createUser(newUser);
      return { result }
    } else {
      throw new Error('Login not found')
    }
  }
}

