import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { AuthResponseData } from '../authResponse';
import { User } from '../user.model';

import * as AuthActions from './auth.actions'

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {

    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    const user = new User(email, userId, token, expirationDate);

    localStorage.setItem('userData', JSON.stringify(user));

    return new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
        redirect: true
    });

}

const handleError = (errorRes: any) => {

    let errorMessage = 'An unknown error ocurred';
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already.';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exists.';
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'This password is not correct.';
            break;
        case 'USER_DISABLED':
            errorMessage = 'The user account has been disabled by an administrator.';
            break;

    }
    return of(new AuthActions.AuthenticateFail(errorMessage));


}

@Injectable()
export class AuthEffects {

    authSignup$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {

            return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, {
                email: signupAction.payload.email,
                password: signupAction.payload.password,
                returnSecureToken: true
            }).pipe(
                tap((resData) => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                }),
                map(resData =>
                    handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
                ),
                catchError(errorRes => handleError(errorRes)))
        })
    ));

    authLogin$ = createEffect(
        () => this.actions$.pipe(
            ofType(AuthActions.LOGIN_START),
            switchMap((authData: AuthActions.LoginStart) => {
                return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }).pipe(
                    tap((resData) => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                    }),
                    map(resData => handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)),
                    catchError(errorRes => handleError(errorRes)))
            }),
        )
    );

    autoLogin = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData'));

            if (!userData) {
                return { type: 'DUMMY' }
            }

            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

            if (loadedUser.token) {

                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);
                return new AuthActions.AuthenticateSuccess({
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate),
                    redirect: false

                });

            }

            return { type: 'DUMMY' }

        })

    ));

    authRedirect$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {

            if (authSuccessAction.payload.redirect) {
                this.router.navigate(['/']);
            }
        }
        )), { dispatch: false })

    authLogout$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearTimeoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })

    ), { dispatch: false });

    constructor(private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService) {

    }
}