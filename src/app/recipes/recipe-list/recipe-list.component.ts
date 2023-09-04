import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../Models/recipe.model';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy{

  recipes!: Recipe[];
  recipesChangesSubscription!: Subscription;

  constructor(private recipeService: RecipeService){}

  ngOnInit(): void {
    this.recipesChangesSubscription = this.recipeService.recipesChanged
    .subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    })
    this.recipes = this.recipeService.getRecipes();
  }

  ngOnDestroy(): void {
    this.recipesChangesSubscription.unsubscribe();
  }
}
