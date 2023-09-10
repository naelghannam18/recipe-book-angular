import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Observable, map, take } from 'rxjs';
import { User } from '../services/authentication/user.model';

export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);

    return authService.user.pipe(
        take(1),
        map((user: User | null) => {
            const isAuth = !!user;
            if (isAuth) {
                return true;
            } else {
                return router.createUrlTree(['/auth']);
            }
        })
    );
};
