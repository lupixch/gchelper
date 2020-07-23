$(() => {
    const crypto = require('crypto');
    const rotx = require('rot');
    const cy = require('cipherjs');
    const L = require('leaflet');

    const wv = require('./lib/word-value.js');
    const ccalc = require('./lib/coord-calcs.js');
    const Cconv = require('./lib/coord-converter.js').CoordConverter;
    const CCFormats = require('./lib/coord-converter.js').CCFormats;
    
    let cconv = new Cconv();
    
    const fcOptions = {
        latLonSeparator: '   ',
        decimalPlaces: 3
    };

    let key = "";
    let inputText = "";
    let inputTextUpper = "";

    let bearing = 90;
    let distance = 1000;
    let p1 = { latitude: 47.493450, longitude: 8.218000};
    let p2 = ccalc.projection(p1, distance, bearing); 
    let p3, p4;

    let map;
    let p1Protect = false;
    let p2Protect = false;
    let distanceProtect = false;
    let bearingProtect = false

    $('#p1').val(cconv.asString(p1));
    $('#p2').val(cconv.asString(p2));
    $('#distance').val(distance);
    $('#bearing').val(Math.round(bearing));

    let updateMapAndFields = () => {
        markerP1.setLatLng([p1.latitude, p1.longitude]);
        markerP2.setLatLng([p2.latitude, p2.longitude]);
        polyline.setLatLngs([[p1.latitude, p1.longitude],
                             [p2.latitude, p2.longitude]]
        );

        if (!p1Protect) $('#p1').val(cconv.asString(p1));
        if (!p2Protect) $('#p2').val(cconv.asString(p2));
        if (!distanceProtect) $('#distance').val(distance);
        if (!bearingProtect) $('#bearing').val(Math.round(bearing));
        p1Protect = false;
        p2Protect = false;
        distanceProtect = false;
        bearingProtect = false;
    };

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

    $('#p1').bind('input propertychange', function() {
        $('#error-text').text('');
        p1 = cconv.asPoint(this.value);
        p1Protect = true;
        onP1Changed();
    })

    $('#p2').bind('input propertychange', function() {
        $('#error-text').text('');
        p2 = cconv.asPoint(this.value);
        p2Protect = true;
        onP2Changed();
    })

    $('#distance').bind('input propertychange', function() {
        $('#error-text').text('');
        distance = parseInt(this.value, 10) || 0;
        distanceProtect = true;
        onDistanceChanged();
    })

    $('#bearing').bind('input propertychange', function() {
        $('#error-text').text('');
        bearing = parseInt(this.value, 10) || 0;
        bearingProtect = true;
        onBearingChanged()
    })

    $('input[type=radio][name=formatOptions]').change(function() {
        if (this.value == 'swiss') {
            cconv.setFormat(CCFormats.Swissgrid1903);
        }
        else if (this.value == 'mmddd') {
            cconv.setFormat(CCFormats.WGS84_ddmmddd);
        }
        else if (this.value == 'ddmmss') {
            cconv.setFormat(CCFormats.WGS84_ddmmss);
        }
        else if (this.value == 'dd') {
            cconv.setFormat(CCFormats.WGS84_dd);
        }
        updateMapAndFields();
    });

    onP1Changed = () => {
        try {
            p2 = ccalc.projection(p1, distance, bearing); 
        } catch(e) {
            $('#error-text').text(e.message);
        }
        updateMapAndFields();
    }

    onP2Changed = () => {
        try {
            let db = ccalc.distanceAndBearing(p1, p2);
            distance =db.distance;
            bearing = Math.round(db.bearing);
        } catch(e) {
            $('#error-text').text(e.message);
        }
        updateMapAndFields();
    }

    onDistanceChanged = () => {
        try {
            p2 = ccalc.projection(p1, distance, bearing); 
        } catch(e) {
            console.error(e);
            $('#error-text').text(e.message);
        }
        updateMapAndFields();
    }

    onBearingChanged = () => {
        try {
            p2 = ccalc.projection(p1, distance, bearing); 
        } catch(e) {
            console.error(e);
            $('#error-text').text(e.message);
        }
        updateMapAndFields();
    }

    $('#text-input').focus() // focus input box

    map = L.map('map').setView([47.493450, 8.218000], 13);

    var greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    var blueIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    let markerP1 = L.marker([p1.latitude, p1.longitude], {icon: greenIcon, draggable: true, title: 'P1'}).addTo(map);
    let markerP2 = L.marker([p2.latitude, p2.longitude], {icon: blueIcon, draggable: true, title: 'P2'}).addTo(map);
 
    let latlngs = [
        [p1.latitude, p1.longitude],
        [p2.latitude, p2.longitude]
    ];
    let polyline = L.polyline([
        [p1.latitude, p1.longitude],
        [p2.latitude, p2.longitude]], 
        {color: 'red', weight: 1}).addTo(map);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
    }).addTo(map);

    $('#coords-tab').focusin( () => {
        setTimeout( () => {
            map.invalidateSize(true); 
        }, 500);
    });

    markerP1.on('moveend', function() {
        let pos = markerP1.getLatLng();
        p1.latitude = pos.lat;
        p1.longitude = pos.lng;
        onP1Changed();
    });

    markerP2.on('moveend', function() {
        let pos = markerP2.getLatLng();
        p2.latitude = pos.lat;
        p2.longitude = pos.lng;
        onP2Changed();
    });

    // Intial update of fields
    updateMapAndFields();

});
