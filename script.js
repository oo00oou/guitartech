// Guitar Tech - script.js

var popup = document.getElementById("popup");
var selectedGuitar = "";


// ===== menu =====

function toggleCurtainMenu() {
    document.body.classList.toggle("curtain-open");
}

function closeCurtainMenu() {
    document.body.classList.remove("curtain-open");
}


// ===== popup =====

function openPopup(id) {
    document.getElementById(id).hidden = false;
    document.body.classList.add("popup-open");
    popup.showModal();
}

function closePopup() {
    popup.close();
}

// runs when the popup closes (also when Esc is pressed)
function popupClosed() {
    document.body.classList.remove("popup-open");
}


// ===== home page =====

function showGuitar(name) {
    selectedGuitar = name;
    var image = document.getElementById("guitar-image");
    var text = document.getElementById("guitar-description");

    document.getElementById("guitar-title").textContent = name;
    document.getElementById("guitar-picture").className = "guitar-photo popup-photo";
    image.alt = name + " guitar";

    if (name === "CL-30") {
        image.src = "assets/1.png";
        text.textContent = "A small, comfortable guitar for lighter playing and quiet sessions.";
    } else if (name === "SD-100") {
        image.src = "assets/2.png";
        text.textContent = "A versatile guitar with a balanced body size, suited to fingerstyle and chords.";
    } else if (name === "DD-12") {
        image.src = "assets/3.png";
        text.textContent = "A larger guitar for full chords and strong strumming.";
    }

    openPopup("guitar");
}

// "Commission this instrument" opens the build page with that guitar picked
function openCommission(name) {
    window.location.href = "build.html?body=" + name;
}


// ===== gallery page =====

var photoNumber = 0;

function filterGallery(category, button) {
    var items = document.querySelectorAll(".gallery-grid li");
    var count = 0;

    for (var i = 0; i < items.length; i++) {
        if (category === "all" || items[i].dataset.category === category) {
            items[i].hidden = false;
            count++;
        } else {
            items[i].hidden = true;
        }
    }

    // make only the clicked button look pressed
    var buttons = document.querySelectorAll(".filters button");
    for (var j = 0; j < buttons.length; j++) {
        buttons[j].setAttribute("aria-pressed", "false");
    }
    button.setAttribute("aria-pressed", "true");

   
    if (category === "all") {
        document.querySelector(".gallery-grid").classList.remove("filtered");
    } else {
        document.querySelector(".gallery-grid").classList.add("filtered");
    }

    document.getElementById("gallery-count").textContent = "Showing " + count + " photos";
}


function getPhotos() {
    return document.querySelectorAll(".gallery-grid li:not([hidden]) .gallery-item");
}

function openPhoto(tile) {
    var photos = getPhotos();
    for (var i = 0; i < photos.length; i++) {
        if (photos[i] === tile) {
            photoNumber = i;
        }
    }
    showPhoto();
    openPopup("photo");
}

// step is 1 for next and -1 for previous
function nextPhoto(step) {
    var photos = getPhotos();
    photoNumber = photoNumber + step;

    // go round to the start or the end
    if (photoNumber >= photos.length) {
        photoNumber = 0;
    }
    if (photoNumber < 0) {
        photoNumber = photos.length - 1;
    }
    showPhoto();
}

function showPhoto() {
    var photos = getPhotos();
    var tile = photos[photoNumber];
    var image = document.getElementById("photo-image");

    image.hidden = false;
    image.src = tile.querySelector("img").src;
    image.alt = tile.querySelector("img").alt;
    document.getElementById("photo-title").textContent = tile.querySelector(".gallery-title").textContent;
    document.getElementById("photo-caption").textContent = tile.dataset.caption;
    document.getElementById("photo-count").textContent = (photoNumber + 1) + " of " + photos.length;
}


// ===== build page =====

