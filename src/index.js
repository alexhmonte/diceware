'use strict';

import diceware from "./diceware.js";

function onGeneratePassword() {
    const nWords = 5;
    const hasSpecialSymbos = false;
    const hasStartCase = false;
    const hasNumber = false;
    const maxPassPhraseLength = 64;
    const passPhrase = diceware(nWords, hasSpecialSymbos, hasStartCase, hasNumber, maxPassPhraseLength);
    const tag = document.querySelector('#passPhrase');

    tag.textContent = passPhrase;
}

let generatePasswordButton = document.querySelector('#generatePasswordButton');

generatePasswordButton.addEventListener('click', onGeneratePassword);
