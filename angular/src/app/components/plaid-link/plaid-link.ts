import { Component, inject, OnInit, signal} from '@angular/core';
import { NgxPlaidLinkModule, PlaidOnExitArgs, PlaidOnSuccessArgs } from 'ngx-plaid-link';
import {PlaidLinkService} from '../../services/plaid-link-service';

@Component({
  selector: 'app-plaid-link',
  imports: [NgxPlaidLinkModule],
  templateUrl: './plaid-link.html',
})

export class PlaidLink implements OnInit {
  plaidLinkService = inject(PlaidLinkService);
  plaidLinkToken = signal('')

  ngOnInit() {
    this.plaidLinkService.getLinkToken(crypto.randomUUID()).subscribe({
      next: (response) => {
        this.plaidLinkToken.set(response.token)
      }
    });
    console.log('PlaidLink initialized:');
    console.log(this.plaidLinkToken());
  }

  onPlaidSuccess(event: PlaidOnSuccessArgs) {
    console.log("We got a token:", event.token);
    console.log("We got metadata:", event.metadata);
  }

  onPlaidExit(event: PlaidOnExitArgs) {
    console.log("We exited:", event.error);
    console.log("We got metadata:", event.metadata);
  }
}
