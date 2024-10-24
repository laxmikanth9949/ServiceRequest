sap.ui.define(["sap/com/servicerequest/servicerequest/controller/BaseController",
	"../../model/formatter",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/core/routing/History",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Input",
	"sap/ui/model/Sorter",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/com/servicerequest/servicerequest/model/models"
], function (BaseController, formatter, MessageBox, Filter, History, Button, Dialog, Text, Input, Sorter, MessageToast,
	JSONModel, models) {
	"use strict";

	return BaseController.extend("sap/com/servicerequest/servicerequest/controller/Detail", {
		formatter: formatter,
		onInit: function () {
			this.aFilters = [-1, -1, -1];
			this.aFilters.splice(0, 1, new Filter("Langu", sap.ui.model.FilterOperator.EQ, "EN"));
		},
		growFire: function (oEvent) {
			models.growFire(oEvent);

		},
		onAfterRendering: function () {
			this.byId("comment-edit").setContent(this.byId("comment-edit").getContent());
		},
		commentsTextChanged: function () {
			this.getModel("buttonControlModel").setProperty("/isCommentsChanged", true);
		},
		onDiscussionUserNameClick: function(oEvent){
			var employeeId = oEvent.getSource().data("createdBy");
			models.getAvatarForAttachmentUser(employeeId,oEvent);
		}
	});
}, true);