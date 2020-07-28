import { elements } from "../views/base";

export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {id, title, author, img};
        this.likes.push(like);
        this.persistLikeData();
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(element => element.id === id);
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        return this.likes.findIndex(element => element.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistLikeData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likes = storage;
        
    }
}