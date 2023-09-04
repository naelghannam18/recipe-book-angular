import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from 'src/app/recipes/Models/recipe.model';
import { Ingredient } from 'src/app/shopping-list/Models/Ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  constructor() { }

  private recipes : Recipe[] = 
  [
    new Recipe
    (
      1,
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
      2,
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

  getRecipe(id: number) : Recipe {
    return this.recipes.filter(r => r.id === id)[0];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(id: number, newRecipe: Recipe) {
    const index = this.recipes.findIndex(r => r.id === id);

    if (index != -1) {
      this.recipes[index] = newRecipe;
      this.recipesChanged.next(this.recipes.slice())
    }
  }

  deleteRecipe(id: number) {
    const index = this.recipes.findIndex(r => r.id === id);
    if (index != -1) {
      this.recipes.slice(index, 1);
      this.recipesChanged.next(this.recipes.slice());
    }
  }

  addIngredientToRecipe(recipeId: number, ingredient: Ingredient) {
    const index = this.recipes.findIndex(r => r.id === recipeId);

    if (index != -1) {
      this.recipes[index].ingredients.push(ingredient);
      this.recipesChanged.next(this.recipes.slice());
    }
  }
}
