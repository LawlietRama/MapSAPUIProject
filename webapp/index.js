sap.ui.define(["sap/ui/core/mvc/XMLView"], function (XMLView) {
  "use strict";

  XMLView.create({
    viewName: "btp.project1.view.App",
  }).then(function (oView) {
    oView.placeAt("content");
  });
});
