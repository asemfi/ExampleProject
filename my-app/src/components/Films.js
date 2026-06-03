import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Films() {
  let [film, setFilm] = useState([]);

  let navigate = useNavigate();
  let params = useParams();
  let url = "/api";
  async function getFilm() {
    let fetchedFilm = await fetchFilm(params.id);
    fetchedFilm.planets = await fetchPlanets();
    fetchedFilm.characters = await fetchCharacters();
    setFilm(fetchedFilm);
  }

  async function fetchFilm() {
    let result = await fetch(`${url}/films/${params.id}`);
    return result.json();
  }

  const fetchCharacters = async () => {
    let ret = await fetch(`${url}/films/${params.id}/characters`).then((res) =>
      res.json()
    );
    return ret;
  };

  const fetchPlanets = async () => {
    let ret = await fetch(`${url}/films/${params.id}/planets`).then((res) =>
      res.json()
    );
    return ret;
  };

  useEffect(() => getFilm, []);

  function handlePlanetClick(id) {
    navigate(`/planets/${id}`);
  }

  function handleCharacterClick(id) {
    navigate(`/characters/${id}`);
  }

  return (
    <>
      <main>
        <h1 id="film_title">{film.title}</h1>
        <section id="generalInfo">
          <p>
            <span id="crawl">{film.opening_crawl}</span>
          </p>
          <p>
            Director: <span id="director">{film.director}</span>
          </p>
          <p>
            Release Date: <span id="release">{film.release_date}</span>
          </p>
        </section>
        <section id="characters">
          <h2>Appearing Characters:</h2>
          <ul>
          {film.characters
              ? film.characters.map((character) => (
                  <li className="character" key={character.id} onClick={() => handleCharacterClick(character.id)}>
                    {character.name}
                  </li>
                ))
              : ""}
          </ul>
        </section>
        <section id="planets">
          <h2>Appearing Planets:</h2>
          <ul>
            {film.planets
              ? film.planets.map((planet) => (
                  <li
                    className="planets"
                    key={planet.id}
                    onClick={() => handlePlanetClick(planet.id)}
                  >
                    {planet.name}
                  </li>
                ))
              : ""}
          </ul>
        </section>
      </main>
    </>
  );
}
export default Films;
