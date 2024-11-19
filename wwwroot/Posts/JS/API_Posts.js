//const API_URL = "https://api-server-5.glitch.me/api/Post";
const API_URL = "http://localhost:5000/api/Post";
class API {
    static initHttpState() {
        this.currentHttpError = "";
        this.currentStatus = 0;
        this.error = false;
    }
    static setHttpErrorState(xhr) {
        if (xhr.responseJSON)
            this.currentHttpError = xhr.responseJSON.error_description;
        else
            this.currentHttpError = xhr.statusText == 'error' ? "Service introuvable" : xhr.statusText;
        this.currentStatus = xhr.status;
        this.error = true;
    }

    static getPosts(query = "") {
        API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: API_URL + query,
                success: posts => { resolve(posts); },
                error: (xhr) => { API.setHttpErrorState(xhr); resolve(null); }
            });
        });
    }
    static getPost(postId) {
        console.log("bonsoir");
        API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: API_URL + "/" + postId,
                success: post => { resolve(post); },
                error: (xhr) => { API.setHttpErrorState(xhr); resolve(null); }
            });
        });
    }
    static API_SavePost(post, create) {
        API.initHttpState();
        console.log("Données envoyées au serveur :", post); // Ajout du log
        return new Promise(resolve => {
            $.ajax({
                url: create ? API_URL :  API_URL + "/" + post.Id,
                type: create ? "POST" : "PUT",
                contentType: 'application/json',
                data: JSON.stringify(post),
                success: (/*data*/) => { currentHttpError = ""; resolve(true); },
                error: (xhr) => {currentHttpError = xhr.responseJSON.error_description; resolve(false /*xhr.status*/); }
            });
        });
    }
    static deletePost(id) {
        API.initHttpState();
        console.log("Delete");
        return new Promise(resolve => {
            $.ajax({
                url: API_URL + "/" + id,
                type: "DELETE",
                success: () => { resolve(true); },
                error: (xhr) => { API.setHttpErrorState(xhr); resolve(null); }
            });
        });
    }
}