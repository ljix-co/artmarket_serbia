const divPosting = document.querySelector("#posting");
const log_icon = document.querySelector(".log");
const divPostComments = document.querySelector("#posts-comments");
const divLogCart = document.querySelector("#login_cart");
const divProfileLink = document.querySelector("#profile_link");
const btnShowCart = document.querySelector("#cart_btn");
const divCart = document.querySelector(".div_cart");
const btnSearch = document.querySelector(".search");

function display_posts(responseText) {
  const artists = JSON.parse(responseText);
  let loggedInUser;
 

  for (let artist of artists) {
    
  
    for (i in artist.posts) {
      if(artist.posts[i].postTitle != "" && artist.posts[i].postText != "") {
      divPostComments.innerHTML += `
      <div class="post_div">
      <h2>${artist.posts[i].postTitle}</h2>
      <div class="justified">
      <p class="data">Author:<b>${artist.name} ${artist.surname}</b></p>
      <p>${artist.posts[i].postText}</p>
      </div>
      </div>
      <div class="to-comment-area">
      <textarea  class="txt-comment" placeholder="Your comment"></textarea>
      <input  class="signature" type="text" placeholder="Your signature"/>
      <button data-postid="${artist.posts[i].postId}" class="comment">Comment</button>
      </div>  
      <h4 class="title">Comments</h4>
      `;
      for (c in artist.posts[i].comments) {
        divPostComments.innerHTML += `
      <div class="comments">
      <div class="justified">
      <p><b>${artist.posts[i].comments[c].commentSignature}</b></p>
      <p>${artist.posts[i].comments[c].commentText}</p>
      </div>
      </div> 
      `;
      }
    }
  }
  }
  for (i in artists) {
    if (artists[i].status == "active") {
      loggedInUser = artists[i];
    }
  }
  if (loggedInUser) {
    log_icon.innerHTML = "";
    log_icon.innerHTML = "<a class='link'>Logout</a>";
    divProfileLink.innerHTML = `
     <a class="icon_profile" class="link" href="./my_profile.html"><i class="fas fa-user"></i></a>
     `;
    divPosting.innerHTML = `
      <input id="post-title" type="text" placeholder="Post title"/><br>
      <textarea id="post-text" placeholder="Text"></textarea>
      <button class="post" type="submit">Post</button>
      `;
    document.addEventListener("click", (e) => {
      const element = e.target;
      if (element && element.classList.contains("post")) {
        const inptPostTitle = (document.querySelector("#post-title")).value;
        const txtPost = (document.querySelector("#post-text")).value;
        
        const newPost = {
          postId: "",
          postTitle: inptPostTitle,
          postText: txtPost,
          comments: [
            {
              commentText: "",
              commentSignature: "",
              commentId: ""
            }
          ]
        }
        const xhrPosting = new XMLHttpRequest();
        xhrPosting.addEventListener("load", function () {
          display_posts(this.responseText);
        });
        xhrPosting.open("POST", "http://localhost:3009/artists/posts");
        xhrPosting.setRequestHeader("Content-type", "application/json");
        xhrPosting.send(JSON.stringify(newPost));
      }
    })
  } if(!loggedInUser) {
    divPosting.style.display = "none";
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
function display_searched_artist(responseText) {
  const searched_artist = JSON.parse(responseText);
  divPostComments.innerHTML = "";
for(i in searched_artist.posts) {
  
      divPostComments.innerHTML += `
      <div class="post_div">
      <h2>${searched_artist.posts[i].postTitle}</h2>
      <div class="justified">
      <p class="data">Author:<b>${searched_artist.name} ${searched_artist.surname}</b></p>
      <p>${searched_artist.posts[i].postText}</p>
      </div>
      </div>
      <div class="to-comment-area">
      <textarea  class="txt-comment" placeholder="Your comment"></textarea>
      <input  class="signature" type="text" placeholder="Your signature"/>
      <button data-postid="${searched_artist.posts[i].postId}" class="comment">Comment</button>
      </div>  
      <h4 class="title">Comments</h4>
      `;
      for (c in searched_artist.posts[i].comments) {
        divPostComments.innerHTML += `
      <div class="comments">
      <div class="justified">
      <p><b>${searched_artist.posts[i].comments[c].commentSignature}</b></p>
      <p>${searched_artist.posts[i].comments[c].commentText}</p>
      </div>
      </div> 
      `;
      }
  
}
}
const xhrdisplayPosts = new XMLHttpRequest();
xhrdisplayPosts.addEventListener("load", function () {

  display_posts(this.responseText);

});
xhrdisplayPosts.open("GET", "http://localhost:3009/");
xhrdisplayPosts.send();


document.addEventListener("click", (e) => {
  const element = e.target;

  if (element && element.classList.contains("comment")) {
    const postId = element.getAttribute("data-postid");
    const txtComment = document.querySelectorAll(".txt-comment");
    const inptSignature = document.querySelectorAll(".signature");
    let txtCommentValue = "";
    let inptSignatureValue = "";

    for (let txt of txtComment.values()) {
      if (txt.value != "") {
        txtCommentValue = txt.value;
      }
    }
    for (let i = 0; i < inptSignature.length; i++) {
      if (inptSignature[i].value != "") {
        inptSignatureValue = inptSignature[i].value;
      }
    }
    const newComment = {
      commentText: txtCommentValue,
      commentSignature: inptSignatureValue,
      commentId: postId
    };
    const xhrComment = new XMLHttpRequest();
    xhrComment.open("PUT", "http://localhost:3009/artists/posts/" + postId);
    xhrComment.setRequestHeader("Content-type", "application/json");
    xhrComment.send(JSON.stringify(newComment));
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