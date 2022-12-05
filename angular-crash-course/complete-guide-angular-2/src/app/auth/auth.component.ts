import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "src/shared/alert/alert.component";
import { PlaceHolderDirective } from "src/shared/placeholder/placeholder.directive";
import {  AuthService } from "./auth.service";

import * as fromApp from '../store/app.reducer'
import * as authActions from './store/auth.actions'
import { AuthResponseData } from "./authResponse";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy, OnInit {

    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceHolderDirective, { static: false }) alertHost: PlaceHolderDirective;

    private closeSub: Subscription;
    private storeSub: Subscription;

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private store: Store<fromApp.AppState>) {

    }
    ngOnInit(): void {
        this.storeSub = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;

            if (this.error) {
                this.showErrorAlert(this.error);
            }

        });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        const email = form.value.email;
        const password = form.value.password;

        this.isLoading = true;

        if (this.isLoginMode) {

            this.store.dispatch(new authActions.LoginStart({ email, password }))
        } else {
            this.store.dispatch(new authActions.SignupStart({ email: email, password: password }));
        }

        form.reset();
    }

    onHandleError() {
        this.store.dispatch(new authActions.ClearError());
    }

    private showErrorAlert(errorMessage: string) {

        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = errorMessage;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });

    }

    ngOnDestroy(): void {
        if (this.closeSub) {
            this.closeSub.unsubscribe();
        }

        if(this.storeSub){
            this.storeSub.unsubscribe();
        }
    }

}