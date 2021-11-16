import {generatePassword} from "./diceware.js";

Object.assign(window, {
    diceware: {
        "generatePassword": generatePassword
    }
});
