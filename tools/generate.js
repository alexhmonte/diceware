var fs = require('fs');
var text = fs.readFileSync("../wordlist-src/pt-BR.txt", { encoding: 'utf-8' });
var textByLine = text.split('\r\n');
var data = JSON.stringify(textByLine);
var out = fs.writeFileSync("../frontend/wordlist/pt-BR.json", data);
