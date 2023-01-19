type IngredientsBoxProps = {
    text: string;
}

const IngredientsBox = ({ text }: IngredientsBoxProps) => <form className="App-link">
    <textarea>{text}</textarea>
    </form>;

export {IngredientsBox}