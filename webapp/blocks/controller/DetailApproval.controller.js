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
	"sap/com/servicerequest/servicerequest/model/models"
], function (BaseController, formatter, MessageBox, Filter, History, Button, Dialog, Text, Input, Sorter, MessageToast, models) {
	"use strict";

	return BaseController.extend("sap/com/servicerequest/servicerequest/controller/Detail", {
		formatter: formatter,
		isRuleExecutedInBatch: true,
		isRulesEdited: false,
		is_onReadSuccess_Excecuted: false,
		onInit: function () {
			this.setModel(new sap.ui.model.json.JSONModel(), "servicerequestApprovalModel");
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("DetailApproval", "DetailApprovalReadSuccess", this.onReadSuccess, this);
			oEventBus.subscribe("saveSRRules", "saveSRRulesSuccess", this.saveSRRulesSuccess, this);
			oEventBus.subscribe("setFocusForApprovalRules", "setFocusForApprovalRulesSuccess", this.setFocusForApprovalRules, this);
			
			if(!this.is_onReadSuccess_Excecuted && this.getModel("servicerequestModel") && this.getModel("servicerequestModel").getProperty("/ServiceRequestID")){
				this.onReadSuccess();
			}
			
		},
		setFocusForApprovalRules: function(){
			models.setElementScroll(this,"idRules-edit");
		},
		onExit: function(){
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.unsubscribe("DetailApproval", "DetailApprovalReadSuccess", this.onReadSuccess, this);
			oEventBus.unsubscribe("saveSRRules", "saveSRRulesSuccess", this.saveSRRulesSuccess, this);
			oEventBus.unsubscribe("setFocusForApprovalRules", "setFocusForApprovalRulesSuccess", this.setFocusForApprovalRules, this);
		},
		onReadSuccess: function (channel, event, stepId) {
			this.is_onReadSuccess_Excecuted =  true;
			//console.log("Inside DetailApprovalReadSuccess");
			this.setModel(new sap.ui.model.json.JSONModel(), "servicerequestApprovalModel");
			this.getModel("busyIndicatorModel").setProperty("/approvalRulesTable", true);
			var oApprovalRules = this.getModel("servicerequestModel").getProperty("/toApprovalRules");
			var sApprovalRuleURL = oApprovalRules.__deferred.uri.substring(oApprovalRules.__deferred.uri.indexOf("/ServiceRequestHeaderSet"));
			this.getModel("SRS_Data").read(sApprovalRuleURL, {
				groupId: "ApprovalRules",
				success: function (oData) {
					if (oData && oData.results.length > 0) {
						var results = oData.results;
						this.setModel(new sap.ui.model.json.JSONModel(results), "servicerequestApprovalModel");
						for(var i=0;i<results.length;i++){
							if(results[i].StatusID===models.RULE_VIOLATED){
								this.getModel("buttonControlModel").setProperty("/isAnyRuleViolated",true);
								break;
							}
						}
					}
					this.getModel("busyIndicatorModel").setProperty("/approvalRulesTable", false);
				}.bind(this),
				error: function () {
					this.setModel(new sap.ui.model.json.JSONModel(), "servicerequestApprovalModel");
					this.getModel("busyIndicatorModel").setProperty("/approvalRulesTable", false);
				}.bind(this)
			});
			if(stepId === models.STATUS_INEXCEPTION){
				this.setFocusForApprovalRules();
			}
		},
		saveSRRulesSuccess: function () {
			sap.ui.core.BusyIndicator.show();
			var rules = this.byId("idRules-edit").getItems();
			var context = this;
			var oModel = context.getModel("SRS_Data");
			var aDeferredGroup = oModel.getDeferredGroups();
			aDeferredGroup.push("ruleBatchUpdate");
			oModel.setDeferredGroups(aDeferredGroup);
			context.isRuleExecutedInBatch = true;
			var oEventBus = sap.ui.getCore().getEventBus();
			var ruleCount = 0;
			var errorMsgShownOnce = true;
			var mParameters = {
				groupId: "ruleBatchUpdate",
				success: function (data) {
					ruleCount++;
					if (ruleCount === rules.length) {
						if (context.isRuleExecutedInBatch) {
							context.isRuleExecutedInBatch = false;
							oEventBus.publish("onSaveSR", "onSaveSRSuccess");
						}
					}
				},
				error: function (err) {
					if (errorMsgShownOnce) {
						MessageBox.error(context.getResourceBundle().getText("errorSavingApproval"));
						// models.showErrorMessage(context, err);                  
						errorMsgShownOnce = false;
					}
					if (context.isRuleExecutedInBatch) {
						context.isRuleExecutedInBatch = false;
						//oEventBus.publish("onSaveSR", "onSaveSRSuccess");
					}
				}
			};
			if (context.isRulesEdited) {
				for (var i = 0; i < rules.length; i++) {
					oModel.sDefaultUpdateMethod = "PUT";
					oModel.update("/ApprovalRuleSet('" + rules[i].getCells()[3].data("approvalModel").RuleID + "')", rules[i].getCells()[3].data(
						"approvalModel"), mParameters);
				}
				if (rules.length > 0) {
					//submit changes and refresh the table and display message
					oModel.submitChanges(mParameters);
				}
			} else {
				oEventBus.publish("onSaveSR", "onSaveSRSuccess");
			}
		},
		onApproveRule: function (oEvent) {
			this.isRulesEdited = true;
			if (oEvent.getSource().getPressed()) { // Approve
				oEvent.getSource().getParent().getParent().getCells()[1].setText(models.RULE_EXCEPTION_APPROVED_TEXT); // Set Rule Status to Exception Approved
				oEvent.getSource().getParent().data("approvalModel").StatusID = models.RULE_EXCEPTION_APPROVED;
				oEvent.getSource().getParent().getParent().getCells()[1].setColorScheme(8); // Set color scheme
				oEvent.getSource().getParent().data("approvalModel").UserID = this.getModel("SRS_Data_UserSet").getData().userId;
				oEvent.getSource().getParent().getParent().getCells()[2].setText(this.getModel("SRS_Data_UserSet").getData().userName); // Set Responsible to logon user name
				oEvent.getSource().getParent().data("approvalModel").ActionID = models.RULE_APPROVE;
			} else { // Undo
				oEvent.getSource().getParent().getParent().getCells()[1].setText(models.RULE_VIOLATED_TEXT); // Set Rule Status to Violation
				oEvent.getSource().getParent().data("approvalModel").StatusID = models.RULE_VIOLATED;
				oEvent.getSource().getParent().getParent().getCells()[1].setColorScheme(3); // Set color scheme
				oEvent.getSource().getParent().data("approvalModel").UserID = "";
				oEvent.getSource().getParent().getParent().getCells()[2].setText("");
				oEvent.getSource().getParent().data("approvalModel").ActionID = models.RULE_NO_ACTION;
			}

			for (var i = 0; i < oEvent.getSource().getParent().getItems().length; i++) {
				if (oEvent.getSource().getId() !== oEvent.getSource().getParent().getItems()[i].getId()) {
					if (oEvent.getSource().getParent().getItems()[i].getPressed()) {
						oEvent.getSource().getParent().getItems()[i].setPressed(false);
					}
				}
			}
		},
		onRejectRule: function (oEvent) {
			this.isRulesEdited = true;
			if (oEvent.getSource().getPressed()) { // Reject
				oEvent.getSource().getParent().getParent().getCells()[1].setText(models.RULE_EXCEPTION_REJECTED_TEXT); // Set Rule Status to Exception Rejected
				oEvent.getSource().getParent().data("approvalModel").StatusID = models.RULE_EXCEPTION_REJECTED;
				oEvent.getSource().getParent().getParent().getCells()[1].setColorScheme(3); // Set color scheme
				oEvent.getSource().getParent().data("approvalModel").UserID = this.getModel("SRS_Data_UserSet").getData().userId;
				oEvent.getSource().getParent().getParent().getCells()[2].setText(this.getModel("SRS_Data_UserSet").getData().userName); // Set Responsible to logon user name
				oEvent.getSource().getParent().data("approvalModel").ActionID = models.RULE_REJECT;
			} else { // Undo
				oEvent.getSource().getParent().getParent().getCells()[1].setText(models.RULE_VIOLATED_TEXT); // Set Rule Status to Violation
				oEvent.getSource().getParent().data("approvalModel").StatusID = models.RULE_VIOLATED;
				oEvent.getSource().getParent().getParent().getCells()[1].setColorScheme(3); // Set color scheme
				oEvent.getSource().getParent().data("approvalModel").UserID = "";
				oEvent.getSource().getParent().getParent().getCells()[2].setText("");
				oEvent.getSource().getParent().data("approvalModel").ActionID = models.RULE_NO_ACTION;
			}

			for (var i = 0; i < oEvent.getSource().getParent().getItems().length; i++) {
				if (oEvent.getSource().getId() !== oEvent.getSource().getParent().getItems()[i].getId()) {
					if (oEvent.getSource().getParent().getItems()[i].getPressed()) {
						oEvent.getSource().getParent().getItems()[i].setPressed(false);
					}
				}
			}
		},
		approvalRuleInfoBtnOnPress: function(oEvent){
			models.showApprovalRuleInfoPopover(this,oEvent);
		}
	});
}, true);