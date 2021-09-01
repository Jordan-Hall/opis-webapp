import { Controller, Post, Body, Get, UnauthorizedException, Param } from '@nestjs/common';
import { FirebaseService } from '@opishub/passport-firebase';
import { LoginDto } from './model/login';
import fetch from 'node-fetch';
import { environment } from '../environments/environment';
import md5 from 'crypto-js/md5';
import { Parser } from 'xml2js';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('boinc')
@Controller('boinc')
export class BoincController {
  constructor(private readonly firebase: FirebaseService) {}

  @Post()
  async login(@Body() login: LoginDto) {
    const res = await fetch(`${environment.boincServer}/lookup_account.php?email_addr=${login.email}&passwd_hash=${md5(login.password + login.email.toLowerCase())}&get_opaque_auth=1`)
    const text = await res.text();
    const result = await new Promise<{ account_out: { authenticator: string[]}}>((res, rej) => {
      const parser = new Parser(
        {
          trim: true,
          explicitArray: true
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parser.parseString(text, (err: any, parsed: any) => {
        if (err) {
          rej(err)
        }
        res(parsed);
      })
    });


    const account = await fetch(`${environment.boincServer}/am_get_info.php?account_key=${result.account_out?.authenticator[0]}`, {
      method: 'POST'
    })

    const accountText = await account.text();
    const accountTextRes = await new Promise<{ am_get_info_reply: Record<string, unknown>}>((res, rej) => {
      const parser = new Parser(
        {
          trim: true,
          explicitArray: true
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parser.parseString(accountText, (err: any, parsed: any) => {
        if (err) {
          rej(err)
        }
        res(parsed);
      })
    });
    return accountTextRes.am_get_info_reply
  }


  @Get(':id')
  async getCreditInformation(@Param('id') authId: string): Promise<{ amount: number, time: number, avgCredit: number }> {
    const res = await fetch(`${environment.boincServer}/show_user.php?userid=${authId}&format=xml`);
    const text = await res.text();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await  new Promise<any>((res, rej) => {
      const parser = new Parser(
        {
          trim: true,
          explicitArray: true
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parser.parseString(text, (err: any, parsed: any) => {
        if (err) {
          rej(err)
        }
        res(parsed);
      })
    })

    if (result.error) {
      throw new UnauthorizedException();
    }

    return {
      amount: parseFloat(result.user?.total_credit[0]),
      time: parseInt(result.user?.expavg_time[0]),
      avgCredit: parseFloat(result.user?.expavg_credit[0])
    }
  }

}
