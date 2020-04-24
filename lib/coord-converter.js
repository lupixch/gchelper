const swissgrid = require('./swissgrid/wgs84_ch1903.js').Swisstopo;
const fcoord = require('formatcoords');
const Cparse = require('coordinate-parser');

const formats = {
    WGS84_dd: 1,
    WGS84_ddmmss: 2,
    WGS84_ddmmddd: 3,
    Swissgrid1903: 4
};

// TODO: May this options can be passed from outside
const fcOptions = {
    latLonSeparator: '   ',
    decimalPlaces: 3
};

class CoordConverter {

    
    constructor() {
        // this.formats = formats;
        this.format = formats.WGS84_ddmmddd;
    }

    setFormat(format) {
        this.format = format;
        return format;
    }

    getFormat() {
        return this.format;
    }

    asPoint(coordstring) {
        // convert string to point
        let p = {
            latitude: 0,
            longitude: 0
        }
        switch(this.format) {
            case formats.WGS84_dd:
            case formats.WGS84_ddmmss:
            case formats.WGS84_ddmmddd:
                let position = new Cparse(coordstring);
                p.latitude = position.getLatitude();
                p.longitude = position.getLongitude();
                break;

            case formats.Swissgrid1903:
                let swissArray = coordstring.split(/\s+/);
                let y = parseInt(swissArray[0]);
                let x = parseInt(swissArray[1]);
                let wgs = swissgrid.CHtoWGS(y, x);
                p.latitude = wgs[1];
                p.longitude = wgs[0];
                break;

            default:                
            break;
        }

        return p;
    }

    asString(point) {
        // convert point to string
        let coordstring = "";
        switch(this.format) {
            case formats.WGS84_dd:
                // This conversion needs more precicion
                let save = fcOptions.decimalPlaces;
                fcOptions.decimalPlaces = 6;
                coordstring = fcoord(point.latitude, point.longitude).format('Xd', fcOptions);
                fcOptions.decimalPlaces = save;
                break;

                case formats.WGS84_ddmmss:
                coordstring = fcoord(point.latitude, point.longitude).format('XD M s', fcOptions);
                break;
                
            case formats.WGS84_ddmmddd:
                coordstring = fcoord(point.latitude, point.longitude).format('XD m', fcOptions);
                break;

            case formats.Swissgrid1903:
                let x = swissgrid.WGStoCHx(point.latitude, point.longitude);
                let y = swissgrid.WGStoCHy(point.latitude, point.longitude);
                coordstring = Math.round(y) + fcOptions.latLonSeparator + Math.round(x);
                break;

            default:                
            break;
        }
        return coordstring;
    }
};


module.exports = {
    CoordConverter : CoordConverter,
    CCFormats : formats
};
