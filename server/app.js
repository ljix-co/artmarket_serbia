const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyparser = require("body-parser");

let artists = [];
let cart = [];
let loggedInUser;
let searched_artist;

const app = express();
app.use(cors());
app.use(bodyparser.json());


app.get("/", (req, res) => {
    res.json(artists);
});

app.put("/", (req, res) => {
    let newProfile = req.body;
    newProfile.id = artists.length;
    artists.push(newProfile);

    res.json(artists);
});
app.post("/", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    for (i in artists) {
        if (username == artists[i].username && password == artists[i].password) {
            loggedInUser = artists[i];
            artists[i].status = "active";
        }
    }
    res.json(artists);
});
app.patch("/", (req, res) => {
    const id = req.body.id;
    for (let artist of artists) {
        if (id == artist.id) {
            artist.status = "";
        }
    }
    res.json(artists);
})
app.patch("/artists/:id", (req, res) => {
    const id = req.params.id;
    const changeInfo = req.body;

    for (let artist of artists) {
        if (id == artist.id) {
            if (changeInfo.profilimage != null) {
                artist.profilimage = changeInfo.profilimage;
            }
            if (changeInfo.name != null) {
                artist.name = changeInfo.name;
            }
            if (changeInfo.surname != null) {
                artist.surname = changeInfo.surname;
            }
            if (changeInfo.profession != null) {
                artist.profession = changeInfo.profession;
            }
            if (changeInfo.bio != null) {
                artist.bio = changeInfo.bio;
            }
        }
    }
    res.json(artists);
})
app.get("/artists/:surname", (req, res) => {
    const surname = req.params.surname;

    for (i in artists) {
        if (surname == artists[i].surname) {
            searched_artist = artists[i];
        }
    }

    res.json(searched_artist);
});
app.post("/artists/posts", (req, res) => {
    let newPost = req.body;
    let artistId;
    let availableId = 0;
    for (let artist of artists) {
        if (loggedInUser.id == artist.id) {
            artistId = artist.id;
            availableId = artist.posts.length;
            newPost.postId = "p" + artistId + availableId;
            artist.posts.push(newPost);
        }
    }
    res.json(artists);
})
app.put("/artists/posts/:postId", (req, res) => {
    let postId = req.params.postId;
    let newComment = req.body;
    for (let artist of artists) {
        for (i in artist.posts) {
            if (postId == artist.posts[i].postId) {
                artist.posts[i].comments.push(newComment);
            }
        }
    }
    res.json(artists);
})
app.put("/artists/artworks/", (req, res) => {
    let newArtwork = req.body;
    let artistId;
    let availableId = 0;
    
    for (let artist of artists) {
        if (loggedInUser.id == artist.id) {
            artistId = artist.id;
            availableId = artist.artworks.length;
            newArtwork.artworkId = "a" + artistId + availableId;
            newArtwork.quantity = 1;
            artist.artworks.push(newArtwork);
        }
    }
    res.json(artists);
})
app.delete("/artists/artworks", (req, res) => {
    const artworkId = req.body.artworkId;

    for (let artist of artists) {
        if (loggedInUser == artist) {
            for (i in loggedInUser.artworks) {
                if (artworkId == loggedInUser.artworks[i].artworkId) {
                    loggedInUser.artworks.splice(i, 1);

                }
            }
        }
    }

    res.json(artists);
})
app.post("/artists/artworks", (req, res) => {
    let artworkId = req.body.artworkId;

    for (let artist of artists) {
        for (i in artist.artworks) {
            if (artworkId == artist.artworks[i].artworkId) {
                cart.push(artist.artworks[i]);
                artist.artworks[i].quantity = 0;
            }
        }
    }
    res.json(cart);
})
app.delete("/cart", (req, res) => {
    let artworkId = req.body.artworkId;
    for (let i in cart) {
        if (cart[i].artworkId == artworkId) {
            cart.splice(i, 1);
        }
    }
    for(let artist of artists) {
        for(i in artist.artworks) {
            if(artist.artworks[i].artworkId == artworkId) {
                artist.artworks[i].quantity++;
            }
        }
    }
    res.json(cart);
})

app.listen(3009, () => {
    console.log("Server je pokrenut na portu  http://localhost:3009/artists");
    artists = JSON.parse(fs.readFileSync("./artists.json"));
})