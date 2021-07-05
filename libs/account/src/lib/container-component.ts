import { Component } from '@angular/core';

@Component({
  selector: 'opis-account-container',
  template: `
    <div class="flex-1 flex h-screen w-screen">
      <opis-account-sidebar class="flex h-full"></opis-account-sidebar>
      <router-outlet></router-outlet>
    </div>
  `
})

export class ContainerComponent {

}
