import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/shared/ingredient.model';


import * as ShoppingListActions from '../store/shopping-list-actions';

import * as fromApp from '../../store/app.reducer'

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', { static: false }) slForm: NgForm;

  subscription: Subscription;
  editMode = false;
  
  editedItem: Ingredient;
  constructor(private store: Store<fromApp.AppState>) { }


  ngOnInit(): void {

    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      this.editMode = false
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;

        this.slForm.resetForm({
          name: stateData.editedIngredient.name,
          amount: stateData.editedIngredient.amount,
        });
      }

    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());

  }

  onSubmit(form: NgForm) {

    const value = form.value;

    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));

    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
      
    }

    this.onClear();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {

    this.store.dispatch(new ShoppingListActions.DeleteIngredient());

    this.onClear();

  }
}