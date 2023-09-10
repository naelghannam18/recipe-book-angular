import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "../Models/recipe.model";
import { DataStorageService } from "../../services/data-storage/data-storage.service";
import { RecipeService } from "../../services/recipe/recipe.service";

@Injectable({
    providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]>{
    constructor(private datastorageServie: DataStorageService, private recipeService: RecipeService) {

    }

    resolve(route: ActivatedRouteSnapshot, status: RouterStateSnapshot) {
        const recipes = this.recipeService.getRecipes();
        if(recipes.length === 0) return this.datastorageServie.fetchRecipes();
        else return recipes;
    }
}