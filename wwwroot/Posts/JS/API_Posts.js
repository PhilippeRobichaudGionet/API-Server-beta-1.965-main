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
        //console.log(API_URL + query);
        return new Promise(resolve => {
            $.ajax({
                url: API_URL + query,
                success: posts => {
                    //console.log(posts);
                     resolve(posts); },
                error: (xhr, status, error) => {
                    console.error("Erreur AJAX :", status, error, xhr.responseText);
                    API.setHttpErrorState(xhr);
                    resolve(null);
                }
            });            
        });
    }
    static getPost(postId) {
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
        console.log("Données envoyées au serveur :", post);
        console.log(post.Id);
        // Validate post and ID for PUT
        if (!create && !post.Id) {
            console.error("Cannot update post: Missing 'Id' property in the post object.");
            return Promise.resolve(false);
        }
    
        return new Promise(resolve => {
            $.ajax({
                url: create ? API_URL : `${API_URL}/${post.Id}`,
                type: create ? "POST" : "PUT",
                contentType: 'application/json',
                data: JSON.stringify(post),
                success: () => {
                    this.currentHttpError = "";
                    resolve(true);
                },
                error: (xhr) => {
                    this.currentHttpError = xhr.responseJSON ? xhr.responseJSON.error_description : xhr.statusText;
                    console.error("Failed to save post:", this.currentHttpError);
                    resolve(false);
                }
            });
        });
    }
    
    static deletePost(id) {
        API.initHttpState();
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