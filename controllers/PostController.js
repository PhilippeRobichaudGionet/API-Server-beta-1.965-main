import Repository from '../models/repository.js';
import PostModel from '../models/post.js';
import Controller from './Controller.js';

export default
    class PostController extends Controller {
        constructor(HttpContext) {
            super(HttpContext, new Repository(new PostModel()));
        }
    }