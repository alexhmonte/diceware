const wordList: string[] = await loadWordlist();

const symbols = ['-', ':', ';', '$', '@', '.', ',', '?', '!', '#', '%', '*', '+', '=', '_', '|', '~'];

async function loadWordlist(language: string = 'pt') {
    let wordlistUri = `wordlists/diceware.wordlist.${language}.json`;
    let response = await fetch(wordlistUri);

    return await response.json();
}

function rollDices(nDices: number): string {
    let dices = new Uint32Array(nDices);
    let result = [];

    crypto.getRandomValues(dices);
    for (let i = 0; i < nDices; i++) {
        result.push(String(dices[i] % 6));
    }
    return result.join('');
}

function pickWords(nWords: number, wordList: string[]): string[] {
    const words = [];
    const nDices = 5;

    for (let i = 0; i < nWords; i++) {
        let dices = rollDices(nDices);
        let wordIndex = dicesToInt(dices);

        words.push(wordList[wordIndex]);
    }
    return words;
}

function pickRandomSymbol() {
    const nDices = findNumberOfDicesForNumber(symbols.length - 1);
    const dices = rollDices(nDices);
    const symbolIndex = dicesToInt(dices) % symbols.length;

    return symbols[symbolIndex];
}

function findNumberOfDicesForNumber(n: number): number {
    const base = 6;

    return Math.floor(Math.log(n) / Math.log(base)) + 1;
}

function startCase(word: string): string {
    let [first, ...rest] = word;

    return first.toUpperCase() + rest.join('');
}

function dicesToInt(dices: string): number {
    const base = 6;

    return parseInt(dices, base);
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
    const hasStartCase = options.hasStartCase ?? false;
    const hasNumber = options.hasNumber ?? false;
    const maxPassPhraseLength = options.maxPassPhraseLength ?? 80;

    if (hasStartCase) {
        words = words.map((v, i, a) => startCase(v));
    }
    while (passwordSize(words) > maxPassPhraseLength) {
        words.pop();
    }
    if (hasNumber) {
        let nDices = findNumberOfDicesForNumber(words.length - 1);
        let dices = rollDices(nDices);
        const wordIndex = dicesToInt(dices) % words.length;

        nDices = findNumberOfDicesForNumber(999);
        dices = rollDices(nDices);
        words[wordIndex] = String(dicesToInt(dices) % 1000);
    }
    return words.join(symbol);   
}

function passwordSize(words: string[]): number {
    const size = words.length - 1;
    
    return words.reduce((previous, current, index, array) => previous + current.length, size);
}
