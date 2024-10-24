sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/m/SearchField"
], function (Controller, ODataModel, ResourceModel, SearchField) {
	"use strict";

	return Controller.extend("sap/com/servicerequest/servicerequest/controller/App", {

		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});
});