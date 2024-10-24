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
	"sap/com/servicerequest/servicerequest/model/models",
	"sap/ui/model/json/JSONModel",
	'sap/ui/core/HTML',
	"sap/ui/core/Fragment",
	"sap/m/library",
	"sap/base/util/deepClone",
	"sap/m/BusyDialog",
	"sap/ui/core/Element"
], function (BaseController, formatter, MessageBox, Filter, History, Button, Dialog, Text, Input, Sorter, MessageToast, models,
	JSONModel, HTML, Fragment,MobileLibrary, deepClone, BusyDialog,Element) {
	"use strict";

	return BaseController.extend("sap/com/servicerequest/servicerequest/controller/Detail", {
		formatter: formatter,
		existingItem: null,
		isBatchExecuted: true,
		serviceDialog: false,
		reqDelDate: null,
		isItemsEdited: false,
		item_20_dateTime: null,
		shiftkeyPressed: false,
		is_onReadSuccess_Excecuted: false,
		soldToCustomerId: "",
		previousSelectedSession_HasTenantProductTypes:false,
		sessionTemplateAdjusted: false,
		onInit: function () {
			//console.log("Inside DetailScope OnInit()");
			var oEventBus = sap.ui.getCore().getEventBus();
			this.setComboBoxContainsFilterScope();
			oEventBus.subscribe("DetailScope", "DetailScopeReadSuccess", this.onReadSuccess, this);
			oEventBus.subscribe("ScopeReset", "ScopeResetSuccess", this.scopeResetSuccess, this);
			oEventBus.subscribe("ScopeTableReset", "ScopeTableResetSuccess", this.scopeTableResetSuccess, this);
			oEventBus.subscribe("createSRItems", "createSRItemsSuccess", this.createSRItemsSuccess, this);
			oEventBus.subscribe("saveSRItems", "saveSRItemsSuccess", this.saveSRItemsSuccess, this);
			oEventBus.subscribe("contractItemValidation", "contractItemValidationSuccess", this.contractItemValidationSuccess, this);
			oEventBus.subscribe("setAgreedScope", "setAgreedScopeSuccess", this.setAgreedScopeSuccess, this);
			oEventBus.subscribe("loadScopeOnSRCopy", "loadScopeOnSRCopySuccess", this.loadScopeOnSRCopySuccess, this);
			oEventBus.subscribe("validateRDDWhenSaveSR", "validateRDDWhenSaveSRSuccess", this.validateRDDWhenSaveSRSuccess, this);
			oEventBus.subscribe("setDefaultReqDelDate", "setReqDelDateSuccess", this.setReqDelDateSuccess, this);
			oEventBus.subscribe("onCaseReset", "onCaseResetSuccess", this.onCaseResetSuccess, this);
			oEventBus.subscribe("clearDeliveryTeams", "clearDeliveryTeamsSuccess", this.clearDeliveryTeamsSuccess, this);
			oEventBus.subscribe("setItem20_DateTime", "setItem20_DateTimeSuccess", this.setItem20_DateTimeSuccess, this);
			oEventBus.subscribe("setFocusForService", "setFocusForServiceSuccess", this.setFocusForService, this);
			oEventBus.subscribe("setFocusForSession", "setFocusForSessionSuccess", this.setFocusForSession, this);
			oEventBus.subscribe("setFocusForContract", "setFocusForContractSuccess", this.setFocusForContract, this);
			oEventBus.subscribe("setFocusForContractItem", "setFocusForContractItemSuccess", this.setFocusForContractItem, this);
			oEventBus.subscribe("setFocusForRDD", "setFocusForRDDSuccess", this.setFocusForRDD, this);
			oEventBus.subscribe("setFocusForAgreedScope", "setFocusForAgreedScopeSuccess", this.setFocusForAgreedScope, this);
			oEventBus.subscribe("eventSetNewServiceAndSession", "eventSetNewServiceAndSession", this.eventSetNewServiceAndSession, this);
			oEventBus.subscribe("validateSystemDuringCopySR", "validateSystemDuringCopySRSuccess", this.validateSystemDuringCopySRSuccess, this);
			oEventBus.subscribe("setFocusForSystem", "setFocusForSystemSuccess", this.setFocusForSystem, this);
			oEventBus.subscribe("resetSystem", "resetSystemSuccess", this.resetSystem, this);
			oEventBus.subscribe("RequestReset", "RequestResetSuccess", this.reloadSystems, this);
			oEventBus.subscribe("setSystem", "setSystemSuccess", this.setSystemSuccess, this);
			oEventBus.subscribe("setServiceRequestScope", "setServiceRequestScopeSuccess", this.setServiceRequestScopeSuccess, this);
			oEventBus.subscribe("setFocusForCustContact", "setFocusForCustContactSuccess", this.setFocusForCustContact, this);
			oEventBus.subscribe("setFocusForSRInfo", "setFocusForSRInfoSuccess", this.setFocusForSRInfo, this);
			oEventBus.subscribe("setFocusForSurveyRecipient", "setFocusForSurveyRecipientSuccess", this.setFocusForSurveyRecipient, this);
			oEventBus.subscribe("removeCustomerContact", "removeCustomerContactSuccess", this.removeCustomerContact, this);
			oEventBus.subscribe("removeSurevyRecipient", "removeSurevyRecipientSuccess", this.removeSurevyRecipient, this);
			oEventBus.subscribe("onSystemSelected", "onSystemSelectedSuccess", this.onSystemSelected, this);	
			oEventBus.subscribe("expandSRInfoTextarea", "expandSRInfoTextareaSuccess", this.expandSRInfoTextarea, this);
			oEventBus.subscribe("setFocusForSRItems", "setFocusForSRItemsSuccess", this.setFocusForSRItemsSuccess, this);	

			var timeLineControl = new JSONModel({
				count: 0
			});
			this.getView().setModel(timeLineControl, "timeLineControl");
			if (!this.is_onReadSuccess_Excecuted && this.getModel("servicerequestModel") && this.getModel("servicerequestModel").getProperty(
					"/ServiceRequestID")) {
				this.onReadSuccess();
			}
			this._counteditscopeRow = 0;
		},

		setItem20_DateTimeSuccess: function (channel, event, date) {
			this.item_20_dateTime = date;
		},

		validateRDDWhenSaveSRSuccess: function (channel, event, msgArr) {
			var RDD = this.byId("reqdate-edit").getValue();
			var SRModel = this.getModel("servicerequestModel").getData();
			if (!SRModel.ServiceID && RDD) {
				msgArr.push({
					"msg": this.getResourceBundle().getText("warningRDDContactMsg")
				});
			}
		},

		setReqDelDateSuccess: function () {
			var defaultReqDelDate, minDate = new Date();
			defaultReqDelDate = new Date((new Date()).setDate(minDate.getDate() + models.DEFAULT_DAYS_TO_ADD_FOR_RDD));
			if (defaultReqDelDate.getDay() != 1) {
				defaultReqDelDate = new Date(models.findComingMonday(defaultReqDelDate.toString()));
			}
			this.byId("reqdate-edit").setDateValue(defaultReqDelDate);
			this.byId("reqdate-edit").setEnabled(true);
			this.reqDelDate = defaultReqDelDate;
			models.SRItemsStartDateValidationEditMode(this);
			this.getModel("buttonControlModel").setProperty("/showContractValidationMessageStrip", false);
			this.getModel("SRS_Data_UserSet").setProperty("/AvailableCallOffDays", "0");
			this.getModel("servicerequestModel").setProperty("/TotalCallOffDays", "0");
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("showPotentialLeadTime", "showPotentialLeadTimeSuccess", defaultReqDelDate);
			this.resetSRItemDateMinMaxLimit();
			var isPrSServiceSelected = this.getModel("buttonControlModel").getProperty("/IsPreferredSuccessServiceSelected");
			if(isPrSServiceSelected){
				this.byId("reqdate-edit").setMinDate(new Date());
				this.byId("reqdate-edit").setValueState("None");
			}else{
				this.byId("reqdate-edit").setMinDate(null);
			}
		},

		loadScopeOnSRCopySuccess: function () {
			var serviceRequestModel = this.getModel("servicerequestModel").getData();
			models.existingService = serviceRequestModel.ServiceID;
			models.existingSession = serviceRequestModel.SessionID;
			models.existingSessionProductName = serviceRequestModel.SessionName;
			this.reqDelDate = this.byId("reqdate-edit").getDateValue();

			this.getModel("buttonControlModel").setProperty("/itemAddBtn", true);
			var SRitems = this.getModel("servicerequestItemsModel").getData();
			if (SRitems.length > 0) {
				var contractId = SRitems[0].ContractID;
				var contractIdItem = SRitems[0].ContractItemID;

				var contractSetModel = this.getModel("contractSetModel").getData();
				var contractItemModel = this.getModel("contractItemModel").getData();
				var scopeServiceModel = this.getModel("productSetModel").getData();

				var doesContractExist = false;
				var doesContractItemExist = false;
				var doesServiceExist = false;
				var doesSessionExist = false;

				var context = this;

				for (var i = 0; i < contractSetModel.length; i++) {
					if (contractId === contractSetModel[i].ContractID) {
						doesContractExist = true;
						break;
					}
				}

				for (var i = 0; i < contractItemModel.length; i++) {
					if (contractIdItem === contractItemModel[i].ContractItemID) {
						var callOffDays = serviceRequestModel.TotalCallOffDays;
						models.validateContractItemBasedOnCallOffDays(contractItemModel[i], callOffDays, this, "msgStripContractItemValidation");
						doesContractItemExist = true;
						break;
					}
				}
				var isSelectedServicePreferredSuccess = false;
				for (var i = 0; i < scopeServiceModel.length; i++) {
					if (serviceRequestModel.ServiceID === scopeServiceModel[i].ProductID) {
						doesServiceExist = true;
						isSelectedServicePreferredSuccess = scopeServiceModel[i].PreferredSuccess;
						models.wasPreviousServicePreferredSuccess = scopeServiceModel[i].PreferredSuccess;
						break;
					}
				}

				if(serviceRequestModel.ServiceID && isSelectedServicePreferredSuccess){
					this.getModel("buttonControlModel").setProperty("/isScopingTeamFieldVisible",false);
					this.getValueDriversBySessionId(this, serviceRequestModel.SessionID);
				}else{
					this.getModel("buttonControlModel").setProperty("/isScopingTeamFieldVisible",true);
				}

				this.reloadContract(true, contractId, contractIdItem);
				if (!doesServiceExist) {
					this.byId("ServiceName-edit").setSelectedKey("");
					this.byId("SessionName-edit").setSelectedKey("");
					this.byId("SessionName-edit").setEnabled(false);
					this.setModel(new JSONModel(), "servicerequestItemsModel");
					this.setModel(new JSONModel(), "contractSetModel");
					this.setModel(new JSONModel(), "contractItemModel");
					this.setModel(new JSONModel(), "scopeSessionModel");
					this.byId("contractId-edit").setSelectedKey("");
					this.byId("contractId-edit").setEnabled(false);
					this.byId("contractItemId-edit").setSelectedKey("");
					this.byId("contractItemId-edit").setEnabled(false);
				}

				models.SRItemsStartDateValidationEditMode(this);
				var oEventBus = sap.ui.getCore().getEventBus();
				if (doesServiceExist && serviceRequestModel.ServiceID) {
					this.setSession();
					this.showHideServiceResultsField(serviceRequestModel.ServiceID);
				}
				models.overallBtnsAndFieldsValidations(this.getModel("servicerequestModel").getData().StatusCode, this);
				this.contractItemValidationSuccess();

				var items = this.byId("idProductsTable-edit").getItems();
				for (var i = 0; i < items.length; i++) {

					//Upon Copy SR, For all scope items remove Delivery Team value and make Delivery Team field read-only
					items[i].getCells()[7].getItems()[0].setSelectedKey("");
					items[i].getCells()[7].getItems()[0].setEnabled(false);

					var isItemDeleted = items[i].getCells()[0].getItems()[0].data("isDeleted");
					if (isItemDeleted === "false") {
						if (items[i].getCells()[5].getItems()[0].getValueState() === "Error" || items[i].getCells()[6].getItems()[0].getValueState() ===
							"Error") {
							this.byId("contractItemId-edit").setValueState("Error");
						}
					}
				}

				if(serviceRequestModel.SessionID){
					var isSessionHasSignavio =  this.showSignavioInstructionsMsg(serviceRequestModel.SessionID);
					if(isSessionHasSignavio){
						this.addSignavioMemberItemIfNotExist();
					}
				}

			}
		},

		contractItemValidationSuccess: function () {
			models.contractItemsDurationValid = true;
			this.resetSRItemDateMinMaxLimit();
			var items = this.byId("idProductsTable-edit").getItems();
			var contractItem, selectedContractItem;
			selectedContractItem = this.byId("contractItemId-edit").getSelectedItem();
			this.byId("contractItemId-edit").setValueState(null);
			this.byId("contractItemId-edit").setValueStateText("");
			var SRStatus = this.getModel("servicerequestModel").getProperty("/StatusCode");
			if (selectedContractItem) {
				contractItem = selectedContractItem.data().contractItem;
				var contractItemStartDate = contractItem.ContractItemStart;
				contractItemStartDate = new Date(JSON.parse(JSON.stringify(contractItemStartDate)));
				contractItemStartDate.setMinutes(contractItemStartDate.getTimezoneOffset() - contractItemStartDate.getMinutes());
				contractItemStartDate.setHours(0, 0, 0, 0);
				var contractItemEndDate = contractItem.ContractItemEnd;
				contractItemEndDate = new Date(JSON.parse(JSON.stringify(contractItemEndDate)));
				contractItemEndDate.setMinutes(contractItemEndDate.getTimezoneOffset() - contractItemEndDate.getMinutes());
				contractItemEndDate.setHours(0, 0, 0, 0);
				for (var i = 0; i < items.length; i++) {
					var isItemDeleted = items[i].getCells()[0].getItems()[0].data("isDeleted");
					var itemNo = items[i].getCells()[0].data("item").ItemNo;
					if (isItemDeleted === "false" && itemNo != models.SR_ITEM_10) {
						var itemStartDateValue = items[i].getCells()[5].getItems()[0].getDateValue();
						var itemStartDate;
						if (itemStartDateValue) {
							itemStartDate = deepClone(itemStartDateValue);
						}
						if (itemStartDateValue) {
							itemStartDate.setHours(0, 0, 0, 0);
						} else {
							models.contractItemsDurationValid = false;
							if (SRStatus !== models.STATUS_APPROVED) {
								items[i].getCells()[5].getItems()[0].setValueState("Error");
								items[i].getCells()[5].getItems()[0].setValueStateText("");
							}
						}

						var itemEndDateValue = items[i].getCells()[6].getItems()[0].getDateValue();
						var itemEndDate;
						if (itemEndDateValue) {
							itemEndDate = deepClone(itemEndDateValue);
						}
						if (itemEndDateValue) {
							itemEndDate.setHours(0, 0, 0, 0);
						} else {
							models.contractItemsDurationValid = false;
							if (SRStatus !== models.STATUS_APPROVED) {
								items[i].getCells()[6].getItems()[0].setValueState("Error");
								items[i].getCells()[6].getItems()[0].setValueStateText("");
							}
						}

						if (itemStartDate > itemEndDate) {
							models.contractItemsDurationValid = false;
							items[i].getCells()[5].getItems()[0].setValueState("Error");
							items[i].getCells()[5].getItems()[0].setValueStateText(this.getResourceBundle().getText("txtStartDateLater"));
						}

						if (itemStartDate < contractItemStartDate) {
							models.contractItemsDurationValid = false;
							if (SRStatus !== models.STATUS_APPROVED) {
								items[i].getCells()[5].getItems()[0].setValueState("Error");
								items[i].getCells()[5].getItems()[0].setValueStateText(this.getResourceBundle().getText("txtMessageInvalidItemsDuration"));
							}
							this.byId("contractItemId-edit").setValueState("Error");
							this.byId("contractItemId-edit").setValueStateText(this.getResourceBundle().getText("txtMessageInvalidItemsDuration"));
						}

						if (itemStartDate > contractItemEndDate) {
							models.contractItemsDurationValid = false;
							if (SRStatus !== models.STATUS_APPROVED) {
								items[i].getCells()[5].getItems()[0].setValueState("Error");
								items[i].getCells()[5].getItems()[0].setValueStateText(this.getResourceBundle().getText("txtMessageInvalidItemsDuration"));
							}
							this.byId("contractItemId-edit").setValueState("Error");
							this.byId("contractItemId-edit").setValueStateText(this.getResourceBundle().getText("txtMessageInvalidItemsDuration"));
						}

						if (itemEndDate > contractItemEndDate) {
							models.contractItemsDurationValid = false;
							if (SRStatus !== models.STATUS_APPROVED) {
								items[i].getCells()[6].getItems()[0].setValueState("Error");
								items[i].getCells()[6].getItems()[0].setValueStateText(this.getResourceBundle().getText("txtMessageInvalidItemsDuration"));
							}
							this.byId("contractItemId-edit").setValueState("Error");
							this.byId("contractItemId-edit").setValueStateText(this.getResourceBundle().getText("txtMessageInvalidItemsDuration"));
						}

						items[i].getCells()[5].getItems()[0].setMinDate(contractItem.ContractItemStart);
						items[i].getCells()[5].getItems()[0].setMaxDate(contractItem.ContractItemEnd);
						items[i].getCells()[6].getItems()[0].setMinDate(contractItem.ContractItemStart);
						items[i].getCells()[6].getItems()[0].setMaxDate(contractItem.ContractItemEnd);
					}
				}
			}

			if (SRStatus === models.STATUS_APPROVED && !models.contractItemsDurationValid) {
				MessageBox.error("Selected Contract is not valid for given date range.");
				this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
			} else {
				this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", true);
				models.onCreateValidate(this);
			}

		},

		setComboBoxContainsFilterScope: function () {
			this.getView().byId("ServiceName-edit").setFilterFunction(function (searchString, oItem) {
				if (!isNaN(searchString)) {
					searchString = searchString.trim();
				}
				return models.comboBoxContainsFilterFunction(oItem, searchString, true);
			});
			this.getView().byId("SessionName-edit").setFilterFunction(function (searchString, oItem) {
				if (!isNaN(searchString)) {
					searchString = searchString.trim();
				}
				return models.comboBoxContainsFilterFunction(oItem, searchString, true);
			});
			this.getView().byId("contractId-edit").setFilterFunction(function (searchString, oItem) {
				if (!isNaN(searchString)) {
					searchString = searchString.trim();
				}
				return models.comboBoxContainsFilterFunction(oItem, searchString, false);
			});
			this.getView().byId("contractItemId-edit").setFilterFunction(function (searchString, oItem) {
				if (!isNaN(searchString)) {
					searchString = searchString.trim();
				}
				return models.comboBoxContainsFilterFunction(oItem, searchString, false);
			});
		},

		scopeResetSuccess: function (context) {
			models.existingService = "";
			models.existingSession = "";
			models.existingSessionProductName = "";
			this.byId("ServiceName-edit").setSelectedKey("");
			this.byId("SessionName-edit").setSelectedKey("");
			this.byId("contractId-edit").setSelectedKey("");
			this.byId("contractItemId-edit").setSelectedKey("");
			this.byId("contractId-edit").setEnabled(false);
			this.byId("contractItemId-edit").setEnabled(false);
			this.deleteAllItems(null, 0);
			this.setModel(new JSONModel([]), "defaultItemsModel");
			this.setModel(new JSONModel({
				ProductID: null,
				ProductName: null
			}), "scopeSessionModel");
			this.setModel(new JSONModel({
				ProductID: null,
				ProductName: null
			}), "scopeServiceModel");
			this.disableRDD();
			//	this.setReqDelDateSuccess();

		},

		scopeTableResetSuccess: function (context) {
			//Added addition check on control because of console errors - Vivek
			if (this.byId("reqdate-edit")) {
				this.byId("reqdate-edit").setValueState("None");
			}
			/*
			if(this.byId("idInputEODService")){
				this.byId("idInputEODService").setTokens([]);
			}*/

			if (this.byId("contractId-edit")) {
				this.byId("contractId-edit").setSelectedKey("");
			}

			if (this.byId("contractItemId-edit")) {
				this.byId("contractItemId-edit").setSelectedKey("");
			}
			models.intializeCloudRefObjModels(this);

		},

		setAgreedScopeSuccess: function () {
			var text = this.getModel("agreedServiceRequestScopeModel").getData().data[0].Text.trim();
			if (text) {
				this.byId("sr-agreed-scope").setValue(text);
			} else {
				var userProfile = this.getModel("SRS_Data_UserSet").getData();
				var model = this.getModel("agreedServiceRequestScopeModel");
				models.setAgreedScopeTemplate(userProfile, model);
			}

		},
		onAfterRendering: function () {
			this.setModel(new sap.ui.model.json.JSONModel({
				"select": false
			}), "checkModel");

			// Reset Growing property of Text Area Agreed Scope upon Edit
			this.byId("sr-agreed-scope-TextMode-Edit").setText(this.getResourceBundle().getText("showMore"));
			this.byId("sr-agreed-scope-TextMode-Edit").setTooltip(this.getResourceBundle().getText("showMore"));
			this.byId("sr-agreed-scope").setGrowing(false);
			this.byId("sr-agreed-scope").setRows(5);

			var oView = this.getView();
			var dialog = oView.byId("dialogSystem");
			// create value help dialog
			if (!dialog) {
				dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.SystemTableSuggestionDialog", this);
				oView.addDependent(dialog);
			}

			this.byId("sr-req-scope-TextMode-Edit").setText(this.getResourceBundle().getText("showMore"));
			this.byId("sr-req-scope-TextMode-Edit").setTooltip(this.getResourceBundle().getText("showMore"));
			this.byId("sr-req-scope").setGrowing(false);
			this.byId("sr-req-scope").setRows(5);

			var context = this;
			$(document).keydown(function (evt) {
				if (evt.shiftKey) {
					context.shiftkeyPressed = true;
				}
			});

			$(document).keyup(function (evt) {
				context.shiftkeyPressed = false;
			});

			this.showHideContractAndRelatedFieldsBasedOnContractMandatory();
			var servicerequestModel = this.getModel("servicerequestModel").getProperty("/StatusCode");
			if(servicerequestModel === models.STATUS_NEW){
				this.expandSRInfoTextarea();		
			}
		},

		onReadSuccess: function (channel, event, stepId) {
			this.is_onReadSuccess_Excecuted = true;
			if (stepId === "ContactID") {
				this.setFocusForCustContact();
			} else if (stepId === "SRInfo") {
				this.setFocusForSRInfo();
			}
			var servicerequestModel = this.getModel("servicerequestModel").getData();
			//call Reference objects for system
			var selectedSystemId = null;
			var ReferenceSystemID = servicerequestModel.ReferenceSystemID;
			models.existingService = servicerequestModel.ServiceID;
			models.existingSession = servicerequestModel.SessionID;
			models.existingSessionProductName = servicerequestModel.SessionName;
			this.byId("idSystemCombo").setSelectedKey(null);

			if(servicerequestModel.SessionID){
				this.showSignavioInstructionsMsg(servicerequestModel.SessionID);
			}

			if (ReferenceSystemID) {
				this.byId("idSystemCombo").setSelectedKey(ReferenceSystemID);
				models.showHideCloudRefObjSection(servicerequestModel.DeployMod, this);
				selectedSystemId = ReferenceSystemID;
			}
			if(!servicerequestModel.SessionID){
				models.getReferenceObjects(this,servicerequestModel.CaseID,selectedSystemId,"idSystemCombo",false,null);
			}
			this.byId("srs_customerContact-input").setTokens([]);
			this.byId("idSurveyRecipient").setTokens([]);
			if (servicerequestModel.ContactID) {
				this.setTokenForCustomerContact(servicerequestModel.ContactID, servicerequestModel.ContactName);
			}

			if (servicerequestModel.SurveyRecID) {
				this.setTokenForSurveyRecipient(servicerequestModel.SurveyRecID, servicerequestModel.SurveyRecName);
			}
			if (servicerequestModel.ShipToID && (servicerequestModel.CustomerID !== servicerequestModel.ShipToID)) {
				this.soldToCustomerId = servicerequestModel.ShipToID;
			}
			
			this.byId("contractId-edit").setEnabled(false);
			this.byId("contractItemId-edit").setEnabled(false);

			//this.setModel(new JSONModel(), "contractSetModel");
			//this.setModel(new JSONModel(), "contractItemModel");
			this.setModel(new JSONModel(), "rdlModel");
			this.byId("comboRDL").setValueState("None");
			this.loadItems(false, null, null, stepId);

			models.getCloudRefObj(this);

			this.byId("ShowMoreCloudRefObjEdit").setText("Show less");
			models.showHideMaxRowsForCloudRefObjs(this.byId("idTreeTableCloudRefEdit"), this.byId("ShowMoreCloudRefObjEdit"), this);
			if(servicerequestModel === models.STATUS_NEW){
				this.expandSRInfoTextarea();		
			}
		},
		onCaseResetSuccess: function () {
			this.setModel(new JSONModel(), "contractSetModel");
			this.setModel(new JSONModel(), "contractItemModel");

			this.byId("contractId-edit").setSelectedKey("");
			this.byId("contractItemId-edit").setSelectedKey("");
			this.byId("contractItemId-edit").setEnabled(false);

			var serviceRequestModel = this.getModel("servicerequestModel").getData();
			if (serviceRequestModel.CustomerID && serviceRequestModel.ServiceID) {
				models.getContracts(this, "/ContractSet", {
					"CustomerID": serviceRequestModel.CustomerID,
					"ProductID": serviceRequestModel.ServiceID,
					"RecDelDate": serviceRequestModel.RequestedDeliveryDate,
					"ParentCaseID": serviceRequestModel.ParentCaseID
				}, "contractSetModel", "contractId-edit", true, null, null);
			}

			var items = this.byId("idProductsTable-edit").getItems();
			for (var i = 0; i < items.length; i++) {
				items[i].getCells()[7].getItems()[0].setValue("");
				items[i].getCells()[7].getItems()[0].setSelectedKey("");
				this.isItemsEdited = true;
				items[i].getCells()[0].data("item").DeliveryTeamID = "";
				items[i].getCells()[0].data("item").DeliveryTeamName = "";
				items[i].getCells()[0].data("item").DeliveryTeamChanged = true;
			}
		},

		loadItems: function (isDeleteAllTriggered, createdItem, index, stepId) {
			this.getModel("buttonControlModel").setProperty("/showContractValidationMessageStrip", false);
			this.getModel("buttonControlModel").setProperty("/showMsgForDatesValidationAgainstCurrentDate", false);
			this.byId("contractItemId-edit").setValueState(null);
			this.setModel(new JSONModel(), "contractItemsDateModel");
			this.setModel(new sap.ui.model.json.JSONModel([]), "servicerequestItemsModel");
			this.getModel("busyIndicatorModel").setProperty("/itemsTable", true);
			var oItems = this.getModel("servicerequestModel").getProperty("/toItems");
			var servicereqModel = this.getModel("servicerequestModel").getData();
			var sItemsURL = oItems.__deferred.uri.substring(oItems.__deferred.uri.indexOf("/ServiceRequestHeaderSet"));
			this.getModel("SRS_Data").read(sItemsURL, {
				filters: [],
				groupId: "SRItems",
				success: function (oData) {
					var srModel = this.getModel("servicerequestModel").getData();
					if (oData.results.length > 0) {
						var results = oData.results;
						results = results.sort(models.sortByProperty("ItemNo"));
						this.setModel(new sap.ui.model.json.JSONModel(results), "servicerequestItemsModel");
						this.getModel("buttonControlModel").setProperty("/itemAddBtn", true);
						var contractId = results[0].ContractID;
						var contractIdItem = results[0].ContractItemID;
						var productId = results[0].ProductID;
						var requestedDeliveryDate = results[0].RequestedDeliveryDate;
						this.reqDelDate = requestedDeliveryDate;
						if(results[0].BrandVoiceText){
							results[0].ProductName = results[0].BrandVoiceText;
						} else if(!results[0].BrandVoiceText){
							var brandVoiceTxt = models.getOfflineBrandVoiceTxtById(productId,this,"ext_commerce_ServiceModel");
							if(brandVoiceTxt){
								results[0].ProductName = brandVoiceTxt;
							}
						}
						if (results[1]) {
							models.isSessionSelected = true;
							this.item_20_dateTime = results[1].StartDate;
							if (models.doesSessionDescExist(this, results[1].ProductID)) {
								this.byId("SessionName-edit").setValueState(null);
								this.byId("SessionName-edit").setTooltip(this.getResourceBundle().getText("session"));
								this.byId("SessionName-edit").setValueStateText(this.getResourceBundle().getText("noComponentselected"));
							} else {
								this.byId("SessionName-edit").setValueState("Warning");
								this.byId("SessionName-edit").setTooltip(this.getResourceBundle().getText("txtMsgEnterSession"));
								this.byId("SessionName-edit").setValueStateText(this.getResourceBundle().getText("txtMsgEnterSession"));
							}
							models.getRequestedDeliveryLanguage(this,results[1].ProductID);

							if(this.getModel("sessionModel") && this.getModel("sessionModel").getData()){
								var sessionData = this.getModel("sessionModel").getData();
								for(var i=0;i<sessionData.length;i++){
									if(sessionData[i].ProductID===results[1].ProductID){
										this.showHideSystem(sessionData[i].SystemRequired,sessionData[i].PreferredSuccess);
										break;
									}
								}
							}
							if(results[1].BrandVoiceText){
								results[1].ProductName = results[1].BrandVoiceText;
							} else if(!results[1].BrandVoiceText){
								var brandVoiceTxt = models.getOfflineBrandVoiceTxtById(results[1].ProductID,this,"ext_commerce_SessionModel");
								if(brandVoiceTxt){
									results[1].ProductName = brandVoiceTxt;
								}
							}
							this.showSignavioInstructionsMsg(results[1].ProductID);
							this.getSelectedValueDriversForComponent(this,results[1].ItemGUID);
						}
						if (productId) {
							models.isServiceSelected = true;
						}
						var oEventBus = sap.ui.getCore().getEventBus();
						if(!(srModel.StatusCode === models.STATUS_SOCREATED || srModel.StatusCode == models.STATUS_CANCELED)){
							if(this.getModel("contractSetModel") && jQuery.isEmptyObject(this.getModel("contractSetModel").getData())){
								if(contractId && contractIdItem){
									this.reloadContract(true,contractId,contractIdItem);
								}else{
									this.reloadContract(false,null,null);
								}
							}
							this.byId("contractId-edit").setSelectedKey(contractId);
							this.byId("contractItemId-edit").setSelectedKey(contractIdItem);
							models.SRItemsStartDateValidationEditMode(this);
							this.setSession();
						}
						
						this.sessionTemplateAdjusted = true;
					} else {
						this.setModel(new sap.ui.model.json.JSONModel(), "servicerequestItemsModel");
						this.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
					}
					if (!models.hasCreationOrDeletionTriggeredForCRO) {
						this.getModel("buttonControlModel").setProperty("/statusBtnEnabled", true);
					}
					var oEventBus = sap.ui.getCore().getEventBus();
					oEventBus.publish("enableCreateSOBtnInDialog", "enableCreateSOBtnInDialogSuccess");
					this.getModel("busyIndicatorModel").setProperty("/itemsTable", false);
					this.getModel("buttonControlModel").setProperty("/isCopyEnabled", true);
					models.overallBtnsAndFieldsValidations(this.getModel("servicerequestModel").getData().StatusCode, this);

					if (models.OPR_TYPE === "SAVE_OPR") {
						var msgTxt = "<div>Service Request <strong>" + srModel.ServiceRequestID +
							"</strong> Updated Successfully.<br/><br/> <strong>Note:</strong> This is not a Service Order! <br/> <strong>What's Next?</strong> Finalize Service Request and submit it for Scoping.</div>";
						var canBeSendForScoping = true;
						var missingMandFields = this.missinMandatoryFieldsOnSendToScoping();
						if (missingMandFields) {
							msgTxt = "<div>Service Request <strong>" + srModel.ServiceRequestID +
								"</strong> Updated Successfully.<br/><br/> <strong>Note:</strong> This is not a Service Order! <br/> <strong>What's Next?</strong> <ul><li>Finalize your Service Request and <strong><span>" +
								missingMandFields + "</span></strong></li><li>Submit Service Request for Scoping</li></ul></div>";
							canBeSendForScoping = false;
						}
						models.showSRCreationAndUpdateMessageForStatusNew(this, msgTxt, canBeSendForScoping, srModel.ServiceRequestID);
						models.OPR_TYPE = null;
						this.hideBusyDialog();
					}

					var oEventBus = sap.ui.getCore().getEventBus();
					//var paramCreateSO = jQuery.sap.getUriParameters().get("paramCreateSO");
					if (models.extracedParamCreateSO && models.extracedParamCreateSO === "true" && srModel.StatusCode === models.STATUS_APPROVED && models.SO_CREATION_VALIDITY) {
						oEventBus.publish("onCreateSO", "onCreateSOSuccess");
					}
					models.SO_CREATION_VALIDITY = false;
					if(!models.isSRStatusReRead){
						sap.ui.core.BusyIndicator.hide();
					}
					oEventBus.publish("evaluateSRProgress", "evaluateSRProgressSuccess");
					if (stepId === "ServiceID") {
						this.setFocusForService();
					} else if (stepId === "SessionID") {
						this.setFocusForSession();
					} else if (stepId === "ContractID") {
						this.setFocusForContract();
					} else if (stepId === "RequestedDeliveryDate") {
						this.setFocusForContractItem();
					} else if (stepId === "ContractItemID") {
						this.setFocusForRDD();
					} else if (stepId === "AgreedScope") {
						this.setFocusForAgreedScope();
					} else if (stepId === "ReferenceSystemID") {
						this.setFocusForSystem();
					}
					this.validateRDDInServiceRequest(results);
				}.bind(this),
				error: function () {
					this.setModel(new sap.ui.model.json.JSONModel(), "servicerequestItemsModel");
					this.getModel("buttonControlModel").setProperty("/statusBtnEnabled", true);
					this.getModel("busyIndicatorModel").setProperty("/itemsTable", false);
					this.hideBusyDialog();
					sap.ui.core.BusyIndicator.hide();
				}.bind(this)
			});
		},

		validateRDDInServiceRequest: function(items){
			var isPrS = this.getModel("buttonControlModel").getProperty("/IsPreferredSuccessServiceSelected");
			if(this.getModel("buttonControlModel").getProperty("/isEdit") && isPrS){
				var idRDDValid = true;
				for(var i=0;i<items.length;i++){
					if(items[i].ItemNo === models.SR_ITEM_10){
						let rdd = deepClone(items[i].RequestedDeliveryDate);
						rdd.setHours(0,0,0,0);
						let todaysDate = new Date();
						todaysDate.setHours(0,0,0,0);
						if(rdd < todaysDate){
							idRDDValid = false;
							break;
						}
					}
				}
				if(!idRDDValid){
					var oView = this.getView();
					var dialog = oView.byId("dialogValidateRDD");
					if (!dialog) {
						// create dialog via fragment factory
						dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.DialogValidateRDD", this);
						oView.addDependent(dialog);
					}
					dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					dialog.open();
					this.byId("idDatePickerValidateRDDDialog").setDateValue(new Date());
					this.byId("idDatePickerValidateRDDDialog").setMinDate(new Date());
				}
			}
		},

		pressOkInValidateRDDDialog: function(){
			var reqDelDate = this.byId("idDatePickerValidateRDDDialog").getDateValue();
			var servicerequestItemsModel = this.getModel("servicerequestItemsModel").getData();
			var dateShift;
			for (var i = 0; i < servicerequestItemsModel.length; i++) {
				if (servicerequestItemsModel[i].ItemNo === models.SR_ITEM_10) {
					servicerequestItemsModel[i].RequestedDeliveryDate = reqDelDate;
				}
				if (servicerequestItemsModel[i].ItemNo === models.SR_ITEM_20 && servicerequestItemsModel[i].StartDate) {
					dateShift = models.calculateDateShiftTime(servicerequestItemsModel[i].StartDate.toString(), reqDelDate.toString(), true);
				}
			}

			for (var i = 0; i < servicerequestItemsModel.length; i++) {
				servicerequestItemsModel[i].StartDate = models.dateShiftForItems(dateShift, servicerequestItemsModel[i].StartDate);
				servicerequestItemsModel[i].EndDate = models.dateShiftForItems(dateShift, servicerequestItemsModel[i].EndDate);
				if (servicerequestItemsModel[i].ItemNo === models.SR_ITEM_20 && servicerequestItemsModel[i].StartDate) {
					this.setItem20_DateTimeSuccess(null,null,servicerequestItemsModel[i].StartDate); 
				}

				//servicerequestItemsModel[i].ParentGUID = "";
				//servicerequestItemsModel[i].HeaderGUID = "";
				//servicerequestItemsModel[i].ItemGUID = "";
			}
			this.getModel("servicerequestItemsModel").setData(servicerequestItemsModel);
			this.getModel("servicerequestModel").setProperty("/RequestedDeliveryDate", new Date(reqDelDate));
			this.byId("dialogValidateRDD").close();
		},

		onChangeDatePickerValidateRDDDialog: function(oEvent){
			if(!oEvent.getParameters().valid || !oEvent.getSource().getValue()){
				oEvent.getSource().setValueState("Error");
				this.byId("idOkInValidateRDDDialog").setEnabled(false);
			}else{
				oEvent.getSource().setValueState("None");
				this.byId("idOkInValidateRDDDialog").setEnabled(true);
			}
		},
		
		pressCancelInValidateRDDDialog: function(){
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("toggleDisplayAndEdit", "toggleDisplayAndEdit");
			this.byId("dialogValidateRDD").close();
		},

		setDeleteAllButtonEnabled: function () {
			var items = this.byId("idProductsTable-edit").getItems();
			var visibleItems = 0;
			for (var i = 0; i < items.length; i++) {
				if (items[i].getVisible()) {
					visibleItems++;
				}
			}
			if (visibleItems > 2) {
				return true;
			}
			return false;
		},

		missinMandatoryFieldsOnSendToScoping: function () {
			var SRHeaderModel = this.getModel("servicerequestModel");
			var serviceInfoModel = this.getModel("serviceRequestScopeModel");
			var SRItemsModel = this.getModel("servicerequestItemsModel");

			if (SRHeaderModel && SRHeaderModel.getData() && serviceInfoModel && serviceInfoModel.getData()) {
				var SRHeaderModelData = SRHeaderModel.getData();
				var serviceInfoModelData = serviceInfoModel.getData();
				var emptyFieldsArray = [];
				models.serviceRequestMandFieldsValidation(this, SRHeaderModelData, emptyFieldsArray);
				if (serviceInfoModelData && serviceInfoModelData.data.length === 0) {
					emptyFieldsArray.push("Service Request Info");
				}
				if (SRItemsModel && SRItemsModel.getData() && SRItemsModel.getData().length > 0) {
					var SRItemsModelData = SRItemsModel.getData();
					models.serviceRequestItemsMandFieldsValidation(this, SRItemsModelData, emptyFieldsArray);
				}
				return this.checkEmptyFieldsForStatus(emptyFieldsArray, models.STATUS_INSCOPING, "dialogTextSendForScoping");
			} else {
				return null;
			}
		},
		checkEmptyFieldsForStatus: function (emptyFieldsArray, statusCode, txtMessage) {
			var emptyFieldsArrayLength = emptyFieldsArray.length;
			var arrayIndexlength = emptyFieldsArray.length - 1;

			if (emptyFieldsArrayLength === 0) {
				return null;
			} else {
				var txtEmptyFields = "";
				for (var i = 0; i < emptyFieldsArrayLength; i++) {
					if (i === arrayIndexlength) {
						txtEmptyFields += emptyFieldsArray[i];
					} else {
						txtEmptyFields += emptyFieldsArray[i] + ", ";
					}
				}
				return "maintain required fields for Scoping: " + "<span style='color: #ff0000;'>" + txtEmptyFields + "</span>";
			}
		},

		onRDLDropDownOnChange: function(oEvent){
			if(oEvent.getSource().getSelectedItem()){
				oEvent.getSource().setValueState("None");
				//this.getModel("servicerequestModel").setProperty("/RequestedDeliveryLanguage",oEvent.getSource().getSelectedKey());
			}else{
				oEvent.getSource().setValueState("Error");
			}
		},

		setScopeSectionNonEditable: function () {
			var SRModel = this.getModel("servicerequestModel").getData();
			if (SRModel.StatusCode === models.STATUS_INEXCEPTION) {
				this.byId("contractId-edit").setEnabled(false);
				this.byId("contractItemId-edit").setEnabled(false);
				this.byId("reqdate-edit").setEnabled(false);
				var items = this.byId("idProductsTable-edit").getItems();
				for (var i = 0; i < items.length; i++) {
					this.byId("idProductsTable-edit").getItems()[i].getCells()[0].getItems()[0].setVisible(false);
					this.byId("idProductsTable-edit").getItems()[i].getCells()[2].getItems()[1].setEnabled(false);
					this.byId("idProductsTable-edit").getItems()[i].getCells()[3].getItems()[0].setEnabled(false);
					this.byId("idProductsTable-edit").getItems()[i].getCells()[4].getItems()[1].setEnabled(false);
					this.byId("idProductsTable-edit").getItems()[i].getCells()[5].getItems()[0].setEnabled(false);
					this.byId("idProductsTable-edit").getItems()[i].getCells()[6].getItems()[0].setEnabled(false);
					this.byId("idProductsTable-edit").getItems()[i].getCells()[7].getItems()[0].setEnabled(false);
				}
				this.getModel("editableFieldsModel").setProperty("/Service", false);
				this.getModel("editableFieldsModel").setProperty("/Session", false);
				this.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
				models.onCreateValidate(this);
			}
		},

		createSRItemsSuccess: function (channel, event, serviceRequestModel) {
			models.existingService = serviceRequestModel.ServiceID;
			models.existingSession = serviceRequestModel.SessionID;
			models.existingSessionProductName = serviceRequestModel.SessionName;
			var items = this.byId("idProductsTable-edit").getItems();
			var context = this;
			var oModel = context.getModel("SRS_Data");
			var aDeferredGroup = oModel.getDeferredGroups();
			aDeferredGroup.push("batchCreate");
			oModel.setDeferredGroups(aDeferredGroup);
			context.isBatchExecuted = true;
			var isPrS = this.getModel("buttonControlModel").getProperty("/IsPreferredSuccessServiceSelected");
			var mParameters = {
				groupId: "batchCreate",
				success: function (data) {
					if (context.isBatchExecuted && data && data.__batchResponses && data.__batchResponses.length > 0) {
						var response = data.__batchResponses[0].__changeResponses;
						var doesItem20exist = false;
						for(var i=0;i<response.length;i++){
							if(response[i].data.ItemNo === models.SR_ITEM_20){
								doesItem20exist = true;
								context.createValueDriversForSelectedComponent(context,response[i].data.ItemGUID,true,serviceRequestModel,false,false);
								break;
							}
						}
						if(!doesItem20exist){
							context.onCreateItemsSuccess(serviceRequestModel, context, models.STRING_SUCCESS);
						}
					}
				},
				error: function (err) {
					if (context.isBatchExecuted) {
						context.isBatchExecuted = false;
						models.showErrorMessage(context, err);
						context.onCreateItemsSuccess(serviceRequestModel, context, models.STRING_ERROR);
					}
				}
			};

			var contractID = this.byId("contractId-edit").getSelectedKey();
			var contractItemID = this.byId("contractItemId-edit").getSelectedKey();
			for(var i=0;i<items.length;i++){
				if(items[i].getVisible()){
					var SRItem = items[i].getCells()[0].data("item");
					if(SRItem.ItemNo === models.SR_ITEM_20){
						this.reqDelDate = SRItem.StartDate;
					}
				}
			}

			if (items && items.length > 0) {
				for (var i = 0; i < items.length; i++) {
					var SRItem = items[i].getCells()[0].data("item");
					var isItemDeleted = items[i].getCells()[0].getItems()[0].data("isDeleted");
					if (isItemDeleted === "false") {
						delete SRItem["ItemGUID"];
						delete SRItem["ParentGUID"];
						SRItem.HeaderGUID = serviceRequestModel.HeaderGUID;
						if (SRItem.ItemNo === models.SR_ITEM_10) {
							//this.reqDelDate = this.byId("reqdate-edit").getDateValue();
							this.setItemContractAndOtherAttr(SRItem, this.reqDelDate, models.goLiveDate, contractID, contractItemID);
						}
						if (SRItem.ItemNo === models.SR_ITEM_20) {
							SRItem.BrandVoiceText = SRItem.ProductName
						}
						SRItem.ProductName = "";
						oModel.create("/ServiceRequestItemSet", SRItem, mParameters);
					}
				}
				//submit changes and refresh the table and display message
				oModel.submitChanges(mParameters);
			} else {
				context.onCreateItemsSuccess(serviceRequestModel, context, models.STRING_SUCCESS);
			}
		},
		onCreateItemsSuccess: function (serviceRequestModel, context, responseType) {
			//success message 
			if (!models.ERROR_FLAG_NOTESET) {
				if (responseType === models.STRING_SUCCESS) {
					context.getRouter().navTo("DetailView", {
						ServiceRequestID: serviceRequestModel.ServiceRequestID,
						CaseId: serviceRequestModel.CaseID !== "" ? serviceRequestModel.CaseID : "0"
					});
				} else {
					var oEventBus = sap.ui.getCore().getEventBus();
					oEventBus.publish("toggleEditDisplay", "toggleEditDisplaySuccess");
					context.hideBusyDialog();
				}
			}
			models.createTenantsAndModules(this);
		},

		saveSRItemsSuccess: function (channel, event) {

			if (!models.sessionValiation(this)) {

				return;
			}

			this.contractItemValidationSuccess();
			if (!models.contractItemsDurationValid) {
				models.showContractValidationMessage(this);
				return;
			}
			sap.ui.core.BusyIndicator.show(0);
			var serviceRequestModel = this.getModel("servicerequestModel").getData();
			var items = this.byId("idProductsTable-edit").getItems();
			var context = this;
			var oModel = context.getModel("SRS_Data");
			var aDeferredGroup = oModel.getDeferredGroups();
			aDeferredGroup.push("batchUpdate");
			oModel.setDeferredGroups(aDeferredGroup);
			context.isBatchExecuted = true;
			var oEventBus = sap.ui.getCore().getEventBus();
			var item20Guid = null;
			var isPrS = this.getModel("buttonControlModel").getProperty("/IsPreferredSuccessServiceSelected");
			var mParameters = {
				groupId: "batchUpdate",
				success: function (data) {
					if(data && data.ItemNo === models.SR_ITEM_20 && data.ItemGUID ){
						item20Guid = data.ItemGUID;
					}
					if (data && data.__batchResponses && data.__batchResponses.length > 0) {
						models.existingService = serviceRequestModel.ServiceID;
						models.existingSession = serviceRequestModel.SessionID;
						models.existingSessionProductName = serviceRequestModel.SessionName;
						if (context.isBatchExecuted) {
							context.isBatchExecuted = false;
							if(item20Guid){
								context.createValueDriversForSelectedComponent(context,item20Guid,false,serviceRequestModel,false,true);
							}else {
								if (serviceRequestModel.StatusCode !== models.STATUS_NEW) {
									models.getSRHeaderByID(context, serviceRequestModel.ServiceRequestID, oEventBus);
								} else {
									oEventBus.publish("onSaveServiceRequest", "onSaveServiceRequestSuccess");
								}
							}
						}
					}
				},
				error: function (err) {
					if (context.isBatchExecuted) {
						context.isBatchExecuted = false;
						models.showErrorMessage(context, err);
						sap.ui.core.BusyIndicator.hide();
					}
				}
			};
			var doesAnyBatchRequestExist = false;
			var contractID = "",
				contractItemID = "";
			if (this.byId("contractId-edit").getSelectedItem()) {
				contractID = this.byId("contractId-edit").getSelectedKey();
			}
			if (this.byId("contractItemId-edit").getSelectedItem()) {
				contractItemID = this.byId("contractItemId-edit").getSelectedKey();
			}

			for(var i=0;i<items.length;i++){
				if(items[i].getVisible()){
					var SRItem = items[i].getCells()[0].data("item");
					if(SRItem.ItemNo === models.SR_ITEM_20){
						this.reqDelDate = SRItem.StartDate;
					}
				}
			}

			var isParentItemDeleted = false;
			if (items && items.length > 0) {
				for (var i = 0; i < items.length; i++) {
					var SRItem = items[i].getCells()[0].data("item");
					if (SRItem.ItemNo === models.SR_ITEM_20) {
						item20Guid = SRItem.ItemGUID;
					}
					var isItemDeleted = items[i].getCells()[0].getItems()[0].data("isDeleted");
					if (!SRItem.HeaderGUID && isItemDeleted === "false") {
						doesAnyBatchRequestExist = true;
						delete SRItem["ItemGUID"];
						delete SRItem["ParentGUID"];
						SRItem.HeaderGUID = serviceRequestModel.HeaderGUID;
						if (SRItem.ItemNo === models.SR_ITEM_10) {
							//this.reqDelDate = this.byId("reqdate-edit").getDateValue();
							this.setItemContractAndOtherAttr(SRItem, this.reqDelDate, models.goLiveDate, contractID, contractItemID);
						}
						if (SRItem.ItemNo === models.SR_ITEM_20) {
							SRItem.BrandVoiceText = SRItem.ProductName
						}
						SRItem.ProductName = ""
						oModel.create("/ServiceRequestItemSet", SRItem, mParameters);
					} else if (SRItem.ItemGUID && SRItem.HeaderGUID && isItemDeleted === "true" && !isParentItemDeleted) {
						doesAnyBatchRequestExist = true;
						oModel.remove("/ServiceRequestItemSet(guid'" + SRItem.ItemGUID + "')", mParameters);
						if (SRItem.ItemNo === models.SR_ITEM_10 || SRItem.ItemNo === models.SR_ITEM_20) {
							isParentItemDeleted = true;
						}
					} else if (SRItem.ItemGUID && SRItem.HeaderGUID && isItemDeleted === "false" && !isParentItemDeleted) {
						doesAnyBatchRequestExist = true;
						oModel.sDefaultUpdateMethod = "PUT";
						if (SRItem.ItemNo === models.SR_ITEM_10) {
							//this.reqDelDate = this.byId("reqdate-edit").getDateValue();
							this.setItemContractAndOtherAttr(SRItem, this.reqDelDate, models.goLiveDate, contractID, contractItemID);
						}
						if (SRItem.ItemNo === models.SR_ITEM_20) {
							SRItem.BrandVoiceText = SRItem.ProductName
						}
						SRItem.ProductName = ""
						oModel.update("/ServiceRequestItemSet(guid'" + SRItem.ItemGUID + "')", SRItem, mParameters);
					}
				}
				if (doesAnyBatchRequestExist) {
					//submit changes and refresh the table and display message
					this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
					oModel.submitChanges(mParameters);
				} else {
					oEventBus.publish("onSaveServiceRequest", "onSaveServiceRequestSuccess");
				}
			} else {
				oEventBus.publish("onSaveServiceRequest", "onSaveServiceRequestSuccess");
			}

		},
		setItemContractAndOtherAttr: function (SRItem, reqDelDate, goLiveDate, contractID, contractItemID) {
			SRItem.RequestedDeliveryDate = reqDelDate;
			SRItem.GoLiveDate = goLiveDate;
			if((!SRItem.ContractID || SRItem.ContractID == "0000000000") && contractID){
				SRItem.ContractID = contractID;
			}
			if((!SRItem.ContractItemID || SRItem.ContractItemID == "0000000000") && contractItemID){
				SRItem.ContractItemID = contractItemID;
			}
			SRItem.StartDate = reqDelDate;
			SRItem.EndDate = reqDelDate;
		},
		createDefaultItemForSR: function (productId, productName, itemNo) {
			var requestDeliverDate = this.byId("reqdate-edit").getDateValue();
			var startDate, endDate;
			if (this.byId("reqdate-edit").getValue()) {
				startDate = deepClone(requestDeliverDate);
				startDate.setHours(9, 0, 0, 0);
				endDate = deepClone(requestDeliverDate);
				endDate.setHours(17, 0, 0, 0);
			} else {
				startDate = new Date();
				startDate.setHours(9, 0, 0, 0);
				endDate = new Date();
				endDate.setHours(17, 0, 0, 0);
			}

			var newItem = {
				"ServiceRequestID": "",
				"ParentGUID": "",
				"HeaderGUID": "",
				"ItemGUID": "",
				"ItemNo": itemNo,
				"ParentNo": "",
				"QualifiactionID": "",
				"QualificationName": "",
				"CallOffDays": "0",
				"StartDate": startDate,
				"EndDate": endDate,
				"ProductID": productId,
				"ProductName": productName,
				"DeliveryTeamID": "",
				"DeliveryTeamName": "",
				"RequestedDeliveryDate": requestDeliverDate,
				"GoLiveDate": null,
				"ContractID": "",
				"ContractName": "",
				"ContractItemID": "",
				"ContractItemName": "",
				"DeliveryTeamChanged": false,
				"BrandVoiceText":productName
			};

			//Default the Item20 with TQM-Qualification (ROLE: PE TQM)
			if (itemNo === models.SR_ITEM_20) {
				var selectedSession="";
				if(this.byId("SessionName-edit") && this.byId("SessionName-edit").getSelectedItem()){
					selectedSession = this.byId("SessionName-edit").getSelectedItem().data("selectedSessionSet");
				}
				if(models.SESSION_READINESS_CHECK === productId){
					newItem["QualifiactionID"] = models.SESSION_READINESS_CHECK_QUALID;
					newItem["QualificationName"] = "SRV: Readiness Check";
				}else{
					newItem["QualifiactionID"] = selectedSession.QualifId;
				}
				newItem["CallOffDays"] = selectedSession.Quantity;
				this.item_20_dateTime = startDate;
				this.recalculateCallOffDays();
			}

			return newItem;
		},
		
		onServiceIdChange: function (oEvent) {
			var oEventBus = sap.ui.getCore().getEventBus();
			var selectedProduct;
			if (!this.serviceDialog) {
				var context = this;
				var exstValue = context.getModel("servicerequestModel").getProperty("/ServiceID");
				var createdItem;
				var tableItems = context.byId("idProductsTable-edit").getItems();
				var productId, productName;
				if (oEvent.getSource().getSelectedItem()) {
					productId = oEvent.getSource().getSelectedItem().getKey();
					var fieldTxt = oEvent.getSource().getSelectedItem().getText();
					var fieldTxtSplitArr = fieldTxt.split("-");
					if (fieldTxtSplitArr.length > 2) {
						for (var k = 1; k < fieldTxtSplitArr.length; k++) {
							if (productName) {
								productName += "-" + fieldTxtSplitArr[k];
							} else {
								productName = fieldTxtSplitArr[k];
							}
						}
					} else if (fieldTxt) {
						productName = fieldTxtSplitArr[1].trim();
					}

					selectedProduct = oEvent.getSource().getSelectedItem().data("selectedProductSet");
				}

				// var itemIndex = 0;
				var reqDelDate = this.byId("reqdate-edit").getDateValue();
				var dialog = new Dialog({
					title: "Confirm",
					type: "Message",
					state: 'Warning',
					beginButton: new Button({
						text: "Yes",
						press: function () {
							models.existingService = null;
							models.existingSession = null;
							models.isServiceSelected = false;
							models.isSessionSelected = false;
							if (context.getModel("servicerequestModel").getData().ServiceRequestID) {
								context.deleteAllItems(createdItem, 0);
							} else {
								context.setModel(new sap.ui.model.json.JSONModel([]), "servicerequestItemsModel");
								context.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
							}
							context.disableRDD();
							//context.byId("ServiceText-edit").setText("");
							context.byId("SessionName-edit").setSelectedKey("");
							context.getModel("editableFieldsModel").setProperty("/Session", false);
							context.byId("SessionText-edit").setEnabled(false);
							context.setModel(new sap.ui.model.json.JSONModel([]), "contractSetModel");
							context.setModel(new sap.ui.model.json.JSONModel([]), "contractItemModel");
							context.byId("idTextContactType").setText("");
							context.getModel("editableFieldsModel").setProperty("/ContractItem", false);
							context.getModel("editableFieldsModel").setProperty("/Contract", false);
							context.byId("contractId-edit").setSelectedKey("");
							context.byId("contractItemId-edit").setSelectedKey("");
							context.serviceDialog = false;
							context.getModel("SRS_Data_UserSet").setProperty("/AvailableCallOffDays", "0");
							context.getModel("servicerequestModel").setProperty("/TotalCallOffDays", "0");
							context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", context.setDeleteAllButtonEnabled());
							context.getModel("buttonControlModel").setProperty("/showEODServiceControl", false);
							var dialogContentSid = dialog.getContent()[0].sId;
							if (dialogContentSid.includes("html")) {
								models.clearSelectedSystem(context);
								context.byId("idSystemCombo").setSelectedKey(null);
							}
							models.onCreateValidate(context);
							context.byId("SessionName-edit").setRequired(false);
							context.byId("SessionName-edit").setValueState(null);
							context.showHideContractAndRelatedFieldsBasedOnContractMandatory();
							models.setVisibleFeedbackForm(context,null);
							context.setImmediateSO(false);
							dialog.close();
							this.getModel("buttonControlModel").setProperty("/showServiceResultReviewfield",false);	
							models.wasPreviousServicePreferredSuccess = false;
							context.getModel("editableFieldsModel").setProperty("/DRoom",true);
							context.showSignavioInstructionsMsg(null);
							context.hideValueDriveField();
							context.getModel("editableFieldsModel").setProperty("/visibleFeedbackFormCheckboxEditable", true);
						}.bind(this)
					}),
					endButton: new Button({
						text: "No",
						type: "Emphasized",
						press: function () {
							context.byId("ServiceName-edit").setSelectedKey(models.existingService);
							context.byId("SessionName-edit").setEnabled(true);
							dialog.close();
							context.serviceDialog = false;
						}
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});

				if (models.existingService) {
					var selectedKey = oEvent.getSource().getSelectedKey();
					if (selectedKey) {
						var userIsTQM = this.getModel("SRS_Data_UserSet").getProperty("/isTQM");
						var userIsScoper = this.getModel("SRS_Data_UserSet").getProperty("/isApprover");
						var userIsApprover = this.getModel("SRS_Data_UserSet").getProperty("/isScoper");
						if(!(models.wasPreviousServicePreferredSuccess === selectedProduct.PreferredSuccess) && selectedProduct.PreferredSuccess && userIsTQM && !userIsScoper && !userIsApprover){
							var context = this;
							var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
							MessageBox.confirm("Change to Preferred Success service will reset the SR items. Do you want to continue?",{
								styleClass: bCompact ? "sapUiSizeCompact" : "",
								actions: [MessageBox.Action.YES, MessageBox.Action.NO],
								emphasizedAction: MessageBox.Action.NO,
								onClose: function (sAction) {
									if(sAction===MessageBox.Action.YES){
										context.deleteAllItems(null,2);
										context.onExistingServiceChange(selectedProduct, productName, selectedKey, productId);
									}else{
										context.byId("ServiceName-edit").setSelectedKey(models.existingService);
									}
								}
							});
						}else{
							this.onExistingServiceChange(selectedProduct, productName, selectedKey, productId);
						}
						this.setBrandVoiceTextForSRItem(models.SR_ITEM_10,productName);
					} else {
						if (this.getModel("servicerequestModel").getProperty("/ReferenceSystemID") && this.getModel("servicerequestModel").getProperty(
								"/ReferenceSystemID") !== "0") {
							this.validateSelectedSystem(dialog, models.PRODUCT_TYPE_SERVICE);
						} else {
							dialog.addContent(
								new Text({
									text: "Removing the service will remove all Items. Do you still want to continue?"
								})
							);
							dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
							dialog.open();
						}
						this.serviceDialog = true;
					}
					this.isItemsEdited = true;
				} else {
					this.setNewServiceAndSession(productId, createdItem, productName, context, oEvent.getSource().getSelectedItem(), null,false);
					models.onCreateValidate(this);
					this.byId("SessionName-edit").setRequired(true);
					this.byId("SessionName-edit").setValueState(null);
					this.showHideContractAndRelatedFieldsBasedOnContractMandatory();
					this.showHideServiceResultsField(productId);
					if(selectedProduct){
						models.wasPreviousServicePreferredSuccess = selectedProduct.PreferredSuccess;
						models.setScopingTeamVisibility(this, selectedProduct.PreferredSuccess,models.wasPreviousServicePreferredSuccess);
						this.validateSurveyRecipientOnServiceChange(selectedProduct.PreferredSuccess);
						this.enableDisableSRItemsBasedOnServiceSelected(selectedProduct.PreferredSuccess);
					}			
					this.hideValueDriveField();
				}
			}

		},
		hideValueDriveField: function(){
			this.byId("idFormValueDriver").setVisible(false);
			this.byId("idMultiComboValueDriver").setSelectedKeys([]);
			this.setModel(new JSONModel([]),"selectedValueDriverModel");
		},
		onExistingServiceChange: function(selectedProduct, productName, selectedKey, productId){
			this.uponServiceReSelect(productName, selectedKey, productId, models.existingService);
			models.onCreateValidate(this);
			this.byId("SessionName-edit").setRequired(true);
			this.byId("SessionName-edit").setValueState(null);
			this.showHideContractAndRelatedFieldsBasedOnContractMandatory();
			this.setImmediateSO(false);
			this.showHideServiceResultsField(productId);
			if(selectedProduct){
				models.setScopingTeamVisibility(this, selectedProduct.PreferredSuccess,models.wasPreviousServicePreferredSuccess);
				this.validateSurveyRecipientOnServiceChange(selectedProduct.PreferredSuccess);
				models.wasPreviousServicePreferredSuccess = selectedProduct.PreferredSuccess;
				this.enableDisableSRItemsBasedOnServiceSelected(selectedProduct.PreferredSuccess);
      		}
    	},
		setBrandVoiceTextForSRItem: function(itemNo,brandVoiceTxt){
			var srItems = this.byId("idProductsTable-edit").getItems();
			for (var i = 0; i < srItems.length; i++) {
				if ((srItems[i].getVisible() && srItems[i].getCells()[0].data("item").ItemNo === itemNo) ) {
					srItems[i].getCells()[0].data("item").BrandVoiceText = brandVoiceTxt;
					break;
				}
			}
		},
		validateSurveyRecipientOnServiceChange: function(isPreferredSuccess){
			var surveyRecipient = this.getModel("servicerequestModel").getProperty("/SurveyRecID");
			this.getModel("buttonControlModel").setProperty("/IsPreferredSuccessServiceSelected",isPreferredSuccess);
			if(!(models.wasPreviousServicePreferredSuccess === isPreferredSuccess) && surveyRecipient){
				this.validateSurveyRecipient();
			}
		},
		enableDisableSRItemsBasedOnServiceSelected: function(isPreferredSuccess){
			var userIsTQM = this.getModel("SRS_Data_UserSet").getProperty("/isTQM");
			var userIsScoper = this.getModel("SRS_Data_UserSet").getProperty("/isApprover");
			var userIsApprover = this.getModel("SRS_Data_UserSet").getProperty("/isScoper");
			if(userIsTQM && !userIsScoper && !userIsApprover){
				this.getModel("editableFieldsModel").setProperty("/IsPreferredSuccessServiceSelected",isPreferredSuccess);
            }else{
				this.getModel("editableFieldsModel").setProperty("/IsPreferredSuccessServiceSelected",false);
			}
			this.byId("idProductsTable-edit").refreshItems();
			this.getModel("buttonControlModel").setProperty("/IsPreferredSuccessServiceSelected",isPreferredSuccess);
		},
		showHideServiceResultsField: function(productId){
			var productSetModel = this.getModel("productSetModel").getData();
			var showServiceResultReviewfield = false;
			for(var i=0;i<productSetModel.length;i++){
				if(productSetModel[i].ProductID === productId){
					showServiceResultReviewfield = productSetModel[i].ReviewMandatory;
					break;
				}
			}
			this.getModel("buttonControlModel").setProperty("/showServiceResultReviewfield",showServiceResultReviewfield);
			this.getModel("servicerequestModel").setProperty("/ServiceReviewEnabled",false);
			
		},
		uponServiceReSelect: function (productName, selectedKey, productId, previousSelectedService) {
			var oEventBus = sap.ui.getCore().getEventBus();
			//this.byId("ServiceText-edit").setText(productName);
			var srItems = this.byId("idProductsTable-edit").getItems();
			var selectedContract = null;
			var selectedContractItem = null;
			for (var i = 0; i < srItems.length; i++) {
				if (srItems[i].getVisible() && srItems[i].getCells()[0].data("item").ItemNo === models.SR_ITEM_10) {
					srItems[i].getCells()[0].data("item").ProductID = selectedKey;
					srItems[i].getCells()[0].data("item").ProductName = productName;
					srItems[i].getCells()[2].getItems()[0].setText(productName);
					selectedContract = srItems[i].getCells()[0].data("item").ContractID;
					selectedContractItem = srItems[i].getCells()[0].data("item").ContractItemID;
					models.existingService = selectedKey;
					//break;
				} else {
					if (selectedKey === models.SERVICE_ON_CALL_DUTY) {
						var callOffVal = srItems[i].getCells()[0].data("item").CallOffDays;
						var PC = parseFloat(callOffVal) / 1.5;
						if (PC >= 1) {
							PC = (Math.round(PC)).toString();
							srItems[i].getCells()[0].data("item").CallOffDays = PC;
							srItems[i].getCells()[4].getItems()[1].setValue(PC);
						} else if (PC > 0 && PC < 1) {
							srItems[i].getCells()[0].data("item").CallOffDays = "1";
							srItems[i].getCells()[4].getItems()[1].setValue(1);
						} else {
							srItems[i].getCells()[0].data("item").CallOffDays = "0";
							srItems[i].getCells()[4].getItems()[1].setValue(0);
						}
					} else if (previousSelectedService === models.SERVICE_ON_CALL_DUTY && selectedKey !== models.SERVICE_ON_CALL_DUTY) {
						var callOffVal = ((1.5 * parseFloat(srItems[i].getCells()[0].data("item").CallOffDays)).toFixed(1)).toString();
						srItems[i].getCells()[0].data("item").CallOffDays = callOffVal;
						srItems[i].getCells()[4].getItems()[1].setValue(callOffVal);
					}

				}
			}
			if (selectedKey === models.SERVICE_ON_CALL_DUTY) {
				MessageBox.information(this.getResourceBundle().getText("txtOnCallDutyServiceSelection"));
				this.recalculateCallOffDays();
			} else if (previousSelectedService === models.SERVICE_ON_CALL_DUTY && selectedKey !== models.SERVICE_ON_CALL_DUTY) {
				MessageBox.information(this.getResourceBundle().getText("txtSwitchServiceFromOnCallDutyService"));
				this.recalculateCallOffDays();
			}
			this.readSessionWhenServiceIsSwitched(selectedKey);
			
			this.byId("idTextContactType").setText("");
			this.reloadContract(true, selectedContract, selectedContractItem);

		},
		validateSelectedSystem: function (dialog, type) {
			var context = this;
			var IbComponent = this.getModel("servicerequestModel").getProperty("/ReferenceSystemID");
			var SolmanComponent = this.getModel("servicerequestModel").getProperty("/SolmanComponent");
			var InstNo = this.getModel("servicerequestModel").getProperty("/InstNo");
			var Customer = this.getModel("servicerequestModel").getProperty("/CustomerID");
			var sessionID = this.getModel("servicerequestModel").getProperty("/SessionID");
			var responseShowMessageForSystemInfoMsgStripBasedOnSystemAndSolman = this.showMessageForSystemInfoMsgStripBasedOnSystemAndSolman();
			sap.ui.core.BusyIndicator.show(0);
			var arrFilter = [];
			var requestFilter;
			arrFilter.push(models.filterCondition_Equal("Customer", Customer));
			arrFilter.push(models.filterCondition_Equal("InstNo", InstNo));
			arrFilter.push(models.filterCondition_Equal("IbComponent", IbComponent));
			if(sessionID){
				arrFilter.push(models.filterCondition_Equal("SessionProductID",sessionID));
			}
			requestFilter = models.filterComparison_AND(arrFilter);

			this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
			context.getModel("SRS_Data").read("/IBaseComponentSet", {
				filters: [requestFilter],
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					context.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", true);
					var response = oData.results;
					var doesSelectedSystemHasSolman = false;
					var iSCloudSystem = false;
					for (var i = 0; i < response.length; i++) {
						if (response[i].SolmanComponent === SolmanComponent) {
							if (response[i].DeployModT.toUpperCase() === "CLOUD") {
								doesSelectedSystemHasSolman = true;
								iSCloudSystem = true;
								break;
							} else {
								if (response[i].SolmanSid) {
									doesSelectedSystemHasSolman = true;
									break;
								} else {
									doesSelectedSystemHasSolman = false;
									break;
								}
							}
						}
					}

					if (responseShowMessageForSystemInfoMsgStripBasedOnSystemAndSolman.shallAppendSolmanAtBotton !== doesSelectedSystemHasSolman) {
						if (dialog) {
							sap.ui.core.BusyIndicator.hide();
							if (type === models.PRODUCT_TYPE_SERVICE) {
								dialog.addContent(
									new HTML({
										content: "<div><ul><li>Removing the Service will remove all Items.</li><li>The selected System does no longer fulfill the requirement of the selected Service/Component combination and therefore it will be removed.</li></ul><p> Do you still want to comtinue?</p></div>"
									})
								);
							} else if (type === models.PRODUCT_TYPE_SESSION) {
								dialog.addContent(
									new HTML({
										content: "<div><ul><li>Removing the Component will remove all Items 30+.</li><li>The selected System does no longer fulfill the requirement of the selected Service/Component combination and therefore it will be removed.</li></ul><p> Do you still want to comtinue?</p></div>"
									})
								);

							}
							dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
							dialog.open();
						} else {
							var serviceId = this.byId("ServiceName-edit").getSelectedKey();
							var sessionId = this.byId("SessionName-edit").getSelectedKey();
							if (serviceId && sessionId && iSCloudSystem) {
								return;
							}
							var systemSolman = this.getModel("servicerequestModel").getProperty("/SolmanComponent");
							if(!systemSolman){
								systemSolman="0";
							}
							if(!responseShowMessageForSystemInfoMsgStripBasedOnSystemAndSolman.shallAppendSolmanAtBotton){
								return;
							}
							
							if(responseShowMessageForSystemInfoMsgStripBasedOnSystemAndSolman.shallAppendSolmanAtBotton && parseInt(systemSolman)>0){
								return;
							}
							
							models.clearSelectedSystem(this);
							this.byId("idSystemCombo").setSelectedKey(null);
							
							var isSystemEnabled = this.getModel("editableFieldsModel").getProperty("/System");
							if (!isSystemEnabled) {
								this.getModel("editableFieldsModel").setProperty("/System", true);
							}
						}
						return;
					}
					if (dialog) {
						sap.ui.core.BusyIndicator.hide();
						if (type === models.PRODUCT_TYPE_SERVICE) {
							dialog.addContent(
								new Text({
									text: "Removing the Service will remove all Items. Do you still want to continue?"
								})
							);
						} else if (type === models.PRODUCT_TYPE_SESSION) {
							dialog.addContent(
								new Text({
									text: "Removing the Component will remove all Items 30+. Do you still want to continue?"
								})
							);
						}
						dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
						dialog.open();
					}
				}.bind(context),
				error: function (err) {
					context.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", true);
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					sap.ui.core.BusyIndicator.hide();
					models.applyBrowserAutoFillOff();
				}.bind(context)
			});
		},
		eventSetNewServiceAndSession: function (oEvent, channel, productParams) {
			var createdItem, productName;
			var productId = productParams[0];
			var sessionId = productParams[1];
			var showServiceResultReviewfield = false;
			var productSetModel = this.getModel("productSetModel").getData();
			for (var i = 0; i < productSetModel.length; i++) {
				if (productId === productSetModel[i].ProductID) {
					productName = productSetModel[i].ProductText;
					showServiceResultReviewfield = productSetModel[i].ReviewMandatory;
					models.wasPreviousServicePreferredSuccess =  productSetModel[i].PreferredSuccess;
					models.setScopingTeamVisibility(this,productSetModel[i].PreferredSuccess,models.wasPreviousServicePreferredSuccess);
					this.enableDisableSRItemsBasedOnServiceSelected(productSetModel[i].PreferredSuccess);
					break;
				}
			}
			this.byId("ServiceName-edit").setSelectedKey(productId);
			if(!this.getModel("ext_commerce_ServiceModel") && models.wasPreviousServicePreferredSuccess){
				models.getRealTimeBrandVoiceTxtById(this,productId,models.PRODUCT_TYPE_SERVICE);
			}
			this.setNewServiceAndSession(productId, createdItem, productName, this, productId, sessionId,true);
			this.showHideContractAndRelatedFieldsBasedOnContractMandatory();
			this.getModel("buttonControlModel").setProperty("/showServiceResultReviewfield",showServiceResultReviewfield);	
			this.getModel("servicerequestModel").setProperty("/ServiceReviewEnabled",false);
		},
		setNewServiceAndSession: function (productId, createdItem, productName, context, selectedService, sessionId,callViaEvent) {
			var oEventBus = sap.ui.getCore().getEventBus();
			context.byId("idTextContactType").setText("");
			//set Default RDD 
			if (selectedService) {
				context.setReqDelDateSuccess();
			}
			this.isItemsEdited = true;
			models.existingService = productId;
			this.onServiceSelectionAndValidation(productId, createdItem, context, productName, sessionId,callViaEvent);
			context.setModel(new sap.ui.model.json.JSONModel([]), "scopeServiceModel");
			context.getModel("scopeServiceModel").setData([{
				ProductID: productId,
				ProductName: productName
			}]);
			context.setModel(new sap.ui.model.json.JSONModel(), "sessionModel");
		},
		disableRDD: function () {
			this.byId("reqdate-edit").setEnabled(false);
			this.byId("reqdate-edit").setValue("");
			this.byId("reqdate-edit").setDateValue(null);
			this.byId("reqdate-edit").setValueState("None");
			this.reqDelDate = "";
		},
		onServiceSelectionAndValidation: function (productId, createdItem, context, productName, sessionIdParam,callViaEvent) {
			if (productId) {
				models.isServiceSelected = true;

				createdItem = context.createDefaultItemForSR(productId, productName, models.SR_ITEM_10);
				if (jQuery.isEmptyObject(context.getModel("servicerequestItemsModel").getData())) {
					context.setModel(new sap.ui.model.json.JSONModel([createdItem]), "servicerequestItemsModel");
				} else {
					this.onAddNewScopeRowOnServiceChange(createdItem);
				}
				var customerId = this.getModel("servicerequestModel").getProperty("/CustomerID");
				models.SRItemsStartDateValidationEditMode(this);
				//context.byId("SessionName-edit").setBusyIndicatorDelay(0);
				//context.byId("SessionName-edit").setBusy(true);
				var busyDialog = models.createBusyDialog("Loading Components...");
				busyDialog.open();
				var hostURL = context.getModel("SRS_Data").sServiceUrl;
				var sessionODataJSONModel = new JSONModel(hostURL + "/CustomerSet('"+customerId+"')/toProductStructure?$filter=(ParentProductID eq '"+productId+"')");
				sessionODataJSONModel.attachRequestCompleted(function (resp) {
					busyDialog.close();
					if (resp.getParameters("success").success) {
						var results = sessionODataJSONModel.getData().d.results;
						//context.byId("SessionName-edit").setBusy(false);
						if (results.length > 0) {
							results = models.addBrandVoiceTextForSession(context,results);
							context.setModel(new sap.ui.model.json.JSONModel(results), "sessionModel");
							context.byId("SessionName-edit").setValueState("None");
							var caseID = context.getModel("servicerequestModel").getProperty("/CaseID");
							if (results.length === 1) {
								var sessionID = results[0].ProductID;
								var sessionName = results[0].ProductText;
								context.selectDefaultSessionandCreateItem(sessionID, sessionName);
								context.callReferenceObjects(results[0].ProductID);
								context.showHideSystem(results[0].SystemRequired,results[0].PreferredSuccess);
								context.setImmediateSO(results[0].PreferredSuccess);
								models.getReferenceObjects(context,caseID,null,null,null,sessionID);
								context.byId("SessionText-edit").setEnabled(true);
								models.getRequestedDeliveryLanguage(context,sessionID);
								context.setMemberItemsTemplate(sessionID,callViaEvent);
								if(!context.getModel("ext_commerce_SessionModel") && results[0].PreferredSuccess){
									models.getRealTimeBrandVoiceTxtById(context,sessionID,models.PRODUCT_TYPE_SESSION);
								}
								context.getValueDriversBySessionId(context,sessionID,true,false);
							} else {
								if (sessionIdParam) {
									var sessionName;
									var hasTenantProductTypes=false;
									var psSuccessSession = false;
									var isSystemRequired = "X";
									for (var i = 0; i < results.length; i++) {
										if (sessionIdParam === results[i].ProductID) {
											sessionName = results[i].ProductText;
											hasTenantProductTypes = results[i].HasTenantProductTypes;
											psSuccessSession = results[i].PreferredSuccess;
											isSystemRequired = results[i].SystemRequired;
										}
									}
									context.selectDefaultSessionandCreateItem(sessionIdParam, sessionName);
									models.getReferenceObjects(context,caseID,null,null,null,sessionIdParam);
									context.setImmediateSO(psSuccessSession);
									models.getRequestedDeliveryLanguage(context,sessionIdParam);
									context.showHideSystem(isSystemRequired,psSuccessSession);
									context.setMemberItemsTemplate(sessionIdParam,callViaEvent);
									context.getValueDriversBySessionId(context,sessionIdParam,true,false);
								} else {
									models.isSessionSelected = false;
									context.byId("SessionName-edit").setValue();
									context.byId("SessionText-edit").setEnabled(false);
									
									models.setVisibleFeedbackForm(context,null);
								}
							}
						} else {
							models.isSessionSelected = false;
							context.byId("SessionText-edit").setEnabled(false);
							
							models.setVisibleFeedbackForm(context,null);
						}
						if (context.getModel("servicerequestModel").getProperty("/ReferenceSystemID") && context.getModel("servicerequestModel").getProperty(
								"/ReferenceSystemID") !== "0") {
							context.validateSelectedSystem(null, models.PRODUCT_TYPE_SESSION);
						}
						
						models.onCreateValidate(context);
						//context.byId("SessionName-edit").setBusy(false);
						context.reloadContract(true, null, null);
					} else {
						models.isSessionSelected = false;
						context.setModel(new sap.ui.model.json.JSONModel(), "sessionModel");
						context.byId("SessionName-edit").setValueState("Error");
						context.byId("SessionName-edit").setValue();
						context.byId("SessionText-edit").setEnabled(false);
						//context.byId("SessionName-edit").setBusy(false);
						sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
						models.showErrorMessage(context, resp.getParameters().errorobject);
					}

				});
				this.getModel("editableFieldsModel").setProperty("/Session", true);
				this.getModel("editableFieldsModel").setProperty("/ReqDelDate", true);
			} else {
				models.isServiceSelected = false;
				context.setModel(new JSONModel(), "contractSetModel");
				context.setModel(new JSONModel(), "contractItemModel");
				context.byId("contractId-edit").setEnabled(false);
				context.byId("contractItemId-edit").setEnabled(false);
				this.getModel("editableFieldsModel").setProperty("/Session", false);
				this.getModel("editableFieldsModel").setProperty("/ReqDelDate", false);
			}
			//context.byId("reqdate-edit").setValue("");
			context.setModel(new sap.ui.model.json.JSONModel([]), "scopeServiceModel");
			context.getModel("scopeServiceModel").setData([{
				ProductID: productId,
				ProductName: productName
			}]);

			context.setModel(new sap.ui.model.json.JSONModel(), "sessionModel");

			context.getModel("buttonControlModel").setProperty("/itemAddBtn", false);

			return createdItem;
		},
		selectDefaultSessionandCreateItem: function (sessionID, sessionName) {
			this.getModel("scopeSessionModel").setData([{
				ProductID: sessionID,
				ProductName: sessionName
			}]);
			this.getModel("servicerequestModel").setProperty("/SessionID", sessionID);
			models.isSessionSelected = true;
			this.getModel("buttonControlModel").setProperty("/itemAddBtn", true);
			var createdItemSession = this.createDefaultItemForSR(sessionID, sessionName, models.SR_ITEM_20);
			this.onAddNewScopeRowOnServiceChange(createdItemSession);
			models.existingSession = sessionID;
			models.existingSessionProductName = sessionName;
			this.isItemsEdited = true;
			if(sessionID){
				models.setVisibleFeedbackForm(this,sessionID);
			}
		},
		callReferenceObjects: function(sessionID){
			var caseId = this.getModel("servicerequestModel").getProperty("/CaseID");
			var referenceSystemID = this.getModel("servicerequestModel").getProperty("/ReferenceSystemID");
			if(referenceSystemID && referenceSystemID!=="0"){
				models.getReferenceObjects(this,caseId,referenceSystemID,"idSystemCombo",true,sessionID);
			}else{
				models.getReferenceObjects(this,caseId,null,"idSystemCombo",false,sessionID);
			}	
		},
		
		selectSingleSession: function (srItems, results, context) {
			var sessionID = results[0].ProductID;
			var sessionName = results[0].ProductText;
			context.getModel("scopeSessionModel").setData([{
				ProductID: sessionID,
				ProductName: sessionName
			}]);
			context.getModel("servicerequestModel").setProperty("/SessionID", sessionID);
			models.isSessionSelected = true;
			context.getModel("buttonControlModel").setProperty("/itemAddBtn", true);
			models.existingSession = sessionID;
			models.existingSessionProductName = sessionName;
			this.isItemsEdited = true;

			var doesItem20Exist = false;

			for (var i = 0; i < srItems.length; i++) {
				if (srItems[i].getVisible() && srItems[i].getCells()[0].data("item").ItemNo === models.SR_ITEM_20) {
					srItems[i].getCells()[0].data("item").ProductID = sessionID;
					srItems[i].getCells()[0].data("item").ProductName = sessionName;
					srItems[i].getCells()[0].data("item").BrandVoiceText = sessionName;
					srItems[i].getCells()[2].getItems()[0].setText(sessionName);
					doesItem20Exist = true;
					break;
				}
			}
			if (!doesItem20Exist) {
				var createdItemSession = context.createDefaultItemForSR(sessionID, sessionName, models.SR_ITEM_20);
				context.onAddNewScopeRowOnServiceChange(createdItemSession);
			}
			if(sessionID){
				models.setVisibleFeedbackForm(this,sessionID);
			}

		},
		readSessionWhenServiceIsSwitched: function (productId) {
			var context = this;
			//context.byId("SessionName-edit").setBusyIndicatorDelay(0);
			//context.byId("SessionName-edit").setBusy(true);
			this.setModel(new JSONModel([]), "sessionModel");
			context.byId("SessionName-edit").setSelectedKey("");
			models.isSessionSelected = false;
			models.onCreateValidate(this);
			var customerId = this.getModel("servicerequestModel").getProperty("/CustomerID");
			var busyDialog = models.createBusyDialog("Loading Components...");
			busyDialog.open();
			this.byId("idMultiComboValueDriver").setBusy(true);
			this.getModel("SRS_Data").read("/CustomerSet('"+customerId+"')/toProductStructure", {
				groupId: "SessionGroup",
				filters: [models.filterCondition_Equal("ParentProductID", productId)],
				success: function (oData) {
					var srItems = this.byId("idProductsTable-edit").getItems();
					if (oData.results.length > 0) {
						//var results = models.filterSessionBasedOnSelectedService(productId,oData.results);
						var results = oData.results;
						results = models.addBrandVoiceTextForSession(context,results);
						context.setModel(new sap.ui.model.json.JSONModel(results), "sessionModel");
						context.byId("SessionName-edit").setValueState("None");
						if (results.length === 1) {
							this.selectSingleSession(srItems, results, context);
							this.callReferenceObjects(results[0].ProductID);
							this.setImmediateSO(results[0].PreferredSuccess);
							this.byId("SessionText-edit").setEnabled(true);
							models.getRequestedDeliveryLanguage(this,results[0].ProductID);
							this.showHideSystem(results[0].SystemRequired,results[0].PreferredSuccess);
							this.setMemberItemsTemplate(results[0].ProductID,false);
							this.getValueDriversBySessionId(this,results[0].ProductID,true,true);
						} else {
							models.isSessionSelected = false;
							context.getModel("scopeSessionModel").setData([{
								ProductID: null,
								ProductName: null
							}]);
							context.byId("SessionName-edit").setSelectedKey("");
							for (var i = 0; i < srItems.length; i++) {
								if (srItems[i].getVisible() && srItems[i].getCells()[0].data("item").ItemNo === models.SR_ITEM_20) {
									srItems[i].getCells()[0].data("item").ProductID = "";
									srItems[i].getCells()[0].data("item").ProductName = "";
									srItems[i].getCells()[2].getItems()[0].setText("");
									break;
								}
							}
							models.setVisibleFeedbackForm(context,null);
						}
					} else {
						models.isSessionSelected = false;
						context.getModel("scopeSessionModel").setData([{
							ProductID: null,
							ProductName: null
						}]);
						context.byId("SessionName-edit").setSelectedKey("");
						for (var i = 0; i < srItems.length; i++) {
							if (srItems[i].getVisible() && srItems[i].getCells()[0].data("item").ItemNo === models.SR_ITEM_20) {
								srItems[i].getCells()[0].data("item").ProductID = "";
								srItems[i].getCells()[0].data("item").ProductName = "";
								srItems[i].getCells()[2].getItems()[0].setText("");
								break;
							}
						}
						models.setVisibleFeedbackForm(context,null);
						this.byId("SessionText-edit").setEnabled(false);
					}
					if (this.getModel("servicerequestModel").getProperty("/ReferenceSystemID") && this.getModel("servicerequestModel").getProperty(
							"/ReferenceSystemID") !== "0") {
						this.validateSelectedSystem(null, models.PRODUCT_TYPE_SESSION);
					}
					
					this.recalculateCallOffDays();
					//context.byId("SessionName-edit").setBusy(false);
					models.onCreateValidate(this);
					busyDialog.close();

				}.bind(context),
				error: function () {
					busyDialog.close();
					models.isSessionSelected = false;
					context.setModel(new sap.ui.model.json.JSONModel(), "sessionModel");
					context.byId("SessionName-edit").setValueState("Error");
					context.byId("SessionName-edit").setValue();
					//context.byId("SessionName-edit").setBusy(false);
					this.recalculateCallOffDays();
				}.bind(context)
			});

		},
		setImmediateSO: function(PrSuccessSession){
			if(PrSuccessSession){
				this.getModel("servicerequestModel").setProperty("/ImmediateSoCreationEnabled",true);
				this.getModel("editableFieldsModel").setProperty("/ImmediateSO",false);
			}else{
				this.getModel("editableFieldsModel").setProperty("/ImmediateSO",true);
			}
		},
		showHideSystem: function(isSystemRequired,isPreferredSuccess){
			if(isPreferredSuccess && !isSystemRequired){
				this.getModel("buttonControlModel").setProperty("/isSystemVisible",false);
				models.clearSelectedSystem(this);
			}else{
				this.getModel("buttonControlModel").setProperty("/isSystemVisible",true);
			}
		},
		onSessionIdChange: function (oEvent) {
			var productId, productName;
			var createdItem;
			var context = this;
			var selectedSessionSet;
			var selectedKey = oEvent.getSource().getSelectedKey();
			var srItems = this.byId("idProductsTable-edit").getItems();
			if (oEvent.getSource().getSelectedItem()) {
				productId = oEvent.getSource().getSelectedItem().getKey();
				var fieldTxt = oEvent.getSource().getSelectedItem().getText();
				var fieldTxtSplitArr = fieldTxt.split("-");
				if (fieldTxtSplitArr.length > 2) {
					for (var k = 1; k < fieldTxtSplitArr.length; k++) {
						if (productName) {
							productName += "-" + fieldTxtSplitArr[k];
						} else {
							productName = fieldTxtSplitArr[k];
						}
					}
				} else if (fieldTxt) {
					productName = fieldTxtSplitArr[1].trim();
				}
				createdItem = this.createDefaultItemForSR(productId, productName, models.SR_ITEM_20);
				if (productId && productName) {
					this.byId("SessionName-edit").setValueState(null);
					this.byId("SessionName-edit").setTooltip(this.getResourceBundle().getText("session"));
					this.byId("SessionName-edit").setValueStateText(this.getResourceBundle().getText("noComponentselected"));
				} else {
					this.byId("SessionName-edit").setValueState("Warning");
					this.byId("SessionName-edit").setTooltip(this.getResourceBundle().getText("txtMsgEnterSession"));
					this.byId("SessionName-edit").setValueStateText(this.getResourceBundle().getText("txtMsgEnterSession"));
				}
				selectedSessionSet = this.byId("SessionName-edit").getSelectedItem().data("selectedSessionSet");
				var visibleItemCount = 0;
				for (var i = 0; i < srItems.length; i++) {
					if (srItems[i].getVisible()) {
						visibleItemCount++;
					}
				}
				if (selectedKey === models.SESSION_READINESS_CHECK && visibleItemCount > 2) {
					var sessionModel = this.getModel("sessionModel").getData();
					var doesSessionExist = false;
					for(var j=0;j<sessionModel.length;j++){
						if(sessionModel[j].ProductID===models.existingSession){
							doesSessionExist = true;
							break;
						}
					}
					if(doesSessionExist){
						context.byId("SessionName-edit").setSelectedKey(models.existingSession);
					}else{
						context.byId("SessionName-edit").setSelectedKey("");
						context.byId("SessionName-edit").setValue("");
						models.isSessionSelected = false;
					}
					//context.byId("SessionName-edit").setSelectedKey(models.existingSession);
					//context.byId("SessionName-edit").focus()
					MessageBox.information("Please remove item 30+ to select Readiness Check Session",{
						onClose: function (oAction){
							context.byId("SessionName-edit").setSelectedKey("");
							context.byId("SessionName-edit").setValue("");
							models.isSessionSelected = false;
							models.onCreateValidate(context);
						}
					});
					models.onCreateValidate(context);
					return;
				}

			}else{
				context.byId("SessionName-edit").setSelectedKey("");
				context.byId("SessionName-edit").setValue("");
				models.isSessionSelected = false;
				models.onCreateValidate(context);
				return;
			}

			var dialog = new Dialog({
				title: "Confirm",
				type: "Message",
				state: 'Warning',
				beginButton: new Button({
					text: "Yes",
					press: function () {
						models.existingSession = null;
						models.existingSessionProductName = null;
						context.deleteAllItems(createdItem, 1);
						models.isSessionSelected = false;
						context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", context.setDeleteAllButtonEnabled());
						var dialogContentSid = dialog.getContent()[0].sId;
						if (dialogContentSid.includes("html")) {
							models.clearSelectedSystem(context);
							this.byId("idSystemCombo").setSelectedKey(null);
						}
						
						models.onCreateValidate(context);
						context.byId("SessionName-edit").setValueState("Error");
						context.byId("SessionText-edit").setEnabled(false);
						models.setVisibleFeedbackForm(context,null);
						context.setImmediateSO(false);
						context.showSignavioInstructionsMsg("");
						dialog.close();
					}.bind(this)
				}),
				endButton: new Button({
					text: "No",
					type: "Emphasized",
					press: function () {
						context.byId("SessionName-edit").setSelectedKey(models.existingSession);
						context.byId("SessionText-edit").setEnabled(true);
						if(models.existingSession){
							models.isSessionSelected = true;
						}
						models.onCreateValidate(context);
						models.setVisibleFeedbackForm(context,models.existingSession);
						dialog.close();
						//context.previousSelectedSession_HasTenantProductTypes = false;
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});

			if (productId) {
				models.isSessionSelected = true;
				this.getModel("buttonControlModel").setProperty("/itemAddBtn", true);
			} else {
				models.isSessionSelected = false;
				//context.previousSelectedSession_HasTenantProductTypes = false;
			}

			if (!models.existingSession) {
				if (productId) {
					this.onAddNewScopeRowOnServiceChange(createdItem);
					this.setMemberItemsTemplate(productId,false);
					models.existingSession = productId;
					models.existingSessionProductName = productName;
					this.isItemsEdited = true;
					models.getRequestedDeliveryLanguage(this,productId);
				}
				if (this.getModel("servicerequestModel").getProperty("/ReferenceSystemID") && this.getModel("servicerequestModel").getProperty(
						"/ReferenceSystemID") !== "0") {
					this.validateSelectedSystem(null, models.PRODUCT_TYPE_SESSION);
				}
				
				models.onCreateValidate(this);
				context.byId("SessionName-edit").setValueState(null);
				models.setVisibleFeedbackForm(this,productId);
				this.callReferenceObjects(selectedSessionSet.ProductID);
				this.setImmediateSO(selectedSessionSet.PreferredSuccess);
				this.showHideSystem(selectedSessionSet.SystemRequired,selectedSessionSet.PreferredSuccess);
				this.getValueDriversBySessionId(this,productId,true,false);
			} else {
				if (selectedKey) {
					srItems = this.byId("idProductsTable-edit").getItems();
					for (var i = 0; i < srItems.length; i++) {
						if ((srItems[i].getVisible() && srItems[i].getCells()[0].data("item").ItemNo === models.SR_ITEM_20)) {
							srItems[i].getCells()[1].getItems()[0].setText(formatter.removePrecedingZerosInItemNo(models.SR_ITEM_20));
							if (productId === models.SESSION_READINESS_CHECK) {
								srItems[i].getCells()[0].data("item").QualifiactionID = models.SESSION_READINESS_CHECK_QUALID;
								srItems[i].getCells()[3].getItems()[0].setSelectedKey(models.SESSION_READINESS_CHECK_QUALID);
								this.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
							} else {
								this.getModel("buttonControlModel").setProperty("/itemAddBtn", true);
							}
							srItems[i].getCells()[0].data("item").ProductID = productId;
							srItems[i].getCells()[0].data("item").ProductName = productName;
							srItems[i].getCells()[2].getItems()[0].setText(productName);

							
							break;
						}
					}
					
					models.isSessionSelected = true;
					this.isItemsEdited = true;
					models.existingSession = productId;
					models.existingSessionProductName = productName;
					if (this.getModel("servicerequestModel").getProperty("/ReferenceSystemID") && this.getModel("servicerequestModel").getProperty(
							"/ReferenceSystemID") !== "0") {
						this.validateSelectedSystem(null, models.PRODUCT_TYPE_SESSION);
					}
					
					models.onCreateValidate(this);
					context.byId("SessionName-edit").setValueState(null);
					this.setMemberItemsTemplate(productId,false);
					models.setVisibleFeedbackForm(this,productId);
					this.callReferenceObjects(selectedSessionSet.ProductID);
					this.setImmediateSO(selectedSessionSet.PreferredSuccess);
					models.getRequestedDeliveryLanguage(this,productId);
					this.showHideSystem(selectedSessionSet.SystemRequired,selectedSessionSet.PreferredSuccess);
					this.setBrandVoiceTextForSRItem(models.SR_ITEM_20,productName);
					this.getValueDriversBySessionId(this,productId,true,true);
				} else {
					if (this.getModel("servicerequestModel").getProperty("/ReferenceSystemID") && this.getModel("servicerequestModel").getProperty(
							"/ReferenceSystemID") !== "0") {
						this.validateSelectedSystem(dialog, models.PRODUCT_TYPE_SESSION);
						models.onCreateValidate(this);
						context.byId("SessionName-edit").setValueState(null);
						context.showSignavioInstructionsMsg(null);
					} else {
						dialog.addContent(
							new Text({
								text: "Removing the Component will remove all Items 30+.  Do you still want to continue?"
							})
						);
						dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
						dialog.open();
					}
					this.isItemsEdited = true;
					this.clearRDLModel();
					this.getValueDriversBySessionId(this,null,false,true);
				}
			}

			if (!this.getModel("scopeSessionModel")) {
				this.setModel(new JSONModel([{
					ProductID: null,
					ProductName: null
				}]), "scopeSessionModel");
			}

			this.getModel("scopeSessionModel").setData([{
				ProductID: productId,
				ProductName: productName
			}]);
		},
		clearRDLModel: function(){
			this.getModel("rdlModel").setData([]);
		},
		setQualificationAndCallOffDaysForSession: function (sessionId,callViaEvent,doesSignavioSessionExist) {
			if(parseInt(sessionId)){
				var items = this.byId("idProductsTable-edit").getItems();
				var selectedSession, memberItemTemplates=[];
				var sessionModel = this.getModel("sessionModel");

				if(sessionModel && sessionModel.getData()){
					var sessionData = sessionModel.getData();
					for(var i=0;i<sessionData.length;i++){
						if(sessionData[i].ProductID===sessionId){
							selectedSession = sessionData[i];
						}
					}
				}

				var totalVisibleItems = 0;
				for(var i=0;i<items.length;i++){
					if(items[i].getVisible()){
						totalVisibleItems++;
					}
				}
				
				if (selectedSession && items) {
					for (var i = 0; i < items.length; i++) {
						if (items[i].getVisible()) {
							var SRItem = items[i].getCells()[0].data("item");
							SRItem.BrandVoiceText = SRItem.ProductName;
							if (SRItem.ItemNo === models.SR_ITEM_20) {
								if(SRItem.QualifiactionID==="00000000"){
									items[i].getCells()[3].getItems()[0].setSelectedKey("");
								}else{
									items[i].getCells()[3].getItems()[0].setSelectedKey(selectedSession.QualifId);
								}

								items[i].getCells()[0].data("item").QualifiactionID = selectedSession.QualifId;
								items[i].getCells()[0].data("item").CallOffDays = selectedSession.Quantity;
								items[i].getCells()[4].getItems()[1].setValue(selectedSession.Quantity);
								var startDate = items[i].getCells()[5].getItems()[0].getDateValue();
								if (startDate) {
									if(selectedSession.Quantity>0){
										items[i].getCells()[6].getItems()[0].setDateValue(models.addDaysToDate(startDate, parseInt(selectedSession.Quantity)-1));
									}else{
										var endDate = deepClone(startDate);
										endDate = models.setEndDateBasedOnStartDateValue(endDate);
										//endDate.setHours(17,0,0,0);
										items[i].getCells()[6].getItems()[0].setDateValue(endDate);
									}
								}
								items[i].getCells()[0].data("item").EndDate = items[i].getCells()[6].getItems()[0].getDateValue();
								this.recalculateCallOffDays();

								if(this.getModel("memberItemsTemplateModel") && this.getModel("memberItemsTemplateModel").getData()){
									memberItemTemplates = this.getModel("memberItemsTemplateModel").getData(); //models.filterMemberItemTemplateBySession(sessionId,this);
									if(!models.existingSession || callViaEvent){
										for(var j=0;j<memberItemTemplates.length;j++){
											this.onAddNewScopeRow(null,memberItemTemplates[j].QualifID,memberItemTemplates[j].Quantity,memberItemTemplates[j].ComponentId);
										}
									}
									
									if((memberItemTemplates.length===0)){
										if(this.sessionTemplateAdjusted){
											var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
											MessageBox.information("Qualification and Call-off-days are updated for Item 20 from the Template available with selected Component "+sessionId+".",{
												styleClass: bCompact ? "sapUiSizeCompact" : ""
											});
										}else{
											this.deleteAllItems(null,2);
											this.getModel("buttonControlModel").setProperty("/itemAddBtn",true);
										}
									}
								}

								if (this.getModel("qualificationModel")) {
									var qualifications = this.getModel("qualificationModel").getData();
									for (var k = 0; k < qualifications.length; k++) {
										if (qualifications[k].DdlbKey === selectedSession.QualifId) {
											items[i].getCells()[3].getItems()[0].setTooltip(qualifications[k].Value);
											items[i].getCells()[0].data("item").QualificationName = qualifications[k].Value;
											break;
										}
									}
								}
								break;

							}
						}
					}
					
					if(!callViaEvent && models.existingSession && memberItemTemplates && memberItemTemplates.length>0){
							if(this.sessionTemplateAdjusted){
							var context = this;
							var htmlContent = "Qualification and Call-off-days are updated for item 20 from the Template available for Component "+sessionId+". The template also contains an item 30+. <br/>Do you want to keep your existing member items(30+) ?";
							var dialog = new Dialog({
								title: "Please confirm",
								type: 'Message',
								icon: "sap-icon://question-mark",
								initialFocus:"beginButtonDialogResetMemberItems",
								content: new sap.m.FormattedText({
								htmlText: htmlContent
								}),
								beginButton: new Button({
									id:"beginButtonDialogResetMemberItems",
									text: "Yes",
									type: 'Emphasized',
									press: function () {
										if(doesSignavioSessionExist){
											context.addSignavioMemberItemIfNotExist();
										}
										dialog.close();
									}
								}),
								endButton: new Button({
									text: "No",
									press: function () {
										context.sessionTemplateAdjusted = false;
										context.deleteAllItems(null,2);
										for(var i=0;i<memberItemTemplates.length;i++){
											context.onAddNewScopeRow(null,memberItemTemplates[i].QualifID,memberItemTemplates[i].Quantity,memberItemTemplates[i].ComponentId);
										}
										context.getModel("buttonControlModel").setProperty("/itemAddBtn",true);
										dialog.close();
									}
								}),
								afterClose: function () {
									dialog.destroy();
								}
							});
							dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
							dialog.open();
						}else{
							this.deleteAllItems(null,2);
							for(var i=0;i<memberItemTemplates.length;i++){
								this.onAddNewScopeRow(null,memberItemTemplates[i].QualifID,memberItemTemplates[i].Quantity,memberItemTemplates[i].ComponentId);
							}
							this.getModel("buttonControlModel").setProperty("/itemAddBtn",true);
						}
					}
				}
			}
			
		},
		addSignavioMemberItemIfNotExist: function(){
			var items = this.byId("idProductsTable-edit").getItems();
			var doesSignavioMemberItemExist = false;
			for (var j = 0; j < items.length; j++) {
				if (items[j].getVisible()) {
					var SRItem = items[j].getCells()[0].data("item");
					if(SRItem.QualifiactionID === "93203181"){
						doesSignavioMemberItemExist = true;
						break;
					}
				}
			}
			if(!doesSignavioMemberItemExist){
				this.onAddNewScopeRow(null,"93203181","2","9501642");
			}
		},

		deleteAllItems: function (createdItem, index) {
			var items = this.byId("idProductsTable-edit").getItems();
			if (index === 0) {
				for (var i = 0; i < items.length; i++) {
					items[i].getCells()[0].getItems()[0].data({
						"isDeleted": "true"
					});
					items[i].setVisible(false);
				}
				this.byId("SessionName-edit").setSelectedKey("");

			}

			if (index === 1) {
				for (var i = 0; i < items.length; i++) {
					var SRItem = items[i].getCells()[0].data("item");
					if (SRItem.ItemNo != models.SR_ITEM_10) {
						items[i].getCells()[0].getItems()[0].data({
							"isDeleted": "true"
						});
						items[i].setVisible(false);
					}
				}
			}

			if (index === 2) {
				for (var i = 0; i < items.length; i++) {
					var SRItem = items[i].getCells()[0].data("item");
					if (!(SRItem.ItemNo === models.SR_ITEM_10 || SRItem.ItemNo === models.SR_ITEM_20)) {
						items[i].getCells()[0].getItems()[0].data({
							"isDeleted": "true"
						});
						items[i].setVisible(false);
					}
				}
			}

			this.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
			this.recalculateCallOffDays();
			this.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", this.setDeleteAllButtonEnabled());
		},
		setMemberItemsTemplate: function(sessionId,callViaEvent){
			var doesSignavioSessionExist = this.showSignavioInstructionsMsg(sessionId);
			if((sessionId !== models.SESSION_READINESS_CHECK) && !doesSignavioSessionExist){
				var context = this;
				var serviceId = context.getModel("servicerequestModel").getProperty("/ServiceID");
				var hostURL = context.getModel("SRS_Data").sServiceUrl;
				var memberTemplateModel = new JSONModel(hostURL + "/GetSessionConfig?ServiceId='"+serviceId+"'&SessionId='"+sessionId+"'");
				var busyDialog = models.createBusyDialog("Loading Member Items...");
				busyDialog.open();
				memberTemplateModel.attachRequestCompleted(function (resp) {
					busyDialog.close();
					if (resp.getParameters("success").success) {
						var results = memberTemplateModel.getData().d.results;
						context.setModel(new sap.ui.model.json.JSONModel(results), "memberItemsTemplateModel");
						context.setQualificationAndCallOffDaysForSession(sessionId,callViaEvent,doesSignavioSessionExist);
					} else {
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
						models.showErrorMessage(context, resp.getParameters().errorobject);
					}

				});
			}else if(doesSignavioSessionExist && (sessionId !== models.SESSION_READINESS_CHECK)){
				this.getHardCodedSignavioSessions(sessionId,callViaEvent,doesSignavioSessionExist);
			}
		},
		getHardCodedSignavioSessions: function(sessionId,callViaEvent,doesSignavioSessionExist){
			var results = [{
				ComponentId : "9501642",
				ComponentText: "Remote Team Member",
				QualifID: "93203181",
				QualifText: "SPK: Signavio",
				Quantity: "2.000",
				QuantityUnit: "TA"
				}]
			this.setModel(new sap.ui.model.json.JSONModel(results), "memberItemsTemplateModel");
			this.setQualificationAndCallOffDaysForSession(sessionId,callViaEvent,doesSignavioSessionExist);
		},
		setSession: function () {
			var doesSessionExist = false;
			this.byId("SessionName-edit").setBusy(true);
			var serviceID = this.getModel("servicerequestModel").getProperty("/ServiceID");
			var sessionID = this.getModel("servicerequestModel").getProperty("/SessionID");
			var sessionName = this.getModel("servicerequestModel").getProperty("/SessionName");
			var SRStatus = this.getModel("servicerequestModel").getProperty("/StatusCode");
			var customerId = this.getModel("servicerequestModel").getProperty("/CustomerID");
			this.byId("idMultiComboValueDriver").setBusy(true);
			this.getModel("SRS_Data").read("/CustomerSet('"+customerId+"')/toProductStructure", {
				groupId: "SessionGroup",
				filters: [models.filterCondition_Equal("ParentProductID", serviceID)],
				success: function (oData) {
					this.byId("SessionName-edit").setBusy(false);
					var sessions = oData.results;
					//sessions = models.filterSessionBasedOnSelectedService(serviceID,sessions);
					sessions = models.addBrandVoiceTextForSession(this,sessions);
					var hasTenantProductTypes = false;
					var PrSuccessSession = false;
					var isSystemRequired = "X";
					this.setModel(new sap.ui.model.json.JSONModel(sessions), "sessionModel");
					for (var i = 0; i < sessions.length; i++) {
						if (sessionID === sessions[i].ProductID) {
							doesSessionExist = true;
							hasTenantProductTypes = sessions[i].HasTenantProductTypes;
							PrSuccessSession = sessions[i].PreferredSuccess;
							isSystemRequired = sessions[i].SystemRequired;
							this.setModel(new JSONModel([{
								ProductID: sessionID,
								ProductName: sessions[i].ProductText
							}]), "scopeSessionModel");
							break;
						}
					}
					if(PrSuccessSession){
						this.setImmediateSO(PrSuccessSession);
						this.enableDisableSRItemsBasedOnServiceSelected(PrSuccessSession);
					}
					this.showHideSystem(isSystemRequired,PrSuccessSession);
					var oEventBus = sap.ui.getCore().getEventBus();
					oEventBus.publish("evaluateSRProgress", "evaluateSRProgressSuccess");
					if (doesSessionExist) {
						models.setVisibleFeedbackForm(this,sessionID);
						this.callReferenceObjects(sessionID);
						models.getRequestedDeliveryLanguage(this,sessionID);
						if(this.getModel("buttonControlModel").getProperty("/isEdit")){
							this.getValueDriversBySessionId(this,sessionID,false,false);
						}
					} else {
						if (SRStatus !== models.STATUS_SOCREATED || SRStatus !== models.STATUS_CANCELED) {
							models.existingSession = "";
							models.existingSessionProductName = "";
							models.isSessionSelected = false;
							
							var productSetModel = this.getModel("productSetModel");
							var doesServiceExist = false;
							if(productSetModel && productSetModel.getData()){
								var productData = productSetModel.getData();
								for(var i=0;i<productData.length;i++){
									if(serviceID === productData[i].ProductID){
										doesServiceExist = true;
										break;
									}
								}
							}
							if(!doesServiceExist && !doesSessionExist){
								models.existingService = null;	
								models.isServiceSelected = false;
								this.deleteAllItems(null, 0);
								this.byId("SessionName-edit").setEnabled(false);
								this.byId("SessionName-edit").setRequired(false);
								this.getModel("servicerequestModel").setProperty("/ServiceID","");
								this.getModel("servicerequestModel").setProperty("/SessionID","");
							}else{
								this.deleteAllItems(null, 1);
								this.byId("SessionName-edit").setValueState("Error");
								this.getModel("servicerequestModel").setProperty("/SessionID","");
							}
							this.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", this.setDeleteAllButtonEnabled());
							models.onCreateValidate(this);
							this.byId("SessionText-edit").setEnabled(false);
							this.byId("SessionName-edit").setSelectedKey("");
						}
					}
				}.bind(this),
				error: function () {
					this.byId("SessionName-edit").setBusy(false);
					this.byId("SessionName-edit").setValue("");
					return doesSessionExist;
				}.bind(this)
			});
		},

		pressDeleteAllItems: function () {
			var i18 = this.getResourceBundle();
			var context = this;
			var dialog = new Dialog({
				title: i18.getText("deleteAllItems"),
				type: "Message",
				state: 'Warning',
				content: new Text({
					text: i18.getText("txtPopupDeleteAllItems")
				}),
				beginButton: new Button({
					text: "Yes",
					press: function () {
						var items = context.byId("idProductsTable-edit").getItems();
						for (var i = 0; i < items.length; i++) {
							var SRItem = items[i].getCells()[0].data("item");
							if (!(SRItem.ItemNo === models.SR_ITEM_10 || SRItem.ItemNo === models.SR_ITEM_20)) {
								items[i].getCells()[0].getItems()[0].data({
									"isDeleted": "true"
								});
								items[i].setVisible(false);
							}
						}
						context.recalculateCallOffDays();
						context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", context.setDeleteAllButtonEnabled());
						context.sessionTemplateAdjusted = true;
						dialog.close();
					}.bind(this)
				}),
				endButton: new Button({
					text: "No",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();

		},

		handleDelete: function (oEvent) {
			var context = this;
			var itemEvent = oEvent.getSource().getParent().getParent();
			var itemIndex = this.byId("idProductsTable-edit").indexOfItem(itemEvent);
			var txt = "Are you sure you want to delete line item?\n\n" + this.getResourceBundle().getText("txtShiftDeleteTxt");
			var dialog = new Dialog({
				title: "Delete Row",
				type: "Message",
				state: 'Warning',
				content: new Text({
					text: txt
				}),
				beginButton: new Button({
					text: "Yes",
					press: function () {
						context.deleteSingleItemUponDeleteBtnPress(itemIndex);
						context.reArrangeItemsSequence();
						dialog.close();
					}.bind(this)
				}),
				endButton: new Button({
					text: "No",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			if (this.shiftkeyPressed) {
				this.deleteSingleItemUponDeleteBtnPress(itemIndex);
				context.reArrangeItemsSequence();
			} else {
				dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				dialog.open();
			}
			this.sessionTemplateAdjusted = true;

		},
		reArrangeItemsSequence: function(){
			var SRItems = this.byId("idProductsTable-edit").getItems();
			var initialCount = 20;
			for(var i=2;i<SRItems.length;i++){
				if(SRItems[i].getVisible()){
					initialCount = initialCount+10;
					SRItems[i].getCells()[0].data("item").ItemNo = initialCount.toString();
					SRItems[i].getCells()[1].getItems()[0].setText(initialCount.toString());
				}
			}
		},

		deleteSingleItemUponDeleteBtnPress: function (itemIndex) {
			this.isItemsEdited = true;
			models.onCreateValidate(this);
			this.byId("idProductsTable-edit").getItems()[itemIndex].getCells()[0].getItems()[0].data({
				"isDeleted": "true"
			});
			this.byId("idProductsTable-edit").getItems()[itemIndex].setVisible(false);
			this.recalculateCallOffDays();
			this.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", this.setDeleteAllButtonEnabled());
		},
		handleItemCopy: function (oEvent) {
			var itemEvent = oEvent.getSource().getParent().getParent();
			var product = itemEvent.getCells()[2].getItems()[1].getSelectedKey();
			var qualification = itemEvent.getCells()[3].getItems()[0].getSelectedKey();
			var qualificationName="";
			if(qualification && itemEvent.getCells()[3].getItems()[0].getSelectedItem()){
				qualificationName = itemEvent.getCells()[3].getItems()[0].getSelectedItem().getText();
			}
			var callOffDays = itemEvent.getCells()[4].getItems()[1].getValue();
			var startDate = itemEvent.getCells()[5].getItems()[0].getDateValue();
			var endDate = itemEvent.getCells()[6].getItems()[0].getDateValue();
			var deliveryTeam = itemEvent.getCells()[7].getItems()[0].getSelectedKey();
			var serviceDeliveryDetails = itemEvent.getCells()[8].getItems()[1].getItems()[0].getText();
			var isDeliveryTeamModified = false;

			if (deliveryTeam) {
				isDeliveryTeamModified = true;
			}

			var items = this.getView().byId("idProductsTable-edit").getItems();
			var currentItemNoArr = [];
			for(var i=0;i<items.length;i++){
				if(items[i].getVisible()){
					currentItemNoArr.push(items[i].getCells()[0].data("item").ItemNo);
				}
			}

			var largest = parseInt(currentItemNoArr[0]);

			for (var i = 0; i < currentItemNoArr.length; i++) {
				if (currentItemNoArr[i] > largest ) {
					largest = parseInt(currentItemNoArr[i]);
				}
			}
			largest += 10;

			var newItem = {
				"ServiceRequestID": "",
				"HeaderGUID": "",
				"ItemNo": largest.toString(),
				"QualifiactionID": qualification,
				"QualificationName": qualificationName,
				"CallOffDays": callOffDays,
				"StartDate": startDate,
				"EndDate": endDate,
				"ProductID": product,
				"ProductName": "",
				"DeliveryTeamID": deliveryTeam,
				"DeliveryTeamName": "",
				"ItemGUID": (new Date).getTime(),
				"ParentGUID": "",
				"RequestedDeliveryDate": null,
				"GoLiveDate": null,
				"ContractID": "",
				"ContractName": "",
				"ContractItemID": "",
				"ContractItemName": "",
				"DeliveryTeamChanged": isDeliveryTeamModified,
				"ServiceDelDetailsText":serviceDeliveryDetails
			};

			var rowCount = this.getView().byId("idProductsTable-edit").getItems().length;
			this.getModel("servicerequestItemsModel").setProperty("/" + rowCount, newItem);
			MessageToast.show("Item is successfully Copied.", {
				duration: 1000
			});
			this.recalculateCallOffDays();

		},
		onAddNewScopeRow: function (oEvent,QualID,CallOffDays,roleId) {
			this.isItemsEdited = true;
			var rowCount = this.getView().byId("idProductsTable-edit").getItems().length;
			var requestDeliverDate = this.byId("reqdate-edit").getDateValue();
			var startDate, endDate;
			if (this.byId("reqdate-edit").getValue()) {
				startDate = deepClone(requestDeliverDate);
				startDate.setHours(9, 0, 0, 0);
				endDate = deepClone(requestDeliverDate);
				endDate.setHours(17, 0, 0, 0);
			} else {
				startDate = new Date();
				startDate.setHours(9, 0, 0, 0);
				endDate = new Date();
				endDate.setHours(17, 0, 0, 0);
			}

			var items = this.getView().byId("idProductsTable-edit").getItems();
			var currentItemNoArr = [];
			for(var i=0;i<items.length;i++){
				if(items[i].getVisible()){
					currentItemNoArr.push(items[i].getCells()[0].data("item").ItemNo);
				}
			}

			var largest = parseInt(currentItemNoArr[0]);

			for (var i = 0; i < currentItemNoArr.length; i++) {
				if (currentItemNoArr[i] > largest ) {
					largest = parseInt(currentItemNoArr[i]);
				}
			}
			largest += 10;

			
			var qualificationId = QualID ? QualID : "";
			var COD = CallOffDays ? CallOffDays : "0";
			var role = roleId ? roleId : "";
			
			if(CallOffDays>0){
				endDate = models.addDaysToDate(startDate, parseInt(CallOffDays)-1)
			}

			var newItem = {
				"ServiceRequestID": "",
				"HeaderGUID": "",
				"ItemNo": largest.toString(),
				"QualifiactionID": qualificationId,
				"QualificationName": "",
				"CallOffDays": COD,
				"StartDate": startDate,
				"EndDate": endDate,
				"ProductID": role,
				"ProductName": "",
				"DeliveryTeamID": "",
				"DeliveryTeamName": "",
				"ItemGUID": (new Date).getTime(),
				"ParentGUID": "",
				"RequestedDeliveryDate": null,
				"GoLiveDate": null,
				"ContractID": "",
				"ContractName": "",
				"ContractItemID": "",
				"ContractItemName": "",
				"DeliveryTeamChanged": false,
				"ServiceDelDetailsText":""
			};

			this.getModel("servicerequestItemsModel").setProperty("/" + rowCount, newItem);
			models.onCreateValidate(this);
			models.SRItemsStartDateValidationEditMode(this);
			this.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", this.setDeleteAllButtonEnabled());
			this.setDefaultItemDateLimit();
			this.recalculateCallOffDays();
			if(oEvent){
				this.sessionTemplateAdjusted = true;
			}
		},

		setDefaultItemDateLimit: function () {
			var selectedContractItem = this.byId("contractItemId-edit").getSelectedKey();
			if (!selectedContractItem) {
				this.resetSRItemDateMinMaxLimit();
			}
		},

		onAddNewScopeRowOnServiceChange: function (item) {
			var rowCount = this.getView().byId("idProductsTable-edit").getItems().length;
			var requestDeliverDate = this.byId("reqdate-edit").getDateValue();
			var startDate, endDate;
			if (this.byId("reqdate-edit").getValue()) {
				startDate = requestDeliverDate;
				endDate = requestDeliverDate;
			} else {
				startDate = new Date();
				startDate.setHours(9, 0, 0, 0);
				endDate = new Date();
				endDate.setHours(17, 0, 0, 0);
			}

			this.getModel("servicerequestItemsModel").setProperty("/" + rowCount, item);
			models.SRItemsStartDateValidationEditMode(this);
			if (item.ProductID === models.SESSION_READINESS_CHECK) {
				this.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
			} else {
				this.getModel("buttonControlModel").setProperty("/itemAddBtn", true);
			}
			this.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", this.setDeleteAllButtonEnabled());
			this.setDefaultItemDateLimit();
		},

		onContractSelected: function (oEvent) {
			var serviceRequestModel = this.getModel("servicerequestModel").oData;
			var SRStatus = serviceRequestModel.StatusCode;
			var contractID = oEvent.getSource().getSelectedKey();
			if (!contractID && SRStatus === models.STATUS_APPROVED) {
				MessageBox.error("Contract cannot be empty");
				var SRItemsContract = this.getModel("servicerequestItemsModel").getData()[0].ContractID;
				this.byId("contractId-edit").setSelectedKey(SRItemsContract);
				return;
			}
			this.isItemsEdited = true;

			this.getModel("buttonControlModel").setProperty("/showContractValidationMessageStrip", false);
			this.byId("contractItemId-edit").setValueState(null);
			this.byId("idTextContactType").setText("");
			var tableItems = this.byId("idProductsTable-edit").getItems();
			for (var i = 0; i < tableItems.length; i++) {
				tableItems[i].getCells()[4].getItems()[1].setValueState("None");
			}
			var ServiceId = this.byId("ServiceName-edit").getSelectedKey();
			if (!ServiceId) {
				ServiceId = serviceRequestModel.ServiceID;
			}
			var reqDeliveryDate = this.byId("reqdate-edit").getDateValue();
			if (!reqDeliveryDate) {
				reqDeliveryDate = this.byId("reqdate-edit").getDateValue();
			}
			this.byId("contractItemId-edit").setSelectedKey("");
			this.byId("contractItemId-edit").setEnabled(false);
			this.getModel("SRS_Data_UserSet").setProperty("/AvailableCallOffDays", "0");
			this.getModel("buttonControlModel").setProperty("/showContractWorkAtRisk", false);
			var SRItems = this.getModel("servicerequestItemsModel").getData();
			if (contractID) {
				if (SRItems && SRItems.length > 0) {
					SRItems[0].ContractID = contractID;
				}

				var parentCaseId = serviceRequestModel.ParentCaseID;
				if(parentCaseId){
					var contractModel = this.getModel("contractSetModel").getData();
					for(var i=0;i<contractModel.length;i++){
						if(contractModel[i].ContractID === contractID && !contractModel[i].InEngagement){
							var CustomerId = "";
							if (this.getModel("SRS_Data_UserSet").getData().customerId) {
								CustomerId = this.getModel("SRS_Data_UserSet").getData().customerId;
							} else if (serviceRequestModel && serviceRequestModel.CustomerID) {
								CustomerId = serviceRequestModel.CustomerID;
							}
							var serviceId = this.byId("ServiceName-edit").getSelectedKey();
							var data = {
								"CustomerID": CustomerId,
								"ProductID": serviceId,
								"RecDelDate": this.reqDelDate, // added for validation 
								"ParentCaseID": serviceRequestModel.ParentCaseID
							};
							models.addContractToEngagementCase(this,parentCaseId,"/ContractSet", data, "contractSetModel", "contractId-edit", true, contractID, null);
							break;
						}
					}
				}

			}else{
				if (SRItems && SRItems.length > 0) {
					SRItems[0].ContractID = "";
					SRItems[0].ContractItemID = "";
				}
			}

			if (ServiceId && reqDeliveryDate && contractID) {
				models.getContracts(this, "/ContractSet", {
					"RecDelDate": reqDeliveryDate,
					"ProductID": ServiceId,
					"ContractID": contractID
				}, "contractItemModel", "contractItemId-edit", true, null, null);
			}

			this.setDefaultItemDateLimit();

		},

		setTimeForEndDate: function (selectedControl, servicerequestItemDate, dateShift) {
			var hoursDiff = selectedControl.getDateValue().getHours() - this.item_20_dateTime.getHours();
			var minutesDiff = selectedControl.getDateValue().getMinutes() - this.item_20_dateTime.getMinutes();

			var hoursToSet = new Date(servicerequestItemDate).getHours() + hoursDiff;
			var minutesToSet = new Date(servicerequestItemDate).getMinutes() + minutesDiff;
			var afterDateShift = models.dateShiftForItems(dateShift, servicerequestItemDate);
			if (afterDateShift) {
				afterDateShift.setHours(hoursToSet);
				afterDateShift.setMinutes(minutesToSet);
			}
			//if(selectedControl.getDateValue().getHours() === 0){
			//	afterDateShift.setDate(afterDateShift.getDate() + 1);
			//}
			return afterDateShift;
		},
		resetItemDatesBasedOnRDD: function (context, dateString, type, selectedControl) {

			var servicerequestItemsModel = context.getModel("servicerequestItemsModel").getData();
			var reqDelDate = new Date(dateString);
			var dateShift = 0;
			var sessionDate = dateString;
			for (var i = 0; i < servicerequestItemsModel.length; i++) {
				if (servicerequestItemsModel[i].ItemNo === models.SR_ITEM_10) {
					context.getModel("servicerequestItemsModel").setProperty("/" + i + "/RequestedDeliveryDate", reqDelDate);
				}
				if (servicerequestItemsModel[i].ItemNo === models.SR_ITEM_20 && servicerequestItemsModel[i].StartDate) {
					if (selectedControl.getId().includes("idProductsTable")) {
						if (this.item_20_dateTime.toDateString() !== reqDelDate.toDateString()) {
							dateShift = models.calculateDateShiftTime(this.item_20_dateTime.toString(), reqDelDate.toString(), true);
						}
					} else {
						dateShift = models.calculateDateShiftTime(this.item_20_dateTime.toString(), reqDelDate.toString(), true);
					}
					if (type === models.PRODUCT_TYPE_SESSION) {
						if (selectedControl.getId().includes("idProductsTable")) {
							var endDateAfterDateShift = this.setTimeForEndDate(selectedControl, servicerequestItemsModel[i].EndDate, dateShift);
							context.getModel("servicerequestItemsModel").setProperty("/" + i + "/StartDate", new Date(dateString));
							context.getModel("servicerequestItemsModel").setProperty("/" + i + "/EndDate", endDateAfterDateShift);
						} else {
							if (servicerequestItemsModel[i].ItemNo === models.SR_ITEM_20) {
								var tempDate = models.dateShiftForItems(dateShift, servicerequestItemsModel[i].StartDate);
								sessionDate = tempDate;
								context.getModel("servicerequestItemsModel").setProperty("/" + i + "/StartDate", tempDate);
							} else {
								context.getModel("servicerequestItemsModel").setProperty("/" + i + "/StartDate", models.dateShiftForItems(dateShift,
									servicerequestItemsModel[i].StartDate));
							}

							context.getModel("servicerequestItemsModel").setProperty("/" + i + "/EndDate", models.dateShiftForItems(dateShift,
								servicerequestItemsModel[i].EndDate));
						}
					}
				}
			}

			if (type === "ALL") {
				for (var i = 0; i < servicerequestItemsModel.length; i++) {
					if (selectedControl.getId().includes("idProductsTable")) {
						if (servicerequestItemsModel[i].ItemNo === models.SR_ITEM_20) {
							context.getModel("servicerequestItemsModel").setProperty("/" + i + "/StartDate", new Date(dateString));
						} else {
							var startDateAfterDateShift = this.setTimeForEndDate(selectedControl, servicerequestItemsModel[i].StartDate, dateShift);
							context.getModel("servicerequestItemsModel").setProperty("/" + i + "/StartDate", new Date(startDateAfterDateShift));
							var table = this.byId("idProductsTable-edit");
							if (startDateAfterDateShift.getHours() === 0) {
								if (table.getItems()[i] && table.getItems()[i].getCells()[5].getItems()[0]) {
									table.getItems()[i].getCells()[5].getItems()[0].setDateValue(startDateAfterDateShift);
								}
							}

						}
						var endDateAfterDateShift = this.setTimeForEndDate(selectedControl, servicerequestItemsModel[i].EndDate, dateShift);
						context.getModel("servicerequestItemsModel").setProperty("/" + i + "/EndDate", endDateAfterDateShift);
					} else {
						if (servicerequestItemsModel[i].ItemNo === models.SR_ITEM_20) {
							var tempDate = models.dateShiftForItems(dateShift, servicerequestItemsModel[i].StartDate);
							sessionDate = tempDate;
							context.getModel("servicerequestItemsModel").setProperty("/" + i + "/StartDate", tempDate);
						} else {
							context.getModel("servicerequestItemsModel").setProperty("/" + i + "/StartDate", models.dateShiftForItems(dateShift,
								servicerequestItemsModel[i].StartDate));
						}
						context.getModel("servicerequestItemsModel").setProperty("/" + i + "/EndDate", models.dateShiftForItems(dateShift,
							servicerequestItemsModel[i].EndDate));
					}
				}
			}

			if (selectedControl.getId().includes("idProductsTable")) {
				this.item_20_dateTime = new Date(dateString);
			} else {
				this.item_20_dateTime = sessionDate;
			}
			models.SRItemsStartDateValidationEditMode(this);
		},
		requestDelDateOnChange: function (oEvent) {

			if (!oEvent.getParameter("valid")) {
				models.dateValidation(this.byId("reqdate-edit"), this.reqDelDate, this);
				return;
			}
			var eventValue = oEvent.getSource().getDateValue();
			if (!eventValue) {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Requested Delivery date cannot be Empty", {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
				this.byId("reqdate-edit").setDateValue(this.reqDelDate);
				return;
			}
			var exstValue = this.getModel("servicerequestItemsModel").getProperty("/0/RequestedDeliveryDate");
			this.reqDelDate = oEvent.getSource().getDateValue();
			var selectedControl = oEvent.getSource();
			var i18 = this.getResourceBundle();
			var dialogMsg = i18.getText("dialogForChangeReqgDDStatusText");
			var StartDateBtnMsg = i18.getText("dialogForChangeRDDSesssionSD");
			if (selectedControl.getId().includes("idProductsTable")) {
				dialogMsg = i18.getText("txtDialogMsgOnChangeStartDateForItem_20");
				StartDateBtnMsg = i18.getText("dialogForChangeRDDSesssionSDTime");
			}
			var context = this;
			if (exstValue) {
				var dialog = new Dialog({
					title: i18.getText("dialogForChangeStatusTitle"),
					type: 'Message',
					state: 'Warning',
					content: new Text({
						text: dialogMsg
					}),
					buttons: [
						new Button({
							text: i18.getText("dialogForChangeRDDAll"),
							press: function () {
								this.isItemsEdited = true;
								context.setRequestedDeliveryDate(context, eventValue, "ALL", selectedControl); //set to ALL
								dialog.close();
							},
						}),
						new Button({
							text: StartDateBtnMsg,
							press: function () {
								this.isItemsEdited = true;
								context.setRequestedDeliveryDate(context, eventValue, models.PRODUCT_TYPE_SESSION, selectedControl);
								dialog.close();
							},
						}),
						new Button({
							text: i18.getText("dialogForChangeRDDCancel"),
							press: function () {
								context.getModel("servicerequestItemsModel").setProperty("/0/RequestedDeliveryDate", exstValue);
								context.byId("reqdate-edit").setDateValue(exstValue);
								if (selectedControl.getId().includes("idProductsTable")) {
									selectedControl.setDateValue(exstValue);
								}
								dialog.close();
							}
						})
					],
					afterClose: function () {
						dialog.destroy();
					}
				});
				var SRItems = context.byId("idProductsTable-edit").getItems();
				var doesMoreThanTwoItemsExist = false;
				var count = 0;
				for (var i = 0; i < SRItems.length; i++) {
					if (SRItems[i].getVisible()) {
						count++;
						if (count > 2) {
							doesMoreThanTwoItemsExist = true;
							break;
						}
					}
				}
				if (doesMoreThanTwoItemsExist) {
					dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					dialog.open();
				} else {
					this.isItemsEdited = true;
					context.setRequestedDeliveryDate(context, eventValue, "ALL", selectedControl);
				}

			} else {
				this.isItemsEdited = true;
				context.setRequestedDeliveryDate(context, eventValue, "ALL", selectedControl);
			}
		},
		setRequestedDeliveryDate: function (context, eventValue, type, selectedControl) {
			context.getModel("servicerequestItemsModel").setProperty("/0/RequestedDeliveryDate", eventValue);
			var selectedContract = context.byId("contractId-edit").getSelectedKey();
			var selectedContractItem = context.byId("contractItemId-edit").getSelectedKey();
			this.resetSRItemDateMinMaxLimit();
			context.reloadContract(true, selectedContract, selectedContractItem);
			if (eventValue) {
				if (selectedControl.getId().includes("idProductsTable")) {
					context.resetItemDatesBasedOnRDD(context, eventValue.toString(), type, selectedControl);
				} else {
					context.resetItemDatesBasedOnRDD(context, eventValue.toDateString(), type, selectedControl);
				}
			} else {
				models.SRItemsStartDateValidationEditMode(this);
			}
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("showPotentialLeadTime", "showPotentialLeadTimeSuccess", eventValue);
		},
		resetSRItemDateMinMaxLimit: function () {
			var items = this.byId("idProductsTable-edit").getItems();
			let isPrSServiceSelected = this.getModel("buttonControlModel").getProperty("/IsPreferredSuccessServiceSelected");
			if(isPrSServiceSelected){
				for (var i = 0; i < items.length; i++) {
					items[i].getCells()[5].getItems()[0].setMinDate(new Date());
					items[i].getCells()[5].getItems()[0].setMaxDate(null);
					items[i].getCells()[5].getItems()[0].setValueState(null);
					items[i].getCells()[5].getItems()[0].setValueStateText("");
	
					items[i].getCells()[6].getItems()[0].setMinDate(new Date());
					items[i].getCells()[6].getItems()[0].setMaxDate(null);
					items[i].getCells()[6].getItems()[0].setValueState(null);
					items[i].getCells()[6].getItems()[0].setValueStateText("");
				}
			}else{
				for (var i = 0; i < items.length; i++) {
					items[i].getCells()[5].getItems()[0].setMinDate(null);
					items[i].getCells()[5].getItems()[0].setMaxDate(null);
					items[i].getCells()[5].getItems()[0].setValueState(null);
					items[i].getCells()[5].getItems()[0].setValueStateText("");
	
					items[i].getCells()[6].getItems()[0].setMinDate(null);
					items[i].getCells()[6].getItems()[0].setMaxDate(null);
					items[i].getCells()[6].getItems()[0].setValueState(null);
					items[i].getCells()[6].getItems()[0].setValueStateText("");
				}
			}

			for (var i = 0; i < items.length; i++) {
				if(items[i].getCells()[6].getItems()[0].getDateValue()<items[i].getCells()[5].getItems()[0].getDateValue()){
					items[i].getCells()[6].getItems()[0].setValueState("Error");
					items[i].getCells()[6].getItems()[0].setValueStateText(this.getResourceBundle().getText("txtEndDateEarlier"));
				}
			}
		},
		reloadContract: function (loadDefaultContract, selectedContract, selectedContractItem) {
			this.setModel(new JSONModel(), "contractSetModel");
			this.setModel(new JSONModel(), "contractItemModel");
			var serviceRequestModel = this.getModel("servicerequestModel").oData;
			var CustomerId = "";
			if (this.getModel("SRS_Data_UserSet").getData().customerId) {
				CustomerId = this.getModel("SRS_Data_UserSet").getData().customerId;
			} else if (serviceRequestModel && serviceRequestModel.CustomerID) {
				CustomerId = serviceRequestModel.CustomerID;
			}
			var serviceId = this.byId("ServiceName-edit").getSelectedKey();
			this.byId("contractId-edit").setSelectedKey("");
			this.byId("contractItemId-edit").setSelectedKey("");
			this.byId("contractId-edit").setEnabled(false);
			this.byId("contractItemId-edit").setEnabled(false);
			//add contract validate
			if (CustomerId && serviceId) {
				models.getContracts(this, "/ContractSet", {
					"CustomerID": CustomerId,
					"ProductID": serviceId,
					"RecDelDate": this.reqDelDate, // added for validation 
					"ParentCaseID": serviceRequestModel.ParentCaseID
				}, "contractSetModel", "contractId-edit", loadDefaultContract, selectedContract, selectedContractItem);
			}
		},
		CallOffDaysOnLiveChange: function (oEvent) {
			var val = oEvent.getSource().getValue();
			var selectedService = this.getModel("servicerequestModel").getProperty("/ServiceID");
			if (selectedService === "9500310") {
				if (val.includes(".")) {
					this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValueStateText("Value must be either 0 or a positive integer");
					return;
				}
			}

			if (parseInt(val) < 0) {
				this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
				oEvent.getSource().setValueState("Error");
				oEvent.getSource().setValueStateText("Value must not be negative");
				return;
			} else {
				oEvent.getSource().setValueState("None");
				this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", true);
				models.onCreateValidate(this);
			}

			oEvent.getSource().getParent().getParent().getCells()[0].data("item").CallOffDays = val;
			this.recalculateCallOffDays();
			this.isItemsEdited = true;

			var selectedContractItem = this.byId("contractItemId-edit").getSelectedItem();
			if (selectedContractItem) {
				var contractItemData = selectedContractItem.data("contractItem");
				var callOffDays = this.byId("totalcalloff-Edit").getText();
				var validcheckFail = models.validateContractItemBasedOnCallOffDays(contractItemData, callOffDays, this,
					"msgStripContractItemValidation");
				if (validcheckFail) {
					oEvent.getSource().setValueState("Error");
					this.byId("contractItemId-edit").setValueState("Error");
				} else {
					oEvent.getSource().setValueState(null);
					this.byId("contractItemId-edit").setValueState(null);
				}
			}
			this.sessionTemplateAdjusted = true;
		},
		callOffDaysOnChange: function (oEvent) {
			if (!oEvent.getSource().getValue()) {
				oEvent.getSource().setValue("0");
				oEvent.getSource().getParent().getParent().getCells()[0].data("item").CallOffDays = "0";
			}
		},
		recalculateCallOffDays: function () {
			var table = this.byId("idProductsTable-edit");
			var reCalculatedDays = 0;
			var isOK = true;
			for (var i = 0; i < table.getItems().length; i++) {
				if (table.getItems()[i].getVisible() && table.getItems()[i].getCells()[0].data("item") && table.getItems()[i].getCells()[0].data(
						"item").ItemNo !== models.SR_ITEM_10 && table.getItems()[i].getCells()[0].getItems()[0].data("isDeleted") === "false") {
					var tempValue = table.getItems()[i].getCells()[4].getItems()[1].getValue();
					if (tempValue) {
						if (!isNaN(tempValue) && parseInt(tempValue) >= 0) { // Allow only [0-9], float & .(dot) [No chars, spl chars, signs allowed].
							table.getItems()[i].getCells()[4].getItems()[1].setValueState("None");
							reCalculatedDays += parseFloat(table.getItems()[i].getCells()[4].getItems()[1].getValue());
						} else {
							isOK = false;
							table.getItems()[i].getCells()[4].getItems()[1].setValueState("Error");
							table.getItems()[i].getCells()[4].getItems()[1].setValueStateText("Invalid Value");
						}
					}
				}
			}

			if (isOK) {
				this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", true);
				models.onCreateValidate(this);
			} else {
				this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
			}

			for (var i = 0; i < table.getItems().length; i++) {
				if (table.getItems()[i].getCells()[0].data("item") && table.getItems()[i].getCells()[0].data("item").ItemNo == models.SR_ITEM_10 &&
					table.getItems()[i].getCells()[0].getItems()[0].data("isDeleted") === "false") {
					table.getItems()[i].getCells()[4].getItems()[0].setText(reCalculatedDays);
				}
			}

			this.byId("totalcalloff-Edit").setText(reCalculatedDays);
			this.getModel("servicerequestModel").setProperty("/TotalCallOffDays", reCalculatedDays.toString());

		},
		comboProductOnChange: function (oEvent) {
			this.isItemsEdited = true;
			var key = "";
			var text = "";
			if (oEvent.getSource().getSelectedItem()) {
				key = oEvent.getSource().getSelectedItem().getKey();
				text = oEvent.getSource().getSelectedItem().getText();
				this.sessionTemplateAdjusted = true;

			}
			oEvent.getSource().getParent().getParent().getCells()[0].data("item").ProductID = key;
			oEvent.getSource().getParent().getParent().getCells()[0].data("item").ProductName = text;
		},
		comboQualOnChange: function (oEvent) {
			this.isItemsEdited = true;
			var key = "";
			var text = "";
			if (oEvent.getSource().getSelectedItem()) {
				key = oEvent.getSource().getSelectedItem().getKey();
				text = oEvent.getSource().getSelectedItem().getText();
			}
			oEvent.getSource().getParent().getParent().getCells()[0].data("item").QualifiactionID = key;
			oEvent.getSource().getParent().getParent().getCells()[0].data("item").QualificationName = text;
			this.sessionTemplateAdjusted = true;
		},
		comboDeliveryOnChange: function (oEvent) {
			this.isItemsEdited = true;
			var key = "";
			var text = "";
			if (oEvent.getSource().getSelectedItem()) {
				key = oEvent.getSource().getSelectedItem().getKey();
				text = oEvent.getSource().getSelectedItem().getText();
			}
			oEvent.getSource().getParent().getParent().getCells()[0].data("item").DeliveryTeamID = key;
			oEvent.getSource().getParent().getParent().getCells()[0].data("item").DeliveryTeamName = text;
			oEvent.getSource().getParent().getParent().getCells()[0].data("item").DeliveryTeamChanged = true;
			this.sessionTemplateAdjusted = true;
			if(oEvent.getSource().getParent().getParent().getCells()[0].data("item").ItemNo === models.SR_ITEM_10){
				var selectedProduct = this.byId("ServiceName-edit").getSelectedItem().data("selectedProductSet");
				models.setScopingTeamVisibility(this,selectedProduct.PreferredSuccess,models.wasPreviousServicePreferredSuccess);
			}

		},
		handleChangeStartD: function (oEvent) {
			this.isItemsEdited = true;
			//Date Validation for Typo
			if (oEvent.getParameter("valid") !== undefined && !oEvent.getParameter("valid")) {
				models.dateValidationSRItems(oEvent.getSource(), oEvent.getSource().getDateValue(), formatter.dateTime(oEvent.getSource().getDateValue()),
					this);
				return;
			}

			var date = oEvent.getSource().getDateValue();
			var startDate = oEvent.getSource().getParent().getParent().getCells()[0].data("item").StartDate;
			if (!date && oEvent.getSource().data("itemNo") === models.SR_ITEM_20) {
				var msg = this.getResourceBundle().getText("txtDialogStartDateNotEmpty");
				MessageBox.error(msg);
				oEvent.getSource().setDateValue(startDate);
				return;
			}

			// Is entered date valid? (incase user had made a mistake while typing!)
			if (oEvent.getSource().isValidValue()) {
				if (date) {
					if (oEvent.getSource().data("itemNo") !== models.SR_ITEM_20) {

						//set end date based on Start Date
						startDate = oEvent.getSource().getParent().getParent().getCells()[0].data("item").StartDate;
						var hoursDiff = 0;
						var minutesDiff = 0;
						var dateShift = 0;
						if (startDate) {
							hoursDiff = date.getHours() - startDate.getHours();
							minutesDiff = date.getMinutes() - startDate.getMinutes();
							if (startDate.toDateString() !== date.toDateString()) {
								dateShift = models.calculateDateShiftTime(startDate.toString(), date.toString(), false);
							}
						}
						var afterDateShift = date;
						if (oEvent.getSource().getParent().getParent().getCells()[0].data("item").EndDate) {
							afterDateShift = models.dateShiftForItems(dateShift, oEvent.getSource().getParent().getParent().getCells()[0].data("item").EndDate);
							afterDateShift.setHours(afterDateShift.getHours() + hoursDiff);
							afterDateShift.setMinutes(afterDateShift.getMinutes() + minutesDiff);
						}

						oEvent.getSource().getParent().getParent().getCells()[0].data("item").EndDate = afterDateShift;
						oEvent.getSource().getParent().getParent().getCells()[6].getItems()[0].setDateValue(afterDateShift);

						oEvent.getSource().getParent().getParent().getCells()[0].data("item").StartDate = date;
						models.onCreateValidate(this);
						oEvent.getSource().setValueState("None");
						oEvent.getSource().getParent().getParent().getCells()[6].getItems()[0].setValueState("None");
					} else {
						this.requestDelDateOnChange(oEvent);
					}
				} else {
					oEvent.getSource().getParent().getParent().getCells()[0].data("item").StartDate = date;
					oEvent.getSource().getParent().getParent().getCells()[0].data("item").EndDate = date;
					this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValueStateText(this.getResourceBundle().getText("fieldValueEmpty"));
					oEvent.getSource().getParent().getParent().getCells()[6].getItems()[0].setDateValue(null);
					oEvent.getSource().getParent().getParent().getCells()[6].getItems()[0].setValueState("Error");
					oEvent.getSource().getParent().getParent().getCells()[6].getItems()[0].setValueStateText(this.getResourceBundle().getText(
						"fieldValueEmpty"));
				}
				models.SRItemsStartDateValidationEditMode(this);
				this.contractItemValidationSuccess();
			} else {
				oEvent.getSource().getParent().getParent().getCells()[0].data("item").StartDate = date;
				this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
				oEvent.getSource().setValueState("Error");
				oEvent.getSource().setValueStateText(this.getResourceBundle().getText("txtInvalidDateTime"));
			}
			this.sessionTemplateAdjusted = true;
		},
		handleChangeEndD: function (oEvent) {
			this.isItemsEdited = true;
			//Date Validation for Typo
			//Date Validation for Typo
			if (oEvent.getParameter("valid") !== undefined && !oEvent.getParameter("valid")) {
				models.dateValidationSRItems(oEvent.getSource(), oEvent.getSource().getDateValue(), formatter.dateTime(oEvent.getSource().getDateValue()),
					this);
				return;
			}
			// Is entered date valid? (incase user had made a mistake while typing!)
			if (oEvent.getSource().isValidValue()) {
				var date = oEvent.getSource().getDateValue();
				var startDate = oEvent.getSource().getParent().getParent().getCells()[0].data("item").StartDate;

				if (date) {
					if (date > startDate || (!startDate)) {
						oEvent.getSource().getParent().getParent().getCells()[0].data("item").EndDate = date;
						this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", true);
						models.onCreateValidate(this);
						oEvent.getSource().setValueState("None");
						if (startDate) {
							if (oEvent.getSource().getParent().getParent().getCells()[5].getItems()[0].getValueState() != "Warning") {
								oEvent.getSource().getParent().getParent().getCells()[5].getItems()[0].setValueState("None");
							}
							this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", true);
							models.onCreateValidate(this);
						} else {
							this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
						}
					} else {
						oEvent.getSource().getParent().getParent().getCells()[0].data("item").EndDate = date;
						//this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
						oEvent.getSource().setValueState("Error");
						oEvent.getSource().setValueStateText(this.getResourceBundle().getText("txtEndDateEarlier"));
						models.onCreateValidate(this);
						return;
					}
				} else {
					oEvent.getSource().getParent().getParent().getCells()[0].data("item").EndDate = date;
					//this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValueStateText(this.getResourceBundle().getText("fieldValueEmpty"));
					models.onCreateValidate(this);
					return;
				}
				
				var items = this.byId("idProductsTable-edit").getItems();
				var isAnyOtherItemInvalid = false;
				for (var i = 0; i < items.length; i++) {
					if(items[i].getCells()[6].getItems()[0].getValueState() === "Error"){
						isAnyOtherItemInvalid = true;
					}
				}
				if(isAnyOtherItemInvalid){
					//this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
					models.onCreateValidate(this);
					return;
				}
				this.contractItemValidationSuccess();
			} else {
				oEvent.getSource().getParent().getParent().getCells()[0].data("item").EndDate = date;
				//this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
				oEvent.getSource().setValueState("Error");
				oEvent.getSource().setValueStateText(this.getResourceBundle().getText("txtInvalidDateTime"));
				models.onCreateValidate(this);
				return;
			}
			this.sessionTemplateAdjusted = true;
		},
		setTextAreaGrowingAgreedScope: function (oEvent) {
			models.toggleTextAreaGrowing(this, "sr-agreed-scope", oEvent);
		},
		onContractItemSelected: function (oEvent) {
			this.getModel("buttonControlModel").setProperty("/showContractWorkAtRisk", false);
			var selectedKey = oEvent.getSource().getSelectedKey();
			var SRStatus = this.getModel("servicerequestModel").getProperty("/StatusCode");
			if (!selectedKey && SRStatus === models.STATUS_APPROVED) {
				MessageBox.error("Contract Item cannot be empty");
				var SRItemsContract = this.getModel("servicerequestItemsModel").getData()[0].ContractItemID;
				this.byId("contractItemId-edit").setSelectedKey(SRItemsContract);
				return;
			}
			var SRItems = this.getModel("servicerequestItemsModel").getData();
			if (selectedKey) {
				var workAtRisk = oEvent.getSource().getSelectedItem().data().contractItem.WorkAtRisk;
				this.getModel("SRS_Data_UserSet").setProperty("/AvailableCallOffDays", oEvent.getSource().getSelectedItem().data().contractItem.ContractItemAvailableDays);
				this.setModel(new JSONModel(oEvent.getSource().getSelectedItem().data().contractItem), "contractItemsDateModel");
				var callOffDays = this.byId("totalcalloff-Edit").getText();
				var validcheckFail = models.validateContractItemBasedOnCallOffDays(oEvent.getSource().getSelectedItem().data().contractItem,
					callOffDays, this, "msgStripContractItemValidation");
				if (validcheckFail) {
					oEvent.getSource().setValueState("Error");
				} else {
					oEvent.getSource().setValueState(null);
				}
				if (workAtRisk && workAtRisk.toUpperCase() === "X") {
					this.getModel("buttonControlModel").setProperty("/showContractWorkAtRisk", true);
					if (workAtRisk && workAtRisk.toUpperCase() === "X") {
						this.getModel("buttonControlModel").setProperty("/showContractWorkAtRisk", true);
						models.setTxtMsgWorkAtRisk(this, SRItems[0].ContractID, selectedKey);
					}
				}
				if (SRItems && SRItems.length > 0) {
					SRItems[0].ContractItemID = selectedKey;
				}
			} else {
				this.getModel("SRS_Data_UserSet").setProperty("/AvailableCallOffDays", "0");
				this.setModel(new JSONModel(), "contractItemsDateModel");
				oEvent.getSource().setValueState(null);
				this.getModel("buttonControlModel").setProperty("/showContractValidationMessageStrip", false);
				if (SRItems && SRItems.length > 0) {
					SRItems[0].ContractItemID = "";
				}
			}

			this.contractItemValidationSuccess();

			this.setDefaultItemDateLimit();
		},
		agreedScopeChanged: function (oEvent) {
			this.getModel("agreedServiceRequestScopeModel").setProperty("/isAgreedScopeChanged", "true");
		},
		onExit: function () {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.unsubscribe("DetailScope", "DetailScopeReadSuccess", this.onReadSuccess, this);
			oEventBus.unsubscribe("ScopeReset", "ScopeResetSuccess", this.scopeResetSuccess, this);
			oEventBus.unsubscribe("ScopeTableReset", "ScopeTableResetSuccess", this.scopeTableResetSuccess, this);
			oEventBus.unsubscribe("createSRItems", "createSRItemsSuccess", this.createSRItemsSuccess, this);
			oEventBus.unsubscribe("saveSRItems", "saveSRItemsSuccess", this.saveSRItemsSuccess, this);
			oEventBus.unsubscribe("contractItemValidation", "contractItemValidationSuccess", this.contractItemValidationSuccess, this);
			oEventBus.unsubscribe("setAgreedScope", "setAgreedScopeSuccess", this.setAgreedScopeSuccess, this);
			oEventBus.unsubscribe("loadScopeOnSRCopy", "loadScopeOnSRCopySuccess", this.loadScopeOnSRCopySuccess, this);
			oEventBus.unsubscribe("validateRDDWhenSaveSR", "validateRDDWhenSaveSRSuccess", this.validateRDDWhenSaveSRSuccess, this);
			oEventBus.unsubscribe("setDefaultReqDelDate", "setReqDelDateSuccess", this.setReqDelDateSuccess, this);
			oEventBus.unsubscribe("onCaseReset", "onCaseResetSuccess", this.onCaseResetSuccess, this);
			//	oEventBus.unsubscribe("removeEOD", "removeEODSuccess", this.removeEODSuccess, this);
			oEventBus.unsubscribe("clearDeliveryTeams", "clearDeliveryTeamsSuccess", this.clearDeliveryTeamsSuccess, this);
			oEventBus.unsubscribe("setItem20_DateTime", "setItem20_DateTimeSuccess", this.setItem20_DateTimeSuccess, this);
			oEventBus.unsubscribe("setFocusForService", "setFocusForServiceSuccess", this.setFocusForService, this);
			oEventBus.unsubscribe("setFocusForSession", "setFocusForSessionSuccess", this.setFocusForSession, this);
			oEventBus.unsubscribe("setFocusForContract", "setFocusForContractSuccess", this.setFocusForContract, this);
			oEventBus.unsubscribe("setFocusForContractItem", "setFocusForContractItemSuccess", this.setFocusForContractItem, this);
			oEventBus.unsubscribe("setFocusForRDD", "setFocusForRDDSuccess", this.setFocusForRDD, this);
			oEventBus.unsubscribe("setFocusForAgreedScope", "setFocusForAgreedScopeSuccess", this.setFocusForAgreedScope, this);
			oEventBus.unsubscribe("setFocusForSRItems", "setFocusForSRItemsSuccess", this.setFocusForSRItemsSuccess, this);
			oEventBus.unsubscribe("eventSetNewServiceAndSession", "eventSetNewServiceAndSession", this.eventSetNewServiceAndSession, this);
			oEventBus.unsubscribe("validateSystemDuringCopySR", "validateSystemDuringCopySRSuccess", this.validateSystemDuringCopySRSuccess,
				this);
			oEventBus.unsubscribe("setFocusForSystem", "setFocusForSystemSuccess", this.setFocusForSystem, this);
			oEventBus.unsubscribe("resetSystem", "resetSystemSuccess", this.resetSystem, this);
			oEventBus.unsubscribe("RequestReset", "RequestResetSuccess", this.reloadSystems, this);
			oEventBus.unsubscribe("setSystem", "setSystemSuccess", this.setSystemSuccess, this);
			oEventBus.unsubscribe("showPotentialLeadTime", "showPotentialLeadTimeSuccess", this.showPotentialLeadTime, this);
			oEventBus.unsubscribe("DetailRequest", "DetailRequestReadSuccess", this.onReadSuccess, this);
			oEventBus.unsubscribe("setServiceRequestScope", "setServiceRequestScopeSuccess", this.setServiceRequestScopeSuccess, this);
			oEventBus.unsubscribe("setFocusForCustContact", "setFocusForCustContactSuccess", this.setFocusForCustContact, this);
			oEventBus.unsubscribe("setFocusForSRInfo", "setFocusForSRInfoSuccess", this.setFocusForSRInfo, this);
			oEventBus.unsubscribe("setFocusForSurveyRecipient", "setFocusForSurveyRecipientSuccess", this.setFocusForSurveyRecipient, this);
			oEventBus.unsubscribe("removeCustomerContact", "removeCustomerContactSuccess", this.removeCustomerContact, this);
			oEventBus.unsubscribe("removeSurevyRecipient", "removeSurevyRecipientSuccess", this.removeSurevyRecipient, this);
			oEventBus.unsubscribe("onSystemSelected", "onSystemSelectedSuccess", this.onSystemSelected, this);
			oEventBus.unsubscribe("expandSRInfoTextarea", "expandSRInfoTextareaSuccess", this.expandSRInfoTextarea, this);
		},
		onBeforeRendering: function(){
			this.sessionTemplateAdjusted = false;
		},
		expandSRInfoTextarea: function(){
			var showLessBtn = this.byId("sr-req-scope-TextMode-Edit");
			showLessBtn.setText(this.getResourceBundle().getText("showLess"));
			showLessBtn.setTooltip(this.getResourceBundle().getText("showLess"));
			this.byId("sr-req-scope").setGrowing(true);
			this.byId("sr-req-scope").setGrowingMaxLines(30);
		},
		removeCustomerContact: function () {
			this.deleteTokenForCustomerContact();
		},
		removeSurevyRecipient: function () {
			this.deleteTokenForSurveyRecipient();
			this.getModel("servicerequestModel").setProperty("/FeedbackEnabled", true);
		},
		setFocusForService: function () {
			models.setElementScroll(this, "ServiceName-edit");
		},
		setFocusForSession: function () {
			models.setElementScroll(this, "SessionName-edit");
		},
		setFocusForContract: function () {
			models.setElementScroll(this, "contractId-edit");
		},
		setFocusForContractItem: function () {
			models.setElementScroll(this, "contractItemId-edit");
		},
		setFocusForRDD: function () {
			models.setElementScroll(this, "reqdate-edit");
		},
		setFocusForAgreedScope: function () {
			models.setElementScroll(this, "panelAgreedScope");
		},
		setFocusForSRItemsSuccess: function () {
			models.setElementScroll(this, "idProductsTable-edit");
		},
		clearDeliveryTeamsSuccess: function () {
			var tableItems = this.byId("idProductsTable-edit").getItems();
			for (var i = 0; i < tableItems.length; i++) {
				if (tableItems[i].getVisible()) {
					tableItems[i].getCells()[7].getItems()[0].setSelectedKey("");
					tableItems[i].getCells()[0].data("item").DeliveryTeamID = "";
					tableItems[i].getCells()[0].data("item").DeliveryTeamName = "";
					tableItems[i].getCells()[0].data("item").DeliveryTeamChanged = false;
				}
			}
		},
		validateSystemDuringCopySRSuccess: function () {
			var servicerequestModel = this.getModel("servicerequestModel").getData();
			var CustomerID = servicerequestModel.CustomerID;
			var ReferenceSystemID = servicerequestModel.ReferenceSystemID;
			var ReferenceSystemName = servicerequestModel.ReferenceSystemName;
			var responseShowMessageForSystemInfoMsgStripBasedOnSystemAndSolman = this.showMessageForSystemInfoMsgStripBasedOnSystemAndSolman();
			if (CustomerID && ReferenceSystemID) {
				models.getSystems(this, "/IBaseComponentSet", {
					"Customer": CustomerID,
					"ReferenceSystemID": ReferenceSystemID,
					"ReferenceSystemName": ReferenceSystemName,
					"SessionID": this.getModel("servicerequestModel").getProperty("/SessionID")
				}, "systemModel", "idSystemCombo", responseShowMessageForSystemInfoMsgStripBasedOnSystemAndSolman.shallAppendSolmanAtBotton);
			} else {
				this.resetSystem();
			}
		},
		setFocusForSystem: function () {
			models.setElementScroll(this, "idSystemCombo");
		},
		modifySystemInServiceRequest: function (system) {
			if (system) {
				this.byId("idSystemCombo").setSelectedKey(null);
				this.getModel("servicerequestModel").setProperty("/ReferenceSystemID", system.IbComponent);
				this.getModel("servicerequestModel").setProperty("/ReferenceSystemName", system.SysDescription);
				this.getModel("servicerequestModel").setProperty("/SolmanComponent", system.SolmanComponent);
				this.getModel("servicerequestModel").setProperty("/InstNo", system.InstNo);
				this.getModel("servicerequestModel").setProperty("/ReferenceProductID", system.SystemRefNum);
				this.getModel("servicerequestModel").setProperty("/DeployMod", system.DeployMod);
				this.byId("idSystemCombo").setSelectedKey(system.IbComponent);
				var SRCustomerId = this.getModel("servicerequestModel").getProperty("/CustomerID");
				if (system.Customer !== SRCustomerId) {
					this.soldToCustomerId = system.Customer;
				}
			}
		},
		onSystemSelected: function(){
			var systemControl = this.byId("idSystemCombo");
			var selectedItem = systemControl.getSelectedItem();
			systemControl.setValueState("None");
			if (selectedItem) {
				
				if(selectedItem.getKey()===models.SEARCH_SYSTEM_KEY){
					this.getModel("buttonControlModel").setProperty("/visibleMessageStripInSystemDialogForSessionFilter",false);
					var sessionId = this.getModel("servicerequestModel").getProperty("/SessionID");
					if(sessionId){
						var selectedSessionSet = this.byId("SessionName-edit").getSelectedItem().data("selectedSessionSet");
						if(selectedSessionSet.HasTenantProductTypes){
							this.getModel("buttonControlModel").setProperty("/visibleMessageStripInSystemDialogForSessionFilter",true);
							this.getModel("buttonControlModel").setProperty("/textMessageStripInSystemDialogForSessionFilter",'Search results will be prefiltered based on selected Component "'+selectedSessionSet.ProductID+' - '+selectedSessionSet.ProductText+'".');
						}
					}
					this.handleValueHelpForSystemTableSuggestions();
					return;
				}
				var responseShowMessageForSystemInfoMsgStripBasedOnSystemAndSolman = this.showMessageForSystemInfoMsgStripBasedOnSystemAndSolman();
				var system = selectedItem.data("systemData");
				var that = this;
				if(responseShowMessageForSystemInfoMsgStripBasedOnSystemAndSolman.shallAppendSolmanAtBotton && system.DeployMod.toUpperCase() !== models.DeployModCloud && !system.SolmanSID){
					MessageBox.information("System without SolMan cannot be used for your selected Service/Component",{
						onClose: function (sAction) {
							systemControl.setSelectedItem(null);
							systemControl.setValue(null);
							systemControl.setValueState("Warning");
							systemControl.setValueStateText(that.getResourceBundle().getText("txtRequiredforScopingSystem"));
						}
					});
					return;
				}else{
					this.modifySystemInServiceRequest(system);
					var ContactID = this.getModel("servicerequestModel").getProperty("/ContactID");
					var SurveyRecID = this.getModel("servicerequestModel").getProperty("/SurveyRecID");
					if (ContactID) {
						this.validateCustomerContact();
					}
					if (SurveyRecID) {
						this.validateSurveyRecipient();
					}
					models.createDefaultTenantonSystemSelection(system,this);
					models.showHideCloudRefObjSection(system.DeployMod, this);
				}
			}else{ 
				models.clearSelectedSystem(this);
				models.showHideCloudRefObjSection(null, this);
			}
		},
		changeSystem: function(oEvent){
			if(!oEvent.getSource().getSelectedItem()){
				oEvent.getSource().setValue(null);
				oEvent.getSource().setValueState("Warning");
				oEvent.getSource().setValueStateText(this.getResourceBundle().getText("txtRequiredforScopingSystem"));
				oEvent.getSource().setSelectedKey(null);
				models.clearSelectedSystem(this);
				models.showHideCloudRefObjSection(null, this);
			}
		},
		onSystemDialogCloseCase: function(oEvent){
			oEvent.getSource().getParent().close();
			var ReferenceSystemID = this.getModel("servicerequestModel").getProperty("/ReferenceSystemID");
			if(ReferenceSystemID && ReferenceSystemID !== "0"){
				this.byId("idSystemCombo").setSelectedKey(ReferenceSystemID);
			}else{
				this.resetSystemKey(true);
			}
		},
		resetSystemKey: function(showWarning){
			var systemControl = this.byId("idSystemCombo");
			var selectedItem = systemControl.getSelectedItem();
			if(selectedItem.getKey()===models.SEARCH_SYSTEM_KEY){
				systemControl.setSelectedKey(null);
				systemControl.setValue(null);
				if(showWarning){
					systemControl.setValueState("Warning");
					systemControl.setValueStateText(this.getResourceBundle().getText("txtRequiredforScopingSystem"));
				}
			}
		},
		addSystemToReferenceObjects: function (oEvent) {
			var oModel = this.getModel("SRS_Data");
			var aDeferredGroup = oModel.getDeferredGroups();
			aDeferredGroup.push("batchCreateRefObjects");
			oModel.setDeferredGroups(aDeferredGroup);
			var selectedIndex = this.byId("systemTable").getSelectedIndex();
			var itemcontextPath = this.byId("systemTable").getContextByIndex(selectedIndex);
			var system = this.getModel("systemModel").getProperty(itemcontextPath.getPath());
			/*
			if(system.DeletionFlag==="Y"){
				sap.m.MessageToast.show("Selected System is not active and therefore cannot be added to System Value Help.");
				return;
			}*/

			var servicerequestModel = this.getModel("servicerequestModel").getData();
			var payload = {"CaseId":servicerequestModel.CaseID,"IbComponent":system.IbComponent,"SolmanComponent":system.SolmanComponent};
			var that = this;
			var sessionId=null;
			if(servicerequestModel.SessionID){
				sessionId = servicerequestModel.SessionID;
			}
			if(!system.doesSystemAlreadyExistInDropDown){
				sap.ui.core.BusyIndicator.show(0);
				oModel.create("/ReferenceObjectSet", payload, {
					success: function (data, resp) {
						sap.ui.core.BusyIndicator.hide();
						that.resetSystemKey(false);
						models.getReferenceObjects(that,servicerequestModel.CaseID,system.IbComponent,"idSystemCombo",true,sessionId);
						oEvent.getSource().getParent().close();
					},
					error: function (err) {
						models.showErrorMessage(that, err);
						models.getReferenceObjects(that,servicerequestModel.CaseID,system.IbComponent,"idSystemCombo",true,sessionId);
					}
				});
			}else{
				this.byId("idSystemCombo").setSelectedKey(system.IbComponent);                          
				this.onSystemSelected();
				oEvent.getSource().getParent().close();
			}
		},
		onRowSelectionChange: function(oEvent){
			var selectedItemIndex = oEvent.getParameters().rowIndex;
			if(selectedItemIndex>=0){
				var itemcontextPath = oEvent.getSource().getContextByIndex(selectedItemIndex);
				var system = this.getModel("systemModel").getProperty(itemcontextPath.getPath());
				var SystemMissingSolman = formatter.formatSystemIcon(system.SolmanSid, system.DeployModT, system.shallAppendSolmanAtBotton);
				if (SystemMissingSolman) {
					sap.m.MessageToast.show(this.getResourceBundle().getText("txtMissingSolman"));
					oEvent.getSource().removeSelectionInterval(selectedItemIndex,selectedItemIndex);
				}else if(system.DeletionFlag === "Y"){
					sap.m.MessageToast.show("System cannot be selected due to inactive status.");
					oEvent.getSource().removeSelectionInterval(selectedItemIndex,selectedItemIndex);
				}
			}
			var selectedIndices = this.byId("systemTable").getSelectedIndices();
			if(selectedIndices.length>0){
				this.byId("addBtnSystemsDialog").setEnabled(true);
			}else{
				this.byId("addBtnSystemsDialog").setEnabled(false);
			}
		},
		validateCustomerContact: function () {
			var CustomerId = this.getModel("servicerequestModel").getProperty("/CustomerID");
			var filterArr = [];
			filterArr.push(models.filterCondition_Equal("HasEmail", true));
			this.byId("srs_customerContact-input").setBusy(true);
			var context = this;
			this.getModel("SRS_Data").read("/CustomerSet(CustomerID='" + CustomerId + "')/toContacts", {
				filters: filterArr,
				groupId: "customerContactValidation",
				success: function (oData) {
					var results = oData.results;
					var ContactID = context.getModel("servicerequestModel").getProperty("/ContactID");
					var doesContactExist = false;
					for (var i = 0; i < results.length; i++) {
						if (results[i].ContactID === ContactID) {
							doesContactExist = true;
							break;
						}
					}
					if (!doesContactExist && this.soldToCustomerId) {
						this.getModel("SRS_Data").read("/CustomerSet(CustomerID='" + this.soldToCustomerId + "')/toContacts", {
							filters: filterArr,
							success: function (oData2) {
								var results2 = oData2.results;
								var doesContactExist = false;
								for (var i = 0; i < results2.length; i++) {
									if (results2[i].ContactID === ContactID) {
										doesContactExist = true;
										break;
									}
								}
								if (!doesContactExist) {
									this.removeCustomerContact();
									var msg = this.getResourceBundle().getText("txtCustomerContactValidationMsg");
									this.showMessageToastforCCandSR(msg);
								}
								context.byId("srs_customerContact-input").setBusy(false);
							}.bind(this)
						});
					} else if (!doesContactExist && !this.soldToCustomerId) {
						this.removeCustomerContact();
						var msg = this.getResourceBundle().getText("txtCustomerContactValidationMsg");
						this.showMessageToastforCCandSR(msg);
						context.byId("srs_customerContact-input").setBusy(false);
					} else {
						context.byId("srs_customerContact-input").setBusy(false);
					}

				}.bind(this)
			});
		},
		showMessageToastforCCandSR: function (msg) {
			if(!this.getModel("backNavModel").getProperty("/isMainViewVisible")){
				MessageBox.information(msg);
			}
		},
		validateSurveyRecipient: function () {
			var CustomerId = this.getModel("servicerequestModel").getProperty("/CustomerID");
			var filterArr = [];
			filterArr.push(models.filterCondition_Equal("HasEmail", true));
			var IsPreferredSuccessServiceSelected = this.getModel("buttonControlModel").getProperty("/IsPreferredSuccessServiceSelected");
			if(!IsPreferredSuccessServiceSelected){
				filterArr.push(models.filterCondition_Equal("IsSurveyRec", true));
			}
			this.byId("idSurveyRecipient").setBusy(true);
			var context = this;
			this.getModel("SRS_Data").read("/CustomerSet(CustomerID='" + CustomerId + "')/toContacts", {
				filters: [models.filterComparison_AND(filterArr)],
				groupId: "surveyRecipientValidation",
				success: function (oData) {
					var results = oData.results;
					var SurveyRecID = context.getModel("servicerequestModel").getProperty("/SurveyRecID");
					var doesContactExist = false;
					for (var i = 0; i < results.length; i++) {
						if (results[i].ContactID === SurveyRecID) {
							doesContactExist = true;
							break;
						}
					}

					if (!doesContactExist && this.soldToCustomerId) {
						this.getModel("SRS_Data").read("/CustomerSet(CustomerID='" + this.soldToCustomerId + "')/toContacts", {
							filters: [models.filterComparison_AND(filterArr)],
							success: function (oData2) {
								var results2 = oData2.results;
								var doesContactExist = false;
								for (var i = 0; i < results2.length; i++) {
									if (results2[i].ContactID === SurveyRecID) {
										doesContactExist = true;
										break;
									}
								}
								if (!doesContactExist) {
									this.removeSurevyRecipient();
									var msg = this.getResourceBundle().getText("txtSurveyRecipientValidationMsg");
									this.showMessageToastforCCandSR(msg);
								}
								context.byId("idSurveyRecipient").setBusy(false);
							}.bind(this)
						});
					} else if (!doesContactExist && !this.soldToCustomerId) {
						this.removeSurevyRecipient();
						var msg = this.getResourceBundle().getText("txtSurveyRecipientValidationMsg");
						this.showMessageToastforCCandSR(msg);
						context.byId("idSurveyRecipient").setBusy(false);
					} else {
						context.byId("idSurveyRecipient").setBusy(false);
					}

				}.bind(this)
			});
		},
		systemOnChange: function (oEvent) {
			if (oEvent.getParameter('type') === sap.m.Tokenizer.TokenUpdateType.Removed) {
				var context = this;
				var ContactID = this.getModel("servicerequestModel").getProperty("/ContactID");
				var SurveyRecID = this.getModel("servicerequestModel").getProperty("/SurveyRecID");
				this.soldToCustomerId = "";
				if (ContactID) {
					this.validateCustomerContact();
				}
				if (SurveyRecID) {
					this.validateSurveyRecipient();
				}
				models.clearSelectedSystem(this);
				models.showHideCloudRefObjSection("", this);
			}

		},
		handleValueHelpForSystemTableSuggestions: function () {
			this.setModel(new JSONModel(), "systemModel");
			//this.inputId = oController.oSource.sId;
			var dialog = this.byId("dialogSystem");
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();

			var serviceRequestModel = this.getModel("servicerequestModel").getData();
			var CustomerId = "";
			if (this.getModel("SRS_Data_UserSet").getData().customerId) {
				CustomerId = this.getModel("SRS_Data_UserSet").getData().customerId;
			} else if (serviceRequestModel && serviceRequestModel.CustomerID) {
				CustomerId = serviceRequestModel.CustomerID;
			}
			this.byId("idCustomerInput").setValue(CustomerId);
			this.byId("comboRelatedPartner").setSelectedKey("Y");
			this.byId("comboFlaggedForDeletion").setSelectedKey("N");
			this.byId("idInstallationNumber").setValue("");
			this.byId("idSystemID").setValue("");
			this.byId("comboSystemRole").setSelectedKey("");
			var responseShowMessageForSystemInfoMsgStripBasedOnSystemAndSolman = this.showMessageForSystemInfoMsgStripBasedOnSystemAndSolman();
			this.byId("idMsgStripSystemDialogInfo").setText(responseShowMessageForSystemInfoMsgStripBasedOnSystemAndSolman.msgTxt);

			var context = this;
			
			if (CustomerId) {
				context.byId("idMsgStripFilterBarSystemDialog").setVisible(false);
				context.byId("systemTable").setVisibleRowCount(1);
				context.byId("systemTable").setNoData("Press 'Go' button to execute System search");
			}

			context.byId("titleSystemTable").setText(context.getResourceBundle().getText("systemTableHeaderTitle"));
			context.clearAllSystemTableFilters();

			dialog.attachAfterOpen(function () {
				context.byId("addBtnSystemsDialog").setEnabled(false);
				if (context.getView().byId("comboSystemRole")) {
					context.getView().byId("comboSystemRole").setFilterFunction(function (searchString, oItem) {
						if (!isNaN(searchString)) {
							searchString = searchString.trim();
						}
						return models.comboBoxContainsFilterFunction(oItem, searchString, true);
					});
				}
			});

		},
		showMessageForSystemInfoMsgStripBasedOnSystemAndSolman: function () {
			var selectedServiceSet = null,
				selectedSessionSet = null;

			if (this.byId("ServiceName-edit").getSelectedItem()) {
				selectedServiceSet = this.byId("ServiceName-edit").getSelectedItem().data("selectedProductSet");
			}
			if (this.byId("SessionName-edit").getSelectedItem()) {
				selectedSessionSet = this.byId("SessionName-edit").getSelectedItem().data("selectedSessionSet");
			}
			var msgTxt = "",
				shallAppendSolmanAtBotton = false;
			if (selectedServiceSet && selectedSessionSet) {
				var isSystemMandatory = false;
				if (selectedSessionSet.SystemRequired === "X" || selectedServiceSet.SystemMandatory) {
					isSystemMandatory = true;
				}

				var isSolmanMandatory = false;
				if (selectedSessionSet.SolmanRequired === "X" || selectedServiceSet.SolmanMandatory) {
					isSolmanMandatory = true;
				}

				if (isSystemMandatory && isSolmanMandatory) {
					shallAppendSolmanAtBotton = true;
					msgTxt = this.getResourceBundle().getText("txtSystemDialogInfo_A");
				} else if (!isSystemMandatory && isSolmanMandatory) {
					shallAppendSolmanAtBotton = true;
					msgTxt = this.getResourceBundle().getText("txtSystemDialogInfo_C");
				} else if (isSystemMandatory && !isSolmanMandatory) {
					msgTxt = this.getResourceBundle().getText("txtSystemDialogInfo_B");
				} else {
					msgTxt = this.getResourceBundle().getText("txtSystemDialogInfo_B");
				}
			} else {
				msgTxt = this.getResourceBundle().getText("txtSystemDialogInfo_D");
			}
			return {
				"msgTxt": msgTxt,
				"shallAppendSolmanAtBotton": shallAppendSolmanAtBotton
			};

		},
		onRelatedPartnerSelection: function (oEvent) {
			if (!oEvent.getSource().getSelectedKey()) {
				this.byId("comboRelatedPartner").setSelectedKey("");
			}
		},
		onChangeDeletionFlag: function(oEvent){
			if (!oEvent.getSource().getSelectedKey()) {
				this.byId("comboFlaggedForDeletion").setSelectedKey("");
			}
		},
		onSystemRoleSelection: function (oEvent) {
			if (!oEvent.getSource().getSelectedKey()) {
				this.byId("comboSystemRole").setSelectedKey("");
			}
		},
		onSystemSearchInDialog: function (oEvent) {
			var customerId = this.byId("idCustomerInput").getValue();
			var instNo = this.byId("idInstallationNumber").getValue();
			var sid = this.byId("idSystemID").getValue();
			var relatedPartner = this.byId("comboRelatedPartner").getSelectedKey();
			var systemRole = this.byId("comboSystemRole").getSelectedKey();
			var deletionFlag = this.byId("comboFlaggedForDeletion").getSelectedKey();
			this.setModel(new JSONModel(), "systemModel");
			var responseShowMessageForSystemInfoMsgStripBasedOnSystemAndSolman = this.showMessageForSystemInfoMsgStripBasedOnSystemAndSolman();
			if (customerId || instNo) {
				this.byId("idMsgStripFilterBarSystemDialog").setVisible(false);
				models.getSystems(this, "/IBaseComponentSet", {
					"Customer": customerId,
					"InstNo": instNo,
					"Sid": sid,
					"relatedPartner": relatedPartner,
					"CarSysRole": systemRole,
					"SessionID": this.getModel("servicerequestModel").getProperty("/SessionID"),
					"DeletionFlag": deletionFlag
				}, "systemModel", "systemTable", responseShowMessageForSystemInfoMsgStripBasedOnSystemAndSolman.shallAppendSolmanAtBotton);
			} else {
				this.byId("idMsgStripFilterBarSystemDialog").setVisible(true);
			}

			this.byId("titleSystemTable").setText(this.getResourceBundle().getText("systemTableHeaderTitle"));
			this.clearAllSystemTableFilters();
		},
		showRelatedPartnerHint: function (oEvent) {
			var oButton = oEvent.getSource();
			var that = this;
			if (!this._RelatedPartnerHintPopover) {
				this._RelatedPartnerHintPopover = Fragment.load({
					id: this.getView().getId(),
					name: "sap.com.servicerequest.servicerequest.fragment.RelatedPartnerPopover",
					controller: this
				}).then(function (oPopover) {
					that.getView().addDependent(oPopover);
					return oPopover;
				});
			}
			this._RelatedPartnerHintPopover.then(function (oPopover) {
				oPopover.openBy(oButton);
			});
		},
		handleServiceResultsReviewPopoverClose: function(){
			this.byId("idServiceResultReviewHintPopover").close();
		},
		pressServiceReviewInfoBtn: function (oEvent) {
			models.pressServiceReviewInfoBtn(this,oEvent);
		},
		pressRDLInfoBtn: function (oEvent) {
			models.pressRDLInfoBtn(this,oEvent);
		},
		handleRDLPopoverClose: function(){
			this.byId("idRDLHintPopover").close();
		},
		showSystemDeletionFlagHint: function (oEvent) {
			var oButton = oEvent.getSource();
			var that = this;
			if (!this._SystemDeletionFlagPopover) {
				this._SystemDeletionFlagPopover = Fragment.load({
					id: this.getView().getId(),
					name: "sap.com.servicerequest.servicerequest.fragment.SystemDeletionFlagPopover",
					controller: this
				}).then(function (oPopover) {
					that.getView().addDependent(oPopover);
					return oPopover;
				});
			}
			this._SystemDeletionFlagPopover.then(function (oPopover) {
				oPopover.openBy(oButton);
			});
		},
		selectedServiceDelDescControl: null,
		pressAddDescriptionBtn: function(oEvent){
			var oButton = oEvent.getSource();
			var that = this;
			this.selectedServiceDelDescControl = null;
			var itemDetails=null;
			if(!oEvent.getSource().getText()){
				this.selectedServiceDelDescControl = oEvent.getSource().getParent().getItems()[0];
				itemDetails = oEvent.getSource().getParent().getParent().getParent().getCells()[0].data("item");
			}else{
				this.selectedServiceDelDescControl = oEvent.getSource().getParent().getItems()[1].getItems()[0];
				itemDetails = oEvent.getSource().getParent().getParent().getCells()[0].data("item");
			}
			if (!this._ServiceDelDetailsPopover) {
				this._ServiceDelDetailsPopover = Fragment.load({
					id: this.getView().getId(),
					name: "sap.com.servicerequest.servicerequest.fragment.ServiceDelTextPopover",
					controller: this
				}).then(function (oPopover) {
					that.getView().addDependent(oPopover);
					if(that.selectedServiceDelDescControl && that.selectedServiceDelDescControl.getText()){
						that.byId("textareaServiceDelDesc").setValue(that.selectedServiceDelDescControl.getText());
					}else{
						that.byId("textareaServiceDelDesc").setValue();
					}
					return oPopover;
				});
			}
			this._ServiceDelDetailsPopover.then(function (oPopover) {
				oPopover.openBy(oButton);
				var popOverTitle = that.getResourceBundle().getText("serviceDeliveryDetails") + " for Item "+ parseInt(itemDetails.ItemNo);
				if(itemDetails.QualificationName){
					popOverTitle += " ("+itemDetails.QualificationName+")";
				}
				that.byId("idServiceDelDetails").setTitle(popOverTitle);
				if(that.selectedServiceDelDescControl && that.selectedServiceDelDescControl.getText()){
					that.byId("textareaServiceDelDesc").setValue(that.selectedServiceDelDescControl.getText());
				}else{
					that.byId("textareaServiceDelDesc").setValue();
				}
			});
			this.sessionTemplateAdjusted = true;
		},
		pressClearBtnServiceDelTextPopover: function(){
			this.byId("textareaServiceDelDesc").setValue("");
		},
		handleServiceDelDetailsCloseBtn: function(oEvent){
			this.byId("idServiceDelDetails").close();
			this.selectedServiceDelDescControl = null;
		},
		handleServiceDelDetailsSaveBtn: function(oEvent){
			this.selectedServiceDelDescControl.setText(this.byId("textareaServiceDelDesc").getValue());
			this.byId("idServiceDelDetails").close();
			this.selectedServiceDelDescControl = null;
		},
		handleRelatedPartnerHintPopoverClose: function (oEvent) {
			this.byId("idRelatedPartnerHintPopover").close();
		},
		handleSystemDeletionFlagPopoverClose: function (oEvent) {
			this.byId("idSystemDeletionFlagHintPopover").close();
		},
		clearAllSystemTableFilters: function () {
			var oTable = this.byId("systemTable");
			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				oTable.filter(aColumns[i], null);
				aColumns[i].setSorted(false);
			}
		},
		resetSystem: function () {
			if (this.byId("idSystemCombo")) {
				this.byId("idSystemCombo").setSelectedKey(null);
			}
			var ContactID = this.getModel("servicerequestModel").getProperty("/ContactID");
			var SurveyRecID = this.getModel("servicerequestModel").getProperty("/SurveyRecID");
			if (ContactID) {
				this.validateCustomerContact();
			}
			if (SurveyRecID) {
				this.validateSurveyRecipient();
			}
			models.intializeCloudRefObjModels(this);
		},
		reloadSystems: function (param) {
			this.setModel(new JSONModel(), "contractSetModel");
			this.setModel(new JSONModel(), "contractItemModel");
			this.resetSystem();
		},
		setSystemSuccess: function () {
			var servicerequestModel = this.getModel("servicerequestModel").getData();
			this.byId("idSystemCombo").setSelectedKey(servicerequestModel.ReferenceSystemID);
		},
		setFocusForCustContact: function () {
			models.setElementScroll(this, "srs_customerContact-input");
		},
		setFocusForSRInfo: function () {
			models.setElementScroll(this, "panelSRInfo");
		},
		setFocusForSurveyRecipient: function () {
			models.setElementScroll(this, "idSurveyRecipient");
		},
		serviceRequestScopeChanged: function (oEvent) {
			this.getModel("serviceRequestScopeModel").setProperty("/isServiceRequestInfoChanged", "true");
		},
		
		setTextAreaGrowing: function (oEvent) {
			models.toggleTextAreaGrowing(this, "sr-req-scope", oEvent);
		},

		setServiceRequestScopeSuccess: function () {
			var serviceRequestModel = this.getModel("serviceRequestScopeModel");
			var text = serviceRequestModel.getData().data[0].Text.trim();
			if (text) {
				this.byId("sr-req-scope").setValue(text);
			} else {
				var userProfile = this.getModel("SRS_Data_UserSet").getData();
				models.setServiceRequestInfoTemplate(userProfile, serviceRequestModel,this);
			}
		},
		onCaseSearch: function () {
			var oView = this.getView();
			var dialog = oView.byId("CaseDialog");
			if (!dialog) {
				// create dialog via fragment factory
				dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.CaseSearch", this);
				oView.addDependent(dialog);
			}
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();
		},
		onCustomerContactSearch: function () {
			var oView = this.getView();
			var dialog = oView.byId("CustomerContactDialog");
			if (!dialog) {
				// create dialog via fragment factory
				dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.CustomerContactSearch", this);
				oView.addDependent(dialog);
			}
			dialog.setTitle(this.getResourceBundle().getText("selectCustomerContact"));
			var title = this.getResourceBundle().getText("selectCustomerContact");
			this.byId("customerContactCounts").setText(title + " (0)");
			this.byId("invisibleTxtForDialogCustomerContact").setText("CC");
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();
			this.byId("idLinkSurveyRecipientHelp").setVisible(false);
			this.onPressCustomerContactSearch();
		},
		onPressCustomerContactSearch: function () {
			this.byId("srs_customerContactTable").setBusyIndicatorDelay(0);
			this.byId("srs_customerContactTable").setBusy(true);

			var sFirstName = this.byId("srs_firstName").getValue();
			var sLastName = this.byId("srs_lastName").getValue();
			var sEmail = this.byId("srs_email").getValue();
			var sCustomerId = this.getModel("servicerequestModel").getData().CustomerID;

			var customerContactModel = new JSONModel({
				caseString: "",
				data: [],
				total: 0,
				page: 0,
				current: 0
			});
			this.setModel(customerContactModel, "customerContactModel");

			var filterArr = [];
			if (sEmail) {
				filterArr.push(models.filterCondition_Contains("EmailAddr", sEmail));
			}

			if (sFirstName) {
				filterArr.push(models.filterCondition_Contains("Firstname", sFirstName));
			}

			if (sLastName) {
				filterArr.push(models.filterCondition_Contains("Lastname", sLastName));
			}

			filterArr.push(models.filterCondition_Equal("HasEmail", true));
			
			var isSelectedServicePrS = false;
			if (this.byId("ServiceName-edit").getSelectedItem()) {
				isSelectedServicePrS = this.byId("ServiceName-edit").getSelectedItem().data("selectedProductSet").PreferredSuccess;
			}

			if (this.byId("invisibleTxtForDialogCustomerContact").getText() === "SR" && !isSelectedServicePrS) {
				filterArr.push(models.filterCondition_Equal("IsSurveyRec", true));
			}
			this.byId("searchBtn").setEnabled(false);
			this.getModel("SRS_Data").read("/CustomerSet(CustomerID='" + sCustomerId + "')/toContacts", {
				filters: [models.filterComparison_AND(filterArr)],
				success: function (oData) {
					var results = oData.results;
					var resultsLength = oData.results.length;
					if (this.soldToCustomerId) {
						this.getModel("SRS_Data").read("/CustomerSet(CustomerID='" + this.soldToCustomerId + "')/toContacts", {
							filters: [models.filterComparison_AND(filterArr)],
							success: function (oData2) {
								results = results.concat(oData2.results);
								resultsLength = resultsLength + oData2.results.length;
								this.getModel("customerContactModel").setProperty("/data", results);
								this.getModel("customerContactModel").setProperty("/total", resultsLength);

								var title = this.getResourceBundle().getText("selectCustomerContact");
								if (this.byId("invisibleTxtForDialogCustomerContact").getText() === "SR") {
									title = this.getResourceBundle().getText("txtSurveyRcpts");
								}
								this.byId("customerContactCounts").setText(title + " (" + resultsLength + ")");

								this.byId("srs_customerContactTable").setBusy(false);
								this.byId("searchBtn").setEnabled(true);
							}.bind(this)
						});
					} else {
						this.getModel("customerContactModel").setProperty("/data", results);
						this.getModel("customerContactModel").setProperty("/total", resultsLength);

						var title = this.getResourceBundle().getText("selectCustomerContact");
						if (this.byId("invisibleTxtForDialogCustomerContact").getText() === "SR") {
							title = this.getResourceBundle().getText("txtSurveyRcpts");
						}
						this.byId("customerContactCounts").setText(title + " (" + resultsLength + ")");

						this.byId("srs_customerContactTable").setBusy(false);
						this.byId("searchBtn").setEnabled(true);
					}

				}.bind(this)
			});

		},
		setTokenForCustomerContact: function (contactId, contactName) {
			this.byId("srs_customerContact-input").setTokens([]);
			this.byId("srs_customerContact-input").addToken(new sap.m.Token({
				key: contactId,
				text: contactName
			}));
			this.getModel("servicerequestModel").setProperty("/ContactID", contactId);
			this.getModel("servicerequestModel").setProperty("/ContactName", contactName);
		},
		deleteTokenForCustomerContact: function () {
			this.byId("srs_customerContact-input").setTokens([]);
			this.getModel("servicerequestModel").setProperty("/ContactID", "");
			this.getModel("servicerequestModel").setProperty("/ContactName", "");
		},
		contactTokenUpdate: function (oEvent) {
			if (oEvent.getParameter('type') === sap.m.Tokenizer.TokenUpdateType.Removed) {
				this.deleteTokenForCustomerContact();
			}
		},
		setTokenForSurveyRecipient: function (SRId, SRName) {
			this.byId("idSurveyRecipient").setTokens([]);
			this.byId("idSurveyRecipient").addToken(new sap.m.Token({
				key: SRId,
				text: SRName
			}));
			this.getModel("servicerequestModel").setProperty("/SurveyRecID", SRId);
			this.getModel("servicerequestModel").setProperty("/SurveyRecName", SRName);
		},
		deleteTokenForSurveyRecipient: function () {
			this.byId("idSurveyRecipient").setTokens([]);
			this.getModel("servicerequestModel").setProperty("/SurveyRecID", "");
			this.getModel("servicerequestModel").setProperty("/SurveyRecName", "");
		},
		surveyRecipientTokenUpdate: function (oEvent) {
			if (oEvent.getParameter('type') === sap.m.Tokenizer.TokenUpdateType.Removed) {
				this.deleteTokenForSurveyRecipient();
			}
		},
		onCloseCustomerContactSearch: function (oEvent) {
			if (oEvent.getSource().getId().indexOf("cancel") === -1) {
				var oSelectedItem = this.byId("srs_customerContactTable").getSelectedItem();
				if (oSelectedItem) {
					var oSelectedCase = oSelectedItem.getBindingContext("customerContactModel").getObject();
					if (this.byId("invisibleTxtForDialogCustomerContact").getText() === "CC") {
						var value = "";
						if (oSelectedCase.Name) {
							value = oSelectedCase.Name;
						} else {
							value = oSelectedCase.Firstname + " " + oSelectedCase.Lastname;
						}
						this.setTokenForCustomerContact(oSelectedCase.ContactID, value);

					} else {
						this.setSurveyRecipient(oSelectedCase);
					}
				} else {
					if (this.byId("invisibleTxtForDialogCustomerContact").getText() === "CC") {
						sap.m.MessageToast.show(this.getResourceBundle().getText("contactEmpty"));
					} else {
						sap.m.MessageToast.show(this.getResourceBundle().getText("txtSREmpty"));
					}
					return;
				}
			}

			this.byId("srs_firstName").setValue();
			this.byId("srs_lastName").setValue();
			this.byId("srs_email").setValue();
			//reset Case Model and more button
			var customerContactModel = new JSONModel({
				caseString: "",
				data: [],
				total: 0,
				page: 0,
				current: 0
			});
			this.setModel(customerContactModel, "customerContactModel");

			this.byId("CustomerContactDialog").close();
		},
		setSurveyRecipient: function (oSelectedCase) {
			var value = "";
			if (oSelectedCase.Name) {
				value = oSelectedCase.Name;
			} else {
				value = oSelectedCase.Firstname + " " + oSelectedCase.Lastname;
			}
			this.setTokenForSurveyRecipient(oSelectedCase.ContactID, value);
			models.onCreateValidate(this);
		},
		handleValid: function (event) {
			var selectedKey = event.getSource().getSelectedKey();
			if (selectedKey) {
				event.getSource().setValueState("None");
				models.onCreateValidate(this);
			} else {
				event.getSource().setValueState("Error");
				models.onCreateValidate(this);
			}
		},
		isEmpty: function (value) {
			if (value === null || value == "") {
				return true;
			} else {
				return false;
			}
		},
		onSurveyRcpySearch: function (oEvent) {
			var oView = this.getView();
			var dialog = oView.byId("CustomerContactDialog");
			if (!dialog) {
				// create dialog via fragment factory
				dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.CustomerContactSearch", this);
				oView.addDependent(dialog);
			}
			dialog.setTitle(this.getResourceBundle().getText("txtSearchSurveyRecipient"));
			this.byId("invisibleTxtForDialogCustomerContact").setText("SR");
			var title = this.getResourceBundle().getText("txtSurveyRcpts");
			this.byId("customerContactCounts").setText(title + " (0)");
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();
			this.byId("idLinkSurveyRecipientHelp").setVisible(true);
			this.onPressCustomerContactSearch();
		},
		onSurveyRcptSwitchChange: function (oEvent) {
			models.onCreateValidate(this);
		},
		showHideContractAndRelatedFieldsBasedOnContractMandatory: function () {
			var selectedService = this.getModel("servicerequestModel").getProperty("/ServiceID");
			if (selectedService) {
				var serviceDropDownItems = this.byId("ServiceName-edit").getItems();
				if (jQuery.isEmptyObject(serviceDropDownItems)) {
					this.getModel("SRS_Data").read("/ProductSet('" + selectedService + "')", {
						groupId: "grpGetServiceByIdEditMode",
						success: function (oData) {
							if (oData) {
								var isContractMandatory = oData.ContractMandatory;
								this.getModel("buttonControlModel").setProperty("/showContractFieldsBasedOnSelectedService", isContractMandatory);
								this.getModel("buttonControlModel").setProperty("/IsPreferredSuccessServiceSelected",oData.PreferredSuccess);
								if (!isContractMandatory) {
									this.resetSRItemDateMinMaxLimit();
								}
							}
						}.bind(this),
						error: function (err) {
							sap.ui.core.BusyIndicator.hide();
							models.showErrorMessage(this, err);
						}.bind(this)
					});
				} else {
					var selectedServiceItem = this.byId("ServiceName-edit").getSelectedItem();
					if (selectedServiceItem) {
						var isContractMandatory = this.byId("ServiceName-edit").getSelectedItem().data("selectedProductSet").ContractMandatory;
						this.getModel("buttonControlModel").setProperty("/showContractFieldsBasedOnSelectedService", isContractMandatory);
						this.getModel("buttonControlModel").setProperty("/IsPreferredSuccessServiceSelected",selectedServiceItem.data("selectedProductSet").PreferredSuccess);
						if (!isContractMandatory) {
							this.resetSRItemDateMinMaxLimit();
						}
					}
				}
			}
		},
		onPressAddTenant: function () {
			var oView = this.getView();
			var dialog = oView.byId("addTenantsDialog");
			//check if the input owner is null, if null set 
			if (!dialog) {
				// create dialog via fragment factory
				dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.AddTenants", this);
				oView.addDependent(dialog);
			}
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();
			this.getAllTenantsByTenantId();
		},
		onCancelTenantPopup: function () {
			this.byId("addTenantsDialog").close();
		},
		getAllTenantsByTenantId: function () {
			this.setModel(new JSONModel(), "tenantModel");
			var tenantId = this.getModel("servicerequestModel").getProperty("/ReferenceProductID");
			this.byId("idSelectTenant").setEnabled(false);
			this.byId("idTenantTable").setBusy(true);
			this.getModel("SRS_Data").read("/RelatedTenantVHSet", {
				filters: [models.filterCondition_Equal("Tenantid", tenantId)],
				groupId: "batchAddTenant",
				success: function (oData) {
					var results = oData.results;
					var CloudReferenceObjectSetModel = this.getModel("CloudReferenceObjectSetModel").getData();
					var arrTenantsAfterRemovingAlreadyAddedTenantsWihtinCloudObjs = [];
					if (CloudReferenceObjectSetModel && CloudReferenceObjectSetModel.objects && CloudReferenceObjectSetModel.objects.length > 0) {
						var objects = CloudReferenceObjectSetModel.objects;
						for (var i = 0; i < results.length; i++) {
							var tenantAlreadyExistWithinCloudObj = false;
							for (var j = 0; j < objects.length; j++) {
								if (results[i].Addtenantid === objects[j].ProductID) {
									tenantAlreadyExistWithinCloudObj = true;
									break;
								}
							}
							if (!tenantAlreadyExistWithinCloudObj) {
								arrTenantsAfterRemovingAlreadyAddedTenantsWihtinCloudObjs.push(results[i]);
							}
						}
					}
					this.getModel("tenantModel").setData(arrTenantsAfterRemovingAlreadyAddedTenantsWihtinCloudObjs);

					this.byId("idTenantTable").setBusy(false);
				}.bind(this),
				error: function (err) {
					models.showErrorMessage(this, err);
				}.bind(this)
			});
		},
		selectedCloudObj: null,
		onPressAddModule: function (oEvent) {
			var ServiceID = this.getModel("servicerequestModel").getProperty("/ServiceID");
			if (!ServiceID) {
				MessageBox.alert("Please select a Service to add Modules", {
					title: "No Service Selected !",
				});
				return;
			}

			this.selectedCloudObj = oEvent.getSource().data("selectedCloudObj");
			var oView = this.getView();
			var dialog = oView.byId("addModuleDialog");
			//check if the input owner is null, if null set 
			if (!dialog) {
				// create dialog via fragment factory
				dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.AddModule", this);
				oView.addDependent(dialog);
			}
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();
			this.getAllModules();
		},
		getAllModules: function () {
			this.setModel(new JSONModel(), "moduleModel");
			this.byId("idSelectModule").setEnabled(false);
			var ServiceID = this.getModel("servicerequestModel").getProperty("/ServiceID");
			this.byId("idModuleTable").setBusy(true);
			this.getModel("SRS_Data").read("/CloudModuleVHSet", {
				filters: [models.filterComparison_AND([models.filterCondition_Equal("Tenantid", this.selectedCloudObj.ProductID), models.filterCondition_Equal(
					"Serviceproductid", ServiceID)])],
				groupId: "batchAddModule",
				success: function (oData) {
					var results = oData.results;
					//results = this.removeDuplicateModules(results);
					var CloudReferenceObjectSetModel = this.getModel("CloudReferenceObjectSetModel").getData();

					var arrModulesAfterRemovingAlreadyAddedModulesWihtinCloudObjs = [];
					if (CloudReferenceObjectSetModel && CloudReferenceObjectSetModel.objects && CloudReferenceObjectSetModel.objects.length > 0) {
						var objects = CloudReferenceObjectSetModel.objects;
						for (var i = 0; i < results.length; i++) {
							var moduleAlreadyExistWithinCloudObj = false;
							for (var j = 0; j < objects.length; j++) {
								if (this.selectedCloudObj.IbComponent === objects[j].IbComponent) {

									if (objects[j].objects && objects[j].objects.length > 0) {
										for (var k = 0; k < objects[j].objects.length; k++) {
											if (objects[j].objects[k].ProductID === results[i].Ppmspvproductid) {
												moduleAlreadyExistWithinCloudObj = true;
												break;
											}
										}
									}
									if (moduleAlreadyExistWithinCloudObj) {
										break;
									}

								}
							}
							if (!moduleAlreadyExistWithinCloudObj) {
								arrModulesAfterRemovingAlreadyAddedModulesWihtinCloudObjs.push(results[i]);
							}
						}
					}

					this.getModel("moduleModel").setData(arrModulesAfterRemovingAlreadyAddedModulesWihtinCloudObjs);

					this.byId("idModuleTable").setBusy(false);
				}.bind(this),
				error: function (err) {
					models.showErrorMessage(this, err);
				}.bind(this)
			});
		},
		removeDuplicateModules: function (arr) {
			var filteredArray = [];
			var doesModuleExist = false;
			for (var i = 0; i < arr.length; i++) {
				doesModuleExist = false;
				if (filteredArray.length === 0) {
					filteredArray.push(arr[i]);
				} else {
					for (var j = 0; j < filteredArray.length; j++) {
						if (filteredArray[j].Ppmsproductid === arr[i].Ppmsproductid && filteredArray[j].Ppmspvproductid === arr[i].Ppmspvproductid) {
							doesModuleExist = true;
							break;
						}
					}
					if (!doesModuleExist) {
						filteredArray.push(arr[i]);
					}
				}
			}
			return filteredArray;
		},
		onCancelModulePopup: function () {
			this.byId("addModuleDialog").close();
		},
		onSelectTenant: function (oEvent) {
			var selectedItems = this.byId("idTenantTable").getSelectedItems();
			var CloudReferenceObjectSetModel = this.getModel("CloudReferenceObjectSetModel").getData();
			var RawCloudReferenceObjectSetModel = this.getModel("RawCloudReferenceObjectSetModel").getData();
			var ServiceRequestId = this.getModel("servicerequestModel").getProperty("/ServiceRequestID");
			var TenantsCreationModel = this.getModel("TenantsCreationModel").getData();
			var TenantsDeletionModel = this.getModel("TenantsDeletionModel").getData();
			for (var i = 0; i < selectedItems.length; i++) {
				var selectedTenant = selectedItems[i].getCells()[0].data("selectedTenant");
				//check if selectedTenant already has GuidObject and added to TenantsDeletionModel
				var selectedTenantExistinDeletionModel = false;
				for (var m = 0; m < TenantsDeletionModel.length; m++) {
					if (TenantsDeletionModel[m].IbComponent === selectedTenant.SystemNumber) {
						selectedTenantExistinDeletionModel = true;
						TenantsDeletionModel.splice(m, 1);
						break;
					}
				}
				var selectedTenantExistInBackend = false;
				var CloudRefObj;
				//check if selected Tenant already exist in the backend
				for (var h = 0; h < RawCloudReferenceObjectSetModel.length; h++) {
					if (RawCloudReferenceObjectSetModel[h].IbComponent === selectedTenant.SystemNumber) {
						selectedTenantExistInBackend = true;
						CloudRefObj = RawCloudReferenceObjectSetModel[h];
						if(CloudRefObj.objects){
							CloudRefObj.objects=[];
						}
						break;
					}
				}

				if (!selectedTenantExistinDeletionModel && !selectedTenantExistInBackend) {
					var createdTenant = {
						"ObjectID": ServiceRequestId,
						"IbComponent": selectedTenant.SystemNumber
					};
					TenantsCreationModel.push(createdTenant);
				}

				if (!selectedTenantExistInBackend) {
					CloudRefObj = {
						"GuidObject": "",
						"ProductText": selectedTenant.Addtenantdescription,
						"ObjectID": ServiceRequestId,
						"RefGuid": "",
						"ComponentText": "",
						"IbaseText": "",
						"IbComponent": selectedTenant.SystemNumber,
						"CarSystemRole": selectedTenant.CarRole,
						"Ibase": selectedTenant.Ibase,
						"CarSystemRoleT": selectedTenant.CarRoleT,
						"ParentComponent": "0",
						"ZzsDescr1": "",
						"ProductID": selectedTenant.Addtenantid,
						"ZzsDescr2": "",
						"MainObject": "",
						"ZzsDescr3": "",
						"ZzsDescr4": "",
						"ZzsDescr5": ""
					};
				}

				CloudReferenceObjectSetModel.objects.push(CloudRefObj);
				//models.rowCountCloudRefObjectoData++;
				this.getModel("CloudReferenceObjectSetModel").setData(CloudReferenceObjectSetModel);
			}
			this.getModel("TenantsCreationModel").setData(TenantsCreationModel);
			this.byId("addTenantsDialog").close();
			models.hideEmpltyRowsOnTenantAndModuleCreation(CloudReferenceObjectSetModel, this);
		},
		onSelectModule: function (oEvent) {
			this.getModel("buttonControlModel").setProperty("/isShowMoreCloudRefObjVisible", true);
			var selectedItems = this.byId("idModuleTable").getSelectedItems();
			var ModulesCreationModel = this.getModel("ModulesCreationModel").getData();
			var ServiceRequestId = this.getModel("servicerequestModel").getProperty("/ServiceRequestID");
			var RawCloudReferenceObjectSetModel = this.getModel("RawCloudReferenceObjectSetModel").getData();
			var CloudReferenceObjectSetModel = this.getModel("CloudReferenceObjectSetModel").getData();
			var tenantObjects = CloudReferenceObjectSetModel.objects;
			var parentId = this.selectedCloudObj.IbComponent;
			var ModuleDeletionModel = this.getModel("ModulesDeletionModel").getData();
			for (var i = 0; i < selectedItems.length; i++) {
				var selectedModule = selectedItems[i].getCells()[0].data("selectedModule");

				//check if selectedTenant already has GuidObject and added to TenantsDeletionModel
				var selectedModuleExistinDeletionModel = false;
				for (var m = 0; m < ModuleDeletionModel.length; m++) {
					if (ModuleDeletionModel[m].ProductID === selectedModule.Ppmspvproductid && ModuleDeletionModel[m].ParentComponent === parentId) {
						selectedModuleExistinDeletionModel = true;
						ModuleDeletionModel.splice(m, 1);
						break;
					}
				}

				var selectedModuleExistInBackend = false;
				var CloudRefObj;
				//check if selected Tenant already exist in the backend
				for (var h = 0; h < RawCloudReferenceObjectSetModel.length; h++) {
					if (RawCloudReferenceObjectSetModel[h].ProductID === selectedModule.Ppmspvproductid && RawCloudReferenceObjectSetModel[h].ParentComponent === parentId) {
						selectedModuleExistInBackend = true;
						CloudRefObj = RawCloudReferenceObjectSetModel[h];
						break;
					}
				}

				if (!selectedModuleExistinDeletionModel && !selectedModuleExistInBackend) {
					var createdModule = {
						"ObjectID": ServiceRequestId,
						"ProductID": selectedModule.Ppmspvproductid,
						"ParentComponent": parentId
					};
					ModulesCreationModel.push(createdModule);
					//models.rowCountCloudRefObjectoData++;
				}

				if (!selectedModuleExistInBackend) {
					CloudRefObj = {
						"GuidObject": "",
						"ProductText": selectedModule.Ppmsproductname,
						"ObjectID": ServiceRequestId,
						"RefGuid": "",
						"ComponentText": "",
						"IbaseText": "",
						"IbComponent": "",
						"CarSystemRole": "",
						"Ibase": "",
						"CarSystemRoleT": "",
						"ParentComponent": parentId,
						"ZzsDescr1": "",
						"ProductID": selectedModule.Ppmspvproductid,
						"ZzsDescr2": "",
						"MainObject": "",
						"ZzsDescr3": "",
						"ZzsDescr4": "",
						"ZzsDescr5": ""
					};
				}

				for (var j = 0; j < tenantObjects.length; j++) {
					if (parentId === tenantObjects[j].IbComponent) {
						if (!Array.isArray(tenantObjects[j].objects)) {
							tenantObjects[j].objects = [];
						}
						tenantObjects[j].objects.push(CloudRefObj);
					}

				}

			}
			this.getModel("ModulesCreationModel").setData(ModulesCreationModel);
			this.getModel("CloudReferenceObjectSetModel").setData({
				"objects": tenantObjects
			});
			this.byId("addModuleDialog").close();
			models.hideEmpltyRowsOnTenantAndModuleCreation(CloudReferenceObjectSetModel, this);
		},
		pressShowMoreCloudRefObjBtn: function (oEvent) {
			this.byId("panelCloudRefObjEdit").setExpanded(true);
			models.showHideMaxRowsForCloudRefObjs(this.byId("idTreeTableCloudRefEdit"), this.byId("ShowMoreCloudRefObjEdit"), this);
		},
		onPressDeleteTenatAndModule: function (oEvent) {
			var selectedObject = oEvent.getSource().data("selectedCloudObj");
			var txtDeleltionMsg = "";
			if (selectedObject.ProductID.includes("S_0")) {
				txtDeleltionMsg = "Tenant " + selectedObject.ProductID.split("S_0")[1];
			}
			if (selectedObject.ParentComponent !== "0") {
				txtDeleltionMsg = "Module " + selectedObject.ProductID;
			}
			var context = this;

			if (this.shiftkeyPressed) {
				this.deleteTenantsOrModule(selectedObject);
			} else {
				MessageBox.confirm("Are you sure you want to delete the " + txtDeleltionMsg + ".\n\n" + this.getResourceBundle().getText(
					"txtShiftDeleteTxt"), {
					actions: ["Yes", "No"],
					onClose: function (sAction) {
						if (sAction.toUpperCase() === "YES") {
							context.deleteTenantsOrModule(selectedObject);
						}
					}
				});
			}
		},
		onCloudRefObjectInfoButton: function (oEvent) {
			models.showCloudRefObjInfo(oEvent, this);
		},
		deleteTenantsOrModule: function (selectedObject) {
			var CloudReferenceObjectSetModel = this.getModel("CloudReferenceObjectSetModel").getData();
			var objects = CloudReferenceObjectSetModel.objects;
			var arrDeletedTenants = this.getModel("TenantsDeletionModel").getData();
			var arrDeletedModules = this.getModel("ModulesDeletionModel").getData();
			var arrTenantsCreationModel = this.getModel("TenantsCreationModel").getData();
			var arrModulesCreationModel = this.getModel("ModulesCreationModel").getData();
			
			var doesAnyModuleExist = false;
			//remove selected object from cloud reference objects tree
			for (var i = 0; i < objects.length; i++) {

				//remove tenant and its modules
				if (objects[i].ProductID === selectedObject.ProductID) {

					if (objects[i].objects) {
						for (var k = 0; k < objects[i].objects.length; k++) {
							//	models.rowCountCloudRefObjectoData--;

							for (var n = 0; n < arrModulesCreationModel.length; n++) {
								if (objects[i].objects[k].ProductID === arrModulesCreationModel[n].ProductID) {
									arrModulesCreationModel.splice(n, 1);
									break;
								}
							}
							
							if (objects[i].objects[k].GuidObject) {
								arrDeletedModules.push(objects[i].objects[k]);
							}
						}
					}

					if (selectedObject.GuidObject) {
						arrDeletedTenants.push(selectedObject);
					}
				
					objects.splice(i, 1);

					for (var m = 0; m < arrTenantsCreationModel.length; m++) {
						if (selectedObject.IbComponent === arrTenantsCreationModel[m].IbComponent) {
							arrTenantsCreationModel.splice(m, 1);
							break;
						}
					}

					//	models.rowCountCloudRefObjectoData--;
					break;
				}

				//remove module
				if (selectedObject.ParentComponent === objects[i].IbComponent) {
					var modules = objects[i].objects;
					for (var j = 0; j < modules.length; j++) {
						if (modules[j].ProductID === selectedObject.ProductID) {
							if (selectedObject.GuidObject) {
								arrDeletedModules.push(selectedObject);
							}
							modules.splice(j, 1);

							for (var n = 0; n < arrModulesCreationModel.length; n++) {
								if (selectedObject.ProductID === arrModulesCreationModel[n].ProductID) {
									arrModulesCreationModel.splice(n, 1);
									break;
								}
							}

							break;
						}
					}
					objects[i].objects = modules;
					//	models.rowCountCloudRefObjectoData--;
					break;
				}
			}
			this.getModel("CloudReferenceObjectSetModel").setData({
				"objects": objects
			});
			CloudReferenceObjectSetModel = this.getModel("CloudReferenceObjectSetModel").getData();
			for (var j = 0; j < CloudReferenceObjectSetModel.objects.length; j++) {
				if(CloudReferenceObjectSetModel.objects[j].objects && CloudReferenceObjectSetModel.objects[j].objects.length>0){
					doesAnyModuleExist = true;
					break;
				}
			}
			this.getModel("buttonControlModel").setProperty("/isShowMoreCloudRefObjVisible", doesAnyModuleExist);
			
			if (arrDeletedTenants.length > 0) {
				this.getModel("TenantsDeletionModel").setData(arrDeletedTenants);
			}
			if (arrDeletedModules.length > 0) {
				this.getModel("ModulesDeletionModel").setData(arrDeletedModules);
			}
			this.deleteEmptyRowsOnModuleAndTenantDeletion();
			
		},
		deleteEmptyRowsOnModuleAndTenantDeletion: function (oEvent) {
			var currentVisibleRowCount = this.getModel("buttonControlModel").getProperty("/visibleRowCount");
			var bindingLength = this.byId("idTreeTableCloudRefEdit").getBinding().getLength();
			this.getModel("buttonControlModel").setProperty("/visibleRowCount", bindingLength);
			/*
			if(bindingLength<currentVisibleRowCount){
				this.getModel("buttonControlModel").setProperty("/visibleRowCount",bindingLength);
			}*/
		},
		selectTenantRow: function () {
			var items = this.byId("idTenantTable").getSelectedItems();
			if (items.length > 0) {
				this.byId("idSelectTenant").setEnabled(true);
			} else {
				this.byId("idSelectTenant").setEnabled(false);
			}
		},
		selectModuleRow: function () {
			var items = this.byId("idModuleTable").getSelectedItems();
			if (items.length > 0) {
				this.byId("idSelectModule").setEnabled(true);
			} else {
				this.byId("idSelectModule").setEnabled(false);
			}
		},
		toggleOpenStateForCROTreeTable: function (oEvent) {
			models.toggleOpenStateForCROTreeTable(oEvent, this);
		},
		deleteAllTenantAndModules: function(){
			var CloudReferenceObjectSetModel = this.getModel("CloudReferenceObjectSetModel").getData();
			if(CloudReferenceObjectSetModel && CloudReferenceObjectSetModel.objects){
				for(var i=0;i<CloudReferenceObjectSetModel.objects.length;i++){
					if(CloudReferenceObjectSetModel.objects[i].MainObject==="X"){
						this.deleteTenantsOrModule(CloudReferenceObjectSetModel.objects[i]);
						break;
					}
				}
			}
		},
		pressSystemHint: function(oEvent){
			var oButton = oEvent.getSource();
			var that = this;
			if (!this._SystemHintPopover) {
				this._SystemHintPopover = Fragment.load({
					id: this.getView().getId(),
					name: "sap.com.servicerequest.servicerequest.fragment.SystemHintPopover",
					controller: this
				}).then(function (oPopover) {
					that.getView().addDependent(oPopover);
					return oPopover;
				});
			}
			this._SystemHintPopover.then(function (oPopover) {
				var htmlcontent = '<div style="margin: 10px !important; font-size: 14px !important;">In order to delete System entries from Value Help, please <a href="'+models.launchHEP(that)+'" target="_blank">open Case</a> in Holistic Engagement Planner(HEP) application and go to "Solution Scope" tab. <br/><strong>Note:</strong> Refresh Service Request in the browser to re-load System entries in Value Help after their deletion from HEP application.</div>';
				that.byId("idSystemHintHTML").setContent(htmlcontent);
				oPopover.openBy(oButton);
			});
		},
		handleSystemHintPopoverClose: function(oEvent){
			this.byId("idSystemHintPopover").close();	
		},
		pressServiceDelDetailsInfoBtn: function(oEvent){
			models.showServiceDelDetailsPopover(oEvent,this);
		},
		handleServiceDelDetailsInfoPopoverClose: function(oEvent){
			models.closeServiceDelDetailsInfoPopover(this,"idServiceDelDetailsInfoPopover");
		},
		selectedQualificationControl: null,
		pressShowFavQualifications: function(oEvent){
			this.selectedQualificationControl = null;
			var oView = this.getView();
			var dialog = oView.byId("showFavQualDialog");
			if (!dialog) {
				// create dialog via fragment factory
				dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.FavQualificationsDialog", this);
				oView.addDependent(dialog);
			}
			this.selectedQualificationControl = oEvent.getSource().getParent().getItems()[0];
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();
		},
		onSearchQual: function(oEvent){
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("QualificationName", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var oList = this.byId("idListFavQualification");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		},
		onCancelFavQualDialog: function(){
			this.byId("showFavQualDialog").close();
		},
		pressFavQualItem: function(oEvent){
			if(this.selectedQualificationControl){
				this.selectedQualificationControl.setSelectedKey(oEvent.getSource().data("QualifiactionID"));
			}
			this.byId("showFavQualDialog").close();
		},
		/*
		pressImmediateSOInfoBtn: function(oEvent){
			models.showImmediateSOInfoPopover(this,oEvent);
		},
		handleImmediateSOInfoPopoverClose: function(){
			this.byId("idImmediateSOInfoPopover").close();
		},*/
		onDropSelectedProductsTable: function(oEvent){

			var SRTableItems = this.byId("idProductsTable-edit").getItems();
			var anyItemDeledt = false;
			for(var i=0;i<SRTableItems.length;i++){
				if(SRTableItems[i].getCells()[0].getItems()[0].data("isDeleted")==="true"){
					anyItemDeledt = true;
					break;
				}
			}
			
			if(anyItemDeledt){
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information("Looks like one or few items are deleted. Items cannot be re-arranged until deletion has been saved.\nPlease save the Service Request before re-arranging the items.",{
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				})
				return;
			}
			var oDraggedItem = oEvent.getParameter("draggedControl");
			var oDraggedItemContext = oDraggedItem.getBindingContext("servicerequestItemsModel");
			var draggedItemDetails,droppedItemDetails, droppedItemIndex, draggedItemIndex;
			if (!oDraggedItemContext) {
				return;
			}else{
				draggedItemDetails = oDraggedItemContext.getProperty();
				if(draggedItemDetails.ItemNo === models.SR_ITEM_10 || draggedItemDetails.ItemNo === models.SR_ITEM_20){
					MessageToast.show(this.getResourceBundle().getText("txtMessageAdjustOrder"));
					return;
				}
				draggedItemDetails = JSON.parse(JSON.stringify(draggedItemDetails));
				draggedItemIndex = parseInt(oDraggedItem.getBindingContext("servicerequestItemsModel").getPath().split("/")[1])
			}

			var oDroppedItem = oEvent.getParameter("droppedControl");
			var oDroppedItemContext = oDroppedItem.getBindingContext("servicerequestItemsModel");

			if (!oDroppedItemContext) {
				return;
			}else{
				droppedItemDetails = oDroppedItemContext.getProperty();
				if(droppedItemDetails.ItemNo === models.SR_ITEM_10 || droppedItemDetails.ItemNo === models.SR_ITEM_20){
					MessageToast.show(this.getResourceBundle().getText("txtMessageAdjustOrder"));
					return;
				}
				droppedItemDetails = JSON.parse(JSON.stringify(droppedItemDetails));
				droppedItemIndex = parseInt(oDroppedItem.getBindingContext("servicerequestItemsModel").getPath().split("/")[1])
			}

			var droppedPosition = oEvent.getParameter("dropPosition");

			var SRItems = this.getModel("servicerequestItemsModel").getData();
			
			if(droppedPosition.toUpperCase() === "BEFORE"){
				if(droppedItemIndex>draggedItemIndex){
					droppedItemIndex = droppedItemIndex - 1;
				}
				this.arraymove(SRItems, draggedItemIndex, droppedItemIndex);
			}else{
				if(draggedItemIndex>droppedItemIndex){
					droppedItemIndex = droppedItemIndex+1;
				}
				this.arraymove(SRItems, draggedItemIndex, droppedItemIndex);
			}
			
			var initialCount = 20;
			for(var i=2;i<SRItems.length;i++){
				initialCount = initialCount+10;
				SRItems[i].ItemNo = initialCount.toString();
			}

			this.getModel("servicerequestItemsModel").setData(SRItems);
		},

		arraymove: function(arr, fromIndex, toIndex) {
			var element = arr[fromIndex];
			arr.splice(fromIndex, 1);
			arr.splice(toIndex, 0, element);
		},

		pressComponentInCatalogIcon: function(){
			var URLHelper = MobileLibrary.URLHelper;
			URLHelper.redirect(models.setSessionHREF(models.existingSession), true);
		},
		showSignavioInstructionsMsg: function(sessionId){
			this.getModel("buttonControlModel").setProperty("/showSignavioInstructionsMsgStrip",false);
			const signavioSessions=["9505485","9503971","9504001","9500183","9504132","9500184"];
			var doesSignavioSessionExist = false;
			for(var i=0;i<signavioSessions.length;i++){
				if(sessionId === signavioSessions[i]){
					doesSignavioSessionExist = true;
					models.getCustomerDetailsForSignavio(this);
					break;
				}
			}
			return doesSignavioSessionExist;
		},
		onValueDriverComboChange: function(oEvent){
			var selectedItems = oEvent.getSource().getSelectedItems();
			if(selectedItems.length>3){
				oEvent.getSource().removeSelectedItem(oEvent.getParameters().changedItem);
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information("Please select not more than three Value Drivers.",{
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				});
				return;
			}

			if(selectedItems.length>0){
				oEvent.getSource().setValueState("None");
			}else{
				oEvent.getSource().setValueState("Warning");
			}
			models.onCreateValidate(this);
		},
		createValueDriversForSelectedComponent: function(context, guid, isTriggeredFromCreateSR,serviceRequestModel,showBusyDialog,isTriggeredFromSaveSR){
			var oEventBus = sap.ui.getCore().getEventBus();
			var oModel = context.getModel("SRS_Data");
			var aDeferredGroup = oModel.getDeferredGroups();
			aDeferredGroup.push("batchCreateValueDriver");
			oModel.setDeferredGroups(aDeferredGroup);
			context.isBatchExecutedForValueDriver = true;
			
			var mParameters = {
				groupId: "batchCreateValueDriver",
				success: function (data) {
					if (context.isBatchExecutedForValueDriver && data && data.__batchResponses && data.__batchResponses.length > 0) {
						context.isBatchExecutedForValueDriver = false;
						if(isTriggeredFromCreateSR){
							context.onCreateItemsSuccess(serviceRequestModel, context, models.STRING_SUCCESS);
						}
						if(isTriggeredFromSaveSR){
							if (serviceRequestModel.StatusCode !== models.STATUS_NEW) {
								models.getSRHeaderByID(context, serviceRequestModel.ServiceRequestID, oEventBus);
							} else {
								oEventBus.publish("onSaveServiceRequest", "onSaveServiceRequestSuccess");
							}
						}
					}
				},
				error: function (err) {
					if (context.isBatchExecutedForValueDriver) {
						context.isBatchExecutedForValueDriver = false;
						models.showErrorMessage(context, err);
						if(isTriggeredFromCreateSR){
							context.onCreateItemsSuccess(serviceRequestModel, context, models.STRING_SUCCESS);
						}
						if(isTriggeredFromSaveSR){
							if (serviceRequestModel.StatusCode !== models.STATUS_NEW) {
								models.getSRHeaderByID(context, serviceRequestModel.ServiceRequestID, oEventBus);
							} else {
								oEventBus.publish("onSaveServiceRequest", "onSaveServiceRequestSuccess");
							}
						}
					}
					
				}
			};
			var selectedValueDriverRawModel = this.getModel("selectedValueDriverRawModel").getData();
			var selectedValueDriver = this.byId("idMultiComboValueDriver").getSelectedItems();
			var deletedValueDriver = [];
			var createValueDriverModel = [];
			
			for(var rawSelectedVD of selectedValueDriverRawModel){
				var doesSelectedExistInRaw = false;
				for(var valueDriver of selectedValueDriver){
					var svd = valueDriver.data("selectedValueDriver");
					if(rawSelectedVD.ValueDriverKey === svd["Value Driver"] && rawSelectedVD.ItemGuid === guid){
						doesSelectedExistInRaw = true;
						break;
					}
				}
				if(!doesSelectedExistInRaw){
					deletedValueDriver.push(rawSelectedVD);
				}
			}

			for(var valueDriver of selectedValueDriver){
				var svd = valueDriver.data("selectedValueDriver");
				var doesSelectedVDExistInRaw = false;
				for(var rawSelectedVD of selectedValueDriverRawModel){
					if(rawSelectedVD.ValueDriverKey === svd["Value Driver"] && rawSelectedVD.ItemGuid === guid){
						doesSelectedVDExistInRaw = true;
						break;
					}
				}
				if(!doesSelectedVDExistInRaw){
					createValueDriverModel.push(svd["Value Driver"]);
				}
			}

			var doesAnyObjectExistForCreateOrDelete = false;

			for(var valueDriver of deletedValueDriver){
				if(valueDriver.ItemGuid && valueDriver.ItemGuid === guid){
					oModel.remove("/ValueDriverSet(ItemGuid=guid'"+valueDriver.ItemGuid+"',ValueDriverKey='"+valueDriver.ValueDriverKey+"')", mParameters);
					doesAnyObjectExistForCreateOrDelete = true;
				}
			}
			
			if(guid){
				for(var valueDriverKey of createValueDriverModel){
					var payload = {
						"ItemGuid":guid,
						"ValueDriverKey":valueDriverKey
					};
					oModel.create("/ValueDriverSet", payload, mParameters);
					doesAnyObjectExistForCreateOrDelete = true;
				}
			}
			oModel.submitChanges(mParameters);
			
			if(!doesAnyObjectExistForCreateOrDelete){
				if(isTriggeredFromSaveSR){
					if (serviceRequestModel.StatusCode !== models.STATUS_NEW) {
						models.getSRHeaderByID(context, serviceRequestModel.ServiceRequestID, oEventBus);
					} else {
						oEventBus.publish("onSaveServiceRequest", "onSaveServiceRequestSuccess");
					}
				}
				if(isTriggeredFromCreateSR){
					context.onCreateItemsSuccess(serviceRequestModel, context, models.STRING_SUCCESS);
				}
			}
		},
		getValueDriversBySessionId: function(context,sessionId,doesShowBusyDialog,isSessionModified){
			var isPrS = this.getModel("buttonControlModel").getProperty("/IsPreferredSuccessServiceSelected");
			context.setModel(new JSONModel([]),"valueDriverModel");
			if(isSessionModified){
				context.byId("idMultiComboValueDriver").removeAllSelectedItems();
				this.setModel(new JSONModel([]),"selectedValueDriverModel");
			}
			var srItems = context.getModel("servicerequestItemsModel").getData();
			var item20Guid = "";
			for(var item of srItems){
				if(item.ItemNo === models.SR_ITEM_20){
					item20Guid = item.ItemGUID;
				}
			}
			if(isPrS){
				var hostURL = context.getModel("SRS_Data").sServiceUrl;
				var valueDriverModel = new JSONModel(hostURL + "/ValueHelpSet()?$filter=( Entity eq 'VALUE_DRIVER' and ProductID eq '"+sessionId+"' )");
				context.byId("idMultiComboValueDriver").setSelectedKeys([]);
				if(sessionId){

					//removing all existing selected Value drivers if session is switched
					var busyDialog = null;
					if(doesShowBusyDialog){
						var busyDialog = models.createBusyDialog("Loading Value Drivers...");
						busyDialog.open();
					}
					valueDriverModel.attachRequestCompleted(function (resp) {
						if(busyDialog){
							busyDialog.close();
						}
						context.byId("idMultiComboValueDriver").setBusy(false);
						if (resp.getParameters("success").success) {
							if(valueDriverModel.getData().d.results.length>0){
								var results = JSON.parse(valueDriverModel.getData().d.results[0].Results);
								if(results.length>0){
									context.byId("idFormValueDriver").setVisible(true);
								}else{
									context.byId("idFormValueDriver").setVisible(false);
								}
								context.setModel(new JSONModel(results),"valueDriverModel");
								var selectedValueDriverRawModel = context.getModel("selectedValueDriverModel").getData();
								var selectedKeyArr = [];
								if(selectedValueDriverRawModel.length>0){
									for(var valueDriver of selectedValueDriverRawModel){
										selectedKeyArr.push(valueDriver.ValueDriverKey);
									}
									context.byId("idMultiComboValueDriver").setSelectedKeys(selectedKeyArr);
								}else if(!isSessionModified && doesShowBusyDialog){
									if(item20Guid){
										context.getSelectedValueDriversForComponent(context,item20Guid);
									}
								}
								if(results.length===1){
									var selectedKey = results[0]["Value Driver"];
									context.byId("idMultiComboValueDriver").setSelectedKeys([selectedKey]);
									context.byId("idMultiComboValueDriver").setValueState("None");
									context.getModel("buttonControlModel").setProperty("/valueDriverDropdowneditable",false);
								}else{
									context.getModel("buttonControlModel").setProperty("/valueDriverDropdowneditable",true);
								}

							}else{
								context.byId("idFormValueDriver").setVisible(false);
							}
							models.applyBrowserAutoFillOff();
						} else {
							if(busyDialog){
								busyDialog.close();
							}
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
							models.showErrorMessage(context, resp.getParameters().errorobject);
							//Apply Auto filter off for Google Chrome
							models.applyBrowserAutoFillOff();
						}
						models.onCreateValidate(context);
					});
				}
			}else{
				context.byId("idFormValueDriver").setVisible(false);
				this.byId("idMultiComboValueDriver").setBusy(false);
			}
		},
		getSelectedValueDriversForComponent: function(context,guid){
			var hostURL = context.getModel("SRS_Data").sServiceUrl;
			var selectedValueDriverModel = new JSONModel(hostURL + "/ServiceRequestItemSet(guid'"+guid+"')/toValueDrivers");
			context.setModel(new JSONModel([]),"selectedValueDriverRawModel");
			context.setModel(new JSONModel([]),"selectedValueDriverModel");
			selectedValueDriverModel.attachRequestCompleted(function (resp) {
				if (resp.getParameters("success").success) {
					var results = selectedValueDriverModel.getData().d.results;
					if(results.length>0){
						context.setModel(new JSONModel(deepClone(results)),"selectedValueDriverModel");
						context.setModel(new JSONModel(deepClone(results)),"selectedValueDriverRawModel");
						var selectedKeys = [];
						for(var i=0;i<results.length;i++){
							selectedKeys.push(results[i].ValueDriverKey);
						}
						context.byId("idMultiComboValueDriver").setSelectedKeys(selectedKeys);
					}else{
						context.byId("idMultiComboValueDriver").setValueState("Warning");
					}
					models.applyBrowserAutoFillOff();
				} else {
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					models.showErrorMessage(context, resp.getParameters().errorobject);
					//Apply Auto filter off for Google Chrome
					models.applyBrowserAutoFillOff();
				}
			});
		},
		pressFindContractBtn: function(){
			var URLHelper = MobileLibrary.URLHelper;
			URLHelper.redirect("https://sap.sharepoint.com/teams/SRSApp/HELP%20Cannot%20use%20my%20Contract/Home.aspx", true);
		},
		SRInfoBtnOnPress: function(oEvent){
			models.showSRInfoPopover(oEvent,this);
		},
		agreedScopeBtnOnPress: function(oEvent){
			models.showAgreedScopePopover(oEvent,this);
		}	
	});
}, true);
