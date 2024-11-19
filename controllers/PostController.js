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
            const { keywords } = this.params;
            let posts = this.repository.getAll(this.HttpContext.path.params, this.repository.ETag);
            const filterKeyword = keywords ? keywords.toLowerCase() : null;
        
            if (filterKeyword) {
                posts = posts.filter(post =>
                    (post.Title && post.Title.toLowerCase().includes(filterKeyword)) ||
                    (post.Text && post.Text.toLowerCase().includes(filterKeyword)) ||
                    (post.Category && post.Category.toLowerCase().includes(filterKeyword))
                );
            }
        
            if (posts && posts.length > 0) {
                this.HttpContext.response.JSON(posts);
            } else {
                this.error("Aucun post ne correspond aux paramètres.");
            }
        }
        
}