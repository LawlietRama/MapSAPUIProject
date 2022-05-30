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
      },

      onClick: function () {
        MessageToast.show("Hello World");
      },
    });
  }
);
