'use strict';

const wordList = await loadWordlist();

async function loadWordlist(locale) {
    let selectedLocale = locale || 'pt-BR';
    let wordlistUri = `wordlists/${selectedLocale}.json`;
    let response = await fetch(wordlistUri);

    return await response.json();
}

function rollDices(nDices) {
    let dices = new Uint16Array(nDices);
    let result = '';

    crypto.getRandomValues(dices);
    for (let i = 0; i < nDices; i++) {
        result = result.concat(dices[i] % 6);
    }
    return result;
}

function pickWords(nWords, wordList) {
    const words = [];
    const nDices = findNumberOfDicesForNumber(wordList.length);

    for (let i = 0; i < nWords; i++) {
        let dices = rollDices(nDices);
        let wordIndex = dicesToInt(dices, wordList.length);

        words.push(wordList[wordIndex]);
    }
    return words;
}

function findNumberOfDicesForNumber(n) {
    const base = 6;

    return parseInt(Math.floor(Math.log(n) / Math.log(base)) + 1);
}

function dicesToInt(dices, maxValue) {
    return parseInt(dices, 6) % maxValue;
}

function pickRandomSymbol() {
    const symbols = ['-', '/', ':', '$', '&', '@', '.', ',', '?', '!'];
    const nDices = findNumberOfDicesForNumber(symbols.length);
    const dices = rollDices(nDices);
    const index  = dicesToInt(dices, symbols.length);

    return symbols[index];
}

function startCase(word) {
    let [first, ...rest] = word;

    return first.toUpperCase() + rest.join('');
}

function generateNumber(maxValue) {
    const nDices = findNumberOfDicesForNumber(maxValue);
    const dices = rollDices(nDices);

    return dicesToInt(dices, maxValue);
}

export default function generatePassPhrase(nWords, hasSpecialSymbos, hasStartCase, hasNumber, maxPassPhraseLength = 64) {
    let words = pickWords(nWords, wordList);
    const symbol = hasSpecialSymbos
            ? pickRandomSymbol()
            : ' ';

    if (hasStartCase) {
        words = words.map((v, i, a) => startCase(v));
    }
    if (hasNumber) {
        words = words.map((v, i, a) => i % 2 > 0 ? generateNumber(1000) : v);
    }
    while (words.join(' ').length > maxPassPhraseLength) {
        words.pop();
    }
    return words.join(symbol);   
}
