

interface IIngredient {
    name: string;
    percentRange?: DoubleRange;
    partialIngredients?: IIngredient[];
}

class Ingredient implements IIngredient {
    name: string;
    percentRange?: DoubleRange;
    exactPercent?: number;
    partialIngredients?: Ingredient[];

    constructor(name: string, percent?: number) {
        this.name = name;
        this.exactPercent = percent;
    }

    setPercent(exact: number) {
        this.exactPercent = exact;
        this.percentRange = { min: exact, max: exact };
    }

    setPercentRange(min?: number, max?: number) {
        this.percentRange = { min: min, max: max };
    }

    setPercentMin(min: number) {
        if (this.percentRange === undefined) {
            this.percentRange = { min: min, max: undefined };
        } else {
            this.percentRange.min = min;
        }
    }

    addPartialIngredient(pi: Ingredient) {
        if (this.partialIngredients === undefined) {
            this.partialIngredients = [];
        }
        this.partialIngredients.push(pi);
    }

    getPercentage() {
        if (this.exactPercent) {
            return this.exactPercent;
        } else {
            return ((this.percentRange?.max ?? 0) + (this.percentRange?.min ?? 0)) / 2;
        }
    }

    getPartialIngredients() {
        return this.partialIngredients;
    }
}

function parseNameAndProsent(s: string) {
    if (s.indexOf("%") === -1) {
        return { name: s };
    } else {
        // Procent after
        let matches = s.match(/^(.+)\s+(\d+([.,]\d+)?)\s*%$/);
        //console.log(s + " => " + matches);
        if (matches && (matches.length ?? 0) > 2)
            return { name: matches[1].trim(), percent: parseFloat(matches[2].replace(",", ".")) };
        else {
            // Procent before
            matches = s.match(/^(\d+([.,]\d+)?)\s*%\s+(.+)$/);
            console.log(matches);
            if (matches && (matches.length ?? 0) > 2)
                return { name: matches[matches.length - 1].trim(), percent: parseFloat(matches[1].replace(",", ".")) };
            else
                return { name: s };
        }
    }
}

function analyse(message: string) {
    // Clean before splitting by putting a space after every comma that is not part of a number
    let cleaned_msg = message.trim().replace(/(\D),(\D)/, "$1, $2");
    console.log(cleaned_msg);

    let parts = cleaned_msg.split(/, /);
    let inBracket = false
    let allIngredients: Ingredient[] = [];
    let latestIngredient: Ingredient = new Ingredient('');
    let exactPercentDefined: number = 0;
    let lastHighestExactPercentage = 100;

    for (let part of parts) {
        part = part.trim();
        if (inBracket) {
            let closingIdx = part.indexOf("]");
            let name = part.split("]")[0].trim();
            let newIngredient = new Ingredient(name);
            //console.log("appending "+ newIngredient+" to last ingredient group");
            latestIngredient.addPartialIngredient(newIngredient);
            if (closingIdx !== -1) {
                //has closing bracket
                inBracket = false;
                allIngredients.push(latestIngredient);
            }
        } else {
            let openingBracketIdx = part.indexOf("[");
            let partSplit = part.split("[");
            let nameAndPercent = parseNameAndProsent(partSplit[0].trim()); // name plus prosent possibly
            latestIngredient = new Ingredient(nameAndPercent.name);
            if (nameAndPercent.percent) {
                // Has exact percent
                let p = nameAndPercent.percent;
                exactPercentDefined += p;
                lastHighestExactPercentage = p;
                latestIngredient.setPercent(p);

                for (let pi = allIngredients.length - 1; pi >= 0; pi--) {
                    if (allIngredients[pi].exactPercent) {
                        // previous had exact percent, no need to propagate further
                        break;
                    } else {
                        allIngredients[pi].setPercentMin(p);
                    }
                }
            } else {
                latestIngredient.setPercentRange(undefined, lastHighestExactPercentage);
            }
            if (openingBracketIdx !== -1) {
                //has opening bracket
                inBracket = true;
                let firstPartial = parseNameAndProsent(partSplit[1].trim());
                latestIngredient.addPartialIngredient(new Ingredient(firstPartial.name, firstPartial.percent));
            } else {
                allIngredients.push(latestIngredient);
            }
        }
    }

    // Go through ingredients and fill out 
    let undefinedPercentage = 100 - exactPercentDefined; // this is the max available for those with unknown at the start

    for (let ii in allIngredients) {
        let ing = allIngredients[ii];
        if (ing.exactPercent === undefined) {
            let index = parseInt(ii);
            let max = undefinedPercentage;
            if (index - 1 >= 0) {
                let possibleMax: number[] = [];
                [allIngredients[index - 1].exactPercent, ing.percentRange?.max, allIngredients[index - 1].percentRange?.max, undefinedPercentage]
                    .forEach(n => {
                        if (n !== undefined)
                            possibleMax.push(n)
                    });
                    console.log("max")
                    console.log(ing);
                    console.log(possibleMax);
                max = Math.min(...possibleMax);
            }
            let min = 0
            if (index + 1 < allIngredients.length) {
                min = (allIngredients[index + 1].exactPercent ?? allIngredients[index + 1].percentRange?.min) ?? 0
            }
            ing.setPercentRange(min, max);
        }
        console.log("%i. %s, %d - %d", ii, ing.name, ing.percentRange?.min, ing.percentRange?.max);
        if (ing.partialIngredients) {
            let j = 1;
            for (let pi of ing.partialIngredients) {
                // TODO percent
                console.log("%i.%i %s", ii, j, pi.name);
                j += 1;
            }
        }
    }

    console.log(allIngredients);
    return allIngredients;
}


export { analyse, Ingredient }
// delingredienser, og hva skjer når delingrediens har prosent... 