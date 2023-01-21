import React, { useState } from "react";
import { Ingredient, analyse } from "./logic/analyse";

const example = 'Vann, tomatpure 10 %, tomater 10 %, Fløte, rapsolje, modifisert stivelse, sukker, mascarpone [Fløte, melk, sitronsyre e330], estragoneddik, hvetemel, salt, naturlig aroma, krydder [laurbær, rosmarin, gurkemeie], stabilisator e415 3%, løkpulver, krydderekstrakt, sitronsyre e330.';

export const Ingredients: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        setIngredientList(analyse(text));
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value);

    const hasUnprocessedText = false; // TODO  Only active when current text has not been analysed

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea value={text} onChange={handleChange}></textarea>                
                <button onClick={() => setText(example)}>Paste example</button>
                <button type="submit" disabled={hasUnprocessedText}>Analyse</button>
            </form>
            <IngredientsList ingredients={ingredientList} />
        </div>
    );
};

interface IngredientsListProps {
    ingredients: Ingredient[];
}

const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients }) => {
    return (
        <ol>{
            ingredients.map(ingredient => {
                return (
                    <li>{ingredient.name}</li>
                );
            }
            )}</ol>
    )
}
