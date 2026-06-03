import React from "react";
import "./App.css";
import "./site.css";
import Header from "./components/Header";
import Characters from "./components/Characters";
import Character from "./components/Character";
import Planets from "./components/Planets";
import Films from "./components/Films";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/characters/:id" element={<Character />} />
          <Route path="/" element={<Characters />} />
          <Route path="/films/:id" element={<Films />} />
          <Route path="/planets/:id" element={<Planets />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
