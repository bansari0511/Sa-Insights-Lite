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
//import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import WMSLayer from "@arcgis/core/layers/WMSLayer";
import WFSLayer from "@arcgis/core/layers/WFSLayer";
import BaseTileLayer from "@arcgis/core/layers/BaseTileLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import urlsMap from "../services/urlsMap";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion";
import Track from "@arcgis/core/widgets/Track";
const basemapUrl = urlsMap.geoserverBasemap
const boundaryUrl = urlsMap.geoserver + "/cite/wms"
const osmUrl = urlsMap.osmLayer
const strategicUrl = urlsMap.strategicLayer
const installationsUrl = urlsMap.installations
const MapContext = createContext(null);

const getContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (type, attrs) {
    return getContext.call(this, type, type === 'webgl2' ? { ...attrs, preserveDrawingBuffer: true } : attrs);
};


let map = null, view = null, containerDiv = null;


export async function MapProvider(mapDiv) {

    /* const mapDiv = useRef(null);
    const[basemap,setBaseMap] = useState(null);
    const[baseview, setBaseview] = useState(null); */

    containerDiv = document.createElement("div");
    containerDiv.id = "mapContainer";
    containerDiv.style.width = "100%";
    containerDiv.style.height = "100%";


    //if(map || view) return;

    /*  const baseMapLayer = new WMSLayer({
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
              }); */

    const custombaselayer = BaseTileLayer.createSubclass({
        properties: {
            urlTemplate: null,
            tileInfo: null
        },
        getTileUrl: function (level, row, col) {
            return this.urlTemplate
                .replace("{z}", level)
                .replace("{x}", col)
                .replace("{y}", row)
        }
    });
    let baseLayer = new custombaselayer({
        urlTemplate: basemapUrl,
        title: "base layer"
    });

    map = new Map({
        layers: [baseLayer],
    });

    const boundary = new WMSLayer(
        {
            url: boundaryUrl,
            title: " Boundarylayer",
            sublayers: [
                {
                    name: "cite:boundary",
                    title: "Boundarylayer",
                    format: "image/png",
                    transparent: true
                }
            ],
        }
    );
    map.add(boundary)



    view = new MapView({
        container: mapDiv,
        map,
        zoom: 2,
        center: [78.19342753563451, 21.591641645634088],
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
    const coordWidget = new CoordinateConversion({
        view: view,
    });
    view.ui.add(coordWidget, "top-right");

    const style = document.createElement("style");
    style.innerHTML = `.esri-coordinate-conversion {padding: 7px 15px 5px;position: unset !important;width: 260px;right: 97px;bottom:10px!important;}`;
    document.head.appendChild(style);

}



export const getMap = () => map;
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
