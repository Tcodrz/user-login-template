import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User } from './auth.service';

@Injectable()
export class AuthInterceptService implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        const user: User = JSON.parse(localStorage.getItem('userData'));
        let request = req;

        if (user) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {

                if (err.status === 401) {
                    this.router.navigateByUrl('/login');
                }
                return throwError(err);
            })
        );
    }

}


