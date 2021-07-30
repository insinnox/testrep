import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as L from "leaflet";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "CodeSandbox";
  private heroesUrl =
    "https:// api.openrouteservice.org /v2/directions/driving-car? api_key = 5b3ce3597851110001cf6248aa80c1a52c4d43ca963f06a05166b0a4& start = 8.681495,49.41461& end = 8.687872,49.420318";
  json;
  durationminutes: number;
  durationseconds: number;

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    var mymap = L.map("mapid").setView([49.41461, 8.681495], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(
      mymap
    );

    const headers = {
      Accept:
        "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
      "Content-Type": "application/json",
      Authorization: "5b3ce3597851110001cf6248aa80c1a52c4d43ca963f06a05166b0a4"
    };

    const body = {
      coordinates: [
        [8.681495, 49.41461],
        [8.687872, 49.420318]
      ],
      attributes: ["avgspeed"]
    };

    let marker = L.marker([
      body.coordinates[0][1],
      body.coordinates[0][0]
    ]).addTo(mymap);
    let marker2 = L.marker([
      body.coordinates[1][1],
      body.coordinates[1][0]
    ]).addTo(mymap);

    marker.bindPopup("Start");
    marker2.bindPopup("End");

    this.http
      .post<any>(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        body,
        { headers }
      )
      .subscribe((json: any) => {
        this.json = json;
        this.durationminutes =
          this.json["features"][0]["properties"]["summary"]["duration"] / 60;
        this.durationseconds =
          this.json["features"][0]["properties"]["summary"]["duration"] % 60;
        this.durationminutes = Math.floor(this.durationminutes);
        this.durationseconds = Math.floor(this.durationseconds);

        L.geoJSON(this.json)
          .addTo(mymap)
          .bindPopup(`${this.durationminutes} Min ${this.durationseconds} Sec`);
      });
  }
}
