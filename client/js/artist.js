const divArtists = document.querySelector("#artists_div");
const log_icon = document.querySelector(".log");
const divLogCart = document.querySelector("#login_cart");
const divProfileLink = document.querySelector("#profile_link");
const divCart = document.querySelector(".div_cart");
const btnShowCart = document.querySelector("#cart_btn");
const btnSearch = document.querySelector(".search");

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

function display_artists(responseText) {
  const artists = JSON.parse(responseText);
  let data = [];
  let loggedInUser;

  divArtists.innerHTML = "";
  for (let artist of artists) {
    divArtists.innerHTML += `
        <div id="artist">
        <img class="artist_img"  src="${artist.profilimage}"/> 
        <h3>${artist.name} ${artist.surname}</h3>
        <p class="data"><b>Profession:</b> ${artist.profession}</p>
        <h4>Biography</h4>
        <div class="justified">
        <p>${artist.bio}</p>
        </div>
        <button data-artistid="${artist.id}" class="seemore">See more</button>
        </div>
        `;
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
  document.addEventListener("click", (e) => {
    const element = e.target;

    if (element && element.classList.contains("seemore")) {
      let desired_artist;
      const artist_by_id = element.dataset.artistid;
      divArtists.innerHTML = "";
      divArtists.innerHTML = `
      <a class="link" href="./artists.html">Back</a>
      `;
      for (i in artists) {
        if (artists[i].id == artist_by_id) {
          desired_artist = artists[i];
          for (a in desired_artist.artworks) {
            data.push({ src: artists[i].artworks[a].image, srct: artists[i].artworks[a].thmbimage, title: artists[i].artworks[a].title });
          }
        }
      }
      if (desired_artist) {

        jQuery(document).ready(function () {

          jQuery("#nanogallery2").nanogallery2({
            items: data,

            thumbnailWidth: 300,
            thumbnailHeight: 300,
            thumbnailLabel: {
              display: false
            },
            thumbnailBorderHorizontal: '0',
            thumbnailBorderVertical: '0',
            thumbnailBorderRadius: '2',
            thumbnailHoverEffect2: 'imageGrayOn|imageGrayOff',
            thumbnailDisplayTransition: 'scaleUp',
            thumbnailDisplayTransitionDuration: 500,
            thumbnailDisplayInterval: 30,
            galleryDisplayTransition: 'slideUp',
            galleryDisplayTransitionDuration: 500,
            locationHash: true,
            viewerTools: { topRight: 'custom1,fullscreenButton,closeButton' },
            viewerToolbar: { display: false },
            viewerTools: {
              topLeft: 'label',
              topRight: 'shareButton, playPauseButton, zoomButton, fullscreenButton, closeButton'
            },
            viewerTheme: 'light',
            viewerGallery: 'bottomOverMedia',
            viewerGalleryTWidth: 40,
            viewerGalleryTWidth: 40,
            viewerTheme: {
              background: '#616161',
              barBorder: '0px solid #111',
              barColor: '#FFFFFF',
              barDescriptionColor: '#ccc'
            },
            galleryTheme: {
              thumbnail: {
                background: '	#FFFFFF',
                borderRadius: '2px'
              },
            },
            icons: {
              buttonClose: '<i  class="far fa-times-circle"></i>',
              viewerImgPrevious: '<i style="background:none; " class="nGY2Icon-ngy2_chevron_left3"></i>',
              viewerImgNext: '<i style="background:none;" class="nGY2Icon-ngy2_chevron_right3"></i>',
              viewerPlay: '<i class="far fa-play-circle"></i>',
              viewerPause: '<i class="far fa-pause-circle"></i>',
              viewerShare: '<i class="fas fa-share-alt"></i>',
              viewerFullscreenOn: '<i class="fas fa-expand"></i>',
              viewerFullscreenOff: '<i class="fas fa-compress"></i>'
            }
          });
        });
      }
    }
    
  });
}
function display_searched_artist(responseText) {
  const searched_artist = JSON.parse(responseText);
  divArtists.innerHTML = "";

  divArtists.innerHTML += `
        <div id="artist">
        <img class="artist_img"  src="${searched_artist.profilimage}"/> 
        <h3>${searched_artist.name} ${searched_artist.surname}</h3>
        <p class="data"><b>Profession:</b> ${searched_artist.profession}</p>
        <h4>Biography</h4>
        <div class="justified">
        <p>${searched_artist.bio}</p>
        </div>
        <button data-artistid="${searched_artist.id}" class="seemore">See more</button>
        </div>
        `;

}
const xhr = new XMLHttpRequest();
xhr.addEventListener("load", function () {
  display_artists(this.responseText);
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
});
btnSearch.addEventListener("click", () => {
   
  const inptSearchSurname = (document.querySelector(".search_field_surname")).value;
  if ( inptSearchSurname != "") {
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