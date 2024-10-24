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
	"sap/com/servicerequest/servicerequest/model/models",
	"sap/m/upload/Uploader",
	"sap/m/library",
	"sap/m/UploadCollectionParameter"
], function (BaseController, formatter, MessageBox, Filter, History, Button, Dialog, Text, Input, Sorter, MessageToast,
	JSONModel, models, Uploader, MobileLibrary, UploadCollectionParameter) {
	"use strict";

	return BaseController.extend("sap/com/servicerequest/servicerequest/controller/Detail", {
		formatter: formatter,
		onInit: function () {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("DetailAttachment", "DetailAttachmentReadSuccess", this.onReadSuccess, this);
		},
		onExit: function(){
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.unsubscribe("DetailAttachment", "DetailAttachmentReadSuccess", this.onReadSuccess, this);
		},
		onReadSuccess: function(sChannel, sEvent, oData){
			this.getModel("buttonControlModel").setProperty("/showAttachMsgStrip", false);
			this.getModel("buttonControlModel").setProperty("/showAttachUpload", true);
			models.getAttachments(this,oData.ServiceRequestID);
		},
		
		onDownloadSelectedButton: function(){
			models.onDownloadAttachmentsSelectedButton(this,"UploadSetEdit");
		},
		
		deleteAttachmentHandler: function(oEvent){
			this.getModel("busyIndicatorModel").setProperty("/attachmentBusyIndicator", true);
			this.deleteAttachment(oEvent.getParameters()["documentId"]); 
		},
		
		deleteAttachment: function(documentId){
			var docId = documentId.split("|"); 
			var ObjectID = docId[0];
			var FileGuid = docId[1];
			var oModel = this.getModel("SRS_Data");
			var context = this;
			var mParameters = {
				success: function (oData) {
					models.getAttachments(context,ObjectID); 
				},
				error: function (err) {
						models.showErrorMessage(context, err);
				}
			};
			oModel.remove("/AttachmentSet(ObjectID='" + ObjectID + "',FileGuid='"+FileGuid+"')",mParameters);
		},
		
		onDeleteSelectedButton: function(oEvent){
			
			var oUploadCollection = this.byId("UploadSetEdit");
			var aSelectedItems = oUploadCollection.getSelectedItems();
			var context = this;	
			if (aSelectedItems && aSelectedItems.length>0) {
				
				MessageBox.confirm("Are you sure to delete selected Documents?", {
					actions: ["YES", MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.NO,
					onClose: function (sAction) {
						if(sAction==="YES"){
							context.getModel("busyIndicatorModel").setProperty("/attachmentBusyIndicator", true);
							for (var i = 0; i < aSelectedItems.length; i++) {
								var documentId = aSelectedItems[i].getDocumentId();
								context.deleteAttachment(documentId);
							}
						}
					}
				});

			} else {
				var msg = this.getResourceBundle().getText("txtFileDeletionMsg");
				MessageToast.show(msg);
			}
		},
		
		onUploadComplete: function(oEvent) {
			models.uploadOnUploadComplete(oEvent,this);
		},

		onBeforeUploadStarts: function(oEvent) {
			models.uploadOnBeforeUploadStarts(oEvent,this);
		},
		
		onChange: function(oEvent) {
			 models.uploadOnChange(oEvent,this);              
		},
		onFileSizeExceeded: function(oEvent) {
			models.uploadOnFileSizeExceeded(oEvent,this);
		},
		onUploadTerminated: function(oEvent){
			
		},
		attachmentUserOnPress: function(oEvent){
			var employeeID = oEvent.getSource().getText();
			models.getAvatarForAttachmentUser(employeeID,oEvent);
		}
	

	});
}, true);