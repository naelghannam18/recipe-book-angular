import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpParams,
} from '@angular/common/http';
import { Observable, take, exhaustMap } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { User } from '../services/authentication/user.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthenticationService) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return this.authService.user.pipe(
            take(1),
            exhaustMap((user: User | null) => {
                if (!user || !user.token || user.token.length === 0) {
                    return next.handle(request);
                }

                const newRequest = request.clone({
                    params: new HttpParams().set('auth', user.token),
                });
                return next.handle(newRequest);
            })
        );
    }
}
