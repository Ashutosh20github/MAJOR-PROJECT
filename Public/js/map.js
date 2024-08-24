// import * as maptilersdk from "@maptiler/sdk";
// import { GeocodingControl } from "@maptiler/geocoding-control/maptilersdk";
// import "@maptiler/sdk/dist/maptiler-sdk.css";
// import "@maptiler/geocoding-control/style.css";

// maptilersdk.config.apiKey = "fEFj7JdmRSjnyKVxgMaE";

// const map = new maptilersdk.Map({
//   container: "map", // id of HTML container element
// });

// const gc = new GeocodingControl();

// map.addControl(gc);

 maptilersdk.config.apiKey =maptoken;

const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element to render the map
  style: maptilersdk.MapStyle.STREETS,
  center: [77.209, 28.6139], // starting position [lng, lat]
  zoom:3, // starting zoom
});