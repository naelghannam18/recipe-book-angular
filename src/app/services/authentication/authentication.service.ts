import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseAuthModel, FirebaseResponse } from './auth.model';
import { Observable, catchError, throwError, BehaviorSubject, tap } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private readonly apiKey = 'AIzaSyCQBG02BWUjSY3ayLDYZ9ZNVIX20ONld-k';
    private readonly signupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
    private readonly signinUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;

    user = new BehaviorSubject<User | null>(null);
    private tokenTimeout: any;

    constructor(private http: HttpClient, private router: Router) {}

    signUpUser(
        email: string,
        password: string
    ): Observable<FirebaseResponse> | Observable<any> {
        const firebaseAuthModel = new FirebaseAuthModel(email, password, true);

        return this.http
            .post<FirebaseResponse>(this.signupUrl, firebaseAuthModel)
            .pipe(catchError(this.handleError));
    }

    signInUser(email: string, password: string) {
        const firebaseAuthModel = new FirebaseAuthModel(email, password, true);

        return this.http
            .post<FirebaseResponse>(this.signinUrl, firebaseAuthModel)
            .pipe(
                catchError(this.handleError),
                tap((responseData: FirebaseResponse) => {
                    this.handleAuthentication(responseData);
                })
            );
    }

    private handleAuthentication(responseData: FirebaseResponse) {
        const expirationDate = new Date(
            new Date().getTime() + +responseData.expiresIn * 1000
        ).getTime();
        const user = new User(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            expirationDate
        );
        this.user.next(user);
        const timeLeftToExpiration = expirationDate - new Date().getTime();
        this.autoLogout(timeLeftToExpiration);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    logout() {
        localStorage.removeItem('userData');
        this.user.next(null);
        this.router.navigate(['/auth']);
        if (this.tokenTimeout) {
            clearTimeout(this.tokenTimeout);
        }
        this.tokenTimeout = null;
    }

    autoLogin() {
        const userstring = localStorage.getItem('userData');

        if (!userstring || userstring === '') {
            return;
        }

        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: number;
        } = JSON.parse(userstring);
        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            userData._tokenExpirationDate
        );
        if (loadedUser.token) {
            this.user.next(loadedUser);
            const timeLeftToExpiration =
                loadedUser.tokenExpirationDate - new Date().getTime();
            this.autoLogout(timeLeftToExpiration);
        }
    }

    autoLogout(tokenExpiryTimeInMilliseconds: number) {
        this.tokenTimeout = setTimeout(() => {
            this.logout();
        }, tokenExpiryTimeInMilliseconds);
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'Something Went Wrong';

        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(() => errorMessage);
        }

        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'Email Already Exists';
                break;
            case 'OPERATION_NOT_ALLOWED':
                errorMessage =
                    'Username/Password Authentication is Disabled At the Moment';
                break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errorMessage =
                    'Too Many Incorrect Attempts. Please Try Again Later.';
                break;
            case 'EMAIL_NOT_FOUND':
            case 'INVALID_PASSWORD':
                errorMessage = 'Invalid Credentials.';
                break;
            case 'USER_DISABLED':
                errorMessage = 'User Is Disabled';
                break;
        }

        return throwError(() => errorMessage);
    }
}
