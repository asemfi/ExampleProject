import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Character() {
  let [character, setCharacter] = useState([]);

  let navigate = useNavigate();
  let params = useParams();
  let url = "/api";
  async function getCharacter() {
    let fetchedCharacter = await fetchCharacter(params.id);
    fetchedCharacter.homeworld = await fetchHomeworld(fetchedCharacter);
    fetchedCharacter.films = await fetchFilms();
    console.log(fetchedCharacter);
    setCharacter(fetchedCharacter);
  }

  async function fetchCharacter() {
    let result = await fetch(`${url}/characters/${params.id}`);
    return result.json();
  }

  const fetchHomeworld = async (fetchedCharacter) => {
    const planet = await fetch(
      `${url}/planets/${fetchedCharacter.homeworld}`
    ).then((res) => res.json());
    return planet;
  };

  const fetchFilms = async () => {
    let ret = await fetch(`${url}/characters/${params.id}/films`).then((res) =>
      res.json()
    );
    return ret;
  };

  useEffect(() => getCharacter, []);

  function handlePlanetClick(id) {
    navigate(`/planets/${id}`);
  }
  function handleFilmClick(id) {
    navigate(`/films/${id}`);
  }

  return (
    <>
      <main>
        <h1 id="name">{character.name}</h1>
        <section id="generalInfo">
          <p>
            Height: <span id="height">{character.height}</span> cm
          </p>
          <p>
            Mass: <span id="mass">{character.mass}</span> kg
          </p>
          <p>
            Born: <span id="birth_year">{character.birth_year}</span>
          </p>
        </section>
        <section id="planets">
          <h2>Homeworld</h2>
          <p>
            <span
              className="planets"
              id="homeworld"
              onClick={() => handlePlanetClick(character.homeworld.id)}
            >
              {character?.homeworld?.name}
            </span>
          </p>
        </section>
        <section id="films">
          <h2>Films appeared in</h2>
          <ul>
            {character.films
              ? character.films.map((film) => (
                  <li className="films" key={film.id} onClick={() => handleFilmClick(film.id)}>
                    {film.name}
                  </li>
                ))
              : ""}
          </ul>
        </section>
      </main>
    </>
  );
}
export default Character;
