var express = require("express");
var dao = require("./mongo-dao.js");
var app = express();

app.use(express.json()); //Parse JSON body

app.get("/api/characters", (req, res) => {
  dao.findAllCharacters((err, characters) => {
    if (characters) {
      res.send(characters);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

app.get("/api/planets", (req, res) => {
  dao.findAllPlanets((err, planets) => {
    if (planets) {
      res.send(planets);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

app.get("/api/films", (req, res) => {
  dao.findAllFilms((err, films) => {
    if (films) {
      res.send(films);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

app.get("/api/characters/:id", (req, res) => {
  dao.findCharacter(req.params.id, (err, character) => {
    if (character) {
      res.send(character);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

app.get("/api/films/:id", (req, res) => {
  dao.findFilm(req.params.id, (err, film) => {
    if (film) {
      res.send(film);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

app.get("/api/planets/:id", (req, res) => {
  dao.findPlanet(req.params.id, (err, planet) => {
    if (planet) {
      res.send(planet);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

app.get("/api/films/:id/characters", (req, res) => {
  dao.findCharactersByFilm(req.params.id, (err, characters) => {
    if (characters) {
      res.send(characters);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

app.get("/api/films/:id/planets", (req, res) => {
  dao.findPlanetsByFilm(req.params.id, (err, planets) => {
    if (planets) {
      res.send(planets);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

app.get("/api/characters/:id/films", (req, res) => {
  dao.findFilmsByCharacter(req.params.id, (err, films) => {
    if (films) {
      res.send(films);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

app.get("/api/planets/:id/films", (req, res) => {
  dao.findFilmsByPlanet(req.params.id, (err, films) => {
    if (films) {
      res.send(films);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

app.get("/api/planets/:id/characters", (req, res) => {
  dao.findCharactersByPlanet(req.params.id, (err, characters) => {
    if (characters) {
      res.send(characters);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

app.use(express.static('./public'));

// server start-up
const port = 4000;
console.log(
  "Open a browser to http://localhost:" + port + " to view the application"
);
app.listen(port);
