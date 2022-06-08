sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    "use strict";

    var map;
    var marker, infowindow;

    return Controller.extend(
      "sap.ui.demo.walkthrough.controller.DetailPointPanel",
      {
        onAfterRendering: function () {
          var input = this.byId("input-location").getDomRef("inner");

          var autocomplete = new google.maps.places.Autocomplete(input, {
            fields: ["place_id", "geometry", "formatted_address", "name"],
          });

          infowindow = new google.maps.InfoWindow();
          var infowindowContent = document.getElementById("infowindow-content");
          infowindow.setContent(infowindowContent);

          var marker = new google.maps.Marker({ map: map });
          marker.addListener("click", function () {
            infowindow.open(map, marker);
          });

          autocomplete.addListener("place_changed", function () {
            var place = autocomplete.getPlace();
            console.log(place);
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
            marker.setPlace({
              placeId: place.place_id,
              location: place.geometry.location,
            });
            marker.setVisible(true);

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
            infowindow.open(map, marker);
            console.log("Detail titik: ");
            console.log("Nama tempat: " + place.name);
            console.log("Id tempat: " + place.place_id);
            console.log("Alamat tempat: " + place.formatted_address);
            console.log("Latitude tempat: " + place.geometry.location.lat());
            console.log("Longitude tempat: " + place.geometry.location.lng());
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

            marker = new google.maps.Marker({ position: mapProp.center });
          }

          initMap();
        },
        onPress: function (oEvent) {
          infowindow.close();
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("second");
        },
      }
    );
  }
);
