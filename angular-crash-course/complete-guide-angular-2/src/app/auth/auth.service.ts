
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer'
import * as authActions from '../auth/store/auth.actions'

@Injectable({ providedIn: 'root' })
export class AuthService {
    
    private tokenExpirationTimer: any;

    constructor(private store: Store<fromApp.AppState>) {

    }

    setLogoutTimer(expirationDuration: number){
       this.tokenExpirationTimer =  setTimeout(() => {
                this.store.dispatch(new authActions.LogOut());
            }, expirationDuration);
    }

    clearTimeoutTimer() {
        if(this.tokenExpirationTimer)   {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }



}