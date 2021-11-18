const wordList = await loadWordlist();

async function loadWordlist(locale: string = 'pt-BR') {
    let wordlistUri = `wordlists/${locale}.json`;
    let response = await fetch(wordlistUri);

    return await response.json();
}

function rollDices(nDices: number): string {
    let dices = new Uint16Array(nDices);
    let result = '';

    crypto.getRandomValues(dices);
    for (let i = 0; i < nDices; i++) {
        result = result.concat(String(dices[i] % 6));
    }
    return result;
}

function pickWords(nWords: number, wordList: string[]): string[] {
    const words = [];

    for (let i = 0; i < nWords; i++) {
        let wordIndex = generateNumber(wordList.length);

        words.push(wordList[wordIndex]);
    }
    return words;
}

function findNumberOfDicesForNumber(n: number): number {
    const base = 6;

    return parseInt(String(Math.floor(Math.log(n) / Math.log(base)) + 1));
}

function dicesToInt(dices: string, maxValue: number) {
    return parseInt(dices, 6) % maxValue;
}

function pickRandomSymbol() {
    const symbols = ['-', '/', ':', '$', '&', '@', '.', ',', '?', '!'];
    const nDices = findNumberOfDicesForNumber(symbols.length);
    const dices = rollDices(nDices);
    const index  = dicesToInt(dices, symbols.length);

    return symbols[index];
}

function startCase(word: string): string {
    let [first, ...rest] = word;

    return first.toUpperCase() + rest.join('');
}

function generateNumber(maxValue: number): number {
    const nDices = findNumberOfDicesForNumber(maxValue);
    const dices = rollDices(nDices);

    return dicesToInt(dices, maxValue);
}

export interface PasswordParameters {
    nWords: number;
    hasSpecialSymbols?: boolean;
    hasStartCase?: boolean;
    hasNumber?: boolean;
    maxPassPhraseLength?: number;
}

export function generatePassword(options: PasswordParameters): string {
    let words = pickWords(options.nWords, wordList);
    const symbol = options.hasSpecialSymbols ?? false
            ? pickRandomSymbol()
            : ' ';
    const numberMaxValue = 1000;
    const hasStartCase = options.hasStartCase ?? false;
    const hasNumber = options.hasNumber ?? false;
    const maxPassPhraseLength = options.maxPassPhraseLength ?? 80;

    if (hasStartCase) {
        words = words.map((v, i, a) => startCase(v));
    }
    if (hasNumber) {
        const wordIndex = generateNumber(words.length);

        words[wordIndex] = String(generateNumber(numberMaxValue));
    }
    while (passwordSize(words) > maxPassPhraseLength) {
        words.pop();
    }
    return words.join(symbol);   
}

function passwordSize(words: string[]): number {
    const size = words.length - 1;
    
    return words.reduce((previous, current, index, array) => previous + current.length, size);
}
