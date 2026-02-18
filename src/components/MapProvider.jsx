import MapView from "@arcgis/core/views/MapView.js";
import Map from "@arcgis/core/Map.js";
import TileLayer from "@arcgis/core/layers/TileLayer";

let map = null, view = null;

export async function MapProvider(mapDiv) {
  const baseLayer = new TileLayer({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    title: "BaseMap",
  });

  map = new Map({
    layers: [baseLayer],
  });

  view = new MapView({
    container: mapDiv,
    map,
    center: [70, 33],
    zoom: 5,
  });
}

export const getMap = () => map;
export const getView = () => view;
