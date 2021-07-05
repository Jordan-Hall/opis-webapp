import { Component, ApplicationRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'opis-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  // constructor(
  //   router: Router,
  //   appRef: ApplicationRef,
  // ) {
  //   router.events
  //     .pipe(filter((e) => e instanceof NavigationEnd))
  //     .subscribe(() => {
  //       appRef.tick();
  //     });
  // }
}
