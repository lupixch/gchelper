$(() => {
    const crypto = require('crypto');
    const rotx = require('rot');
    const wv = require('./lib/word-value.js');
    const cy = require('cipherjs');

    let key = "";
    let inputText = "";

    $('#btnTobase64').click(function() {
        let txt = $('#tobase64-output').text();
        $('#text-input').val(txt).trigger('propertychange');
    });
    $('#btnFrombase64').click(function() {
        let txt = $('#frombase64-output').text();
        $('#text-input').val(txt).trigger('propertychange');
    });

    $('#key-input').bind('input propertychange', function() {
        key = this.value;

        const Vigenere = cy.Vigenere;
        let vdec = Vigenere.decrypt(inputText, key);
        $('#vigenereDecript-output').text(vdec);

        let venc = Vigenere.encrypt(inputText, key);
        $('#vigenereEncript-output').text(venc);

        const Substitution = cy.Substitution;
        let sdec = Substitution.decrypt(inputText, key);
        $('#substitutionDecript-output').text(sdec);

        let senc = Substitution.encrypt(inputText, key);
        $('#substitutionEncript-output').text(senc);
    });

    $('#text-input').bind('input propertychange', function() {
        inputText = this.value.toUpperCase();

        const Vigenere = cy.Vigenere;
        let vdec = Vigenere.decrypt(inputText, key);
        $('#vigenereDecript-output').text(vdec);

        let venc = Vigenere.encrypt(inputText, key);
        $('#vigenereEncript-output').text(venc);

        const Substitution = cy.Substitution;
        let sdec = Substitution.decrypt(inputText, key);
        $('#substitutionDecript-output').text(sdec);

        let senc = Substitution.encrypt(inputText, key);
        $('#substitutionEncript-output').text(senc);

        let rot = "";
        for (let j = 1; j <= 26; j++) {
            rot = rot + j + ' ' + rotx(inputText, j) + '\n';
        }
        $('#rot-output').text(rot);

        const md5 = crypto.createHash('md5').update(inputText, 'utf8').digest('hex');
        $('#md5-output').text(md5);

        const sha1 = crypto.createHash('sha1').update(inputText, 'utf8').digest('hex');
        $('#sha1-output').text(sha1);

        const sha256 = crypto.createHash('sha256').update(inputText, 'utf8').digest('hex');
        $('#sha256-output').text(sha256);

        const sha512 = crypto.createHash('sha512').update(inputText, 'utf8').digest('hex');
        $('#sha512-output').text(sha512);

        const toBase64 = Buffer.from(inputText).toString('base64');
        $('#tobase64-output').text(toBase64);
        const fromBase64 = Buffer.from(inputText, 'base64').toString('ascii');
        $('#frombase64-output').text(fromBase64);

        let words = this.value.split(" ");
        let values = "";
        let sum = 0;
        const padVal = 20;
        for (var i = 0; i < words.length; i += 1) {
            let word = words[i];
            if (word.length > 0) {
                let val = wv.wordValue(word);
                let valRed = wv.reducedSum(val);
                sum += val;
                values = values + words[i].padEnd(padVal) + ': ' + val + ' (' + valRed + ')\n';
            }
        }
        values += '-'.repeat(2 * padVal) + '\n';
        values += 'Summe'.padEnd(padVal) + ': ' + sum + ' (' + wv.reducedSum(sum) + ')\n';
        $('#word-output').text(values);
    })

    $('#text-input').focus() // focus input box
});