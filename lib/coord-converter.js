const swissgrid = require('./swissgrid/wgs84_ch1903.js').Swisstopo;
const fcoord = require('formatcoords');
const Cparse = require('coordinate-parser');

const formats = {
    WGS84_dd: 1,
    WGS84_ddmmss: 2,
    WGS84_ddmmddd: 3,
    Swissgrid1903: 4,
    Swissgrid1903P: 5
};

const fcOptions = {
    latLonSeparator: ' ',
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
            case formats.Swissgrid1903P:
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
            case formats.WGS84_ddmmss:
            case formats.WGS84_ddmmddd:
                coordstring = fcoord(point.latitude, point.longitude).format('XD m', fcOptions);

            case formats.Swissgrid1903:
            case formats.Swissgrid1903P:
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
