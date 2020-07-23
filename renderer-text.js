$(() => {
    const crypto = require('crypto');
    const rotx = require('rot');
    const cy = require('cipherjs');

    const wv = require('./lib/word-value.js');

    let key = "";
    let inputText = "";
    let inputTextUpper = "";

    $('#text-input').focus() // focus input box

    $('#btnTobase64').click(function() {
        let txt = $('#base64encode-output').text();
        $('#text-input').val(txt).trigger('propertychange');
    });

    $('#btnFrombase64').click(function() {
        let txt = $('#base64decode-output').text();
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
        inputText = this.value;
        inputTextUpper = inputText.toUpperCase();

        const Vigenere = cy.Vigenere;
        let vdec = Vigenere.decrypt(inputTextUpper, key);
        $('#vigenereDecript-output').text(vdec);

        let venc = Vigenere.encrypt(inputTextUpper, key);
        $('#vigenereEncript-output').text(venc);

        const Substitution = cy.Substitution;
        let sdec = Substitution.decrypt(inputTextUpper, key);
        $('#substitutionDecript-output').text(sdec);

        let senc = Substitution.encrypt(inputTextUpper, key);
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

        const base64encode = Buffer.from(this.value, 'utf8').toString('base64');
        $('#base64encode-output').text(base64encode);
        const base64decode = Buffer.from(this.value, 'base64').toString('utf8');
        $('#base64decode-output').text(base64decode);

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
        values += 'Sum'.padEnd(padVal) + ': ' + sum + ' (' + wv.reducedSum(sum) + ')\n';
        $('#word-output').text(values);
    })

});