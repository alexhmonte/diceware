async function loadWordlist(locale) {
    let selectedLocale = locale | 'pt-BR.json';
    let wordlistUri = `wordlist/${selectedLocale}.json`;
    let response = await fetch(wordlistUri);

    return await response.json();
}

function rollDices(nDices) {
    let results = Uint16Array(nDices);

    crypto.getRandomValues(results);
    for (let i = 0; i < nDices; i++) {
        results[i] = results[i] % 7777;
    }
    return results;
}

function pickWords(nWords, wordList) {
    let wordIndexes = rollDices(nWords);
    
    return wordIndexes.map((v, i, a) => wordList[v]);
}
