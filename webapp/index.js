sap.ui.define(["sap/ui/core/ComponentContainer"], function (XMLView) {
  "use strict";

  XMLView.create({
    viewName: "btp.project1.view.App",
  }).then(function (oView) {
    oView.placeAt("content");
  });
});
