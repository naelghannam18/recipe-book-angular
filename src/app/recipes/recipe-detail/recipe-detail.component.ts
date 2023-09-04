import { Component, OnInit } from '@angular/core';
import { Recipe } from '../Models/recipe.model';
import { ShoppingListService } from 'src/app/services/shopping-list/shopping-list.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe/recipe.service';

@Component({
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
    recipe!: Recipe;
    recipeId!: number;
    constructor(
        private shoppingListService: ShoppingListService,
        private route: ActivatedRoute,
        private recipeService: RecipeService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.recipeId = +params['id'];
            this.recipe = this.recipeService.getRecipe(this.recipeId);
        });
    }

    addToShoppingList() {
        this.recipe.ingredients.forEach((ing) => {
            this.shoppingListService.addIngredient(ing);
        });
    }

    onDeleteRecipe() {
        this.recipeService.deleteRecipe(this.recipe.id);
        this.router.navigate(['/recipes']);
    }
}
