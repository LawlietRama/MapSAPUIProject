sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  var map2;
  var marker1, marker2;

  return Controller.extend(
    "sap.ui.demo.walkthrough.controller.CalculationPanel",
    {
      onAfterRendering: function () {
        var input1 = this.byId("from_places").getDomRef("inner");

        var autocomplete1 = new google.maps.places.Autocomplete(input1, {
          fields: ["place_id", "geometry", "formatted_address", "name"],
        });

        var input2 = this.byId("to_places").getDomRef("inner");

        var autocomplete2 = new google.maps.places.Autocomplete(input2, {
          fields: ["place_id", "geometry", "formatted_address", "name"],
        });

        marker1 = new google.maps.Marker({ map: map2 });
        marker1.addListener("click", function () {});

        marker2 = new google.maps.Marker({ map: map2 });
        marker2.addListener("click", function () {});

        autocomplete1.addListener("place_changed", function () {
          var place = autocomplete1.getPlace();
          if (!place.geometry || !place.geometry.location) {
            return;
          }
          if (place.geometry.viewport) {
            map2.fitBounds(place.geometry.viewport);
          } else {
            map2.setCenter(place.geometry.location);
            map2.setZoom(17);
          }
          // Set the position of the marker using the place ID and location.
          // @ts-ignore This should be in @typings/googlemaps.
          marker1.setPlace({
            placeId: place.place_id,
            location: place.geometry.location,
          });
          marker1.setVisible(true);
        });

        autocomplete2.addListener("place_changed", function () {
          var place = autocomplete2.getPlace();
          if (!place.geometry || !place.geometry.location) {
            return;
          }
          if (place.geometry.viewport) {
            map2.fitBounds(place.geometry.viewport);
          } else {
            map2.setCenter(place.geometry.location);
            map2.setZoom(17);
          }
          // Set the position of the marker using the place ID and location.
          // @ts-ignore This should be in @typings/googlemaps.
          marker2.setPlace({
            placeId: place.place_id,
            location: place.geometry.location,
          });
          marker2.setVisible(true);
        });
      },
      onRenderMap: function () {
        function initMap() {
          var mapProp = {
            center: new google.maps.LatLng(-2.508742, 127.12085),
            zoom: 5,
          };
          map2 = new google.maps.Map(document.getElementById("map"), mapProp);

          marker = new google.maps.Marker({ position: mapProp.center });
        }

        initMap();
      },
      onPress: function (oEvent) {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("first");
      },
    }
  );
});
