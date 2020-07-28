import axios from 'axios';
import { forkifyURLRoot } from '../config/config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            let response = await axios(`${forkifyURLRoot}/search?q=${this.query}`);
            this.result = response.data.recipes;
        } catch (error) {
            console.log(error);
        }
    }
    
}