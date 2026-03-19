import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LinkTokenModel } from '../models/LinkTokenModel';
import { AccessTokenModel } from '../models/AccessTokenModel';

class LinkToken {}

@Injectable({
  providedIn: 'root',
})
export class PlaidLinkService {
  private readonly baseUrl = 'http://localhost:8080/api/plaid';

  constructor(private http: HttpClient) {}

  getLinkToken(userId: string): Observable<LinkTokenModel> {
    const params = new HttpParams().set('userId', userId);
    return this.http.post<LinkTokenModel>(`${this.baseUrl}/link-token`, null, { params });
  }

  exchangeToken(token: string): Observable<AccessTokenModel> {
    const params = new HttpParams().set('token', token);
    return this.http.post<AccessTokenModel>(`${this.baseUrl}/exchange-token`, null, { params });
  }


}
