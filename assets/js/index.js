"use strict";

function onLoad() {
    const maxLength = document.querySelector('#maxLength');
    const maxLengthDisplay = document.querySelector('#maxLengthDisplay');

    maxLengthDisplay.textContent = maxLength.value;
    maxLength.addEventListener('input', function() {
        maxLengthDisplay.textContent = maxLength.value;
    });
}

function readPasswordOptions(nWords) {
    const hasSymbol = document.querySelector('#hasSimbol');
    const hasNumber = document.querySelector('#hasNumber');
    const hasUpcase = document.querySelector('#hasUpcase');
    const maxLength = document.querySelector('#maxLength');

    return {
        "nWords": nWords,
        "hasSpecialSymbols": hasSymbol.checked,
        "hasNumber": hasNumber.checked,
        "hasStartCase": hasUpcase.checked,
        "maxPassPhraseLength": maxLength.value
    }
}

function onGeneratePassword(nWords) {
    const options = readPasswordOptions(nWords);
    const password = diceware.generatePassword(options);
    const passwordDisplay = document.querySelector('#password');
    const copyButton = document.querySelector('.copy-button');

    passwordDisplay.textContent = password;
    passwordDisplay.style.display = 'block';
    copyButton.style.display = 'block';
}
