import React, { useState } from "react";
import { Ingredient, analyse } from "./logic/analyse copy";

const example = 'Vann, tomatpure 10 %, tomater 10 %, Fløte, rapsolje, modifisert stivelse, sukker, mascarpone [Fløte, melk, sitronsyre e330], estragoneddik, hvetemel, salt, naturlig aroma, krydder [laurbær, rosmarin, gurkemeie], stabilisator e415 3%, løkpulver, krydderekstrakt, sitronsyre e330.';

export const Ingredients: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [analysedText, setAnalysedText] = useState<string>('');
    const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        setAnalysedText(text);
        setIngredientList(analyse(text));
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {setText(e.target.value);}

    const hasUnprocessedText = analysedText !== text; // TODO  Only active when current text has not been analysed

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea value={text} onChange={handleChange}></textarea>
                <button onClick={() => setText(example)}>Paste example</button>
                <button type="submit" disabled={!hasUnprocessedText}>Analyse</button>
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
        <ol className="ingredientList">{
            ingredients.map((ingredient, idx) => {
                let hasExactPercent = ingredient.exactPercent !== undefined;
                let numberValue = hasExactPercent ? ingredient.exactPercent : `[${ingredient.percentRange?.min}, ${ingredient.percentRange?.max}]`;
                return (
                    <li style={{ fontSize: ingredient.getPercentage() }} className={ hasExactPercent ? "exact" : "approximate" } key={idx}>{ingredient.name} {numberValue}
                        {((ingredient.getPartialIngredients()?.length ?? 0) > 0) ? <ol>
                            {
                                (ingredient.getPartialIngredients() ?? []).map((pi, pii) => {
                                    return (<li key={pi + "." + pii}>{pi.name}</li>);
                                })
                            }
                        </ol> : null}

                    </li>
                );
            }
            )}</ol>
    )
}
