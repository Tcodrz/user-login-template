import { UserService } from './user.service';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, BehaviorSubject} from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface UserData {
    email: string;
    password: string;
}

export interface UserToken {
    accessToken: string;
}
export interface User {
    email: string;
    exp: number;
    iat: number;
    sub: string;
    token?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    userChange = new BehaviorSubject<User>(null);

    constructor(
        private http: HttpClient,
        private userService: UserService,
    ) { }

    register(data: UserData) {
        return this.http.post<UserToken>('http://localhost:3000/signup', {
            email: data.email,
            password: data.password
        }
        ).pipe(
            catchError(this.handleErrors),
            tap(
                response => {
                    const user = this.userService.decodeUser(response);
                    this.userChange.next(user);
            }),
        );
    }

    login(data: UserData) {
        return this.http.post<UserToken>('http://localhost:3000/login',
        {
            email: data.email,
            password: data.password
        })
        .pipe(
            catchError(this.handleErrors),
            tap(
                response => {
                    const user = this.userService.decodeUser(response);
                    this.userChange.next(user);
            }),
        );
    }

    handleErrors(errObject: HttpErrorResponse) {
        if (errObject.status === 0) {
            return throwError('Sorry, Server is Down Try Again Later');
        }
        return throwError(errObject.error);
    }

    autoLogin() {
        const loadUser = JSON.parse(localStorage.getItem('userData'));
        if (!loadUser) {
            return;
        }

        const expirationDate = loadUser.exp * 1000;
        if ((new Date().getDate() < expirationDate) && loadUser) {
            this.userChange.next(loadUser);
        } else {
            this.logoutUser();
        }
    }

    logoutUser() {
        localStorage.removeItem('userData');
        this.userChange.next(null);
    }


}