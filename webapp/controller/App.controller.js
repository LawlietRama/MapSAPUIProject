sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/resource/ResourceModel",
  ],
  function (BaseController, JSONModel, MessageToast, ResourceModel) {
    "use strict";

    var map;
    var fromAutocomplete, toAutocomplete;
    var fromAddress;
    var toAddress;

    return BaseController.extend("btp.project1.controller.controller.App", {
      onInit: function () {
        var oData = {
          recipient: {
            name: "UI5",
          },
        };
        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel);
        //set i18n model on view
        var i18nModel = new ResourceModel({
          bundleName: "btp.project1.i18n.i18n",
          supportedLocales: [""],
          fallbackLocale: "",
        });

        this.getView().setModel(i18nModel, "i18n");

        var oModelResult = new sap.ui.model.json.JSONModel({
          myText: "Say,Hello to Fragments in SAPUI5",
        });
        sap.ui.getCore().setModel(oModelResult, "myData");
      },

      onAfterRendering: function () {
        //Menghitung jarak antara dua titik
        var inputOrigin = this.byId("input-origin").getDomRef("inner");
        var inputDestination =
          this.byId("input-destination").getDomRef("inner");
        fromAutocomplete = new google.maps.places.Autocomplete(inputOrigin, {
          fields: ["place_id", "geometry", "formatted_address", "name"],
        });
        toAutocomplete = new google.maps.places.Autocomplete(inputDestination, {
          fields: ["place_id", "geometry", "formatted_address", "name"],
        });

        fromAutocomplete.addListener("place_changed", function () {
          var fromPlace = fromAutocomplete.getPlace();
          fromAddress = fromPlace.formatted_address;
          // $("#origin").val(fromAddress);
        });

        toAutocomplete.addListener("place_changed", function () {
          var toPlace = toAutocomplete.getPlace();
          toAddress = toPlace.formatted_address;
          // $("#destination").val(toAddress);
        });

        var input = this.byId("input-location").getDomRef("inner");

        var autocomplete = new google.maps.places.Autocomplete(input, {
          fields: ["place_id", "geometry", "formatted_address", "name"],
        });

        autocomplete.addListener("place_changed", function () {
          var place = autocomplete.getPlace();
          console.log(place);
          if (!place.geometry || !place.geometry.location) {
            return;
          }
          console.log("Detail titik: ");
          console.log("Nama tempat: " + place.name);
          console.log("Id tempat: " + place.place_id);
          console.log("Alamat tempat: " + place.formatted_address);
          console.log("Latitude tempat: " + place.geometry.location.lat());
          console.log("Longitude tempat: " + place.geometry.location.lng());
        });
      },

      onCalculate: function () {
        var service = new google.maps.DistanceMatrixService();
        service
          .getDistanceMatrix({
            origins: [fromAddress],
            destinations: [toAddress],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL, // miles and feet.
            // unitSystem: google.maps.UnitSystem.metric, // kilometers and meters.
            avoidHighways: false,
            avoidTolls: false,
          })
          .then((response) => {
            console.log("Hasil perihitungan jarak antara dua titik:");
            var origin = response.originAddresses[0];
            console.log(origin);
            var destination = response.destinationAddresses[0];
            console.log(destination);
            if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
              console.log(
                "Tidak ada jalan dari " +
                  origin +
                  "menuju " +
                  destination +
                  "melalui darat"
              );
            } else {
              var distance = response.rows[0].elements[0].distance;
              var duration = response.rows[0].elements[0].duration;
              var distance_in_kilo = distance.value / 1000; // the kilom
              var duration_text = duration.text;
              var duration_value = duration.value;
              console.log(
                `Distance in Kilometre: ${distance_in_kilo.toFixed(2)}`
              );
              console.log(`Distance in Text: ${duration_text}`);
              console.log(`Distance in Minutes: ${duration_value}`);
              console.log(`Distance From: ${origin}`);
              console.log(`Distance to: ${destination}`);
            }
          });
      },

      onRenderMap: function () {
        function initMap() {
          var mapProp = {
            center: new google.maps.LatLng(-2.508742, 127.12085),
            zoom: 5,
          };
          map = new google.maps.Map(document.getElementById("map"), mapProp);

          // var marker = new google.maps.Marker({ position: mapProp.center });

          // marker.setMap(map);
        }
        initMap();
      },

      onClick: function () {
        // read msg from i18n model
        var oBundle = this.getView().getModel("i18n").getResourceBundle();
        var sRecipient = this.getView()
          .getModel()
          .getProperty("/recipient/name");
        var sMsg = oBundle.getText("helloText", [sRecipient]);
        //Show Message
        MessageToast.show(sMsg);
      },
    });
  }
);
