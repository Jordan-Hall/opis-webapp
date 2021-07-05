import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';

export const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
