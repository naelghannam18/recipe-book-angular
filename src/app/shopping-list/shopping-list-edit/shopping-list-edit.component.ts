import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../Models/Ingredient.model';
import { ShoppingListService } from 'src/app/services/shopping-list/shopping-list.service';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit {
  
  @ViewChild("nameInput", {static: false}) nameInputReference!: ElementRef;
  @ViewChild("amountInput", {static: false}) amountInputReference!: ElementRef;

  constructor(private shoppingListService: ShoppingListService){}
  
  ngOnInit(): void {
    
  }

  onAddItem() {
    const ingredientName = this.nameInputReference.nativeElement.value;
    const ingredientAmount = this.amountInputReference.nativeElement.value;
    const newIngredient: Ingredient = new Ingredient(ingredientName, ingredientAmount);
    this.shoppingListService.addIngredient(newIngredient);
  }

}
