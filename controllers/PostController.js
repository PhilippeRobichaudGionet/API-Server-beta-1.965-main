import Repository from '../models/repository.js';
import PostModel from '../models/post.js';
import Controller from './Controller.js';

export default
    class PostController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new PostModel()));
        this.params = HttpContext.path.params;
    }
    error(message) {
        if (this.params == null)
            this.params = {};
        this.params["error"] = message;
        this.HttpContext.response.JSON(this.params);
        return false;
    }
    get() {
        if (this.HttpContext.path.queryString != undefined)
            this.getFilteredPosts();
    }
    getFilteredPosts() {
        const { Title, Text, Category } = this.params;

        let posts = this.repository.getAll();
        if (Title || Text) {
            const MotFiltre = (Title || Text).toLowerCase();
            posts = posts.filter(post =>
                (post.Title && post.Title.toLowerCase().includes(MotFiltre)) ||
                (post.Text && post.Text.toLowerCase().includes(MotFiltre))
            );
        }
        if (Category) {
            posts = posts.filter(post => post.Category === Category);
        }
        if (posts.length > 0) {
            this.HttpContext.response.JSON(posts);
        } else {
            this.error("Aucun post ne correspond aux paramètres.");
        }
    }
}