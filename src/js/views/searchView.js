import { elements } from './base';

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((accumulator, current) => {
            if (accumulator + current.length <= limit) {
                newTitle.push(current);
            }
            return accumulator + current.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

export const highlightSelected = id => {
    const results = Array.from( document.querySelectorAll('.results__link'));
    results.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

export const clearInput = () => elements.searchInput.value = '';

export const clearResultsList = () => {
    elements.searchResultsList.innerHTML = '';
    elements.searchResultsPage.innerHTML = '';
}

export const getInput = () => elements.searchInput.value;

const createButton = (pageNumber, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? pageNumber - 1 : pageNumber + 1}>
    <span>Page ${type === 'prev' ? pageNumber - 1 : pageNumber + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
</button>`;

const renderPageButtons = (page, numResults, resultsPerPage) => {
    const numberOfPages = Math.ceil(numResults / resultsPerPage);
    let button;
    if (page === 1 && numberOfPages > 1) {
        button = createButton(page, 'next');
    } else if (page < numberOfPages) {
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
        `;
    } else if (page == numberOfPages) {
        button = createButton(page, 'prev');
    }

    elements.searchResultsPage.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, currentPage = 1, resultsPerPage = 10) => {
    const start = (currentPage - 1) * resultsPerPage;
    const end = currentPage * resultsPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    renderPageButtons(currentPage, recipes.length, resultsPerPage);
};