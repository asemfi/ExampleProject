var express = require("express");
var dao = require("./mongo-dao.js");
var app = express();

// ── Fix 2: Body size limit to prevent oversized payload DoS ──────────────────
app.use(express.json({ limit: '10kb' })); //Parse JSON body

// ── Fix 1: Rate limiting to prevent request flooding DoS ─────────────────────
// FIXED: was "windowsMs" (typo) — correct key is "windowMs"
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5-minute window
  max: 50,                  // max 50 requests per IP per window
  message: 'Too many requests, try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ── Fix 3: Pagination on all collection endpoints to prevent DB overload ──────
// Usage: GET /api/characters?limit=20&skip=0
// - limit: how many records to return (default 20, max capped at 100)
// - skip: how many records to skip (default 0, used for paging)

app.get("/api/characters", (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip  = parseInt(req.query.skip) || 0;
  dao.findAllCharacters(limit, skip, (err, characters) => {
    if (characters) {
      res.send(characters);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

app.get("/api/planets", (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip  = parseInt(req.query.skip) || 0;
  dao.findAllPlanets(limit, skip, (err, planets) => {
    if (planets) {
      res.send(planets);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

app.get("/api/films", (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip  = parseInt(req.query.skip) || 0;
  dao.findAllFilms(limit, skip, (err, films) => {
    if (films) {
      res.send(films);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

// ── Single record endpoints — no pagination needed ───────────────────────────

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