// import { HttpClient } from "@angular/common/http";
// import { Injectable,  OnInit } from "@angular/core";

// import { Recipe } from '../app/recipes/recipe.model'

// import { RecipeService } from "src/app/recipes/recipe.service";
// import {  map,  tap } from "rxjs";
// import { Store } from "@ngrx/store";
// import  * as fromApp from '../app/store/app.reducer'
// import * as RecipesActions from '../app/recipes/store/recipe.actions'

// @Injectable({
//     providedIn: 'root'
// })
// export class DataStorageService implements OnInit {
//     constructor(private httpClient: HttpClient,
//         private recipeServices: RecipeService,
//         private store: Store<fromApp.AppState> ) {
//     }

//     ngOnInit(): void {

//     }

//     storeRecipes() {
//         const recipes = this.recipeServices.getRecipes();
//         this.httpClient
//             .put('https://ng-course-recipe-book-e04e9-default-rtdb.firebaseio.com/recipes.json', recipes)
//             .subscribe(response => {
//                 console.log(response);
//             });
//     }

//     fetchRecipes() {

//         return this.httpClient
//             .get<Recipe[]>('https://ng-course-recipe-book-e04e9-default-rtdb.firebaseio.com/recipes.json')
//             .pipe(map(recipes => {
//                 return recipes.map(recipe => {
//                     return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
//                 })
//             }), tap(recipes => {
//                 this.store.dispatch(new RecipesActions.SetRecipes(recipes))
//             }));
//     }
// }