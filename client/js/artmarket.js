const divGallery = document.querySelector("#gallery_div");
const divCart = document.querySelector(".div_cart");
const divPay = document.querySelector("#paying_order");
const btnShowCart = document.querySelector("#cart_btn");
const btnCloseCart = document.querySelector("#close_cart");
const log_icon = document.querySelector(".log");
const divLogCart = document.querySelector("#login_cart");
const divProfileLink = document.querySelector("#profile_link");

const btnSearch = document.querySelector(".search");

function display_artworks(responseText) {
    const artists = JSON.parse(responseText);
    divGallery.innerHTML = "";
    const artists_array = [];
    artists_array.push(artists);
    let loggedInUser;

    for (let artist of artists) {
        if (artist.status == "active") {
            loggedInUser = artist;
        }
        for (i in artist.artworks) {
            divGallery.innerHTML += `
        <div class="artworks">
        <img class="artworks_img"   src="${artist.artworks[i].image}"/> 
        <p class="artwork_desc">Author: ${artist.name} ${artist.surname}</p>
        <p class="artwork_desc">Title: ${artist.artworks[i].title}</p>
        <p class="artwork_desc">Type: ${artist.artworks[i].type}</p>
        <p class="artwork_desc">Dimensions: ${artist.artworks[i].dimensions}</p>
        <p class="artwork_desc">Price: ${artist.artworks[i].price} $</p>
        <button  data-artworkid="${artist.artworks[i].artworkId}" class="buy">Buy</button>
        </div>
        `;
            if (artist.artworks[i].quantity == 0) {
                const btnBuy = document.querySelectorAll(".buy");

                for (let btn of btnBuy) {
                    const artworkId = btn.dataset.artworkid;
                    if (artworkId == artist.artworks[i].artworkId) {
                        btn.innerHTML = "Added to cart";
                        btn.disabled = true;
                        btn.style = "background-color:white; color:gray";
                    }

                }
            }
        }
        const btnBuy = document.querySelectorAll(".buy");
        for (let btn of btnBuy) {
            btn.addEventListener("click", () => {
                btn.innerHTML = "Added to cart";
                btn.disabled = true;
                btn.style = "background-color:white; color:gray";
            })
        }

    }

    if (loggedInUser) {
        log_icon.innerHTML = "";
        log_icon.innerHTML = "<a class='link'>Logout</a>";
        divProfileLink.innerHTML = `
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
        <button class="remove_from_cart" data-artworkid="${artwork.artworkId}"><i class="far fa-times-circle"></i></button>
        <p class="cart_txt">${artwork.title} <small class="artwork_desc">price:</small>${artwork.price} $</p>
        `;
    }
    divCart.innerHTML += `
   <a id="confirm_order" class="link" href="#">Confirm order</a>
    `;
    const btnRemove = document.querySelectorAll(".remove_from_cart");
    for (let btn of btnRemove) {
        btn.addEventListener("click", () => {
            const artworkId = btn.dataset.artworkid;

            const xhrRemoveCart = new XMLHttpRequest();
            xhrRemoveCart.addEventListener("load", function () {
                display_cart(this.responseText);
            });
            xhrRemoveCart.open("DELETE", "http://localhost:3009/cart");
            xhrRemoveCart.setRequestHeader("Content-type", "application/json");
            xhrRemoveCart.send(JSON.stringify({ "artworkId": artworkId }));
        })
    }
    const confirmOrder = document.querySelector("#confirm_order");
    confirmOrder.addEventListener("click", () => {
        divPay.innerHTML = `
        <div id="list_products">
       <h3>Your order:</h3> 
        </div>
        <div id="paying_form">
        <input id="card_num" type="text" placeholder="Card number (only Visa or MasterCard)"/>
        <input id="card_month" type="text" placeholder="Month (format: XX)"/>
        <input id="card_year" type="text" placeholder="Year (format: XX)"/>
        <input id="card_v_value" type="text" placeholder="Verification value"/>
        <input id="card_fname" type="text" placeholder="First name"/>
        <input id="card_lname" type="text" placeholder="Last name"/>
        <input id="card_eadress" type="text" placeholder="Email address"/>
        <br>
        <button id="confirm_payment">Confirm</button>
        <div id="else_message"></div>
        </div>
        <button class="exit_order_form" onclick="this.parentElement.style.visibility='hidden';"><i class="far fa-times-circle"></i></button>
        `;
        const divListPr = document.querySelector("#list_products");
        for (let artwork of cart) {
            divListPr.innerHTML += `
        <ul>
        <li><img class="cart_img" src="${artwork.image}"/> <p class="cart_txt">${artwork.title} <small class="artwork_desc">price:</small>${artwork.price} $</p></li>
        </ul>
        `;
        }
        const divElseMessage = document.querySelector("#else_message");
        const inptCardNum = document.querySelector("#card_num");
        const inptCardMon = document.querySelector("#card_month");
        const inptCardYear = document.querySelector("#card_year");
        const inptCardVValue = document.querySelector("#card_v_value");
        const inptCardFName = document.querySelector("#card_fname");
        const inptCardLName = document.querySelector("#card_lname");
        const inptCardEmail = document.querySelector("#card_eadress");
        const confirmPay = document.querySelector("#confirm_payment");

        confirmPay.addEventListener("click", () => {

            const cardno = /^(?:5[1-5][0-9]{14})|(?:4[0-9]{12}(?:[0-9]{3})?)$/;
            const month = /^(?:0[1-9]|1[0-2])$/;
            const year = /^(?:2[1-9]|[3-9][0-9])$/;
            const cvc = /^\d{3}$/;
            const email = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
            if (inptCardNum.value != "" && inptCardMon.value != "" && inptCardYear.value != ""
                && inptCardVValue.value != "" && inptCardFName.value != "" && inptCardLName.value != ""
                && inptCardEmail.value != "") {
                if (inptCardNum.value.match(cardno) && inptCardMon.value.match(month) && inptCardYear.value.match(year)
                    && inptCardVValue.value.match(cvc) && inptCardEmail.value.match(email)) {
                    divPay.innerHTML = "";
                    divPay.innerHTML = `
                    <p>Thank You for ordering. Your request was sent for confirmation. Response about confirmation and other details considering your order will be sent by email.</p>
                    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
                    `;
                } else {
                    divElseMessage.innerHTML = `
                    <p style="color:red;">Incorrect data. Check if you entered proper information.</p>
                    `;
                }
            } else {
                divElseMessage.innerHTML = `
                <p style="color:red;">Some fields are left empty.</p>
                `;
            }
        });


    })

}
function display_searched_artist(responseText) {
    const searched_artist = JSON.parse(responseText);
    divGallery.innerHTML = "";
    for (a in searched_artist.artworks) {
        divGallery.innerHTML += `
    <div class="artworks">
    <img class="artworks_img"   src="${searched_artist.artworks[a].image}"/> 
    <p class="artwork_desc">Author: ${searched_artist.name} ${searched_artist.surname}</p>
    <p class="artwork_desc">Title: ${searched_artist.artworks[a].title}</p>
    <p class="artwork_desc">Type: ${searched_artist.artworks[a].type}</p>
    <p class="artwork_desc">Dimensions: ${searched_artist.artworks[a].dimensions}</p>
    <p class="artwork_desc">Price: ${searched_artist.artworks[a].price} $</p>
    <button  data-artworkid="${searched_artist.artworks[a].artworkId}" class="buy">Buy</button>
    </div>
    `;
        if (searched_artist.artworks[a].quantity == 0) {
            const btnBuy = document.querySelectorAll(".buy");

            for (let btn of btnBuy) {
                const artworkId = btn.dataset.artworkid;
                if (artworkId == searched_artist.artworks[a].artworkId) {
                    btn.innerHTML = "Added to cart";
                    btn.disabled = true;
                    btn.style = "background-color:white; color:gray";
                }

            }
        }
    }
    const btnBuy = document.querySelectorAll(".buy");
    for (let btn of btnBuy) {
        btn.addEventListener("click", () => {
            btn.innerHTML = "Added to cart";
            btn.disabled = true;
            btn.style = "background-color:white; color:gray";
        })
    }
}
const xhr = new XMLHttpRequest();
xhr.addEventListener("load", function () {
    display_artworks(this.responseText);
});
xhr.open("GET", "http://localhost:3009");
xhr.send();

document.addEventListener("click", (e) => {
    const element = e.target;

    if (element && element.classList.contains("buy")) {
        const artworkId = element.getAttribute("data-artworkid");

        const xhrCart = new XMLHttpRequest();
        xhrCart.addEventListener("load", function () {
            display_cart(this.responseText);
        });
        xhrCart.open("POST", "http://localhost:3009/artists/artworks");
        xhrCart.setRequestHeader("Content-type", "application/json");
        xhrCart.send(JSON.stringify({ "artworkId": artworkId }));

    }


})

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
btnSearch.addEventListener("click", () => {

    const inptSearchSurname = (document.querySelector(".search_field_surname")).value;
    if (inptSearchSurname != "") {
        const surname = inptSearchSurname;

        const xhrSearch = new XMLHttpRequest();
        xhrSearch.addEventListener("load", function () {
            display_searched_artist(this.responseText);
        })
        xhrSearch.open("GET", "http://localhost:3009/artists/" + surname);
        xhrSearch.setRequestHeader("Content-type", "application/json");
        xhrSearch.send();
    }
})