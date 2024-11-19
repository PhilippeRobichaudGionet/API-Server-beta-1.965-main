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
function renderAdd(){
    $("#scrollPanel").hide();
    $("#abort").hide();
    $("#search").hide();
    $("#actionTitle").text("Ajouter");
    $("#aboutContainer").hide();
    $("#AddPost").show();
    News = newNews()
    $("#content").append(`
        <form class="form" id="BookmarkForm">
            <label for="Title" class="form-label">Titre </label>
            <input 
                class="form-control Alpha"
                name="Title" 
                id="Title" 
                placeholder="Titre"
                required
                RequireMessage="Veuillez entrer un titre"
                InvalidMessage="Le titre comporte un caractère illégal"
            />
            <br><br>
            <label for="Text" class="form-label">Text </label>
            <input
                class="form-control Text"
                name="Text"
                id="Text"
                placeholder="Text"
                required
            />
            <br><br>
            <label for="Category" class="form-label">Catégorie </label>
            <input 
                class="form-control"
                name="Category"
                id="Category"
                placeholder="Catégorie"
                required
            />
            <br><br>
            <input type="submit" value="Enregistrer" id="saveBookmark" class="btn btn-primary">
            <input type="button" value="Annuler" id="cancel" class="btn btn-secondary">
        </form>
    `);
}
async function renderPosts(queryString) {
    if (search != "") queryString += "&keywords=" + search;
    addWaitingGif();
    let endOfData = true;
    let posts = await API.getPosts(queryString);
    if (API.error)
        renderError(API.currentHttpError);
    else
        if (posts.length > 0) {
            let i = 1;
            posts.forEach(post => { $("#News").append(renderPost(post,i)); i++});
            endOfData = false;
        } else
            removeWaitingGif();
    return true;
}
function addWaitingGif() {
    $("#wordsPanel").append($("<div id='waitingGif' class='waitingGifcontainer'><img class='waitingGif' src='Loading_icon.gif' /></div>'"));
}
function removeWaitingGif() {
    $("#waitingGif").remove();
}

function renderPost(post,elemNum) {
    return $(`
    <div id="Newsrow">
        <div id="BtnSection${elemNum}" hidden>
            <button id="Edit" class="Btn"><i class="fa-solid fa-pencil"></i></button>
            <button id="Delete" class="Btn"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <h3 id="Category">${post.Category}</h3>
        <br>
        <h1 id="Title">${post.Title}</h1>
        <br>
        <img id="Image" src="${post.Image}"/>
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
    News.Creation = 0;
    return News;
}