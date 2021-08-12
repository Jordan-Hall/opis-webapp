import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BOINCSERVER } from './token';
import { Observable } from 'rxjs';
@Injectable({providedIn: 'root'})
export class BoincService {
  constructor(private httpClient: HttpClient, @Inject(BOINCSERVER) protected serverUrl: string ) { }

  login(username: string, password: string): Observable<Record<string, unknown>> {
    return this.httpClient.post<{result: string}>(`${this.serverUrl}`, {
      email: username,
      password
    })
  }

  getCreditInformation(authId: string) {
    return this.httpClient.get<{ amount: string, time: number, avgCredit: string }>(`${this.serverUrl}/${authId}`);
  }
}
