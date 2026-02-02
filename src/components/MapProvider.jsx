import MapView from "@arcgis/core/views/MapView.js";
import { RequestContext } from "../context/RequestContext";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import PopupTemplate from "@arcgis/core/PopupTemplate.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import Graphic from "@arcgis/core/Graphic.js";
import Map from "@arcgis/core/Map.js";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import Expand from "@arcgis/core/widgets/Expand.js";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import Point from "@arcgis/core/geometry/Point.js";
import { queryAPI } from "../utils/QueryGraph";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer.js";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer.js";
// Removed deprecated BasemapGallery import
import WMSLayer from "@arcgis/core/layers/WMSLayer";
import TileLayer from "@arcgis/core/layers/TileLayer";
import urlsMap from "../services/urlsMap";

const basemapUrl = urlsMap.geoserverBasemap
const boundaryUrl = urlsMap.geoserver + "/cite/wms"
const osmUrl = urlsMap.osmLayer
const strategicUrl = urlsMap.strategicLayer

const MapContext = createContext(null);

let map = null,view = null,containerDiv=null;


export async function MapProvider(mapDiv){

/* const mapDiv = useRef(null);
const[basemap,setBaseMap] = useState(null);
const[baseview, setBaseview] = useState(null); */

/*
containerDiv = document.createElement("div");
containerDiv.id = "mapContainer";
containerDiv.style.width = "100%";
containerDiv.style.height = "100%";


        //if(map || view) return;

      const baseMapLayer = new WMSLayer({
                 url: basemapUrl,
                 title: "BaseMapLayer",
                 sublayers: [
                   {
                     name: "tileservice:bluemarble",
                     title: "BaseMapLayer",
                     format: "image/png",
                     transparent: true
                   }
                 ],
               });

            map = new Map({
            layers: [baseMapLayer],
         });

     const boundary = new WMSLayer(
                 {
                   url :boundaryUrl,
                   title : " Boundarylayer",
                   sublayers: [
                     {
                       name: "cite:boundary",
                       title : "Boundarylayer",
                       format: "image/png",
                       transparent: true
                     }
                   ],
                 }
               );
            map.add(boundary)

          const strategicfacilitieslayer = new MapImageLayer({
                  url: strategicUrl,
                  title: "Strategic Facilities",
                  customLayerParameters: {
                      styles: "default"
                  },
                  visible: false,

              });

               map.add(strategicfacilitieslayer)
          const NGF_OSM_var = new WMSLayer({
                          url: osmUrl,
                          title: "NGF OSM",
                          sublayers: [{
                              name: 'osm',
                              title: "NGF OSM",
                              visible: true
                          }],
                          visible: false
                      });

           map.add(NGF_OSM_var)

            view = new MapView({
                     container: mapDiv,
                     map,
                     scale: 40000000,
                     center: [78.19342753563451, 21.591641645634088],
                     constraints: {
                     minScale: 100000000,
                     },
                     popup: {
                       dockEnabled: true,
                       autoOpenEnabled: true,
                       dockOptions: {
                         // Ignore the default sizes that trigger responsive docking
                         breakpoint: false,
                         position: "top-right",
                       },
                     },
                     highlightOptions: {
                       color: [255, 180, 0, 1],
                       haloColor: [255, 0, 0, 1],
                       haloOpacity: 1,
                       fillOpacity: 0.01,
                       shadowColor: "black",
                       shadowOpacity: 1,
                     },
                   });
 */
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
  //  viewRef.current = view;
              /* await view.when(() => {
                   setBaseMap(map);
                   setBaseView(view);
                   }); */
}

export const getMap= () => map;
export const getView = () => view;

   /*  return (
        <MapContext.Provider value = {{basemap,baseview}}>

        <div
          ref={mapDiv}
          style={{ height: "100vh", width: "100vw" }}
        />
            {children}

            </MapContext.Provider>
        );

    }; */

// export const useMap = () => useContext(MapContext);

