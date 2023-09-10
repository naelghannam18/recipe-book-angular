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

  private recipes : Recipe[] = []

  setRecipes(recipes:Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice())
  }

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
