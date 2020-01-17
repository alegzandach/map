import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { MapService } from './map.service'
import * as mapboxgl from 'mapbox-gl';
//import * as MapboxDraw from '@mapbox/mapbox-gl-draw'
var MapboxDraw = require('@mapbox/mapbox-gl-draw');
var turf = require('@turf/turf');

@Component({
    selector: 'map-component',
    providers: [MapService],
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit{

    constructor(public mapService: MapService) {}

    map;
    draw;
    polyId;
    searchText: '';
    results: {};
    possibleLocs: [];
    style = 'mapbox://styles/mapbox/streets-v11';
    initLat = 42.36;
    initLng = -71.06;
    kwattsPerSqM;

    // create the map and draw objects
    ngOnInit() {
        mapboxgl.accessToken = environment.mapbox.accessToken;
        this.map = new mapboxgl.Map({
            container: 'map',
            style: this.style,
            zoom: 13,
            center: [this.initLng, this.initLat]
        });

        this.draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
            }
        });

        // add the control box that will allow users to draw a polygon,
        // as well as the events that will trigger drawing
        this.map.addControl(this.draw);
        this.map.on('draw.create', this.updateArea);
        this.map.on('draw.delete', this.updateArea);
        this.map.on('draw.update', this.updateArea);
    }

    // gets the text written in the search box and sends a search to the
    // mapbox api. the results are used to populate a table that can be
    // selected from
    public sendSearch = () => {
        const baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
        const encodedLoc = encodeURIComponent(this.searchText);
        const token = '.json?access_token=' + environment.mapbox.accessToken;
        var url = baseUrl + encodedLoc + token;
        if(encodedLoc){
            this.mapService.getCoords(url).subscribe(data => {
                //console.log(data)
                this.results = data;
            });
        }else{
            this.results.features = [];
        }
    }

    // triggered when a location suggestion is clicked, jumps to that location
    public newLoc = (center) => {
        this.map.jumpTo({
            center: center
        });
    }

    // gets all the points drawn on the map and calculates the area of the 
    // resulting polygon
    public updateArea = (e) => {
        var data = this.draw.getAll();
        //var answer = document.getElementById('calculated-area');
        if (data.features.length > 0) {
            var area = turf.area(data);
            //restrict to area to 2 decimal points
            var rounded_area = Math.round(area * 100) / 100;
            // assuming power gen of 1.35 W / m^2
            this.kwattsPerSqM = Math.round((rounded_area * 1.35 / 1000) * 100) / 100

            var el = document.createElement('div');
            el.className = 'marker';
            el.innerHTML = this.kwattsPerSqM + ' kW/m<sup>2</sup>';


            new mapboxgl.Marker(el)
            .setLngLat(data.features[data.features.length - 1].geometry.coordinates[0][0])
            .addTo(this.map);
            this.polyId.push(data.features[data.features.length - 1].id)
        }   
    }
}