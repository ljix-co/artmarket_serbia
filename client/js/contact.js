const log_icon = document.querySelector(".log");
const divLogCart = document.querySelector("#login_cart");
const divProfileLink = document.querySelector("#profile_link");
const divCart = document.querySelector(".div_cart");
const btnShowCart = document.querySelector("#cart_btn");

function if_logged_in(responseText) {
    const artists = JSON.parse(responseText);
    let loggedInUser;
    for (let artist of artists) {
        if (artist.status == "active") {
            loggedInUser = artist;
        }
    }
    if (loggedInUser) {
        log_icon.innerHTML = "";
        log_icon.innerHTML = "<a class='link'>Logout</a>";
        divProfileLink.innerHTML += `
        <a class="icon_profile" class="link" href="./my_profile.html"><i class="fas fa-user"></i></a>
        `;
    }
}
function display_cart(responseText) {
    const cart = JSON.parse(responseText);

    divCart.innerHTML = "";
    let fullPrice = 0;
    for (let artwork of cart) {
        fullPrice += Number(artwork.price);
    }
    divCart.innerHTML = `
    <p class="cart_txt"><small class="artwork_desc">Total price:</small> ${fullPrice} $</p> 
    `;
    for (let artwork of cart) {
        divCart.innerHTML += `
        <img class="cart_img" src="${artwork.image}"/>
        <p class="cart_txt">${artwork.title} <small class="artwork_desc">price:</small>${artwork.price} $</p>
        `;
    }
}
const xhr = new XMLHttpRequest();
xhr.addEventListener("load", function () {
    if_logged_in(this.responseText);
});
xhr.open("GET", "http://localhost:3009");
xhr.send();



btnShowCart.addEventListener("click", () => {
    const xhrShowCart = new XMLHttpRequest();
    xhrShowCart.addEventListener("load", function () {
        display_cart(this.responseText);
    });
    xhrShowCart.open("POST", "http://localhost:3009/artists/artworks");
    xhrShowCart.send();
    if (divCart.classList.contains("hide") == true) {
        divCart.classList.remove("hide");
        btnShowCart.innerHTML = "Close";
    } else {
        divCart.classList.add("hide");
        btnShowCart.innerHTML = "<i class='fas fa-shopping-cart'></i>";
    }
})