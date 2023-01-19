import React from 'react';
import './App.css';
import { analyse } from './logic/analyse';
import { IngredientsBox } from './IngredientBox';

function App() {
  analyse('Vann, tomatpure 10 %, tomater 10 %, Fløte, rapsolje, modifisert stivelse, sukker, mascarpone [Fløte, melk, sitronsyre e330], estragoneddik, hvetemel, salt, naturlig aroma, krydder [laurbær, rosmarin, gurkemeie], stabilisator e415 3%, løkpulver, krydderekstrakt, sitronsyre e330.');
  return (
    <div className="App">
      <header className="App-header">
        Analyse ingredienser
      <IngredientsBox text={'valami'} />
      </header>
    </div>
  );
}

export default App;
