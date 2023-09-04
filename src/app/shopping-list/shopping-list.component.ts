import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from './Models/Ingredient.model';
import { ShoppingListService } from '../services/shopping-list/shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  
  private ingredientsChangesSubscription!: Subscription;
  
  ingredients: Ingredient[] = [];

  constructor(private shoppingListService: ShoppingListService){}

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientsChangesSubscription = this
    .shoppingListService
    .ingredientsChanged
    .subscribe((ings: Ingredient[]) =>
    {
      this.ingredients = ings;
      console.log(this.ingredients)
    })
  }

  ngOnDestroy(): void {
    this.ingredientsChangesSubscription.unsubscribe();
  }

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }

}
