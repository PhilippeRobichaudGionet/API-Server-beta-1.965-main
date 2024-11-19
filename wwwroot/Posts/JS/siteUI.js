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
        $('#aboutCmd').show();
        $("#aboutContainer").hide();
        $("#News").show();
        $("#abort").hide();
        $("#add").show();
        $("#search").show();
        $("#scrollPanel").show();
        $("#actionTitle").text("Fil de nouvelles");
        EraseForm();
    });
    $('#aboutCmd').on("click", function () {
        renderAbout();
    });

    $('#searchKey').on('click', () => {
        SearchAppear();
    })
    $('#PostSearch').change(function() {
        Searching($('#PostSearch').text)
    });

    $('#add').click(function (e) { 
        $("#add").show();
        renderAdd();
    });
    $("#Edit").click
}
function Searching(text){
    renderPosts(text);
}
function SearchAppear() {
    let SearchBar = $("#SearchSection");
    if (SearchBar.is(":hidden")){
        SearchBar.show();
    }else{
        SearchBar.hide();
    }
}
function renderAbout() {
    $("#News").hide();
    $("#abort").show();
    $("#search").hide();
    $('#aboutCmd').hide();
    $("#actionTitle").text("À propos...");
    $("#aboutContainer").show();
    $("#add").hide();
}
function renderError(message) {
    removeWaitingGif();
    $("#scrollPanel").hide();
    $("#aboutContainer").hide();
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
        post.PhotoImageData = "../assetsRepository/News-Logo.jpg";
    }
    $("#add").hide();
    $("#abort").show();
    $("#News").hide();
    $("#actionTitle").text(create ? "Créer un post" : "Modifier le post");
    $("#scrollPanel").append(`
        <form class="form" id="postForm">

            <input id="Id" name="Id" value="${post.Id}" hidden/>
            <label for="Title" class="form-label TitreLabel">Titre:</label>
            <input
                class="form-control"
                name="Title"
                id="Title"
                placeholder="Titre"
                required
                value="${post.Title}"
            />
            <br>
            <label for="Text" class="form-label">Texte:</label>
            <textarea
                class="form-control"
                name="Text"
                id="Text"
                placeholder="Texte"
                required
            >${post.Text}</textarea>
            <br>
            <label for="Category" class="form-label">Catégorie:</label>
            <input
                class="form-control"
                name="Category"
                id="Category"
                placeholder="Catégorie"
                required
                value="${post.Category}"
            />
            <br>
            <!-- nécessite le fichier javascript 'imageControl.js' -->
            <label class="form-label">PostImage: </label>
            <div   class='imageUploader' 
                   newImage='${create}' 
                   controlId='PhotoImageData' 
                   imageSrc='../assetsRepository/${post.PhotoImageData}' 
                   waitingImage="Loading_icon.gif">
            </div>
            <hr>
            <br><br>
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
        $("#aboutContainer").hide();
        $("#errorContainer").hide();

        $("#News").show();
        $("#abort").hide();
        $("#add").show();
        $("#search").show();
        $("#scrollPanel").show();
        $("#actionTitle").text("Fil de nouvelles");
        EraseForm();
    });

}

function getFormData($form) {
    const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
    var jsonObject = {};
    $.each($form.serializeArray(), (index, control) => {
        jsonObject[control.name] = control.value.replace(removeTag, "");
    });
    jsonObject["Creation"] = GetTodayNum();

    return jsonObject;
}

function showWaitingGif() {
    eraseContent();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='Loading_icon.gif' /></div>'"));
}

async function renderPosts(queryString = "") {
    if (search != ""){
        queryString += "&keywords=" + search;
    } 
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
            <button id="Edit" value="${post}" class="Btn"><i class="fa-solid fa-pencil"></i></button>
            <button id="Delete" class="Btn"><i class="fa-solid fa-xmark" onclick="API.deletePost('${post.Id}')"></i></button>
        </div>

        <h3 id="Category">${post.Category}</h3>
        <br>
        <h1 id="Title">${post.Title}</h1>
        <br>
        <img id="Image" src="../assetsRepository/${post.PhotoImageData}"/>
        <p id="Date">${convertToFrenchDate(post.Creation)}</p>
        <br>
        <p id="Desc">${post.Text}</p>
    </div>
    <br><br>    
    `).on('click', '#Edit', async function () {
        renderAdd(post);
    })
    .on('click', '#Delete', async function () {
        API.deletePost(post.Id);
    });
}

function newNews() {
    News = {};
    News.Title = "";
    News.Text = "";
    News.Category = "";
    News.PhotoImageData = "";
    News.Creation = 0;
    return News;
}
function eraseContent() {
    $("#content").empty();
}
function EraseForm() {
    $("#postForm").remove();
}
function convertToFrenchDate(numeric_date) {
    // Ensure the input is a string for slicing
    const dateString = String(numeric_date);
    
    // Extract date and time components
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6) - 1; // Month is 0-indexed
    const day = dateString.slice(6, 8);
    const hour = dateString.slice(8, 10);
    const minute = dateString.slice(10, 12);
    const second = dateString.slice(12, 14);

    // Create a new Date object
    const date = new Date(year, month, day, hour, minute, second);

    // Format the date in French
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);

    // Format the time in HH:mm:ss
    const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;

    // Combine the formatted date and time
    const result = `${formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)} - ${formattedTime}`;

    return result;
}

function GetTodayNum(){
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();     
    const hour = date.getHours();      
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const result = parseInt(`${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}${String(hour).padStart(2, '0')}${String(minute).padStart(2, '0')}${String(second).padStart(2, '0')}`);
    return result;
}