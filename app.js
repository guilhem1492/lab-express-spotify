require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", (req, res, next) => {
  const reqArtist = req.query.artist;
  spotifyApi
    .searchArtists(reqArtist)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const artists = data.body.artists.items;
      res.render("artist-search-results", { artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(function (data) {
      console.log("Artist albums", data.body.items[0]);
      const albums = data.body.items;
      res.render("albums", { albums });
    })
    .catch((err) =>
      console.log("The error while searching artists albums occurred: ", err)
    );
});

app.get("/albums/:id/tracks", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then(function (data) {
      console.log("Album tracks", data.body.items);
      const tracks = data.body.items;
      res.render("tracks", { tracks });
    })
    .catch((err) =>
      console.log("The error while searching album tracks occurred: ", err)
    );
});

// Our routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on http://localhost:3000 🎧 🥁 🎸 🔊")
);
