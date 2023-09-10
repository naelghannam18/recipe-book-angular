import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from 'src/app/recipes/Models/recipe.model';
import { RecipeService } from '../recipe/recipe.service';
import { tap, map, Observable, take } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DataStorageService {
    private mainUrl =
        'https://ng-complete-guide-f82f4-default-rtdb.firebaseio.com';
    private readonly recipesCollection = 'recipes';

    constructor(
        private httpClient: HttpClient,
        private recipeService: RecipeService,
    ) {}

    storeRecipes() {

        const recipes = this.recipeService.getRecipes();
        return this.httpClient
            .put<Recipe[]>(
                `${this.mainUrl}/${this.recipesCollection}.json`,
                recipes
            )
            .subscribe((response) => {
            });
    }

    fetchRecipes() : Observable<Recipe[]>{
        return this.httpClient
            .get<Recipe[]>(`${this.mainUrl}/${this.recipesCollection}.json`)
            // Here we are using pipe to make sure that the recipe contains an ingredient object even if its empty
            .pipe(
                map((recipes) => {
                    // Map From RxJs
                    return recipes.map((recipe) => {
                        // Array Map
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients
                                ? recipe.ingredients
                                : [],
                        };
                    });
                }),
                tap((recipes) => {
                    this.recipeService.setRecipes(recipes);
                })
            );
    }
}
