import Model, { attr } from '@ember-data/model';
import proj4 from 'proj4';

export default class GeometryModel extends Model {
  @attr('string') asWKT;

  get wgs84Coord() {
    this.defineProj4();

    const match = this.asWKT.match(
      /((?<system>.*);)?(?<type>\w+)\s*\(+(?<coords>[^)]+)\)+/,
    );

    const coordinateSystem = match.groups.system;

    if (!['POINT', 'LINESTRING', 'POLYGON'].includes(match.groups.type)) {
      throw new Error(
        'Encountered an unsupported WKT geometry: ' + match.groups.type,
      );
    }

    const coords = this.#transformCoord(match.groups.coords);

    const coordWGS84 = coords.map((pair) => {
      if (!coordinateSystem || coordinateSystem.startsWith('SRID=')) {
        const epsg = coordinateSystem
          ? `EPSG:${coordinateSystem.substring(5)}`
          : 'EPSG:4326'; // actually, the default is OGC:CRS84, which has no direct EPSG equivalent as it switches lang/long coordinates
        // target is wgs84 = EPSG:4326, gps system https://epsg.io/4326
        const wgsCoord = proj4(epsg, 'EPSG:4326', pair);
        // NOTE (05/01/2026): `proj4` requires `x` and `y` as property names,
        // whereas Leaflet uses `lat` and `lng`. We switch them here to simplify
        // using the resulting data in the Leaflet component. Technically, both
        // can also work with arrays containing coordinate pairs, but this makes
        // it challenging to keep track of what a given number actually means.
        // NOTE (23/04/2026): https://docs.ogc.org/is/22-047r1/22-047r1.html#10-8-1-1-%C2%A0-rdfs-datatype-geo-wktliteral
        // defines the default coordinate system as WGS 84 longitude-latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84)
        // there is no SRID equivalent to this, so in this case we swap lat and long
        const lat = coordinateSystem ? wgsCoord.y : wgsCoord.x;
        const lng = coordinateSystem ? wgsCoord.x : wgsCoord.y;
        return { lat, lng };
      } else {
        throw new Error(
          `Encountered unknown coordinate system: ${coordinateSystem}`,
        );
      }
    });

    return { type: match.groups.type, coordinates: coordWGS84 };
  }

  #transformCoord(coordinates) {
    return coordinates.split(',').map((pair) => {
      const [x, y] = pair.trim().split(/\s+/);
      return { x: parseFloat(x), y: parseFloat(y) };
    });
  }

  defineProj4() {
    // Register EPSG:31370 (Belgian Lambert 72)
    // Source: <https://epsg.io/31370>
    proj4.defs(
      'EPSG:31370',
      '+proj=lcc +lat_0=90 +lon_0=4.36748666666667 +lat_1=51.1666672333333 +lat_2=49.8333339 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.8686,52.2978,-103.7239,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs +type=crs',
    );
  }
}
