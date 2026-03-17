import Modifier from 'ember-modifier';
import L from 'leaflet';

class LeafletModifier extends Modifier {
  root = null;

  /*eslint no-unused-vars: ["error", { "argsIgnorePattern": "component" }]*/
  modify(element, positional, { component, props }) {
    const map = L.map(element);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // NOTE (06/01/2026): `POINT` and `LINESTRING` are actually WKT types,
    // ideally we should use Leaftlet's terminology here.
    switch (props.type) {
      case 'POINT': {
        const latlng = props.coordinates[0];
        map.setView(latlng, 15);
        L.marker(latlng).addTo(map);
        break;
      }
      case 'LINESTRING': {
        const polyline = L.polyline(props.coordinates).addTo(map);
        map.fitBounds(polyline.getBounds());
        break;
      }
      case 'POLYGON': {
        const polygon = L.polygon(props.coordinates).addTo(map);
        map.fitBounds(polygon.getBounds());
        break;
      }
      default:
        throw new Error('Encountered an unsupported type: ' + props.type);
    }
  }
}

<template>
  <div class="map-container" {{LeafletModifier props=@props}}></div>
</template>
