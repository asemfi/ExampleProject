import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Planets() {
  let [planet, setPlanet] = useState([]);

  let navigate = useNavigate();
  let params = useParams();
  let url = "/api";
  async function getPlanet() {
    let fetchedPlanet = await fetchPlanet(params.id);
    fetchedPlanet.films = await fetchFilms();
    fetchedPlanet.characters = await fetchCharacters();
    setPlanet(fetchedPlanet);
  }

  async function fetchPlanet() {
    let result = await fetch(`${url}/planets/${params.id}`);
    return result.json();
  }

  const fetchCharacters = async () => {
    let ret = await fetch(`${url}/planets/${params.id}/characters`).then((res) =>
      res.json()
    );
    return ret;
  };

  const fetchFilms = async () => {
    let ret = await fetch(`${url}/planets/${params.id}/films`).then((res) =>
      res.json()
    );
    return ret;
  };

  useEffect(() => getPlanet, []);

  function handleFilmClick(id) {
    navigate(`/films/${id}`);
  }

  function handleCharacterClick(id) {
    navigate(`/characters/${id}`);
  }

  return (
    <>
      <main>
        <h1 id="name"></h1>
        <section id="generalInfo">
          <p>
            Climate: <span id="climate">{planet.climate}</span>
          </p>
          <p>
            Surface water: <span id="surface_water">{planet.surface_water}</span>
          </p>
          <p>
            Diameter: <span id="diameter">{planet.diameter}</span> miles
          </p>
          <p>
            Rotation period: <span id="rotation_period">{planet.rotation_period}</span> days
          </p>
          <p>
            Terrain: <span id="terrain">{planet.terrain}</span>
          </p>
          <p>
            Graity: <span id="gravity">{planet.gravity}</span>
          </p>
          <p>
            Orbital period: <span id="orbital_period">{planet.orbital_period}</span> days
          </p>
          <p>
            Population: <span id="population">{planet.population}</span>
          </p>
        </section>
        <section id="characters">
          <h2>Characters who have visited</h2>
          <ul>
          {planet.characters
              ? planet.characters.map((character) => (
                  <li className="character" key={character.id} onClick={() => handleCharacterClick(character.id)}>
                    {character.name}
                  </li>
                ))
              : ""}
          </ul>
        </section>
        <section id="films">
          <h2>Films appeared in</h2>
          <ul>
            {planet.films
              ? planet.films.map((film) => (
                  <li className="films" key={film.id} onClick={() => handleFilmClick(film.id)}>
                    {film.title}
                  </li>
                ))
              : ""}
          </ul>
        </section>
      </main>
    </>
  );
}
export default Planets;
