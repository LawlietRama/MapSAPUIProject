sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    "use strict";

    var map;
    var marker1, marker2, fromAddress, toAddress;

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

          var infowindow = new google.maps.InfoWindow();
          var infowindowContent = document.getElementById("infowindow-content");
          infowindow.setContent(infowindowContent);

          marker1 = new google.maps.Marker({ map: map });
          marker1.addListener("click", function () {
            infowindow.open(map, marker1);
          });

          marker2 = new google.maps.Marker({ map: map });
          marker2.addListener("click", function () {
            infowindow.open(map, marker2);
          });

          autocomplete1.addListener("place_changed", function () {
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
            // Set the position of the marker using the place ID and location.
            // @ts-ignore This should be in @typings/googlemaps.
            marker1.setPlace({
              placeId: place.place_id,
              location: place.geometry.location,
            });
            marker1.setVisible(true);

            infowindowContent.children.namedItem("place-name").textContent =
              place.name;
            infowindowContent.children.namedItem("place-id").textContent =
              place.place_id;
            infowindowContent.children.namedItem("place-address").textContent =
              place.formatted_address;
            infowindowContent.children.namedItem("place-lat").textContent =
              place.geometry.location.lat();
            infowindowContent.children.namedItem("place-long").textContent =
              place.geometry.location.lng();
            infowindow.open(map, marker1);
          });
          autocomplete2.addListener("place_changed", function () {
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
            // Set the position of the marker using the place ID and location.
            // @ts-ignore This should be in @typings/googlemaps.
            marker2.setPlace({
              placeId: place.place_id,
              location: place.geometry.location,
            });
            marker2.setVisible(true);

            infowindowContent.children.namedItem("place-name").textContent =
              place.name;
            infowindowContent.children.namedItem("place-id").textContent =
              place.place_id;
            infowindowContent.children.namedItem("place-address").textContent =
              place.formatted_address;
            infowindowContent.children.namedItem("place-lat").textContent =
              place.geometry.location.lat();
            infowindowContent.children.namedItem("place-long").textContent =
              place.geometry.location.lng();
            infowindow.open(map, marker2);
          });
        },

        onCalculate: function () {
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
                this.getView()
                  .getModel()
                  .setProperty(
                    "/result/errorText",
                    " Tidak ada jalan dari " +
                      origin +
                      " menuju " +
                      destination +
                      " melalui darat"
                  );
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
                console.log(duration_value);
                this.getView().getModel().setProperty("/result/errorText", "");
              }
            });
        },

        onShowHello: function () {
          // read msg from i18n model
          var oBundle = this.getView().getModel("i18n").getResourceBundle();
          var sRecipient = this.getView()
            .getModel()
            .getProperty("/recipient/name");
          var sMsg = oBundle.getText("helloMsg", [sRecipient]);
          // show message
          MessageToast.show(sMsg);
        },

        onRenderMap: function () {
          function initMap() {
            var mapProp = {
              center: new google.maps.LatLng(-2.508742, 127.12085),
              zoom: 5,
            };
            map = new google.maps.Map(document.getElementById("map"), mapProp);

            marker1 = new google.maps.Marker({ position: mapProp.center });

            // marker1.setMap(map);
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
