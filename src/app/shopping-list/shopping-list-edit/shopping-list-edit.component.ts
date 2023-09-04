import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Ingredient } from '../Models/Ingredient.model';
import { ShoppingListService } from 'src/app/services/shopping-list/shopping-list.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-shopping-list-edit',
    templateUrl: './shopping-list-edit.component.html',
    styleUrls: ['./shopping-list-edit.component.css'],
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {

    addIngredientsForm!: FormGroup;
    startedEditingSubscription!: Subscription;
    editMode = false;
    editedItemIndex!: number;
    editedItem!: Ingredient;

    constructor(private shoppingListService: ShoppingListService) {}

    ngOnInit(): void {
        this.addIngredientsForm = new FormGroup({
            ingName: new FormControl(null, [
                Validators.required,
                this.ingredientNameValidator,
            ]),
            ingAmount: new FormControl(null, [
                Validators.required,
                this.ingredientAmountValidator,
            ]),
        });
        this.startedEditingSubscription =
            this.shoppingListService.startedEditing.subscribe(
                (index: number) => {
                    this.editMode = true;
                    this.editedItemIndex = index;
                    this.editedItem = this.shoppingListService.getIngredient(index);
                    this.addIngredientsForm.setValue({ingName: this.editedItem.name, ingAmount: this.editedItem.amount});
                }
            );
    }

    onIngredientSubmit() {
      const ingName = this.addIngredientsForm.get('ingName')?.value;
      const ingAmount = this.addIngredientsForm.get('ingAmount')?.value;
      const ing = new Ingredient(ingName, ingAmount);

        if (!this.editMode) 
        {
            this.shoppingListService.addIngredient(ing);
        }
        else 
        {
          this.shoppingListService.updateIngredient(this.editedItemIndex, ing);
          this.editMode = false;
        }
        this.addIngredientsForm.reset();
      }

    ingredientNameValidator(crtl: FormControl) : { [s: string]: boolean } | null
    {
        if (crtl.value != null && crtl.value.length < 2)
            return { ingredientNameTooShort: true };
        else return null;
    }

    ingredientAmountValidator(crtl: FormControl) : { [s: string]: boolean } | null
    {
        if (crtl.value != null && crtl.value <= 0)
            return { 'invalid Quantity': true };
        else return null;
    }

    onDeleteIngredient() {
        if (this.editedItemIndex != null) {
          this.shoppingListService.deleteIngredient(this.editedItemIndex);
          this.onClearInputs();
        }
    }

    onClearInputs() {
        this.editMode=false;
        this.addIngredientsForm.reset();
    }

    ngOnDestroy(): void {
        this.startedEditingSubscription.unsubscribe();
    }
}
