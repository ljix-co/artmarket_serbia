const divProfile = document.querySelector("#profile");
const divArtworks = document.querySelector("#my-artworks");
const btnAddNewArtwork = document.querySelector("#add-new-artwork");
const divPutNew = document.querySelector("#put-new");
const logLink = document.querySelector(".log");
const btnChangeInfo = document.querySelector("#change_personal_info");

function display_loggedin_profile(responseText) {
    const artists = JSON.parse(responseText);
    let loggedInUser;
    let artworks_array = [];
    for (let i = 0; i < artists.length; i++) {
        if (artists[i].status == "active") {
            loggedInUser = artists[i];
        }
    }
    if (loggedInUser) {
        for (i in loggedInUser.artworks) {
            artworks_array.push(loggedInUser.artworks[i]);
        }

        divProfile.innerHTML = "";
        divArtworks.innerHTML = "";
        logLink.innerHTML = "Logout";
        divProfile.innerHTML = `
        <div class="div_prof_img">
        <img class="profile_img" src="${loggedInUser.profilimage}"/>
        </div>
        <h2>${loggedInUser.name} ${loggedInUser.surname}</h2>
        <p class="profile_desc">Profession: ${loggedInUser.profession}</p>
        <h3 class="profile_desc">Biography</h3>
        <p>${loggedInUser.bio}</p>
        `;
        for (let i = 0; i < artworks_array.length; i++) {
            divArtworks.innerHTML += `
        <div class="artworks">
        <img class="artworks_img" src="${loggedInUser.artworks[i].image}"/> 
        <p class="artwork_desc">Title: ${loggedInUser.artworks[i].title}</p>
        <p class="artwork_desc">Type: ${loggedInUser.artworks[i].type}</p>
        <p class="artwork_desc">Dimensions: ${loggedInUser.artworks[i].dimensions}</p>
        <p class="artwork_desc">Price: ${loggedInUser.artworks[i].price} $</p>
        <button data-artworkId="${loggedInUser.artworks[i].artworkId}" id="delete-artwork">Delete</button>
        </div>
        `;
        }

        btnChangeInfo.addEventListener("click", () => {
            divProfile.innerHTML += `
        <div id="change_prof_div">
        <input class="inpt_personal_info" id="profileimage" type="text" placeholder="Profile image"/>
        <input class="inpt_personal_info" id="name" type="text" placeholder="Name"/>
        <input class="inpt_personal_info" id="surname" type="text" placeholder="Surname"/>
        <input class="inpt_personal_info" id="profession" type="text" placeholder="Profession"/>
        <textarea id="bio" type="text" placeholder="Biography"></textarea>
        <button id="change_info">Confirm</button>
        </div>
        `;
            btnChangeInfo.style.display = "none";
            document.addEventListener("click", (e) => {
                const element = e.target;
                if (element && element.id == "change_info") {
                    const id = loggedInUser.id;
                    const inptProfileImage = document.querySelector("#profileimage");
                    const inptName = document.querySelector("#name");
                    const inptSurname = document.querySelector("#surname");
                    const inptProfession = document.querySelector("#profession");
                    const inptBio = document.querySelector("#bio");
                    let profileImage;
                    let Name;
                    let Surname;
                    let profileProfession;
                    let profileBio;
                    if (inptProfileImage.value != "") {
                        profileImage = inptProfileImage.value;
                    }
                    if (inptName.value != "") {
                        Name = inptName.value;
                    }
                    if (inptSurname.value != "") {
                        Surname = inptSurname.value;
                    }
                    if (inptProfession.value != "") {
                        profileProfession = inptProfession.value;
                    }
                    if (inptBio.value != "") {
                        profileBio = inptBio.value;
                    }

                    const changeInfo = {
                        profilimage: profileImage,
                        name: Name,
                        surname: Surname,
                        profession: profileProfession,
                        bio: profileBio
                    }
                    const xhr = new XMLHttpRequest();
                    xhr.open("PATCH", "http://localhost:3009/artists/" + id);
                    xhr.addEventListener("load", function () {
                        display_loggedin_profile(this.responseText);
                    })
                    xhr.setRequestHeader("Content-type", "application/json");
                    xhr.send(JSON.stringify(changeInfo));
                }
            })
        })
        btnAddNewArtwork.addEventListener("click", () => {
            divPutNew.innerHTML = `
          <input class="inpt_artwork" id="title" type="text" placeholder="Artwork title"/>
          <input class="inpt_artwork" id="type" type="text" placeholder="Artwork type"/>
          <input class="inpt_artwork" id="dimensions" type="text" placeholder="Artwork dimensions"/>
          <input class="inpt_artwork" id="price" type="text" placeholder="Artwork price in USD"/>
          <input class="inpt_artwork" id="image" type="text" placeholder="Artwork image"/>
          <button class="add-new">Add</button>
          `;

            const inptTitle = document.querySelector("#title");
            const inptType = document.querySelector("#type");
            const inptDimensions = document.querySelector("#dimensions");
            const inptPrice = document.querySelector("#price");
            const inptImage = document.querySelector("#image");
            document.addEventListener("click", (e) => {
                const element = e.target;

                if (element && element.classList.contains("add-new")) {


                    const newArtwork = {
                        artworkId: "",
                        quantity: 0,
                        title: inptTitle.value,
                        type: inptType.value,
                        dimensions: inptDimensions.value,
                        price: inptPrice.value,
                        image: inptImage.value
                    }
                    const xhrNewArtwork = new XMLHttpRequest();
                    xhrNewArtwork.addEventListener("load", function () {
                        display_loggedin_profile(this.responseText);
                    });
                    xhrNewArtwork.open("PUT", "http://localhost:3009/artists/artworks");
                    xhrNewArtwork.setRequestHeader("Content-type", "application/json");
                    xhrNewArtwork.send(JSON.stringify(newArtwork));
                }
            })
        })
    }
}
document.addEventListener("click", (e) => {
    const element = e.target;
    if (element && element.id == "delete-artwork") {
        const artworkId = element.getAttribute("data-artworkId");
        const xhrDeleteArtwork = new XMLHttpRequest();
        xhrDeleteArtwork.addEventListener("load", function () {
            display_loggedin_profile(this.responseText);
        })
        xhrDeleteArtwork.open("DELETE", "http://localhost:3009/artists/artworks");
        xhrDeleteArtwork.setRequestHeader("Content-type", "application/json");
        xhrDeleteArtwork.send(JSON.stringify({ "artworkId": artworkId }));
    }
})


const xhr = new XMLHttpRequest();
xhr.addEventListener("load", function () {
    display_loggedin_profile(this.responseText);
});
xhr.open("GET", "http://localhost:3009/");
xhr.send();

