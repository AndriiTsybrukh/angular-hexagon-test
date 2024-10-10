import { LatLng, latLng, MapOptions, tileLayer } from 'leaflet';

export const INIT_ZOOM: number = 7;
export const INIT_LOCATION: LatLng = latLng(
  24.746831298412058,
  41.22070312500001
);

export const MAP_DEFAULT_OPTIONS: MapOptions = {
  layers: [
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 9,
    }),
  ],
  zoom: INIT_ZOOM,
  center: INIT_LOCATION,
};