// the radio button that is picked in a group (body, finish or hardware)
function getChoice(name) {
    return document.querySelector("input[name=" + name + "]:checked");
}

function getTotal() {
    return Number(getChoice("body").dataset.price) + Number(getChoice("finish").dataset.price) + Number(getChoice("hardware").dataset.price);
}

// turns "Tobacco burst" into "tobacco-burst" so it can be used in a file name
function slug(text) {
    return text.toLowerCase().replace(/\s+/g, "-");
}

// the photo shown for the current choices
function updatePhoto() {
    var body = getChoice("body");
    var finish = getChoice("finish");
    var hardware = getChoice("hardware");
    var photo = document.getElementById("guitar-photo");

    // the photos from the home page, used if there is no build photo yet
    var homePhotos = {
        "CL-30": "assets/1.png",
        "SD-100": "assets/2.png",
        "DD-12": "assets/3.png"
    };

    // tries the most specific photo first, then falls back
    var tries = [
        "images/build/" + body.value + "-" + slug(finish.value) + "-" + slug(hardware.value) + ".jpg",
        "images/build/" + body.value + "-" + slug(finish.value) + ".jpg",
        "images/build/" + body.value + ".jpg",
        homePhotos[body.value]
    ];
    var n = 0;

    photo.onerror = function () {
        n++;
        if (n < tries.length) {
            photo.src = tries[n];
        } else {
            photo.onerror = null;
        }
    };

    photo.alt = body.value + " guitar, " + finish.value + " finish, " + hardware.value + " hardware";
    photo.src = tries[0];
}

// runs every time something on the build form changes
function updateBuild() {
    var body = getChoice("body");
    var finish = getChoice("finish");
    var hardware = getChoice("hardware");

    updatePhoto();

    // summary under the photo
    document.getElementById("build-name").textContent = body.value;
    document.getElementById("summary-body").textContent = body.dataset.name;
    document.getElementById("summary-finish").textContent = finish.value;
    document.getElementById("summary-hardware").textContent = hardware.value;

    // the price is on the page twice
    var prices = document.querySelectorAll(".build-price");
    for (var j = 0; j < prices.length; j++) {
        prices[j].textContent = "$" + getTotal().toLocaleString();
    }

    document.getElementById("enquiry-result").hidden = true;
}

function prepareEnquiry(event) {
    event.preventDefault(); // stops the page reloading

    var notes = document.getElementById("customer-notes").value;
    if (notes === "") {
        notes = "None";
    }

    var text = "Guitar Tech build enquiry\n\n";
    text += "Name: " + document.getElementById("customer-name").value + "\n";
    text += "Email: " + document.getElementById("customer-email").value + "\n\n";
    text += "Body: " + getChoice("body").value + "\n";
    text += "Finish: " + getChoice("finish").value + "\n";
    text += "Hardware: " + getChoice("hardware").value + "\n";
    text += "Estimated price: $" + getTotal().toLocaleString() + " NZD\n\n";
    text += "Notes: " + notes;

    document.getElementById("enquiry-text").value = text;
    document.getElementById("copy-message").textContent = "";
    document.getElementById("enquiry-result").hidden = false;
    document.getElementById("enquiry-result").scrollIntoView();
}

function copyEnquiry() {
    var text = document.getElementById("enquiry-text");
    text.select();
    navigator.clipboard.writeText(text.value);
    document.getElementById("copy-message").textContent = "Copied!";
}


// ===== runs when a page loads =====

// build page
if (document.getElementById("build-form")) {
    // pick the choices from the link, e.g. build.html?body=DD-12
    var params = new URLSearchParams(window.location.search);
    var radios = document.querySelectorAll("#build-form input[type=radio]");
    for (var k = 0; k < radios.length; k++) {
        if (params.get(radios[k].name) === radios[k].value) {
            radios[k].checked = true;
        }
    }

    updateBuild();
}

// copyright year
document.getElementById("year").textContent = new Date().getFullYear();


