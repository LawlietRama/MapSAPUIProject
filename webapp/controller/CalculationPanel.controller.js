sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    "use strict";

    var map, directionsService, directionsRenderer;
    var marker1, marker2, fromAddress, toAddress, infowindow;

    return Controller.extend(
      "sap.ui.demo.walkthrough.controller.CalculationPanel",
      {
        onAfterRendering: function () {
          var input1 = this.byId("input-origin").getDomRef("inner");

          var autocomplete1 = new google.maps.places.Autocomplete(input1, {
            fields: ["place_id", "geometry", "formatted_address", "name"],
          });

          var input2 = this.byId("input-destination").getDomRef("inner");

          var autocomplete2 = new google.maps.places.Autocomplete(input2, {
            fields: ["place_id", "geometry", "formatted_address", "name"],
          });

          // infowindow = new google.maps.InfoWindow();
          // var infowindowContent = document.getElementById("infowindow-content");
          // infowindow.setContent(infowindowContent);

          marker1 = new google.maps.Marker({
            map: map,
            draggable: true,
          });

          marker1.addListener("click", function () {
            // infowindow.open(map, marker1);
            var place = autocomplete1.getPlace();
            MessageToast.show(place.name);
            toggleBounce(marker1);
          });

          marker2 = new google.maps.Marker({
            map: map,
            draggable: true,
          });
          marker2.addListener("click", function () {
            // infowindow.open(map, marker2);
            var place = autocomplete2.getPlace();
            MessageToast.show(place.name);
            toggleBounce(marker2);
          });

          function toggleBounce(marker) {
            if (marker.getAnimation() !== null) {
              marker.setAnimation(null);
            } else {
              marker.setAnimation(google.maps.Animation.BOUNCE);
            }
          }

          map.addListener("click", (mapsMouseEvent) => {
            directionsRenderer.setMap(null);
            marker2.setVisible(false);

            marker2.setPosition(mapsMouseEvent.latLng);
            marker2.setVisible(true);

            toAddress = mapsMouseEvent.latLng;
            input2.value = toAddress;
          });

          google.maps.event.addListener(marker1, "dragend", function (event) {
            directionsRenderer.setMap(null);

            fromAddress = event.latLng;
            input1.value = fromAddress;
          });

          google.maps.event.addListener(marker2, "dragend", function (event) {
            directionsRenderer.setMap(null);

            toAddress = event.latLng;
            input2.value = toAddress;
          });

          autocomplete1.addListener("place_changed", function () {
            directionsRenderer.setMap(null);

            var place = autocomplete1.getPlace();
            fromAddress = place.formatted_address;
            if (!place.geometry || !place.geometry.location) {
              return;
            }
            if (place.geometry.viewport) {
              map.fitBounds(place.geometry.viewport);
            } else {
              map.setCenter(place.geometry.location);
              map.setZoom(17);
            }
            marker1.setPosition(place.geometry.location);
            marker1.setVisible(true);
          });

          autocomplete2.addListener("place_changed", function () {
            directionsRenderer.setMap(null);
            var place = autocomplete2.getPlace();
            toAddress = place.formatted_address;
            if (!place.geometry || !place.geometry.location) {
              return;
            }
            if (place.geometry.viewport) {
              map.fitBounds(place.geometry.viewport);
            } else {
              map.setCenter(place.geometry.location);
              map.setZoom(17);
            }
            marker2.setPosition(place.geometry.location);
            marker2.setVisible(true);
          });
        },

        onDrawRoute: function () {
          directionsRenderer.setMap(map);
          directionsService.route(
            {
              origin: fromAddress,
              destination: toAddress,
              travelMode: "DRIVING",
            },
            function (result, status) {
              if (status == "OK") {
                directionsRenderer.setDirections(result);
              }
            }
          );

          var service = new google.maps.DistanceMatrixService();
          service
            .getDistanceMatrix({
              origins: [fromAddress],
              destinations: [toAddress],
              travelMode: google.maps.TravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.metric,
              // unitSystem: google.maps.UnitSystem.metric, // kilometers and meters.
              avoidHighways: false,
              avoidTolls: false,
            })
            .then((response) => {
              var origin = response.originAddresses[0];
              var destination = response.destinationAddresses[0];
              if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
                directionsRenderer.setMap(null);
                this.getView()
                  .getModel()
                  .setProperty(
                    "/result/errorText",
                    " Tidak ditemukan rute dari " +
                      origin +
                      " menuju " +
                      destination +
                      "."
                  );
                this.getView().getModel().setProperty("/result/distance", "");
                this.getView()
                  .getModel()
                  .setProperty("/result/durationText", "");
                this.getView()
                  .getModel()
                  .setProperty("/result/durationValue", "");
              } else {
                var distance = response.rows[0].elements[0].distance;
                var duration = response.rows[0].elements[0].duration;
                var distance_in_kilo = distance.value / 1000; // the kilom
                var duration_text = duration.text;
                var duration_value = duration.value;
                this.getView()
                  .getModel()
                  .setProperty("/result/distance", distance_in_kilo.toFixed(2));
                this.getView()
                  .getModel()
                  .setProperty("/result/durationText", duration_text);
                this.getView()
                  .getModel()
                  .setProperty("/result/durationValue", duration_value);
                this.getView().getModel().setProperty("/result/errorText", "");
              }
            });
        },

        onRenderMap: function () {
          function initMap() {
            var mapProp = {
              center: new google.maps.LatLng(-2.508742, 127.12085),
              zoom: 5,
            };
            directionsService = new google.maps.DirectionsService();
            directionsRenderer = new google.maps.DirectionsRenderer({
              suppressMarkers: true,
            });
            map = new google.maps.Map(document.getElementById("map2"), mapProp);

            directionsRenderer.setMap(map);
          }

          initMap();
        },
        onPress: function (oEvent) {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("first");
        },
      }
    );
  }
);
