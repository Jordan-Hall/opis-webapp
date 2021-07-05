import { map } from 'rxjs/operators';
import { AuthPipeGenerator } from '@angular/fire/auth-guard/auth-guard';
import { ActivatedRouteSnapshot } from '@angular/router';


export const onlyAllowSelf: AuthPipeGenerator = (next: ActivatedRouteSnapshot) =>
  map((user) => !!user && next.params.userId === user.uid);
