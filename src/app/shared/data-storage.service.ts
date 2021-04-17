import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipesService } from "../recipes/recipes.service";
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataStorageService {

    constructor(private http: HttpClient, private recipeService: RecipesService) { }

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http
            .put('https://ng-recipe-book-579f6-default-rtdb.firebaseio.com/recipes.json', recipes)
            .subscribe((response) => {
                console.log(response);
            });
    }

    fetchRecipes() {
        return this.http
            .get<Recipe[]>('https://ng-recipe-book-579f6-default-rtdb.firebaseio.com/recipes.json')
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                    })
                }),
                tap(recipes => {
                    this.recipeService.setRecipes(recipes);
                })
            )
    }
}