$(() => {
    const crypto = require('crypto');
    const rotx = require('rot');
    const wv = require('./lib/word-value.js');
    const cy = require('cipherjs');
    const swisstopo = require('./lib/swissgrid/wgs84_ch1903.js').Swisstopo;
    const fcoord = require('formatcoords');
    const clib = require('./lib/coordlib.js');
    const cparse = require('coordinate-parser');

    const fcOptions = {
        latLonSeparator: '   ',
        decimalPlaces: 3
    };

    let key = "";
    let inputText = "";
    let inputTextUpper = "";
    let wgs84String = "";
    let swissgridString = "";
    let wgs84p1String = "";
    let wgs84p2String = "";

    $('#btnTobase64').click(function() {
        let txt = $('#base64encode-output').text();
        $('#text-input').val(txt).trigger('propertychange');
    });

    $('#btnFrombase64').click(function() {
        let txt = $('#base64decode-output').text();
        $('#text-input').val(txt).trigger('propertychange');
    });

    $('#swissgrid').bind('input propertychange', function() {
        swissgridString = this.value;
        let swissArray = swissgridString.split(/\s+/);
        let y = parseInt(swissArray[0]);
        let x = parseInt(swissArray[1]);
        let wgs = swisstopo.CHtoWGS(y, x);
        let out = fcoord(wgs[1], wgs[0]).format('XD m', fcOptions);
        $('#wgs84').val(out);
    });

    $('#wgs84').bind('input propertychange', function() {
        wgs84String = this.value;
        try {
            let wgs = new cparse(wgs84String);
            let x = swisstopo.WGStoCHx(wgs.latitude, wgs.longitude);
            let y = swisstopo.WGStoCHy(wgs.latitude, wgs.longitude);
            $('#swissgrid').val(Math.round(y) + '  ' + Math.round(x));
        } catch {

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

    $('#wgsp1').bind('input propertychange', function() {
        wgs84p1String = this.value;
        try {
            let wgsP1 = new cparse(wgs84p1String);
            let wgsP2 = new cparse(wgs84p2String);
            if (clib.checkPointValid(wgsP1) && clib.checkPointValid(wgsP1)) {
                let db = clib.distanceAndBearing(wgsP1, wgsP2);
                $('#wgs-distance').val(db.distance);
                $('#wgs-angle').val(Math.round(db.bearing));
            }
        } catch {

        }
    })

    $('#wgsp2').bind('input propertychange', function() {
        wgs84p2String = this.value;
        try {
            let wgsP1 = new cparse(wgs84p1String);
            let wgsP2 = new cparse(wgs84p2String);
            if (clib.checkPointValid(wgsP1) && clib.checkPointValid(wgsP1)) {
                let db = clib.distanceAndBearing(wgsP1, wgsP2);
                $('#wgs-distance').val(db.distance);
                $('#wgs-angle').val(Math.round(db.bearing));
            }
        } catch {

        }
    })

    $('#wgs-distance').bind('input propertychange', function() {
        wgs84p1String = $('#wgsp1').val();
        let angle = parseInt($('#wgs-angle').val(), 10);
        let distance = parseInt(this.value, 10);
        try {
            let p2 = clib.projection(new cparse(wgs84p1String), distance, angle); 
            let out = fcoord(p2.latitude, p2.longitude).format('XD m', fcOptions);
            $('#wgsp2').val(out);
    
        } catch {

        }
    })

    $('#wgs-angle').bind('input propertychange', function() {
        wgs84p1String = $('#wgsp1').val();
        let angle = parseInt(this.value, 10);
        let distance = parseInt($('#wgs-distance').val(), 10);
        try {
            let p2 = clib.projection(new cparse(wgs84p1String), distance, angle); 
            let out = fcoord(p2.latitude, p2.longitude).format('XD m', fcOptions);
            $('#wgsp2').val(out);
    
        } catch {

        }
    })

    $('#text-input').focus() // focus input box
});