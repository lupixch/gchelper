const swissgrid = require('./swissgrid/wgs84_ch1903.js').Swisstopo;
const fcoord = require('formatcoords');
const Cparse = require('coordinate-parser');

const formats = {
    WGS84_dd: 1,
    WGS84_ddmmss: 2,
    WGS84_ddmmddd: 3,
    Swissgrid1903: 4
};


class CoordConverter {

    
    constructor(options) {
        this.format = formats.WGS84_ddmmddd;

        const optionDefaults = {
            latLonSeparator: '   ',
            decimalPlaces: 3
        };
        this.options = Object.assign({}, optionDefaults, options);
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
        if (coordstring.length == 0) {
            return p;
        }
        switch(this.format) {
            case formats.WGS84_dd:
            case formats.WGS84_ddmmss:
            case formats.WGS84_ddmmddd:
                // This formats can all be handled by the coordinate-parser lib
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
        if (!point) {
            point = {
                latitude: 0,
                longitude: 0
            }
        }
        // convert point to string
        let coordstring = "";
        switch(this.format) {
            case formats.WGS84_dd:
                // This conversion needs more precicion
                let save = this.options.decimalPlaces;
                this.options.decimalPlaces = 6;
                coordstring = fcoord(point.latitude, point.longitude).format('Xd', this.options);
                this.options.decimalPlaces = save;
                break;

                case formats.WGS84_ddmmss:
                coordstring = fcoord(point.latitude, point.longitude).format('XD M s', this.options);
                break;
                
            case formats.WGS84_ddmmddd:
                coordstring = fcoord(point.latitude, point.longitude).format('XD m', this.options);
                break;

            case formats.Swissgrid1903:
                let x = swissgrid.WGStoCHx(point.latitude, point.longitude);
                let y = swissgrid.WGStoCHy(point.latitude, point.longitude);
                coordstring = Math.round(y) + this.options.latLonSeparator + Math.round(x);
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
