import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../Models/recipe.model';
import { ShoppingListService } from 'src/app/services/shopping-list/shopping-list.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit{
  
  @Input() recipe!: Recipe;

  constructor(private shoppingListService: ShoppingListService){}
  
  ngOnInit(): void {
  }

  addToShoppingList() {
    this.recipe.ingredients.forEach(ing => {
      this.shoppingListService.addIngredient(ing);
    })
  }

}
