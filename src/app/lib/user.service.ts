import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { UserToken, User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  decodeUser(token: UserToken) {

    try {
      const decoded = jwt_decode(token.accessToken);
      const exporationDate = decoded.exp * 1000;

      // new date().getTime() = current time
      // decoded.exp * 1000 = when expired

      if (new Date().getTime() > exporationDate) {
        return null;
      }

      this.storeUser(decoded, token);

      return decoded;

    } catch {

      return null;
    }
  }

  private storeUser(decoded: User, token: UserToken) {
    localStorage.setItem('userData',
      JSON.stringify({
      email: decoded.email,
      exp: decoded.exp,
      iat: decoded.iat,
      sub: decoded.sub,
      token: token.accessToken
    }
    ));
  }

}
