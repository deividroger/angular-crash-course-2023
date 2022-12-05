import { Component,  OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, Subscription } from "rxjs";

import * as fromApp from '../store/app.reducer'
import * as authAction from '../auth/store/auth.actions'
import * as recipeActions from '../recipes/store/recipe.actions'

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

    isAuthenticated = false;
    private userSub: Subscription;


    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.userSub = this.store.select('auth').pipe(map(authState => authState.user)).subscribe(user => {
            this.isAuthenticated = !!user;
        });
    }

    onSaveData() {

        this.store.dispatch(new recipeActions.StoreRecipes());
    }

    onFetchData() {
        this.store.dispatch(new recipeActions.FetchRecipes());
    }

    onLogout() {
        this.store.dispatch(new authAction.LogOut());
    }

    ngOnDestroy(): void {

        this.userSub.unsubscribe();
    }

}