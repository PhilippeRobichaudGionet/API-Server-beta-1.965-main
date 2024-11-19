let search = "";
let endOfData = false;
let pageManager;
Init_UI();

function Init_UI() {

    let PostItemLayout = {
        width: $("#sample").outerWidth(),
        height: $("#sample").outerHeight()
    };

    pageManager = new PageManager('scrollPanel', 'News', PostItemLayout, renderPosts);
    $("#actionTitle").text("Fil de nouvelles");
    $("#search").show();
    $("#abort").hide();
    $('#aboutContainer').hide();
    $("#errorContainer").hide();

    $('#abort').on("click", async function () {
        $("#aboutContainer").hide();
        $("#errorContainer").hide();
        $("#abort").hide();
        $("#search").show();
        $("#scrollPanel").show();
        $("#actionTitle").text("Mots");
    });
    $('#aboutCmd').on("click", function () {
        renderAbout();
    });
    $("#searchKey").on("change", () => {
        doSearch();
    })
    $('#doSearch').on('click', () => {
        doSearch();
    })
    $('#add').click(function (e) { 
        e.preventDefault();
        renderAdd()
    });
}
function doSearch() {
    search = $("#searchKey").val().replace(' ', ',');
    pageManager.reset();
}
function renderAbout() {
    $("#scrollPanel").hide();
    $("#abort").show();
    $("#search").hide();
    $("#actionTitle").text("À propos...");
    $("#aboutContainer").show();
}
function renderError(message) {
    removeWaitingGif();
    $("#scrollPanel").hide();
    $("#abort").show();
    $("#search").hide();
    $("#actionTitle").text("Erreur du serveur...");
    $("#errorContainer").show();
    $("#errorContainer").empty();
    $("#errorContainer").append(
        $(`
            <span class="errorContainer">
                ${message}
            </span>
        `)
    );
}
function renderAdd(post = null) {
    let create = post === null;
    if (create) {
        post = newNews();
        post.Image = "Image/News-Logo.jpg";
    }
    $("#createContact").hide();
    $("#abort").show();
    eraseContent(); 
    $("#actionTitle").text(create ? "Créer un post" : "Modifier le post");
    $("#content").append(`
        <form class="form" id="postForm">
            <label for="Title" class="form-label">Titre</label>
            <input
                class="form-control"
                name="Title"
                id="Title"
                placeholder="Titre"
                required
                value="${post.Title}"
            />
            <br>
            <label for="Text" class="form-label">Texte</label>
            <textarea
                class="form-control"
                name="Text"
                id="Text"
                placeholder="Texte"
                required
            >${post.Text}</textarea>
            <br>
            <label for="Category" class="form-label">Catégorie</label>
            <input
                class="form-control"
                name="Category"
                id="Category"
                placeholder="Catégorie"
                required
                value="${post.Category}"
            />
            <br>
            <!-- Uploader d'image -->
            <label class="form-label">Image</label>
            <div 
                class="imageUploader"
                newImage="${create}"
                controlId="Image"
                imageSrc="${post.Image}"
                waitingImage="Loading_icon.gif"
            ></div>
            <hr>
            <button type="submit" id="savePost" class="btn btn-primary">Enregistrer</button>
            <button type="button" id="cancel" class="btn btn-secondary">Annuler</button>
        </form>
    `);

    initImageUploaders();
    initFormValidation();
    $('#postForm').on("submit", async function (event) {
        event.preventDefault();
        let postData = getFormData($("#postForm")); 
        showWaitingGif();

        let result = await API.API_SavePost(postData, create);

        if (result) {
            renderPosts();
        } else {
            renderError("Une erreur est survenue lors de l'enregistrement !");
        }
    });

    $('#cancel').on("click", function () {
        renderPosts();
    });
    
}
function getFormData($form) {
    const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
    var jsonObject = {};
    $.each($form.serializeArray(), (index, control) => {
        jsonObject[control.name] = control.value.replace(removeTag, "");
    });
    jsonObject["Creation"] = new Date().toISOString();

    return jsonObject;
}

function showWaitingGif() {
    eraseContent();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='Loading_icon.gif' /></div>'"));
}
async function renderPosts(queryString = "") {
    if (search != "") queryString += "&keywords=" + search;
    addWaitingGif();
    let posts = await API.getPosts(queryString);
    if (API.error) {
        renderError(API.currentHttpError);
    } else {
        if (posts.length > 0) {
            posts.forEach(post => {
                $("#News").append(renderPost(post)); 
            });
        } else {
            renderError("Aucun post trouvé.");
        }
    }
    removeWaitingGif();
    return true;
}

function addWaitingGif() {
    $("#wordsPanel").append($("<div id='waitingGif' class='waitingGifcontainer'><img class='waitingGif' src='Loading_icon.gif' /></div>'"));
}
function removeWaitingGif() {
    $("#waitingGif").remove();
}

function renderPost(post) {
    return $(`
    <div class="Newsrow">
        <div class="BtnSection">
            <button id="Edit" value="${post.id}" class="Btn"><i class="fa-solid fa-pencil"></i></button>
            <button id="Delete" class="Btn"><i class="fa-solid fa-xmark" onclick="API.deletePost('${post.Id}')"></i></button>
        </div>

        <h3 id="Category">${post.Category}</h3>
        <br>
        <h1 id="Title">${post.Title}</h1>
        <br>
        <img id="Image" src="../assetsRepository/${post.Image}"/>
        <p id="Date">${post.Creation}</p>
        <br>
        <p id="Desc">${post.Text}</p>
    </div>
    <br><br>    
    `);
}

function newNews() {
    News = {};
    News.Title = "";
    News.Text = "";
    News.Category = "";
    News.Image = "";
    News.Creation= new Date().toISOString();
    return News;
}
function eraseContent() {
    $("#content").empty();
}