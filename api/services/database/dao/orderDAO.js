let code = codeValidatedRandom();
console.log(code);

function codeValidatedRandom() {
    let longueur = 6,
        str = '1234567890',
        result = '',
        number = '1234567890',
        total = '' + str;

    result = str[Math.floor(Math.random() * str.length)];
    total += str.toUpperCase();
    total += number;

    for (let d = 1; d < longueur; d++) {
        result += total[Math.floor(Math.random() * total.length)];
    }
    return result;
}
