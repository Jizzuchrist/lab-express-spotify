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

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      //res.send(data);
      /* console.log(
        "The received data from the API: ",
        data.body.artists.items[0].images
      ); */
      /* spotifyApi.getArtistAlbums(data) */
      let allArtists = data.body.artists.items;
      /* let artistsImages = data.body.artists.items.images */
      res.render(
        "artist-search-results",
        { allArtists } /* , {artistsImages} */
      );
    })
    .catch((err) =>
      console.log("The error while searching artist occurred", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      // res.send(data);
      /* let artistName = data.body.items[0].artists[0].name */
      let albums = data.body.items;
      res.render("albums", { albums } );
    })
    .catch((err) =>
      console.log("The error while searching artist occurred", err)
    );
});

app.get("/view-tracks/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      // res.send(data)
      let tracks = data.body.items;
      // let artistName = data.body.items[0].artists[0].name
      // let albums = data.body.items;
      res.render("view-tracks", {tracks})
    })
    .catch((err) =>
      console.log("The error while searching artist occurred", err)
    );
});

/* app.get("/artist-search-results", (req,res)=>{
    res.render("artist-search-results")
}) */
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
