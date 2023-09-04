import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from '../Models/recipe.model';
import { RecipeService } from 'src/app/services/recipe/recipe.service';

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
    editMode: boolean = false;
    recipeId!: number;
    isEditSubscription!: Subscription;
    selectedRecipe!: Recipe;
    recipeEditForm!: FormGroup;

    get controls() {
        return (<FormArray>this.recipeEditForm.get('ingredients')).controls;
    }

    constructor(
        private route: ActivatedRoute,
        private recipeService: RecipeService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.isEditSubscription = this.route.params.subscribe(
            (params: Params) => {
                this.recipeId = +params['id'];
                this.editMode = params['id'] != null;
                this.initializeForm();
            }
        );
    }
    ngOnDestroy(): void {
        this.isEditSubscription.unsubscribe();
    }

    onFormSubmit() {
        const recipeName = this.recipeEditForm.value['name'];
        const recipeDescription = this.recipeEditForm.value['description'];
        const recipeImagePath = this.recipeEditForm.value['imagePath'];
        const recipeIngredients = this.recipeEditForm.value['ingredients'];
        const newRecipe = new Recipe(
            this.editMode ? this.recipeId : this.RandomId,
            recipeName,
            recipeDescription,
            recipeImagePath,
            recipeIngredients
        );
        if (this.editMode) {
            this.recipeService.updateRecipe(this.recipeId, newRecipe);
        } else {
            this.recipeService.addRecipe(newRecipe);
        }
        this.onCancel();
    }

    get RandomId() {
        return Math.floor(Math.random() * 1001);
    }

    private initializeForm() {
        let recipeName = '';
        let recipeImagePath = '';
        let recipeDescription = '';
        let recipeIngredients = new FormArray<FormGroup>([]);

        if (this.editMode) {
            this.selectedRecipe = this.recipeService.getRecipe(this.recipeId);
            recipeName = this.selectedRecipe.name;
            recipeImagePath = this.selectedRecipe.imagePath;
            recipeDescription = this.selectedRecipe.description;
            if (this.selectedRecipe['ingredients']) {
                for (let ingredient of this.selectedRecipe.ingredients) {
                    recipeIngredients.push(
                        new FormGroup({
                            name: new FormControl(
                                ingredient.name,
                                Validators.required
                            ),
                            amount: new FormControl(ingredient.amount, [
                                Validators.required,
                                Validators.pattern(/^[1-9]+[0-9]*$/),
                            ]),
                        })
                    );
                }
            }
        }

        this.recipeEditForm = new FormGroup({
            name: new FormControl(recipeName, Validators.required),
            imagePath: new FormControl(recipeImagePath, Validators.required),
            description: new FormControl(
                recipeDescription,
                Validators.required
            ),
            ingredients: recipeIngredients,
        });
    }

    onAddIngredient() {
        (<FormArray>this.recipeEditForm.get('ingredients')).push(
            new FormGroup({
                name: new FormControl(null, Validators.required),
                amount: new FormControl(null, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                ]),
            })
        );
    }

    onCancel() {
        this.router.navigate(['../'], {relativeTo: this.route})
    }

    onDeleteIngredient(index: number) {
        (<FormArray>this.recipeEditForm.get('ingredients')).removeAt(index);
    }
}
