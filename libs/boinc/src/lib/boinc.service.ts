import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BOINCSERVER } from './token';
import { map, switchMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import md5 from 'crypto-js/md5';
import { Parser } from 'xml2js';

@Injectable({providedIn: 'root'})
export class BoincService {
  constructor(private httpClient: HttpClient, @Inject(BOINCSERVER) protected serverUrl: string ) { }

  register(username: string, password: string): Observable<string>  {
    return this.httpClient.get(`${this.serverUrl}/create_account.php?email_addr=${username}&passwd_hash=${md5(password)}&user_name=${username}`, this.setHttpHeaders() as any )
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        switchMap((result) => from(new Promise<any>((res, rej) => {
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
        }))),
        map((result) => {
          return result.account_out?.authenticator[0];
        })
      )
  }

  login(username: string, password: string): Observable<string> {
    return this.httpClient.get(`${this.serverUrl}/create_account.php?email_addr=${username}&passwd_hash=${md5(password)}&get_opaque_auth=1`, this.setHttpHeaders() as any)
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        switchMap((result) => from(new Promise<{ account_out: { authenticator: string[]}}>((res, rej) => {
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
        }))),
        map((result) => {
          return result.account_out?.authenticator[0];
        }),
      )
  }

  getCreditInformation(authId: string): Observable<{ amount: string, time: number, avgCredit: string }> {
    return this.httpClient.get(`${this.serverUrl}/show_user.php?auth=${authId}&format=xml`, this.setHttpHeaders() as any)
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        switchMap((result) => from(new Promise<any>((res, rej) => {
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
        }))),
        map((result) => {
          return {
            amount: result.user?.total_credit,
            time: result.user?.expavg_time,
            avgCredit: result.user?.expavg_credit
          }
        })
      )
  }

  private setHttpHeaders()  {
    return {
      headers: new HttpHeaders()
        .set('Content-Type', 'text/xml')
        .append('Access-Control-Allow-Methods', 'GET')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
      observe: 'body', responseType: 'text'
    }
  }

}
