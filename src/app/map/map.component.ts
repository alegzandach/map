import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { MapService } from './map.service'
import * as mapboxgl from 'mapbox-gl';

@Component({
    selector: 'map-component',
    providers: [MapService],
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit{
    map: mapboxgl.Map;
    searchText: ''
    style = 'mapbox://styles/mapbox/streets-v11';
    lat = 42.36;
    lng = -71.06;

    ngOnInit() {
        mapboxgl.accessToken = environment.mapbox.accessToken;
          this.map = new mapboxgl.Map({
            container: 'map',
            style: this.style,
            zoom: 13,
            center: [this.lng, this.lat]
        });
    }

    constructor(public mapService: MapService) {}

    public sendSearch() {
        const baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
        const encodedLoc = encodeURIComponent(this.searchText);
        const token = '.json?access_token=' + environment.mapbox.accessToken;
        var url = baseUrl + encodedLoc + token;
        this.mapService.getCoords(url).subscribe(data => {
            console.log(data);
        });
    }
}