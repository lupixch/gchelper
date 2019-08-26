$(() => {
    const crypto = require('crypto');
    const rotx = require('rot');
    const wv = require('./lib/word-value.js');
    const cy = require('cipherjs');
    const swisstopo = require('./lib/swissgrid/wgs84_ch1903.js').Swisstopo;
    const ddd_dmm = require('./lib/ddd-dmm.js');
    const fcoord = require('formatcoords');
    const fcOptions = {
        latLonSeparator : '   ' ,
        decimalPlaces: 3
    };
    const cparse = require('coordinate-parser');

    let key = "";
    let inputText = "";
    let wgs84String = "";
    let swissgridString = "";

    $('#btnTobase64').click(function() {
        let txt = $('#tobase64-output').text();
        $('#text-input').val(txt).trigger('propertychange');
    });
    $('#btnFrombase64').click(function() {
        let txt = $('#frombase64-output').text();
        $('#text-input').val(txt).trigger('propertychange');
    });

    $('#swissgrid').bind('input propertychange', function() {
        swissgridString = this.value;
        let swissArray = swissgridString.split(/\s+/);
        let y = parseInt(swissArray[0]);
        let x = parseInt(swissArray[1]);
        let coord = swisstopo.CHtoWGS(y, x); 
        // let lat = swisstopo.CHtoWGSlat(y, x);
        // let lon = swisstopo.CHtoWGSlng(y, x);
        let out = fcoord(coord[1],coord[0]).format('XD m', fcOptions);
        // $('#swiss2wgs-output').val(ddd_dmm.ddd2dmm(lat) + ' ' + ddd_dmm.ddd2dmm(lon));
        $('#wgs84').val(out);
    });

    $('#wgs84').bind('input propertychange', function() {
        wgs84String = this.value;
        try {
            let zzz = new cparse(wgs84String);
            // let wgsArray = wgs84String.split(' ');
            // let lat = ddd_dmm.dmm2ddd(wgsArray[0] + ' ' + wgsArray[1]);
            // let lon = ddd_dmm.dmm2ddd(wgsArray[2] + ' ' + wgsArray[3]);
            let x = swisstopo.WGStoCHx(zzz.latitude, zzz.longitude);
            let y = swisstopo.WGStoCHy(zzz.latitude, zzz.longitude);
            // $('#wgs2swiss-output').val(Math.round(y) + ' ' + Math.round(x));
            $('#swissgrid').val(Math.round(y) + '  ' + Math.round(x));
            }
        catch {

        }
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