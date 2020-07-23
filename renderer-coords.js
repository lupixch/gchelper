$(() => {
    const L = require('leaflet');

    const ccalc = require('./lib/coord-calcs.js');
    const Cconv = require('./lib/coord-converter.js').CoordConverter;
    const CCFormats = require('./lib/coord-converter.js').CCFormats;
    
    let cconv = new Cconv();
    
    const fcOptions = {
        latLonSeparator: '   ',
        decimalPlaces: 3
    };

    let bearing = 90;
    let distance = 1000;
    let p1 = { latitude: 47.493450, longitude: 8.218000};
    let p2 = ccalc.projection(p1, distance, bearing); 
    let p3, p4;

    let map;
    let p1RaisesEvent = false;
    let p2RaisesEvent = false;
    let distancesRaisesEvent = false;
    let bearingRaisesEvent = false

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

    // Delay the sizing of the map. Not really sure, if this is the correct workaround for missing map tiles...
    $('#coords-tab').focusin( () => {
        setTimeout( () => {
            map.invalidateSize(true); 
        }, 500);
    });

    // Called by user code
    onP1Changed = () => {
        try {
            p2 = ccalc.projection(p1, distance, bearing); 
        } catch(e) {
            $('#error-text').text(e.message);
        }
        updateMapAndFields();
    }

    // Called by user code
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

    // Called by user code
    onDistanceChanged = () => {
        try {
            p2 = ccalc.projection(p1, distance, bearing); 
        } catch(e) {
            console.error(e);
            $('#error-text').text(e.message);
        }
        updateMapAndFields();
    }

    // Called by user code
    onBearingChanged = () => {
        try {
            p2 = ccalc.projection(p1, distance, bearing); 
        } catch(e) {
            console.error(e);
            $('#error-text').text(e.message);
        }
        updateMapAndFields();
    }


    // Called by user code
    // Update the positions of map elements and values in input boxes.
    let updateMapAndFields = () => {
        markerP1.setLatLng([p1.latitude, p1.longitude]);
        markerP2.setLatLng([p2.latitude, p2.longitude]);
        polyline.setLatLngs([[p1.latitude, p1.longitude],
                             [p2.latitude, p2.longitude]]
        );

        // Don't update inputs that raise the event
        if (!p1RaisesEvent) $('#p1').val(cconv.asString(p1));
        if (!p2RaisesEvent) $('#p2').val(cconv.asString(p2));
        if (!distancesRaisesEvent) $('#distance').val(distance);
        if (!bearingRaisesEvent) $('#bearing').val(Math.round(bearing));
        p1RaisesEvent = false;
        p2RaisesEvent = false;
        distancesRaisesEvent = false;
        bearingRaisesEvent = false;
    };

    // jQuery event
    $('#p1').bind('input propertychange', function() {
        $('#error-text').text('');
        p1 = cconv.asPoint(this.value);
        p1RaisesEvent = true;
        onP1Changed();
    })

    // jQuery event
    $('#p2').bind('input propertychange', function() {
        $('#error-text').text('');
        p2 = cconv.asPoint(this.value);
        p2RaisesEvent = true;
        onP2Changed();
    })

    // jQuery event
    $('#distance').bind('input propertychange', function() {
        $('#error-text').text('');
        distance = parseInt(this.value, 10) || 0;
        distancesRaisesEvent = true;
        onDistanceChanged();
    })

    // jQuery event
    $('#bearing').bind('input propertychange', function() {
        $('#error-text').text('');
        bearing = parseInt(this.value, 10) || 0;
        bearingRaisesEvent = true;
        onBearingChanged()
    })

    // jQuery event
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

    // leaflet event
    markerP1.on('moveend', function() {
        let pos = markerP1.getLatLng();
        p1.latitude = pos.lat;
        p1.longitude = pos.lng;
        onP1Changed();
    });

    // leaflet event
    markerP2.on('moveend', function() {
        let pos = markerP2.getLatLng();
        p2.latitude = pos.lat;
        p2.longitude = pos.lng;
        onP2Changed();
    });

    // Intial update of fields
    updateMapAndFields();
});
