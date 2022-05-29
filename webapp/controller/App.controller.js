sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, MessageToast, JSONModel) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.App", {
      onInit: function () {
        var oData = {
          recipient: {
            name: "UI5",
          },
        };
        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel);
      },
      onShowHello: function () {
        //Show native or vanilla JS alert
        MessageToast.show("Si paling halo");
      },
    });
  }
);