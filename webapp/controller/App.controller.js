sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/resource/ResourceModel",
  ],
  function (BaseController, JSONModel, MessageToast, ResourceModel) {
    "use strict";

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
      },

      onRenderMap: function () {
        var map;
        function initMap() {
          var mapProp = {
            center: new google.maps.LatLng(-2.508742, 127.12085),
            zoom: 5,
          };

          map = new google.maps.Map(document.getElementById("map"), mapProp);
        }
        initMap();
        console.log("Ini dijalani kan?");
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
