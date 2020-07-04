import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): boolean | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | UrlTree {
        return this.authService.userChange.pipe(
            take(1),
            map(user => {
                if (user === null) {
                    return true;
                }
                return this.router.createUrlTree(['/profile']);
            })
        )
    }
}