const btnReg = document.querySelector("#registration");
const btnLogin = document.querySelector("#btn_login");
const divReg = document.querySelector("#reg");
const divRegLog = document.querySelector("#reg-log");
const divNotLogged = document.querySelector("#hint_not_logged");
const log_icon = document.querySelector(".log");
const divLogCart = document.querySelector("#login_cart");
const divProfileLink = document.querySelector("#profile_link");
const divCart = document.querySelector(".div_cart");
const btnShowCart = document.querySelector("#cart_btn");
const inptUsername = document.querySelector("#login-username");
const inptPassword = document.querySelector("#login-password");

let loggedInUser;

function display_my_profile(responseText) {
  const artists = JSON.parse(responseText);
  for (let artist of artists) {
    if (artist.status == "active") {
      loggedInUser = artist;
    }
  }
  if (loggedInUser != null) {
    divRegLog.innerHTML = "";
    divRegLog.innerHTML = `
    <div>
      <a style="width: 15rem;" class="link" href="./my_profile.html">Show my profile</a>
      <button data-id="${loggedInUser.id}" class="logout">Logout</button>
    </div>   `;
    log_icon.innerHTML = "";
    log_icon.innerHTML = "<a class='link'>Logout</a>";
    divProfileLink.innerHTML += `
    <a class="icon_profile" class="link" href="./my_profile.html"><i class="fas fa-user"></i></a>
    `;
  }
  else {

    divNotLogged.innerHTML = `
      <p class="hint_message"><small>You have to been 
      logged in so you could manage your profile.(Only for artists!)</small></p>
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

btnLogin.addEventListener("click", () => {

  if (inptUsername.value != "" && inptPassword.value != "") {
    const username = inptUsername.value;
    const password = inptPassword.value;

    const xhrLogin = new XMLHttpRequest();
    xhrLogin.addEventListener("load", function () {
      display_my_profile(this.responseText);
    })
    xhrLogin.open("POST", "http://localhost:3009");
    xhrLogin.setRequestHeader("Content-type", "application/json");
    xhrLogin.send(JSON.stringify({ "username": username, "password": password }));

  } else {
    window.alert("Username or password are missing.");
  }

});
btnReg.addEventListener("click", () => {
  divReg.innerHTML = "";
  divReg.innerHTML = `
<h4>Registration</h4>
<input class="inpt_personal_info" id="fname" type="text" placeholder="First name">
<input class="inpt_personal_info" id="lname" type="text" placeholder="Last name">
<input class="inpt_personal_info" id="profession" type="text" placeholder="Profession">
<input class="inpt_personal_info" id="profilimage" type="text" placeholder="Profile image">
<input class="inpt_personal_info" id="username" type="text" placeholder="Username">
<input class="inpt_personal_info" id="password" type="password" placeholder="Password">
<button class="btn-reg" type="submit">Register</button>
`;

  const inptFname = document.querySelector("#fname");
  const inptLname = document.querySelector("#lname");
  const inptProfession = document.querySelector("#profession");
  const inptProfilimage = document.querySelector("#profilimage");
  const inptUsername = document.querySelector("#username");
  const inptPassword = document.querySelector("#password");
  document.addEventListener("click", (e) => {
    element = e.target;
    if (element && element.classList.contains("btn-reg")) {

      const newProfile = {
        username: inptUsername.value,
        password: inptPassword.value,
        profilimage: inptProfilimage.value,
        name: inptFname.value,
        surname: inptLname.value,
        profession: inptProfession.value,
        bio: "",
        artworks: [],
        posts: [
          {
            postId: "",
            postTitle: "",
            postText: "",
            comments: [
              {
                commentText: "",
                commentSignature: "",
                commentId: ""
              }
            ]
          }
        ]
      };
      const xhr = new XMLHttpRequest();
      xhr.addEventListener("load", function () {
        divReg.innerHTML = `
        <p class="hint_message"><small>You've registred your profile. 
        Please, login so you could add other information.</small></p>
        `;
      });
      xhr.open("PUT", "http://localhost:3009");
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send(JSON.stringify(newProfile));
    }
  });

});
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

const xhr = new XMLHttpRequest();
xhr.addEventListener("load", function () {
  display_my_profile(this.responseText);
});
xhr.open("GET", "http://localhost:3009");
xhr.send();

document.addEventListener("click", (e) => {
  const element = e.target;

  if (element && element.classList.contains("logout")) {
    const id = element.getAttribute("data-id");

    const xhrLogout = new XMLHttpRequest();
    xhrLogout.addEventListener("load", function () {
      divRegLog.innerHTML = "";
      divRegLog.innerHTML = "<h2>You are logged out!<h2>";
      log_icon.innerHTML = "";
      log_icon.innerHTML = `<a class="log" class="log_cart" href="./login.html">Login</a>`;
      divProfileLink.innerHTML = "";
    })
    xhrLogout.open("PATCH", "http://localhost:3009/");
    xhrLogout.setRequestHeader("Content-type", "application/json");
    xhrLogout.send(JSON.stringify({ "id": id }));
  }
})

