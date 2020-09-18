$(() => {
    const crypto = require('crypto');
    const rotx = require('rot');
    const cy = require('cipherjs');

    const wv = require('./lib/word-value.js');

    let key: string = "";
    let inputText: string = "";
    let inputTextUpper: string = "";

    $('#text-input').trigger("focus") // focus input box

    $('#btnTobase64').on("lick", function() : void {
        let txt : string = $('#base64encode-output').text();
        $('#text-input').val(txt).trigger('propertychange');
    });

    $('#btnFrombase64').on("lick", function() : void {
        let txt = $('#base64decode-output').text();
        $('#text-input').val(txt).trigger('propertychange');
    });

    $('#key-input').on('input propertychange', function() : void {
        key = "" + $(this).val();

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

    $('#text-input').on('input propertychange', function() : void {
        inputText = "" + $(this).val();
        inputTextUpper = inputText.toUpperCase();

        const Vigenere = cy.Vigenere;
        let vdec : string = Vigenere.decrypt(inputTextUpper, key);
        $('#vigenereDecript-output').text(vdec);

        let venc : string = Vigenere.encrypt(inputTextUpper, key);
        $('#vigenereEncript-output').text(venc);

        const Substitution : any = cy.Substitution;
        let sdec : string = Substitution.decrypt(inputTextUpper, key);
        $('#substitutionDecript-output').text(sdec);

        let senc : string = Substitution.encrypt(inputTextUpper, key);
        $('#substitutionEncript-output').text(senc);

        let rot : string = "";
        for (let j : number = 1; j <= 26; j++) {
            rot = rot + j + ' ' + rotx(inputText, j) + '\n';
        }
        $('#rot-output').text(rot);

        const md5 : string = crypto.createHash('md5').update(inputText, 'utf8').digest('hex');
        $('#md5-output').text(md5);

        const sha1 : string = crypto.createHash('sha1').update(inputText, 'utf8').digest('hex');
        $('#sha1-output').text(sha1);

        const sha256 : string = crypto.createHash('sha256').update(inputText, 'utf8').digest('hex');
        $('#sha256-output').text(sha256);

        const sha512 : string = crypto.createHash('sha512').update(inputText, 'utf8').digest('hex');
        $('#sha512-output').text(sha512);

        const base64encode : string = Buffer.from(inputText, 'utf8').toString('base64');
        $('#base64encode-output').text(base64encode);
        const base64decode : string = Buffer.from(inputText, 'base64').toString('utf8');
        $('#base64decode-output').text(base64decode);

        let words: string[] = ("" + $(this).val()).split(" ");
        let values : string = "";
        let sum: number = 0;
        const padVal : number = 20;
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
