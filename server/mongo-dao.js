const mongodb = require("mongodb"); // mongo client library
const url = "mongodb://localhost:27017/swapi";
let dbPool;

mongodb.MongoClient.connect(url, function (err, db) {
  if (!err) {
    dbPool = db.db("swapi");
  } else {
    console.log("DB CONNECTION FAILED. Is database running?");
  }
});

module.exports.findAllCharacters = async function (callback) {
  var col = dbPool.collection("characters");
  col.find().toArray(async(err, characters) => {
    if (!err) {
      callback(null, characters);
    } else {
      callback("Failed to find characters", undefined);
    }
  });
};

module.exports.findAllPlanets = async function (callback) {
  var col = dbPool.collection("planets");
  col.find().toArray(async(err, planets) => {
    if (!err) {
      callback(null, planets);
    } else {
      callback("Failed to find planets", undefined);
    }
  });
};

module.exports.findAllFilms = async function (callback) {
  var col = dbPool.collection("films");
  col.find().toArray(async(err, films) => {
    if (!err) {
      callback(null, films);
    } else {
      callback("Failed to find films", undefined);
    }
  });
};

// retrieve single character
module.exports.findCharacter = async function (id, callback) {
  var col = dbPool.collection("characters");
  col.find({ id: +id }).toArray(async(err, character) => {
    if (!err) {
      callback(null, character[0]);
    } else {
      callback("Failed to find character", undefined);
    }
  });
};

// retrieve single film
module.exports.findFilm = async function (id, callback) {
  var col = dbPool.collection("films");
  col.find({ id: +id }).toArray(async(err, film) => {
    if (!err) {
      callback(null, film[0]);
    } else {
      callback("Failed to find film", undefined);
    }
  });
};

// retrieve single planet
module.exports.findPlanet = async function (id, callback) {
  var col = dbPool.collection("planets");
  col.find({ id: +id }).toArray(async(err, planet) => {
    if (!err) {
      callback(null, planet[0]);
    } else {
      callback("Failed to find planet", undefined);
    }
  });
};

module.exports.findCharactersByFilm = async function (id, callback) {
  var col = dbPool.collection("films_characters");
  col.find({ film_id: +id }).toArray(async (err, matches) => {
    let characters = [];
    for (let match of matches) {
      let character_id = match.character_id;
      var col = dbPool.collection("characters");
      let data = await col.find({ id: +character_id }).toArray();
      characters.push({ id: character_id, name: data[0].name });
    }
    if (!err) {
      callback(null, characters);
    } else {
      callback("Failed to find characters", undefined);
    }
  });
};

module.exports.findPlanetsByFilm = async function (id, callback) {
  var col = dbPool.collection("films_planets");
  col.find({ film_id: +id }).toArray(async (err, matches) => {
    let planets = [];
    for (let match of matches) {
      let planet_id = match.planet_id;
      var col = dbPool.collection("planets");
      let data = await col.find({ id: +planet_id }).toArray();
      planets.push({ id: planet_id, name: data[0].name });
    }
    if (!err) {
      callback(null, planets);
    } else {
      callback("Failed to find planets", undefined);
    }
  });
};

module.exports.findFilmsByCharacter = async function (id, callback) {
  var col = dbPool.collection("films_characters");
  col.find({ character_id: +id }).toArray(async (err, matches) => {
    let films = [];
    for (let match of matches) {
      let film_id = match.film_id;
      var col = dbPool.collection("films");
      let data = await col.find({ id: +film_id }).toArray();
      films.push({ id: film_id, name: data[0].title });
    }
    if (!err) {
      callback(null, films);
    } else {
      callback("Failed to find films", undefined);
    }
  });
};

module.exports.findFilmsByPlanet = async function (id, callback) {
  var col = dbPool.collection("films_planets");
  col.find({ planet_id: +id }).toArray(async (err, matches) => {
    let films = [];
    for (let match of matches) {
      let film_id = match.film_id;
      var col = dbPool.collection("films");
      let data = await col.find({ id: +film_id }).toArray();
      films.push({ id: film_id, title: data[0].title });
    }
    if (!err) {
      callback(null, films);
    } else {
      callback("Failed to find character", undefined);
    }
  });
};

module.exports.findCharactersByPlanet = async function (id, callback) {
  var col = dbPool.collection("characters");
  col.find({ homeworld: +id }).toArray(async(err, characters) => {
    characters = characters.map((character) => {
      return { id: character.id, name: character.name };
    });
    if (!err) {
      callback(null, characters);
    } else {
      callback("Failed to find character", undefined);
    }
  });
};
