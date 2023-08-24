import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from 'src/app/recipes/Models/recipe.model';
import { Ingredient } from 'src/app/shopping-list/Models/Ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor() { }

  recipeSelected = new EventEmitter<Recipe>();

  private recipes : Recipe[] = 
  [
    new Recipe
    (
      "Test 1", 
      "Test 1 Description",
      "https://imagesvc.meredithcorp.io/v3/mm/image?url=https:%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F1107107.jpg",
      [
        new Ingredient("Bread", 1),
        new Ingredient("Tomatoes", 2)
      ]
    ),
    new Recipe
    (
      "Test 2", 
      "Test 2 Description",
      "https://i.pinimg.com/originals/6c/f4/6f/6cf46f697a2a3a8e96f9df3a728b988f.jpg",
      [
        new Ingredient("Salt", 1),
        new Ingredient("Pepper", 2)
      ]
    ),
  ]

  getRecipes() : Recipe[] {
    return this.recipes.slice();
  }
}
