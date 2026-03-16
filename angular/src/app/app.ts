import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlaidLink } from './components/plaid-link/plaid-link';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PlaidLink],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('angular');
}
