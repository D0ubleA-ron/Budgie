import { Component } from '@angular/core';
import { NgxPlaidLinkModule, PlaidOnExitArgs, PlaidOnSuccessArgs } from 'ngx-plaid-link';

@Component({
  selector: 'app-plaid-link',
  imports: [NgxPlaidLinkModule],
  templateUrl: './plaid-link.html',
})
export class PlaidLink {
  onPlaidSuccess(event: PlaidOnSuccessArgs) {
    console.log("We got a token:", event.token);
    console.log("We got metadata:", event.metadata);
  }

  onPlaidExit(event: PlaidOnExitArgs) {
    console.log("We exited:", event.error);
    console.log("We got metadata:", event.metadata);
  }
}
