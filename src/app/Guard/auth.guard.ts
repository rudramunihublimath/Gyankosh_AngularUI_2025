import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';
import { inject } from '@angular/core';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };

export function authGuard(): CanActivateFn {
  return() => {
    const loginService: LoginService = inject(LoginService);

    if(loginService.isLoggedIn()) {
      return true;
    }
    loginService.navigateToLogin();
    return false;
  };
};
