import axios from 'axios';
import { forkifyURLRoot } from '../config/config';
import { elements } from '../views/base';

export default class Recipe {
    constructor(id) {
        this.id = id;

    }

    async getRecipe() {
        try {
            let response = await axios(`${forkifyURLRoot}/get?rId=${this.id}`);
            let recipe = response.data.recipe;
            this.title = recipe.title;
            this.author = recipe.publisher;
            this.img = recipe.image_url;
            this.url = recipe.source_url;
            this.ingredients = recipe.ingredients;
            console.log(recipe);
        } catch (error) {
            console.log(error);
        }
    }

    calcTime() {
        const numOfIngredients = this.ingredients.length;
        const periods = Math.ceil(numOfIngredients / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const newIngredients = this.ingredients.map(element => {

            const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','cup','pounds','pound'];
            const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cp', 'cp', 'lb', 'lb']
            const units = [...unitsShort, 'kg', 'g'];
            let ingredient = element.toLowerCase();
            
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, units[i]);
            });

            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            
            const arrIngredients = ingredient.split(' ');
            const unitIndex = arrIngredients.findIndex(element2 => units.includes(element2));
            let objIngredient;

            if (unitIndex > -1 ){
                const arrCount = arrIngredients.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIngredients[0].replace('-', '+'));
                } else {
                    count = eval(arrIngredients.slice(0, unitIndex).join('+'));
                }
                objIngredient = {
                    count,
                    unit: arrIngredients[unitIndex],
                    ingredient: arrIngredients.slice(unitIndex + 1).join(' '),
                }
            } else if (parseInt(arrIngredients[0], 10)) {
                objIngredient = {
                    count: parseInt(arrIngredients[0], 10),
                    unit: '',
                    ingredient: arrIngredients.slice(1).join(' '),
                }
            } else if (unitIndex === -1) {
                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            
            return objIngredient;
        });

        this.ingredients = newIngredients;
    }
    
    updateServings(type) {
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        
        this.ingredients.forEach(ingredient => {
            ingredient.count *=  (newServings / this.servings);
        });
        
        this.servings = newServings;
    }
}