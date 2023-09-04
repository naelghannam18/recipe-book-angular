import { Component } from '@angular/core';
import { Recipe } from './Models/recipe.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent{
  
  selectedRecipe!: Recipe;
  recipeSelected!: Subscription;

  constructor(){}
  


}
