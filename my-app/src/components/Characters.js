import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Characters() {
    let [charList, setCharList] = useState([]);
    let navigate = useNavigate();

    let data_url = "/api/characters";

    const fetchCharacters = () => {
        fetch(data_url)
        .then((res) => res.json())
        .then((charList) => {
            setCharList(charList);
        });
    };

    useEffect(fetchCharacters, []);

  function handleClick(id) {
    navigate(`/characters/${id}`);
  }

  return (
    <>
      <section id="charactersList">
        {charList.map((character) => (
          <div key={character.id} onClick={() => handleClick(character.id)}>
            {character.name}
          </div>
        ))}
      </section>
    </>
  );
}
export default Characters;
