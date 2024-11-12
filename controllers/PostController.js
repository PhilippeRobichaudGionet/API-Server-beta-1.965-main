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
        if (this.HttpContext.path.queryString != '')
            this.getFilteredPosts();
        else
            this.list();
    }
    list() {
            this.HttpContext.response.JSON(
                this.repository.getAll(this.HttpContext.path.params, this.repository.ETag)
            );
        }
    getFilteredPosts() {
        const { title, text, category } = this.params;
        let posts = this.repository.getAll(this.HttpContext.path.params, this.repository.ETag);
        // Filtrage par mot-clé dans le titre ou texte
        if (title || text) {
            const MotFiltre = (title || text).toLowerCase();
            posts = posts.filter(post =>
                (post.Title && post.Title.toLowerCase().includes(MotFiltre)) ||
                (post.Text && post.Text.toLowerCase().includes(MotFiltre))
            );
        }
        if (category) {
            posts = posts.filter(post => post.category === category);
        }
        if (posts!= null &&posts.length > 0 ) {
            this.HttpContext.response.JSON(posts);
        } else {
            this.error("Aucun post ne correspond aux paramètres.");
        }
    }
}