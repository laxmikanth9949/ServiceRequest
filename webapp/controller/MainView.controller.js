sap.ui.define([
	"sap/com/servicerequest/servicerequest/controller/BaseController",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/m/SearchField",
	"sap/ui/model/Filter",
	"sap/com/servicerequest/servicerequest/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/TablePersoController",
	"sap/com/servicerequest/servicerequest/model/SRPersoService",
	"sapit/controls/EmployeeDataSearchDialog",
	"sap/ui/model/FilterOperator",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Button",
	"sap/ui/export/Spreadsheet",
	"sap/com/servicerequest/servicerequest/model/models",
	"sap/ui/core/Fragment",
	'sap/m/DynamicDateUtil'
], function (BaseController, ODataModel, ResourceModel, SearchField, Filter, formatter, JSONModel, MessageBox, TablePersoController,
	SRPersoService, EmployeeDataSearchDialog, FilterOperator, Dialog, Text, Button, Spreadsheet, models, Fragment, DynamicDateUtil) {
	"use strict";

	return BaseController.extend("sap/com/servicerequest/servicerequest/controller/MainView", {
		formatter: formatter,
		_smartFilterBar: null,
		defaultSelectedKey: '*standard*',
		inputTypeForUserControl: "",
		isBatchExecutedForVariant: true,
		onInit: function () {
			sap.ui.core.BusyIndicator.show();
			this.UserSetAPIIntegration();
			this.initModel();
			this.setComboBoxContainsFilterMain();

			this._oTPC = new TablePersoController({
				table: this.byId("servicerequestTable"),
				//specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
				componentName: "SRTable",
				persoService: SRPersoService
			}).activate();

			var context = this;
			this._oTPC.attachPersonalizationsDone(function () {
				context.modifySavedVariant();
			});

			this.getOwnerComponent().getService("ShellUIService").then(function (oShellService) {
				oShellService.setBackNavigation(function () {
					var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
					// Navigate back to FLP home
					oCrossAppNavigator.toExternal({
						target: {
							shellHash: "#"
						}
					});
					//either do nothing to disable it, or add your own back nav logic
				});
			});
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("RouteMainView").attachPatternMatched(this._onReloadView, this);

			//create Sort Data
			var i18n = this.getResourceBundle();
			var sortItemsList = {
				sortDescending: false,
				items: [{
					text: i18n.getText("servicerequestID"),
					key: "ServiceRequestID",
					selected: false
				}, {
					text: i18n.getText("servicerequestTitle"),
					key: "Description",
					selected: false
				}, {
					text: i18n.getText("service"),
					key: "ServiceName",
					selected: false
				}, {
					text: i18n.getText("session"),
					key: "SessionName",
					selected: false
				}, {
					text: i18n.getText("customer"),
					key: "CustomerName",
					selected: false
				}, {
					text: i18n.getText("caseId"),
					key: "CaseID",
					selected: false
				}, {
					text: i18n.getText("serviceRequestOwner"),
					key: "OwnerName",
					selected: false
				}, {
					text: i18n.getText("creationdate"),
					key: "CreatedDate",
					selected: false
				}, {
					text: i18n.getText("requestedDeliveryDate"),
					key: "RequestedDeliveryDate",
					selected: true
				}, {
					text: i18n.getText("status"),
					key: "StatusDescription",
					selected: false
				}, {
					text: i18n.getText("deploymentroom"),
					key: "RespDepName",
					selected: false
				}, {
					text: i18n.getText("serviceRequestProcessor"),
					key: "ProcessorName",
					selected: false
				}, {
					text: i18n.getText("region"),
					key: "RegionName",
					selected: false
				}, {
					text: i18n.getText("txtCountry"),
					key: "Country",
					selected: false
				}, {
					text: i18n.getText("txtLastChangedDate"),
					key: "ChangedDate",
					selected: false
				}, {
					text: i18n.getText("txtExtRef"),
					key: "ExternalRef",
					selected: false
				},{
					text: i18n.getText("txtLastScoper"),
					key: "LastScoperName",
					selected: false
				}]
			};
			this.setModel(new JSONModel(sortItemsList), "SRListSortModel");

			var pageDropDown = [{
				key: "10",
				value: "10"
			}, {
				key: "20",
				value: "20"
			}, {
				key: "30",
				value: "30"
			}, {
				key: "40",
				value: "40"
			}, {
				key: "50",
				value: "50"
			}, {
				key: "60",
				value: "60"
			}, {
				key: "70",
				value: "70"
			}, {
				key: "80",
				value: "80"
			}, {
				key: "90",
				value: "90"
			}, {
				key: "100",
				value: "100"
			}];
			this.setModel(new JSONModel(pageDropDown), "SRListPageModel");
			
			var oEventBus = sap.ui.getCore().getEventBus();
 			oEventBus.subscribe("onSRColumnPress", "onSRColumnPressSuccess", this.onSRColumnPressSuccess, this);

			this.getModel("backNavModel").setProperty("/isMainViewVisible",true);
 			
		},   
		setComboBoxContainsFilterMain: function () {
			this.getView().byId("StatusDescription").setFilterFunction(function (searchString, oItem) {
				return models.comboBoxContainsFilterFunction(oItem, searchString, false);
			});
			this.getView().byId("RegionID").setFilterFunction(function (searchString, oItem) {
				return models.comboBoxContainsFilterFunction(oItem, searchString, false);
			});
			this.getView().byId("RespDepName").setFilterFunction(function (searchString, oItem) {
				return models.comboBoxContainsFilterFunction(oItem, searchString, false);
			});
			this.getView().byId("ServiceName").setFilterFunction(function (searchString, oItem) {
				return models.comboBoxContainsFilterFunction(oItem, searchString, false);
			});
			this.getView().byId("SessionName").setFilterFunction(function (searchString, oItem) {
				return models.comboBoxContainsFilterFunction(oItem, searchString, false);
			});
		},

		_onReloadView: function (oEvent) {

			this.getOwnerComponent().getService("ShellUIService").then(function (oShellService) {
				oShellService.setBackNavigation(function () {
					var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
					// Navigate back to FLP home
					oCrossAppNavigator.toExternal({
						target: {
							shellHash: "#"
						}
					});
					//either do nothing to disable it, or add your own back nav logic
				});
			});

			var isMainViewVisible = this.getModel("backNavModel").getProperty("/isMainViewVisible");

			if (!isMainViewVisible) {
				this.getModel("backNavModel").setProperty("/isMainViewVisible",true);
				this.loadSRList();
			}
			//Apply Auto filter off for Google Chrome
			models.applyBrowserAutoFillOff();
			models.setDocumentTitle(this,null,null,null);
		},
		initModel: function () {
			this.setModel(new JSONModel({
				message: []
			}), "errorModel");

			this.setModel(new JSONModel([]), "SessionSetModel");
			this.setModel(new JSONModel([]), "MasterSessionSetModel");

			var caseModel = new JSONModel({
				visible: true,
				caseString: "",
				data: [],
				total: 0,
				page: 0,
				current: 0
			});
			this.setModel(caseModel, "caseModel");

			var customerModel = new JSONModel({
				visible: true,
				customerString: "",
				data: [],
				total: 0,
				page: 0,
				current: 0
			});
			this.setModel(customerModel, "customerModel");

			var customerSearchModel = new JSONModel({
				customer: ""
			});
			this.setModel(customerSearchModel, "customerSearchModel");

			var serviceRequestFilterModel = new JSONModel({
				total: 0,
				page: 0,
				current: 0,
				isShowMoreVisible: false
			});
			this.setModel(serviceRequestFilterModel, "serviceRequestFilterModel");

			var buttonControlModel = new JSONModel({
				caseMoreButton: false,
				customerMoreButton: false,
				enableShowMoreBtnInCaseSearch:true,
				enableCaseSearchBtn:true,
				enablePageSizeOkBtn: true
			});
			this.setModel(buttonControlModel, "buttonControlModel");

			//case Search Model
			var caseSearchModel = new JSONModel({
				caseId: "",
				customer: "",
				owner: this.getModel("SRS_Data_UserSet").getProperty("/userName"),
				ownerId: ""
			});
			this.setModel(caseSearchModel, "caseSearchModel");

			var SRListSortIconVisibilityModel = new JSONModel({
				ServiceRequestID: "None",
				Description: "None",
				ServiceName: "None",
				SessionName: "None",
				CustomerName: "None",
				CaseID: "None",
				OwnerName: "None",
				CreatedDate: "None",
				RequestedDeliveryDate: "None",
				StatusDescription: "None",
				RespDepName: "None",
				ProcessorName: "None",
				RegionName: "None",
				Country: "None",
				ChangedDate: "None",
				ExternalRef: "None",
				LastScoperName: "None"
			});
			this.setModel(SRListSortIconVisibilityModel, "SRListSortIconVisibilityModel");
		},
		setDefaultVariant: function (variantID) {
			this.byId("pageVariantId").setInitialSelectionKey(variantID);
			this.byId("pageVariantId").setDefaultVariantKey(variantID);
			this.byId("pageVariantId").setSelectionKey(variantID);
			this.byId("pageVariantId").getModel().refresh();
		},
		readVariants: function (isRedirectionCall, runFilterSearch, selectedVariant) {
			this.byId("pageVariantId").setModel("");
			this.getModel("SRS_Data").read("/VariantDataSet", {
				filters: [new Filter("VariantSetName", sap.ui.model.FilterOperator.EQ, "TEAM_SRSAPP")],
				groupId: "variantSet",
				success: function (oData) {
					var data = oData;
					var convertDataToJSON = new JSONModel(data);
					convertDataToJSON.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
					this.byId("pageVariantId").setModel(convertDataToJSON);

					if (data) {
						var results = data.results;
						var isDefaultVariantSelected = false;

						if (selectedVariant) {
							isDefaultVariantSelected = true;
							this.setDefaultVariant(selectedVariant);
							for (var i = 0; i < results.length; i++) {
								if (results[i].VariantID === selectedVariant) {
									this.setFilterBarControlsContent(results[i].VariantContent);
									break;
								}
							}
						} else {
							for (var i = 0; i < results.length; i++) {
								if (results[i].IsDefault === "X") {
									this.setDefaultVariant(results[i].VariantID);
									this.setFilterBarControlsContent(results[i].VariantContent);
									isDefaultVariantSelected = true;
									break;
								}
							}
						}

						if (!isDefaultVariantSelected) {
							this.setDefaultFilter(this);
						}

						if (runFilterSearch) {
							var SRFilterTemp = [];
							var variantFilters = this.createSearchFiltersArray(false);
							if (isDefaultVariantSelected && variantFilters) {
								SRFilterTemp.push(variantFilters);
							} else {
								var userFilters = this.getModel("SRS_Data_UserSet").getData()["userFilter"];
								if (userFilters) {
									SRFilterTemp.push(userFilters);
								}
							}
							if (SRFilterTemp) {
								this.byId("servicerequestTable").setModel(new JSONModel({results:[]}));
								this._FilterServiceRequestTable([models.filterComparison_AND(SRFilterTemp)], 0, models.DEFAULT_SORT_BY, models.DEFAULT_SORT_ORDER);
								if (this.getModel("SRS_Data_UserSet").getProperty("/isScoper")) {
									if (this.byId("ProcessorUser").getTokens().length === 0) {
										models.getUnassignedSRs([models.filterComparison_AND([this.createSearchFiltersArray(true)])], this,
											"idTextTotalUnassignedSR");
									} else {
										this.byId("idTextTotalUnassignedSR").setText(this.getResourceBundle().getText("txtUnassignedSR"));
									}
								}
							} else {
								this.byId("servicerequestTable").setModel(new JSONModel({results:[]}));
								this._FilterServiceRequestTable([], 0, models.DEFAULT_SORT_BY, models.DEFAULT_SORT_ORDER);
								if (this.getModel("SRS_Data_UserSet").getProperty("/isScoper")) {
									if (this.byId("ProcessorUser").getTokens().length === 0) {
										models.getUnassignedSRs([], this, "idTextTotalUnassignedSR");
									} else {
										this.byId("idTextTotalUnassignedSR").setText(this.getResourceBundle().getText("txtUnassignedSR"));
									}
								}

							}
						}
						sap.ui.core.BusyIndicator.hide();
						if (jQuery.isEmptyObject(this.getModel("qualificationModel"))) {
							//models.getDropDownListModel(this, "/DropDownListSet", "Qualification", "qualificationModel");
							models.getQualificationDropDownListModel(this,"qualificationModel");
						}
					}
				}.bind(this),
				error: function (err) {
					this.UserSetAPIIntegration(false, null);
					sap.ui.core.BusyIndicator.hide();
					models.showErrorMessage(this, err);
					if (jQuery.isEmptyObject(this.getModel("qualificationModel"))) {
						//models.getDropDownListModel(this, "/DropDownListSet", "Qualification", "qualificationModel");
						models.getQualificationDropDownListModel(this,"qualificationModel");
					}
				}.bind(this)
			});

		},
		setDefaultFilter: function (context) {
			var status = this.getModel("SRS_Data_UserSet").getData()["selectedStatus"];
			var user = this.getModel("SRS_Data_UserSet").getData()["userId"];
			var userName = this.getModel("SRS_Data_UserSet").getData()["userName"];
			var isTQM = this.getModel("SRS_Data_UserSet").getData()["isTQM"];
			var isApprover = this.getModel("SRS_Data_UserSet").getData()["isApprover"];
			var firstName = this.getModel("SRS_Data_UserSet").getData()["firstName"];
			var lastName = this.getModel("SRS_Data_UserSet").getData()["lastName"];

			if (status && status.length > 0) {
				context.byId("StatusDescription").setSelectedKeys(status);
			}
			if (user && userName) {
				var data = {
					ID: user,
					firstName: firstName,
					lastName: lastName
				};
				if (isTQM) {
					this.byId("ServiceRequestOwnerUser").setTokens([]);
					context.setDataForInputTypeUserControl(data, "ServiceRequestOwnerUser");
				}
				if (isApprover) {
					this.byId("ServiceRequestOwnerUser").setTokens([]);
					context.setDataForInputTypeUserControl(data, "ServiceRequestOwnerUser");
				}
			}
			SRPersoService.resetPersData();
			this._oTPC.refresh();
			// reset Column Visibility
			context.byId("ColCustomerName").setVisible(true);
			context.byId("ColCaseID").setVisible(true);
			context.byId("ColServicerequestID").setVisible(true);
			context.byId("ColServicerequestTitle").setVisible(true);
			context.byId("ColServiceRequestOwner").setVisible(true);
			context.byId("ColRequestedDeliveryDate").setVisible(true);
			context.byId("ColService").setVisible(true);
			context.byId("ColStatus").setVisible(true);
			context.byId("ColDeploymentroom").setVisible(true);
			context.byId("ColServiceRequestProcessor").setVisible(true);
			context.byId("ColRegion").setVisible(true);
			context.byId("ColCountry").setVisible(true);
			context.byId("ColLastChangedDate").setVisible(true);
			if (context.byId("ColExtRef")) {
				context.byId("ColExtRef").setVisible(false);
			}
			if (context.byId("ColLastScoper")) {
				context.byId("ColLastScoper").setVisible(false);
			}
			context.byId("ColCreationDate").setVisible(true);
			context.byId("ColSession").setVisible(true);

			// reset Column Order
			context.byId("ColCustomerName").setOrder(4);
			context.byId("ColCaseID").setOrder(5);
			context.byId("ColServicerequestID").setOrder(0);
			context.byId("ColServicerequestTitle").setOrder(1);
			context.byId("ColServiceRequestOwner").setOrder(6);
			context.byId("ColCreationDate").setOrder(7);
			context.byId("ColRequestedDeliveryDate").setOrder(8);
			context.byId("ColService").setOrder(2);
			context.byId("ColSession").setOrder(3);
			context.byId("ColStatus").setOrder(9);
			context.byId("ColDeploymentroom").setOrder(10);
			context.byId("ColServiceRequestProcessor").setOrder(11);
			context.byId("ColRegion").setOrder(12);
			context.byId("ColCountry").setOrder(13);
			context.byId("ColLastChangedDate").setOrder(14);
			if (context.byId("ColExtRef")) {
				context.byId("ColExtRef").setOrder(15);
			}
			if (context.byId("ColLastScoper")) {
				context.byId("ColLastScoper").setOrder(16);
			}

			this.byId("filterbar").getFilterGroupItems()[8].setVisibleInAdvancedArea(false);
			this.byId("filterbar").getFilterGroupItems()[3].setVisibleInAdvancedArea(true);
			this.byId("filterbar").getFilterGroupItems()[0].setVisibleInAdvancedArea(true);
			this.byId("filterbar").getFilterGroupItems()[4].setVisibleInAdvancedArea(true);
			this.byId("filterbar").getFilterGroupItems()[6].setVisibleInAdvancedArea(true);
			this.byId("filterbar").getFilterGroupItems()[1].setVisibleInAdvancedArea(true);
			this.byId("filterbar").getFilterGroupItems()[7].setVisibleInAdvancedArea(true);
			this.byId("filterbar").getFilterGroupItems()[10].setVisibleInAdvancedArea(true);
			this.byId("filterbar").getFilterGroupItems()[12].setVisibleInAdvancedArea(true);
			this.byId("filterbar").getFilterGroupItems()[9].setVisibleInAdvancedArea(true);
			this.byId("filterbar").getFilterGroupItems()[11].setVisibleInAdvancedArea(true);
			this.byId("filterbar").getFilterGroupItems()[5].setVisibleInAdvancedArea(true);
			this.byId("filterbar").getFilterGroupItems()[2].setVisibleInAdvancedArea(true);
			this.byId("filterbar").getFilterGroupItems()[13].setVisibleInAdvancedArea(true);
			this.byId("filterbar").getFilterGroupItems()[14].setVisibleInAdvancedArea(false);

			//set default sort option
			this.selectSortOption("RequestedDeliveryDate", "desc");

			//set Default Page size
			models.DEFAULT_PAGE_TOP = "10";

		},
		selectSortOption: function (optionToSelect, sortOrder) {
			var SRListSortModel = this.getModel("SRListSortModel").getData();
			for (var i = 0; i < SRListSortModel.items.length; i++) {
				if (optionToSelect === SRListSortModel.items[i].key) {
					SRListSortModel.items[i].selected = true;
				} else {
					SRListSortModel.items[i].selected = false;
				}
			}
			if (sortOrder === models.DEFAULT_SORT_ORDER) {
				SRListSortModel.sortDescending = false;
			} else {
				SRListSortModel.sortDescending = true;
			}
			SRListSortModel.order = sortOrder;
			this.getModel("SRListSortModel").setData(null);
			this.getModel("SRListSortModel").setData(SRListSortModel);
			models.DEFAULT_SORT_BY = optionToSelect;
			models.DEFAULT_SORT_ORDER = sortOrder;
		},
		UserSetAPIIntegration: function () {
			this.getModel("SRS_Data").read("/UserSet", {
				success: function (UserSetData) {
					this.userSetSuccessHandler(UserSetData);
					// Track User
					if (this.getModel("SRS_Data_UserSet").getData().userId !== "") {
						models.trackUser(this.getOwnerComponent(), this.getModel("SRS_Data_UserSet").getData().userId);
					}
				}.bind(this),
				error: function (err) {
					sap.ui.core.BusyIndicator.hide();
					models.showErrorMessage(this, err);
				}.bind(this)
			});
		},
		_handleEmpSearchValueHelpConfirm: function (oEvent) {
			var aSelectedUser = oEvent.getParameter("value").user;
			var fullName = aSelectedUser.firstName + " " + aSelectedUser.lastName;
			if (this.byId("CaseDialog") && this.byId("CaseDialog").isOpen()) {
				models.setTokenForCaseOwner(this, "srs_ownerAndPeople", aSelectedUser.ID, fullName);
				this.getModel("caseSearchModel").setProperty("/owner", fullName);
				this.getModel("caseSearchModel").setProperty("/ownerId", aSelectedUser.ID);
			} else {
				if (this.inputTypeForUserControl === "PU") {
					this.setDataForInputTypeUserControl(aSelectedUser, "ProcessorUser");
				} else if (this.inputTypeForUserControl === "OU") {
					this.setDataForInputTypeUserControl(aSelectedUser, "ServiceRequestOwnerUser");
				} else if(this.inputTypeForUserControl === "LS"){
					this.setDataForInputTypeUserControl(aSelectedUser, "LastScoperUser");
				}
			}
			this.filterBarInputsOnChange();
		},
		setDataForInputTypeUserControlWithVariant: function (data, controlID) {
			if (data) {
				this.byId(controlID).setTokens([]);
				if (Array.isArray(data)) {
					for (var i = 0; i < data.length; i++) {
						this.byId(controlID).addToken(new sap.m.Token({
							key: data[i].key,
							text: data[i].text
						}));
					}
				} else {
					var name = data.firstName + " " + data.lastName;
					if(data.ID){
						this.byId(controlID).addToken(new sap.m.Token({
							key: data.ID,
							text: name
						}));
					}
				}
			} else {
				this.byId(controlID).setTokens([]);
			}
		},
		setDataForInputTypeUserControl: function (data, controlID) {
			if (data) {
				var name = data.firstName + " " + data.lastName;
				if(data.ID){
					this.byId(controlID).addToken(new sap.m.Token({
						key: data.ID,
						text: name
					}));
				}
			}
		},
		onClear: function () {
			var aFilterItems = this.byId("filterbar").getAllFilterItems();

			this.getModel("SessionSetModel").setData([]);
			this.getModel("MasterSessionSetModel").setData([]);
			this.byId("SessionName").setValueState("Information");
			this.modifySavedVariant();

			for (var i = 0; i < aFilterItems.length; i++) {
				try {
					if (aFilterItems[i].getControl().getId().includes("vBoxProcessorUser")) {
						aFilterItems[i].getControl().getItems()[0].removeAllTokens();
						aFilterItems[i].getControl().getItems()[1].getItems()[0].setState(false);
						this.changeSwitch(false);
					}
					aFilterItems[i].getControl().removeAllTokens();
					aFilterItems[i].getControl().setValue();
				} catch (err) {
					try {
						aFilterItems[i].getControl().removeAllSelectedItems();
						aFilterItems[i].getControl().setSelectedKeys([]);
					} catch (err2) {
						if (aFilterItems[i].getControl().getId().includes("vBoxProcessorUser")) {
							aFilterItems[i].getControl().getItems()[0].removeAllTokens();
							aFilterItems[i].getControl().getItems()[1].getItems()[0].setState(false);
							this.changeSwitch(false);
						}else{
							aFilterItems[i].getControl().setValue();
						}
					}
				}
			}
		},

		onCustomerSearch: function () {
			var oView = this.getView();
			var dialog = oView.byId("CustomerDialog");
			this.getModel("customerSearchModel").setProperty("/customer", "");
			if (!dialog) {
				// create dialog via fragment factory
				dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.CustomerSearch", this);
				oView.addDependent(dialog);
			}
			dialog.open();

		},

		showMoreCustomer: function () {
			var pageNumber = this.getModel("customerModel").getProperty("/page") + 1;
			models.getCustomerByPageNumber(this, pageNumber);
			this.getModel("customerModel").setProperty("/page", pageNumber);
		},
		onPressCustomerSearch: function () {
			this.byId("srs_customertable").setBusy(true);
			//reset more button 
			this.getModel("buttonControlModel").setProperty("/customerMoreButton", false);
			//read total number 
			var sCustomer = this.getModel("customerSearchModel").getProperty("/customer");
			// top 10
			var customerModel = new JSONModel({
				customerString: "",
				data: [],
				total: 0,
				page: 0,
				current: 0,
				visible: true
			});
			this.setModel(customerModel, "customerModel");
			// if sCase or sCUstomre + filter after caseSet
			var filterArr = [];
			if (sCustomer) {
				filterArr.push(models.filterCondition_Contains("CustomerSearch", sCustomer));
				//filterArr.push("substringof('" + sCustomer + "',CustomerSearch)");
			}
			// if no condition, total need to be read by /$count.
			if (sCustomer == "") {
				//read total number  if no filter string
				this.getModel("SRS_Data").read("/CaseSet/$count", {
					success: function (oData) {
						this.getModel("customerModel").setProperty("/total", oData);
						if (oData <= 10) {
							// total less than 10
							this.getModel("customerModel").setProperty("/current", oData);
						} else {
							// set current indicator to 10  if total number more than 10
							this.getModel("customerModel").setProperty("/current", 10);
							// more than 10 . enable the more button
							this.getModel("buttonControlModel").setProperty("/customerMoreButton", true);
						}
					}.bind(this)
				});
			}
			this.getModel("SRS_Data").read("/CaseSet", {
				// filters: aFilters,
				urlParameters: {
					"$skip": "0",
					"$top": "10",
					"$inlinecount": "allpages"
				},
				filters: filterArr,
				success: function (oData) {
					if (oData.results.length) {
						if (oData.__count) {
							// total less than 10
							if (oData.__count <= 10) {
								this.getModel("customerModel").setProperty("/current", oData.__count);
								this.getModel("buttonControlModel").setProperty("/customerMoreButton", false);
							} else {
								this.getModel("customerModel").setProperty("/current", 10);
								this.getModel("buttonControlModel").setProperty("/customerMoreButton", true);
							}
						} else {
							oData.__count = oData.results.length;
						}
						this.getModel("customerModel").setProperty("/data", oData.results);
						if (this.getModel("customerModel").getProperty("/total") === 0) {
							// means with filter
							this.getModel("customerModel").setProperty("/total", oData.__count);
						}
					} else {
						this.getModel("customerModel").setProperty("/data", []);
						this.getModel("customerModel").setProperty("/total", 0);

					}
					this.byId("srs_customertable").setBusy(false);
				}.bind(this),
				error: function () {
					sap.m.MessageToast.show(this.getResourceBundle().getText("errorTextForCase"));
					this.getModel("buttonControlModel").setProperty("/customerMoreButton", false);

					this.byId("srs_table").setBusy(false);
				}.bind(this)

			});

		},
		onCaseSearch: function () {

			var oView = this.getView();
			var dialog = oView.byId("CaseDialog");

			this.getModel("caseSearchModel").setProperty("/ownerId", "");
			this.getModel("caseSearchModel").setProperty("/owner", "");
			this.getModel("caseSearchModel").setProperty("/customer", "");
			if (!dialog) {
				// create dialog via fragment factory
				dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.CaseSearch", this);
				oView.addDependent(dialog);
			}
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();
			this.getModel("buttonControlModel").setProperty("/caseMoreButton",false);
			this.byId("srs_ownerAndPeople").setTokens([]);
		},
		onCaseOwnerChange: function (oEvent) {
			models.onCaseOwnerChange(oEvent, this, "srs_ownerAndPeople");
		},

		// case Search start
		onPressCaseSearch: function () {
			this.byId("srs_casetable").setBusyIndicatorDelay(0);
			this.byId("srs_casetable").setBusy(true);
			this.getModel("buttonControlModel").setProperty("/enableCaseSearchBtn", false);
			//reset more button 
			this.getModel("buttonControlModel").setProperty("/caseMoreButton", false);

			//read total number 
			var sCase = this.byId("srs_case").getValue();
			var sCustomer = this.byId("srs_customer").getValue();
			var sOwner = this.getModel("caseSearchModel").getProperty("/ownerId");
			// top 10
			var caseModel = new JSONModel({
				caseString: "",
				data: [],
				total: 0,
				page: 0,
				current: 0,
				visible: true
			});
			this.setModel(caseModel, "caseModel");
			// if sCase or sCUstomre + filter after caseSet
			var filterArr = [];
			if (sCase) {
				filterArr.push(models.filterCondition_Contains("CaseSearch", sCase));
			}
			if (sCustomer) {
				filterArr.push(models.filterCondition_Contains("CustomerSearch", sCustomer));
				//filterArr.push("substringof('" + sCustomer + "',CustomerSearch)");
			}

			if (sOwner) {
				filterArr.push(models.filterCondition_Contains("OwnerSearch", sOwner));

			}
			if (filterArr.length >= 2) {
				var tempArr = models.filterComparison_AND(filterArr);
				filterArr = [];
				filterArr.push(tempArr);
			}
			// if no condition, total need to be read by /$count.
			if (sCustomer == "" && sCase == "" && sOwner == "") {
				//read total number  if no filter string
				this.getModel("SRS_Data").read("/CaseSet/$count", {
					success: function (oData) {
						this.getModel("caseModel").setProperty("/total", oData);
						if (oData <= 10) {
							// total less than 10
							this.getModel("caseModel").setProperty("/current", oData);
						} else {
							// set current indicator to 10  if total number more than 10
							this.getModel("caseModel").setProperty("/current", 10);
							// more than 10 . enable the more button
							this.getModel("buttonControlModel").setProperty("/caseMoreButton", true);
						}
					}.bind(this)
				});
			}
			this.getModel("SRS_Data").read("/CaseSet", {
				// filters: aFilters,
				urlParameters: {
					"$skip": "0",
					"$top": "10",
					"$inlinecount": "allpages"
				},
				filters: filterArr,
				success: function (oData) {
					this.getModel("buttonControlModel").setProperty("/enableCaseSearchBtn", true);
					if (oData.results.length) {
						if (oData.__count) {
							// total less than 10
							if (oData.__count <= 10) {
								this.getModel("caseModel").setProperty("/current", oData.__count);
								this.getModel("buttonControlModel").setProperty("/caseMoreButton", false);
							} else {
								this.getModel("caseModel").setProperty("/current", 10);
								this.getModel("buttonControlModel").setProperty("/caseMoreButton", true);
							}
						} else {
							oData.__count = oData.results.length;
						}
						this.getModel("caseModel").setProperty("/data", oData.results);
						if (this.getModel("caseModel").getProperty("/total") === 0) {
							// means with filter
							this.getModel("caseModel").setProperty("/total", oData.__count);
						}
					} else {
						this.getModel("caseModel").setProperty("/data", []);
						this.getModel("caseModel").setProperty("/total", 0);

					}
					this.byId("srs_casetable").setBusy(false);
				}.bind(this),
				error: function () {
					sap.m.MessageToast.show(this.getResourceBundle().getText("errorTextForCase"));
					this.getModel("buttonControlModel").setProperty("/caseMoreButton", false);

					this.byId("srs_casetable").setBusy(false);
				}.bind(this)

			});
		},
		showMoreCase: function () {
			var pageNumber = this.getModel("caseModel").getProperty("/page") + 1;
			models.getCaseByPageNumber(this, pageNumber);
			this.getModel("caseModel").setProperty("/page", pageNumber);
		},

		onPressOkInCaseSearchPopUp: function (oEvent) {
			var aSelectedItems = this.byId("srs_casetable").getSelectedItems();
			if (aSelectedItems && aSelectedItems.length>0) {
				for (var i = 0; i < aSelectedItems.length; i++) {
					var oSelectedItem = aSelectedItems[i];
					var sCaseId = oSelectedItem.getCells()[0].getItems()[0].getText();
					this.byId("CaseID").addToken(new sap.m.Token({
						key: sCaseId,
						text: sCaseId
					}));
				}
				this.filterBarInputsOnChange();
			} else {
				sap.m.MessageToast.show(this.getResourceBundle().getText("Select at least one Case"));
				return;
			}

			this.byId("srs_case").setValue();
			this.byId("srs_customer").setValue();
			var caseModel = new JSONModel({
				visible: true,
				caseString: "",
				data: [],
				current: 0,
				total: 0,
				page: 0
			});
			this.setModel(caseModel, "caseModel");
			this.byId("CaseDialog").close();
		},
		onCloseCase: function(){
			this.byId("CaseDialog").close();
		},
		onCloseCustomer: function (oEvent) {
			if (oEvent.getSource().getId().indexOf("cancel") === -1) {
				var aSelectedItems = this.byId("srs_customertable").getSelectedItems();
				if (aSelectedItems) {
					for (var i = 0; i < aSelectedItems.length; i++) {
						var oSelectedItem = aSelectedItems[i];
						var sCaseId = oSelectedItem.getCells()[0].getText();
						this.byId("CustomerName").addToken(new sap.m.Token({
							key: sCaseId,
							text: sCaseId
						}));
					}
				} else {
					sap.m.MessageToast.show(this.getResourceBundle().getText("customerEmpty"));
					return;
				}

			}
			this.getModel("customerSearchModel").setProperty("/customer", "");
			var customerModel = new JSONModel({
				visible: true,
				caseString: "",
				data: [],
				current: 0,
				total: 0,
				page: 0
			});
			this.setModel(customerModel, "customerModel");
			this.byId("CustomerDialog").close();
		},
		handleEmpSearchValueHelp: function (oEvent) {
			this.inputTypeForUserControl = "PU";
			this.openEmployeeDialog(oEvent);
		},
		handleOwnerSearchValueHelp: function (oEvent) {
			this.inputTypeForUserControl = "OU";
			this.openEmployeeDialog(oEvent);

		},
		handleLastScoperSearchValueHelp: function(oEvent){
			this.inputTypeForUserControl = "LS";
			this.openEmployeeDialog(oEvent);
		},
		openEmployeeDialog:	function(oEvent){
			this.inputId = oEvent.getSource().getId();
			var that = this;
			var dialog = new EmployeeDataSearchDialog({
				endpoint: sap.ui.require.toUrl("sap/com/servicerequest/servicerequest") + "/sapit-employee-data",
				multiSelect: false,
				liveSearch: false,
				confirm: function (oEvt) {
					that._handleEmpSearchValueHelpConfirm(oEvt);
				},
			});
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();
		},
		resetSRListSortIconVisibilityModel: function () {
			var modelData = this.getModel("SRListSortIconVisibilityModel").getData();
			for (var key in modelData) {
				this.getModel("SRListSortIconVisibilityModel").setProperty("/" + key, "None");
			}
		},

		setSortIcon: function (sortByColumn, sortOrder) {
			var sortOrderFullText = "Ascending";
			if (sortOrder === "desc") {
				sortOrderFullText = "Descending";
			}
			if (sortByColumn) {
				this.resetSRListSortIconVisibilityModel();
				this.getModel("SRListSortIconVisibilityModel").setProperty("/" + sortByColumn, sortOrderFullText);
			}
		},

		_FilterServiceRequestTable: function (aFilters, pageNumber, sortByColumn, sortOrder) {
			this.byId("idIconEditPageSize").setEnabled(false);
			this.byId("servicerequestTable").setBusy(true);
			this.byId("servicerequestTable").setBusyIndicatorDelay(0);
			this.byId("servicerequestTable").setNoDataText("Please wait while service requests are loading...");
			this.getModel("serviceRequestFilterModel").setProperty("/isShowMoreVisible",false);
			if (pageNumber) {
				pageNumber = pageNumber * parseInt(models.DEFAULT_PAGE_TOP);
			} else {
				pageNumber = 0;
			}
			var sortParam = sortByColumn + " " + sortOrder;
			var filterGoBtn = this.byId("filterbar");
			if(filterGoBtn){
				filterGoBtn.setSearchEnabled(false);
			}
			this.getModel("SRS_Data").read("/ServiceRequestHeaderSet", {
				filters: aFilters,
				urlParameters: {
					"$orderby": sortParam,
					"$skip": pageNumber,
					"$top": models.DEFAULT_PAGE_TOP,
					"$inlinecount": "allpages"
				},
				success: function (oData) {
					if(filterGoBtn){
						filterGoBtn.setSearchEnabled(true);
					}
					var serviceRequests;
					var srTableData;
					this.setSortIcon(sortByColumn, sortOrder);
					try {
						serviceRequests = oData.results;
					} catch (err) {
						sap.ui.core.BusyIndicator.hide();
						this.getModel("serviceRequestFilterModel").setProperty("/isShowMoreVisible", false);
						return;
					}

					if (oData.results.length>0) {
						if (oData.__count) {
							// less than 10 results
							if (oData.__count <= 10) {
								this.getModel("serviceRequestFilterModel").setProperty("/current", oData.__count);
								this.getModel("serviceRequestFilterModel").setProperty("/total", oData.__count);
								this.getModel("serviceRequestFilterModel").setProperty("/isShowMoreVisible", false);
								srTableData = new JSONModel({
									results: serviceRequests
								});
								this.byId("servicerequestTable").setModel(srTableData);
							} else {

								if (this.byId("servicerequestTable").getModel().getData() === null || pageNumber === 0) {
									this.getModel("serviceRequestFilterModel").setProperty("/page", 0);
									srTableData = new JSONModel({
										results: serviceRequests
									});
								} else {
									srTableData = new JSONModel({
										results: this.byId("servicerequestTable").getModel().getData().results.concat(serviceRequests)
									});
								}
								srTableData.setSizeLimit(20000);
								this.byId("servicerequestTable").setModel(srTableData);

								var current = srTableData.getData().results.length;
								if (current >= oData.__count) { // last page
									current = oData.__count;
									this.getModel("serviceRequestFilterModel").setProperty("/isShowMoreVisible", false);
								} else {
									this.getModel("serviceRequestFilterModel").setProperty("/isShowMoreVisible", true);
								}
								this.getModel("serviceRequestFilterModel").setProperty("/current", current);
								this.getModel("serviceRequestFilterModel").setProperty("/total", oData.__count);

							}
						}
					} else {
						if (!pageNumber) {
							this.getModel("serviceRequestFilterModel").setProperty("/current", 0);
							this.getModel("serviceRequestFilterModel").setProperty("/total", 0);
						}
						this.getModel("serviceRequestFilterModel").setProperty("/isShowMoreVisible", false);
						srTableData = new JSONModel({
							results: []
						});
						this.byId("servicerequestTable").setModel(srTableData);
						this.byId("servicerequestTable").setNoDataText("No data");
					}

					this.aDropDownFilters = [-1, -1, -1, -1];
					this.aFilters = [];
					//Apply Auto filter off for Google Chrome
					this.byId("servicerequestTable").setBusy(false);
					this.byId("idIconEditPageSize").setEnabled(true);
					models.applyBrowserAutoFillOff();
				}.bind(this),
				error: function (err) {
					if(filterGoBtn){
						filterGoBtn.setSearchEnabled(true);
					}
					var srTableData = new JSONModel({
						results: []
					});
					this.byId("servicerequestTable").setModel(srTableData);
					this.getModel("serviceRequestFilterModel").setProperty("/total", 0);
					this.getModel("serviceRequestFilterModel").setProperty("/page", 0);
					this.getModel("serviceRequestFilterModel").setProperty("/current", 0);
					this.getModel("serviceRequestFilterModel").setProperty("/isShowMoreVisible", false);
					sap.ui.core.BusyIndicator.hide();
					models.showErrorMessage(this, err);
					this.byId("servicerequestTable").setBusy(false);
					this.byId("servicerequestTable").setNoDataText("No data");
				}.bind(this)
			});
		},
		loadSRList: function () {
			var SRFilterTemp = [];
			var variantFilters = this.createSearchFiltersArray(false);
			if (variantFilters.aFilters.length > 0) {
				SRFilterTemp.push(variantFilters);
			}
			this.byId("servicerequestTable").setModel(new JSONModel({results:[]}));
			this._FilterServiceRequestTable([models.filterComparison_AND(SRFilterTemp)], 0, models.DEFAULT_SORT_BY, models.DEFAULT_SORT_ORDER);
			if (this.getModel("SRS_Data_UserSet").getProperty("/isScoper")) {
				if (this.byId("ProcessorUser").getTokens().length === 0) {
					models.getUnassignedSRs([models.filterComparison_AND([this.createSearchFiltersArray(true)])], this, "idTextTotalUnassignedSR");
				} else {
					this.byId("idTextTotalUnassignedSR").setText(this.getResourceBundle().getText("txtUnassignedSR"));
				}
			}
		},
		onFilterPressed: function () {
			this.loadSRList();
			var filterBar = this.byId("filterbar").getFilterGroupItems();
			if (!filterBar[2].getVisibleInAdvancedArea() || !filterBar[0].getVisibleInAdvancedArea() || !filterBar[3].getVisibleInAdvancedArea() ||
				!filterBar[5].getVisibleInAdvancedArea() || !filterBar[1].getVisibleInAdvancedArea() || !filterBar[6].getVisibleInAdvancedArea() ||
				!filterBar[9].getVisibleInAdvancedArea() || !filterBar[11].getVisibleInAdvancedArea() || !filterBar[8].getVisibleInAdvancedArea() ||
				!filterBar[10].getVisibleInAdvancedArea() || !filterBar[4].getVisibleInAdvancedArea()) {
				this.modifySavedVariant();
			}
		},
		modifySavedVariant: function () {
			var selectedVariantKey = this.byId("pageVariantId").getSelectionKey();
			if (selectedVariantKey && selectedVariantKey !== this.defaultSelectedKey) {
				this.byId("pageVariantId").currentVariantSetModified(true);
			}
		},
		showMoreServiceRequest: function (oEvent) {
			var pageNumber = this.getModel("serviceRequestFilterModel").getProperty("/page") + 1;

			var SRFilterTemp = [];
			var searchFilters = this.createSearchFiltersArray(false);
			if (searchFilters.aFilters.length > 0) {
				SRFilterTemp.push(searchFilters);
			}
			this._FilterServiceRequestTable([models.filterComparison_AND(SRFilterTemp)], pageNumber, models.DEFAULT_SORT_BY, models.DEFAULT_SORT_ORDER);
			this.getModel("serviceRequestFilterModel").setProperty("/page", pageNumber);
		},
		onItemPressed: function (oEvent) {
			var sCaseID = oEvent.getParameters().listItem.getCells()[5].getText();
			var sServiceRequestID = oEvent.getParameters().listItem.getCells()[0].getText();

			sap.ui.core.BusyIndicator.show();
			var BusyOpenFn = function () {
				this.getRouter().navTo("DetailView", {
					ServiceRequestID: sServiceRequestID,
					CaseId: sCaseID !== "" ? sCaseID : "0"
				});
				this.getModel("SRS_Data_UserSet").getData["isCreatingNewSR"] = false;
			};
			sap.ui.core.BusyIndicator.attachEventOnce("Open", BusyOpenFn, this);
		},
		createNewServiceRequest: function () {

			var userRoles = this.getModel("SRS_Data_UserSet").getData();
			var that = this;

			if (userRoles.isTQM && !userRoles.isScoper && !userRoles.isApprover) {
				var htmlTxt = '<div><strong>Service Requests must be created through Holistic Engagement Planner(HEP).</strong><br/>In HEP select your Project and go to Tab "Service Plan".<br/>Then either click "Add Service" or<br/> click "Service Plans" to open or create a Service Plan Draft. Then select "Add/Remove Items".<br/><br/><a href="https://workzone.one.int.sap/site#workzone-home&/wiki/show/cCEETHmSsTPyaBoPmrzi2x" target="_blank"">How to work with HEP Service Plans - including Service Plan Designer</a><br/><br/>Do you want to open HEP now ?</div> ';
				var dialog = new Dialog({
					title: "Information",
					type: "Message",
					state: "Information",
					icon: "sap-icon://message-information",
					content: new sap.ui.core.HTML({
 								content: htmlTxt
 					}),
					beginButton: new Button({
						type: "Emphasized",
						text: this.getResourceBundle().getText("dialogChangeStatusYes"), 
						press: function () {
							var host = that.getModel("SRS_Data_UserSet").getProperty("/backendSystem");
								if (host) {
									host = host.toUpperCase();
								}
								var url = models.HEP_DEV_URL;
								if (host.includes(models.BACKND_SYS_ICP)) { // Prod
									url = models.HEP_PROD_URL;
								} else if (host.includes(models.BACKND_SYS_ICT)) { // Test
									url = models.setHEPTestURL(models.HEP_TEST_URL)//models.HEP_TEST_URL;
								} else { // Dev
									url = models.HEP_DEV_URL;
								}
								window.open(url);
						}
					}),
					endButton: new Button({
						text: this.getResourceBundle().getText("dialogChangeStatusNo"),
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
			} else {
				this.getRouter().navTo("DetailView", {
					ServiceRequestID: models.SR_NEW_ID,
					CaseId: "0"
				});
				this.getModel("SRS_Data_UserSet").getData["isCreatingNewSR"] = true;
			}

		},
		variantOnSave: function (oEvent) {

			var existingVariantData = oEvent.getSource().getModel().getData().results;

			//var existingVariantData = this.getModel("variantSetModel").getData();
			var variantDetails = oEvent.getParameters();

			var existingSelectedVariant = null;

			var defaultVariant = "";
			if (variantDetails.def) {
				defaultVariant = "X";
			}

			for (var i = 0; i < existingVariantData.length; i++) {
				if (variantDetails.key === existingVariantData[i].VariantID) {
					existingVariantData[i].IsDefault = defaultVariant;
					existingSelectedVariant = existingVariantData[i];
				}
			}

			var serviceRequestId = this.byId("ServiceRequestID").getValue();
			var caseID = this.parseMultiInputTokens("CaseID");
			var country = this.parseMultiInputTokens("idCountry");
			var statusDescription = this.byId("StatusDescription").getSelectedKeys();
			var customerName = this.byId("CustomerName").getValue();
			var processorUser = "";
			if (this.byId("ProcessorUser").getTokens().length > 0) {
				processorUser = this.parseMultiInputTokens("ProcessorUser");
			}
			var serviceRequestOwnerUser = "";
			if (this.byId("ServiceRequestOwnerUser").getTokens().length > 0) {
				serviceRequestOwnerUser = this.parseMultiInputTokens("ServiceRequestOwnerUser");
			}
			var lastScoperUser = "";
			if (this.byId("LastScoperUser").getTokens().length > 0) {
				lastScoperUser = this.parseMultiInputTokens("LastScoperUser");
			}

			var CreationDate = this.byId("CreationDate").getValue();
			var respDepName = this.byId("RespDepName").getSelectedKeys();
			var RequestedDeliveryDate = this.byId("RequestedDeliveryDate").getValue();
			var regionID = this.byId("RegionID").getSelectedKeys();
			var serviceName = this.byId("ServiceName").getSelectedKeys();
			var sessionName = this.parseSessionItems(this.byId("SessionName").getSelectedKeys());
			var changedDate ="";
			if(this.byId("ChangedDate").getValue()){
				changedDate = this.byId("ChangedDate").getValue();
			}
			
			var externalColVisibile = false, lastScoperColVisibile=false,
				externalColOrder = null, lastScoperColOrder=null;
			if (this.byId("ColExtRef")) {
				externalColVisibile = this.byId("ColExtRef").getVisible();
				externalColOrder = this.byId("ColExtRef").getOrder();
			}
			if (this.byId("ColLastScoper")) {
				lastScoperColVisibile = this.byId("ColLastScoper").getVisible();
				lastScoperColOrder = this.byId("ColLastScoper").getOrder();
			}

			var variantData = {
				ServiceRequestID: serviceRequestId,
				CaseID: caseID,
				Country: country,
				StatusDescription: statusDescription,
				CustomerName: customerName,
				ProcessorUser: processorUser,
				ServiceRequestOwnerUser: serviceRequestOwnerUser,
				LastScoperUser: lastScoperUser,
				CreatedDateFrom: "", //Obselete but cannot be deleted due to Production Compatibility Concerns
				CreatedDateTo: "", //Obselete but cannot be deleted due to Production Compatibility Concerns
				CreationDate: CreationDate,
				RespDepName: respDepName,
				RequestedDeliveryDate: RequestedDeliveryDate,
				RequestedDeliveryDateFrom: "", //Obselete but cannot be deleted due to Production Compatibility Concerns
				RequestedDeliveryDateTo: "", //Obselete but cannot be deleted due to Production Compatibility Concerns
				RegionID: regionID,
				ServiceName: serviceName,
				SessionName: sessionName,
				ChangedDate: changedDate,
				tableColumnsVisiblility: {
					"ColCustomerName": this.byId("ColCustomerName").getVisible(),
					"ColCaseID": this.byId("ColCaseID").getVisible(),
					"ColServicerequestID": this.byId("ColServicerequestID").getVisible(),
					"ColServicerequestTitle": this.byId("ColServicerequestTitle").getVisible(),
					"ColServiceRequestOwner": this.byId("ColServiceRequestOwner").getVisible(),
					"ColRequestedDeliveryDate": this.byId("ColRequestedDeliveryDate").getVisible(),
					"ColService": this.byId("ColService").getVisible(),
					"ColStatus": this.byId("ColStatus").getVisible(),
					"ColDeploymentroom": this.byId("ColDeploymentroom").getVisible(),
					"ColServiceRequestProcessor": this.byId("ColServiceRequestProcessor").getVisible(),
					"ColRegion": this.byId("ColRegion").getVisible(),
					"ColCountry": this.byId("ColCountry").getVisible(),
					"ColLastChangedDate": this.byId("ColLastChangedDate").getVisible(),
					"ColExtRef": externalColVisibile,
					"ColLastScoper": lastScoperColVisibile,
					"ColCreationDate": this.byId("ColCreationDate").getVisible(),
					"ColSession": this.byId("ColSession").getVisible()
				},
				tableColumnsOrder: {
					"ColCustomerName": this.byId("ColCustomerName").getOrder(),
					"ColCaseID": this.byId("ColCaseID").getOrder(),
					"ColServicerequestID": this.byId("ColServicerequestID").getOrder(),
					"ColServicerequestTitle": this.byId("ColServicerequestTitle").getOrder(),
					"ColServiceRequestOwner": this.byId("ColServiceRequestOwner").getOrder(),
					"ColRequestedDeliveryDate": this.byId("ColRequestedDeliveryDate").getOrder(),
					"ColService": this.byId("ColService").getOrder(),
					"ColStatus": this.byId("ColStatus").getOrder(),
					"ColDeploymentroom": this.byId("ColDeploymentroom").getOrder(),
					"ColServiceRequestProcessor": this.byId("ColServiceRequestProcessor").getOrder(),
					"ColRegion": this.byId("ColRegion").getOrder(),
					"ColCountry": this.byId("ColCountry").getOrder(),
					"ColLastChangedDate": this.byId("ColLastChangedDate").getOrder(),
					"ColExtRef": externalColOrder,
					"ColLastScoper": lastScoperColOrder,
					"ColCreationDate": this.byId("ColCreationDate").getOrder(),
					"ColSession": this.byId("ColSession").getOrder()
				},
				sort: {
					order: models.DEFAULT_SORT_ORDER,
					value: models.DEFAULT_SORT_BY
				},
				fieldVisibility: {
					"CustomerName": this.byId("filterbar").getFilterGroupItems()[8].getVisibleInAdvancedArea(),
					"CaseID": this.byId("filterbar").getFilterGroupItems()[3].getVisibleInAdvancedArea(),
					"ServicerequestID": this.byId("filterbar").getFilterGroupItems()[0].getVisibleInAdvancedArea(),
					"ServiceRequestOwner": this.byId("filterbar").getFilterGroupItems()[4].getVisibleInAdvancedArea(),
					"RequestedDeliveryDate": this.byId("filterbar").getFilterGroupItems()[6].getVisibleInAdvancedArea(),
					"Service": this.byId("filterbar").getFilterGroupItems()[1].getVisibleInAdvancedArea(),
					"Status": this.byId("filterbar").getFilterGroupItems()[7].getVisibleInAdvancedArea(),
					"Deploymentroom": this.byId("filterbar").getFilterGroupItems()[10].getVisibleInAdvancedArea(),
					"ServiceRequestProcessor": this.byId("filterbar").getFilterGroupItems()[12].getVisibleInAdvancedArea(),
					"Region": this.byId("filterbar").getFilterGroupItems()[9].getVisibleInAdvancedArea(),
					"Country": this.byId("filterbar").getFilterGroupItems()[11].getVisibleInAdvancedArea(),
					"CreationDate": this.byId("filterbar").getFilterGroupItems()[5].getVisibleInAdvancedArea(),
					"Session": this.byId("filterbar").getFilterGroupItems()[2].getVisibleInAdvancedArea(),
					"ChangedDate": this.byId("filterbar").getFilterGroupItems()[13].getVisibleInAdvancedArea()
				},
				SRListPageTopSize: models.DEFAULT_PAGE_TOP,
				SwitchUnassignedSR: this.byId("SwitchUnassignedSR").getState()
			};

			sap.ui.core.BusyIndicator.show();

			if (existingSelectedVariant) {
				existingSelectedVariant.VariantContent = JSON.stringify(variantData);
				this.updateVariants(null, existingSelectedVariant, this);
			} else {
				var newEntry = {
					"VariantSetName": "TEAM_SRSAPP",
					"VariantDisplayName": variantDetails.name,
					"VariantContent": JSON.stringify(variantData),
					"IsDefault": defaultVariant,
					"Scope": "LOCAL"
				};
				this.createVariants(variantDetails.name, newEntry, this, variantData);
			}
		},

		parseMultiInputTokens: function (inputID) {
			var tokens = this.byId(inputID).getTokens();
			var arrCase = [];
			if (tokens) {
				for (var i = 0; i < tokens.length; i++) {
					arrCase.push({
						key: tokens[i].getKey(),
						text: tokens[i].getText()
					});
				}
			}
			return arrCase;
		},

		parseSessionItems: function (selectedKeys) {
			var arrSession = {
				masterSessionData: this.getModel("MasterSessionSetModel").getData(),
				selectedKeys: selectedKeys
			};

			return arrSession;
		},

		VariantOnSelect: function (oEvent) {
			this.getModel("SessionSetModel").setData([]);

			var selectedVariantKey = oEvent.getParameters().key;
			if (selectedVariantKey !== this.defaultSelectedKey) {
				var selectedModelIndex = oEvent.getSource().getItemByKey(selectedVariantKey).getBindingContext();
				if (selectedModelIndex) {
					selectedModelIndex = selectedModelIndex.getPath();
					var selectedModel = oEvent.getSource().getModel().getProperty(selectedModelIndex);
					this.setFilterBarControlsContent(selectedModel.VariantContent);
				}
			} else {
				this.setFilterBarControlsContentAsEmpty();
				this.setDefaultFilter(this);
			}

			var state = this.byId("SwitchUnassignedSR").getState();
			this.changeSwitch(state);
		},

		createVariants: function (variantName, payload, context) {
			this.getModel("SRS_Data").create("/VariantDataSet", payload, {
				success: function (oData, resp) {
					context.readVariants(true, false, oData.VariantID);
				},
				error: function (err) {
					models.showErrorMessage(context, err);
					context.readVariants(true, false, null);
				}
			});
		},

		VariantOnManage: function (oEvent) {
			var existingFiltersData = oEvent.getSource().getModel().getData().results;
			var deletedVariants = oEvent.getParameters().deleted;
			var renamedVariants = oEvent.getParameters().renamed;
			var defaultVariant = null;

			if (oEvent.getParameters().def === this.defaultSelectedKey) {
				this.byId("pageVariantId").setInitialSelectionKey(this.defaultSelectedKey);
				this.byId("pageVariantId").setDefaultVariantKey(this.defaultSelectedKey);
				this.byId("pageVariantId").setSelectionKey(this.defaultSelectedKey);
				this.setFilterBarControlsContentAsEmpty();

				for (var j = 0; j < existingFiltersData.length; j++) {
					if (existingFiltersData[j].IsDefault === "X") {
						defaultVariant = existingFiltersData[j];
						existingFiltersData[j].IsDefault = "";
					}
				}

				if (defaultVariant && deletedVariants.length > 0 && deletedVariants.includes(defaultVariant.VariantID)) {
					defaultVariant = null;
				}

				if (defaultVariant && deletedVariants.length > 0 && renamedVariants.includes(defaultVariant.VariantID)) {
					defaultVariant = null;
				}

			} else {

				var explicitCallNeededToSetDefaultVariant = true;
				if (deletedVariants.length > 0) {
					explicitCallNeededToSetDefaultVariant = deletedVariants.includes(oEvent.getParameters().def);
				}

				if (explicitCallNeededToSetDefaultVariant && renamedVariants.length > 0) {
					explicitCallNeededToSetDefaultVariant = renamedVariants.includes(oEvent.getParameters().def);
				}

				if (oEvent.getParameters().def && oEvent.getParameters().def !== this.defaultSelectedKey) {
					for (var j = 0; j < existingFiltersData.length; j++) {
						if (oEvent.getParameters().def === existingFiltersData[j].VariantID) {
							existingFiltersData[j].IsDefault = "X";
							if (explicitCallNeededToSetDefaultVariant) {
								defaultVariant = existingFiltersData[j];
							}
						} else {
							existingFiltersData[j].IsDefault = "";
						}
					}
				}

			}

			if (deletedVariants.length > 0 || renamedVariants.length > 0 || defaultVariant) {
				this.updateVariantCollection(deletedVariants, renamedVariants, existingFiltersData, defaultVariant);
			}
		},

		updateVariants: function (variantName, payload, context) {

			if (payload) {
				if (payload["__metadata"]) {
					delete payload["__metadata"];
				}
				//var oModel = new ODataModel("/CRM_BACKEND/sap/opu/odata/sap/zs_app_srs_srv");
				this.getModel("SRS_Data").sDefaultUpdateMethod = "PUT";
				this.getModel("SRS_Data").update("/VariantDataSet(guid'" + payload.VariantID + "')", payload, {
					success: function (oData, resp) {
						sap.ui.core.BusyIndicator.hide();
						//	context.readVariants(true, false, payload.VariantID);
					},
					error: function (err) {
						models.showErrorMessage(context, err);
						context.readVariants(true, false, payload.VariantID);
					}
				});
			}
		},

		updateVariantCollection: function (deletedVariants, renamedVariants, variantCollection, defaultVariant) {
			sap.ui.core.BusyIndicator.show();

			var variantsToUpdate = [];

			for (var j = 0; j < variantCollection.length; j++) {
				for (var i = 0; i < renamedVariants.length; i++) {
					if (variantCollection[j].VariantID === renamedVariants[i].key) {
						variantCollection[j].VariantDisplayName = renamedVariants[i].name;
						variantsToUpdate.push(variantCollection[j]);
					}
				}
			}

			var oModel = this.getModel("SRS_Data");
			var aDeferredGroup = oModel.getDeferredGroups();
			aDeferredGroup.push("batchVariantsUpdate");
			oModel.setDeferredGroups(aDeferredGroup);
			var context = this;
			context.isBatchExecutedForVariant = true;
			var mParameters = {
				groupId: "batchVariantsUpdate",
				success: function (oData, resp) {
					if (context.isBatchExecutedForVariant && oData && oData.__batchResponses && oData.__batchResponses.length > 0) {
						context.readVariants(true, false, null);
					}
				},
				error: function (err) {
					if (context.isBatchExecutedForVariant) {
						context.isBatchExecutedForVariant = false;
						models.showErrorMessage(context, err);
						context.readVariants(true, false, null);
					}
				}
			};

			for (var i = 0; i < deletedVariants.length; i++) {
				oModel.remove("/VariantDataSet(guid'" + deletedVariants[i] + "')", mParameters);
			}

			for (var i = 0; i < variantsToUpdate.length; i++) {
				if (variantsToUpdate[i]["__metadata"]) {
					delete variantsToUpdate[i]["__metadata"];
				}
				oModel.sDefaultUpdateMethod = "PUT";
				oModel.update("/VariantDataSet(guid'" + variantsToUpdate[i].VariantID + "')", variantsToUpdate[i], mParameters);
			}

			if (defaultVariant) {
				if (defaultVariant["__metadata"]) {
					delete defaultVariant["__metadata"];
				}
				oModel.sDefaultUpdateMethod = "PUT";
				oModel.update("/VariantDataSet(guid'" + defaultVariant.VariantID + "')", defaultVariant, mParameters);
			}

			oModel.submitChanges(mParameters);

		},

		setFilterBarControlsContent: function (variantData) {
			variantData = JSON.parse(variantData);
			this.byId("ServiceRequestID").setValue(variantData.ServiceRequestID);
			this.byId("CaseID").setTokens(this.setMultiInputForVariants(variantData.CaseID));
			this.byId("idCountry").setTokens(this.setMultiInputForVariants(variantData.Country));
			this.byId("StatusDescription").setSelectedKeys(variantData.StatusDescription);
			this.byId("CustomerName").setValue(variantData.CustomerName);
			this.setDataForInputTypeUserControlWithVariant(variantData.ProcessorUser, "ProcessorUser");
			this.setDataForInputTypeUserControlWithVariant(variantData.ServiceRequestOwnerUser, "ServiceRequestOwnerUser");
			this.setDataForInputTypeUserControlWithVariant(variantData.LastScoperUser, "LastScoperUser");
			if(this.byId("LastScoperUser").getTokens().length>0){
				this.byId("filterbar").getFilterGroupItems()[14].setVisibleInFilterBar(true)
			}
			this.byId("CreationDate").setValue(variantData.CreationDate);
			if(variantData["ChangedDate"]){
				if(variantData.ChangedDate.operator.toUpperCase() === "DATERANGE"){
					var dates = variantData.ChangedDate.values;
					variantData.ChangedDate.values[0] = new Date(dates[0]);
					variantData.ChangedDate.values[1] = new Date(dates[1]);
					this.byId("ChangedDate").setValue(variantData.ChangedDate);
				}else{
					this.byId("ChangedDate").setValue(variantData.ChangedDate);
				}
			}else{
				this.byId("ChangedDate").setValue();
			}
			this.byId("RespDepName").setSelectedKeys(variantData.RespDepName);
			this.byId("RequestedDeliveryDate").setValue(variantData.RequestedDeliveryDate);
			this.byId("RegionID").setSelectedKeys(variantData.RegionID);
			this.byId("ServiceName").setSelectedKeys(variantData.ServiceName);
			if (variantData.SessionName && variantData.SessionName.selectedKeys && variantData.SessionName.selectedKeys.length > 0) {
				var masterSessionData = variantData.SessionName.masterSessionData;
				this.getModel("MasterSessionSetModel").setData(masterSessionData);
				masterSessionData = models.removeDuplicateSessions(masterSessionData);
				this.getModel("SessionSetModel").setData(masterSessionData);
				this.byId("SessionName").setSelectedKeys(variantData.SessionName.selectedKeys);
				this.byId("SessionName").setValueState("None");
			} else {
				this.byId("SessionName").setSelectedKeys([]);
				this.byId("SessionName").setValueState("Information");
			}

			var selectedItems = this.byId("RegionID").getSelectedItems();
			this.reloadScopingTeams(selectedItems);

			SRPersoService.resetPersData();
			this._oTPC.refresh();

			if (variantData.fieldVisibility) {
				var fieldVisibilityData = variantData.fieldVisibility;
				this.byId("filterbar").getFilterGroupItems()[8].setVisibleInAdvancedArea(fieldVisibilityData.CustomerName);
				this.byId("filterbar").getFilterGroupItems()[3].setVisibleInAdvancedArea(fieldVisibilityData.CaseID);
				this.byId("filterbar").getFilterGroupItems()[0].setVisibleInAdvancedArea(fieldVisibilityData.ServicerequestID);
				this.byId("filterbar").getFilterGroupItems()[4].setVisibleInAdvancedArea(fieldVisibilityData.ServiceRequestOwner);
				this.byId("filterbar").getFilterGroupItems()[6].setVisibleInAdvancedArea(fieldVisibilityData.RequestedDeliveryDate);
				this.byId("filterbar").getFilterGroupItems()[1].setVisibleInAdvancedArea(fieldVisibilityData.Service);
				this.byId("filterbar").getFilterGroupItems()[7].setVisibleInAdvancedArea(fieldVisibilityData.Status);
				this.byId("filterbar").getFilterGroupItems()[10].setVisibleInAdvancedArea(fieldVisibilityData.Deploymentroom);
				this.byId("filterbar").getFilterGroupItems()[12].setVisibleInAdvancedArea(fieldVisibilityData.ServiceRequestProcessor);
				this.byId("filterbar").getFilterGroupItems()[9].setVisibleInAdvancedArea(fieldVisibilityData.Region);
				this.byId("filterbar").getFilterGroupItems()[11].setVisibleInAdvancedArea(fieldVisibilityData.Country);
				this.byId("filterbar").getFilterGroupItems()[5].setVisibleInAdvancedArea(fieldVisibilityData.CreationDate);
				this.byId("filterbar").getFilterGroupItems()[2].setVisibleInAdvancedArea(fieldVisibilityData.Session);
				if(fieldVisibilityData.hasOwnProperty("ChangedDate")){
					this.byId("filterbar").getFilterGroupItems()[13].setVisibleInAdvancedArea(fieldVisibilityData.ChangedDate);
				}else{
					this.byId("filterbar").getFilterGroupItems()[13].setVisibleInAdvancedArea(true);
				}
			} else {
				this.byId("filterbar").getFilterGroupItems()[8].setVisibleInAdvancedArea(false);
				this.byId("filterbar").getFilterGroupItems()[3].setVisibleInAdvancedArea(true);
				this.byId("filterbar").getFilterGroupItems()[0].setVisibleInAdvancedArea(true);
				this.byId("filterbar").getFilterGroupItems()[4].setVisibleInAdvancedArea(true);
				this.byId("filterbar").getFilterGroupItems()[6].setVisibleInAdvancedArea(true);
				this.byId("filterbar").getFilterGroupItems()[1].setVisibleInAdvancedArea(true);
				this.byId("filterbar").getFilterGroupItems()[7].setVisibleInAdvancedArea(true);
				this.byId("filterbar").getFilterGroupItems()[10].setVisibleInAdvancedArea(true);
				this.byId("filterbar").getFilterGroupItems()[12].setVisibleInAdvancedArea(true);
				this.byId("filterbar").getFilterGroupItems()[9].setVisibleInAdvancedArea(true);
				this.byId("filterbar").getFilterGroupItems()[11].setVisibleInAdvancedArea(true);
				this.byId("filterbar").getFilterGroupItems()[5].setVisibleInAdvancedArea(true);
				this.byId("filterbar").getFilterGroupItems()[2].setVisibleInAdvancedArea(false);
				this.byId("filterbar").getFilterGroupItems()[13].setVisibleInAdvancedArea(true);
			}

			if (variantData.tableColumnsVisiblility) {
				var tableColum = variantData.tableColumnsVisiblility;
				this.byId("ColCustomerName").setVisible(tableColum.ColCustomerName);
				this.byId("ColCaseID").setVisible(tableColum.ColCaseID);
				this.byId("ColServicerequestID").setVisible(tableColum.ColServicerequestID);
				this.byId("ColServicerequestTitle").setVisible(tableColum.ColServicerequestTitle);
				this.byId("ColServiceRequestOwner").setVisible(tableColum.ColServiceRequestOwner);
				this.byId("ColRequestedDeliveryDate").setVisible(tableColum.ColRequestedDeliveryDate);
				this.byId("ColService").setVisible(tableColum.ColService);
				this.byId("ColStatus").setVisible(tableColum.ColStatus);
				this.byId("ColDeploymentroom").setVisible(tableColum.ColDeploymentroom);
				this.byId("ColServiceRequestProcessor").setVisible(tableColum.ColServiceRequestProcessor);
				this.byId("ColRegion").setVisible(tableColum.ColRegion);
				this.byId("ColCountry").setVisible(tableColum.ColCountry);
				//Condition to avoid regression due to late addition of column for saved variants
				if (tableColum.ColLastChangedDate) {
					this.byId("ColLastChangedDate").setVisible(tableColum.ColLastChangedDate);
				} else {
					this.byId("ColLastChangedDate").setVisible(false);
				}

				if (this.byId("ColExtRef")) {
					//Condition to avoid regression due to late addition of column for saved variants
					if (tableColum.ColExtRef) {
						this.byId("ColExtRef").setVisible(tableColum.ColExtRef);
					} else {
						this.byId("ColExtRef").setVisible(false);
					}
				}

				if (this.byId("ColLastScoper")) {
					//Condition to avoid regression due to late addition of column for saved variants
					if (tableColum.ColLastScoper) {
						this.byId("ColLastScoper").setVisible(tableColum.ColLastScoper);
					} else {
						this.byId("ColLastScoper").setVisible(false);
					}
				}

				this.byId("ColCreationDate").setVisible(tableColum.ColCreationDate);
				this.byId("ColSession").setVisible(tableColum.ColSession);
			}

			if (variantData.tableColumnsOrder) {
				var tableColum = variantData.tableColumnsOrder;
				this.byId("ColCustomerName").setOrder(tableColum.ColCustomerName);
				this.byId("ColCaseID").setOrder(tableColum.ColCaseID);
				this.byId("ColServicerequestID").setOrder(tableColum.ColServicerequestID);
				this.byId("ColServicerequestTitle").setOrder(tableColum.ColServicerequestTitle);
				this.byId("ColServiceRequestOwner").setOrder(tableColum.ColServiceRequestOwner);
				this.byId("ColRequestedDeliveryDate").setOrder(tableColum.ColRequestedDeliveryDate);
				this.byId("ColService").setOrder(tableColum.ColService);
				this.byId("ColStatus").setOrder(tableColum.ColStatus);
				this.byId("ColDeploymentroom").setOrder(tableColum.ColDeploymentroom);
				this.byId("ColServiceRequestProcessor").setOrder(tableColum.ColServiceRequestProcessor);
				this.byId("ColRegion").setOrder(tableColum.ColRegion);
				this.byId("ColCountry").setOrder(tableColum.ColCountry);
				if (tableColum.ColLastChangedDate) {
					this.byId("ColLastChangedDate").setOrder(tableColum.ColLastChangedDate);
				} else {
					this.byId("ColLastChangedDate").setOrder(14);
				}
				if (this.byId("ColExtRef")) {
					if (tableColum.ColExtRef) {
						this.byId("ColExtRef").setOrder(tableColum.ColExtRef);
					} else {
						this.byId("ColExtRef").setOrder(15);
					}
				}
				if (this.byId("ColLastScoper")) {
					if (tableColum.ColLastScoper) {
						this.byId("ColLastScoper").setOrder(tableColum.ColLastScoper);
					} else {
						this.byId("ColLastScoper").setOrder(16);
					}
				}
				this.byId("ColCreationDate").setOrder(tableColum.ColCreationDate);
				this.byId("ColSession").setOrder(tableColum.ColSession);
			}

			if (variantData.sort) {
				var sortData = variantData.sort;
				this.selectSortOption(sortData.value, sortData.order);
			} else {
				this.selectSortOption("RequestedDeliveryDate", "desc");
			}

			if (variantData.SRListPageTopSize) {
				models.DEFAULT_PAGE_TOP = variantData.SRListPageTopSize;
			} else {
				models.DEFAULT_PAGE_TOP = "10";
			}

			if (this.byId("hBoxSwitchUnassignedSR").getVisible() && variantData.SwitchUnassignedSR) {
				this.byId("ProcessorUser").setEnabled(false);
				this.byId("SwitchUnassignedSR").setState(variantData.SwitchUnassignedSR);
			} else {
				this.byId("ProcessorUser").setEnabled(true);
				this.byId("SwitchUnassignedSR").setState(false);
			}

		},

		setFilterBarControlsContentAsEmpty: function () {
			this.byId("ServiceRequestID").setValue("");
			this.byId("CaseID").setTokens([]);
			this.byId("idCountry").setTokens([]);
			this.byId("StatusDescription").setSelectedKeys("");
			this.byId("CustomerName").setValue("");
			this.byId("ProcessorUser").setTokens([]);
			this.byId("ServiceRequestOwnerUser").setTokens([]);
			this.byId("LastScoperUser").setTokens([]);
			this.byId("CreationDate").setValue("");
			this.byId("RespDepName").setSelectedKeys("");
			this.byId("RequestedDeliveryDate").setValue("");
			this.byId("RegionID").setSelectedKeys("");
			this.byId("ServiceName").setSelectedKeys([]);
			this.byId("SessionName").setSelectedKeys([]);
			this.byId("SessionName").setValueState("Information");
			this.byId("ChangedDate").setValue();
			var selectedItems = this.byId("RegionID").getSelectedItems();
			this.byId("SwitchUnassignedSR").setState(false);
			this.reloadScopingTeams(selectedItems);
		},

		onSRTablePersonalize: function (oEvent) {
			this._oTPC.openDialog();
			this.filterBarInputsOnChange();
		},

		onTablePersoRefresh: function () {
			SRPersoService.resetPersData();
			this._oTPC.refresh();
		},
		userSetSuccessHandler: function (oData, context) {
			try {
				var response = oData.results;
			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				return;
			}
			models.setSRS_Data_UserSet(response, this);
			var SRSdataModel = this.getModel("SRS_Data_UserSet").getData();
			if (SRSdataModel.isTQM) {
				this.byId("btnCreateNewSR").setVisible(true);
				if (!SRSdataModel.isScoper && !SRSdataModel.isApprover) {
					this.byId("ColExtRef").destroy();
				}
				//	this.byId("servicerequestTable").getColumns()[this.byId("servicerequestTable").getColumns().length-1].destroy();
			}

			if (!SRSdataModel.isTQM && !SRSdataModel.isScoper && !SRSdataModel.isApprover && !SRSdataModel.isGuest) {
				sap.ui.core.BusyIndicator.hide();
				models.showUnAuthorizedMessage(this);
			} else {
				if (jQuery.isEmptyObject(this.getModel("roleModel"))) {
					models.getDropDownListModel(this, "/DropDownListSet", "Role", "roleModel");
				}
				if (jQuery.isEmptyObject(this.getModel("timezoneModel"))) {
					models.getDropDownListModel(this, "/DropDownListSet", "TimeZone", "timezoneModel");
				}
				if (jQuery.isEmptyObject(this.getModel("regionModel"))) {
					models.getDropDownListModel(this, "/DropDownListSet", "Region", "regionModel");
				}
				if (jQuery.isEmptyObject(this.getModel("productSetModelMainView"))) {
					models.getProductSetForMainView(this, "/ProductSet", "ProductID", "productSetModelMainView", null,null);
				}
				if (jQuery.isEmptyObject(this.getModel("carSystemRoleModel"))) {
					models.getDropDownListModel(this, "/DropDownListSet", "CarSystemRole", "carSystemRoleModel");
				}
				if (jQuery.isEmptyObject(this.getModel("cancelReasonModel"))) {
					models.getDropDownListModel(this, "/DropDownListSet", "SRSCancReason", "cancelReasonModel");
				}
				models.getDeploymentRooms(this, "/DeploymentRoomSet", null, "deplRoomValuesFiltersModel", null, null, false,"XXXXXXXXXX");
				var oViewInfo = {
					View: "Main"
				};
				this.getView().setModel(new sap.ui.model.json.JSONModel(oViewInfo), "viewModel");
				this.getView().setModel(this.getModel("SRS_Data"));
				this.readVariants(false, true, null);
			}
		},
		createSearchFiltersArray: function (checkUnassigned) {
			var arrFilters = [];
			var i = 0;

			if (this.byId("ServiceRequestID").getValue()) {
				var SRID = this.byId("ServiceRequestID").getValue();
				arrFilters.push(models.filterCondition_Contains("ServiceRequestID", SRID));
			}

			var processorTokens = this.byId("ProcessorUser").getTokens();
			if (checkUnassigned && processorTokens.length === 0) {
				arrFilters.push(models.filterCondition_Equal("ProcessorUser", ""));
			} else {
				var switchUnassignedSR = this.byId("SwitchUnassignedSR").getState();
				if (this.byId("hBoxSwitchUnassignedSR").getVisible() && switchUnassignedSR) {
					arrFilters.push(models.filterCondition_Equal("ProcessorUser", ""));
				} else {
					if (processorTokens.length > 0) {
						var arrFltr = [];
						for (i = 0; i < processorTokens.length; i++) {
							arrFltr.push(models.filterCondition_Equal("ProcessorUser", processorTokens[i].getKey()));
						}
						if (arrFltr.length > 0) {
							arrFilters.push(models.filterComparison_OR(arrFltr));
						}
					}
				}
			}

			var ServiceRequestOwnerUserTokens = this.byId("ServiceRequestOwnerUser").getTokens();
			if (ServiceRequestOwnerUserTokens.length > 0) {
				var arrFltr = [];
				for (i = 0; i < ServiceRequestOwnerUserTokens.length; i++) {
					arrFltr.push(models.filterCondition_Equal("OwnerUser", ServiceRequestOwnerUserTokens[i].getKey()));
				}
				if (arrFltr.length > 0) {
					arrFilters.push(models.filterComparison_OR(arrFltr));
				}
			}

			var LastScoperUserTokens = this.byId("LastScoperUser").getTokens();
			if (LastScoperUserTokens.length > 0) {
				var arrFltr = [];
				for (i = 0; i < LastScoperUserTokens.length; i++) {
					arrFltr.push(models.filterCondition_Equal("LastScoperUser", LastScoperUserTokens[i].getKey()));
				}
				if (arrFltr.length > 0) {
					arrFilters.push(models.filterComparison_OR(arrFltr));
				}
			}

			if (this.byId("CreationDate").getDateValue()) {
				var arrFltr = [];
				var dateFrom = this.byId("CreationDate").getFrom();
				var dateTo = this.byId("CreationDate").getTo();
				if (dateFrom) {
					arrFltr.push(models.filterCondition_GreaterThanEquals("CreatedDate", formatter.formatCreationDateFrom(dateFrom)));
				}
				if (dateTo) {
					arrFltr.push(models.filterCondition_LessThanEquals("CreatedDate", formatter.formatCreationDateTo(dateTo)));
				}
				arrFilters.push(models.filterComparison_AND(arrFltr));
			}

			if (this.byId("RequestedDeliveryDate").getValue()) {
				var arrFltr = [];
				var dateFrom = this.byId("RequestedDeliveryDate").getFrom();
				var dateTo = this.byId("RequestedDeliveryDate").getTo();
				if (dateFrom) {
					arrFltr.push(models.filterCondition_GreaterThanEquals("RequestedDeliveryDate", formatter.formatCreationDateFrom(dateFrom)));
				}
				if (dateTo) {
					arrFltr.push(models.filterCondition_LessThanEquals("RequestedDeliveryDate", formatter.formatCreationDateTo(dateTo)));
				}
				arrFilters.push(models.filterComparison_AND(arrFltr));
			}

			var arrStatus = this.byId("StatusDescription").getSelectedKeys();
			var arrRespDepName = this.byId("RespDepName").getSelectedKeys();
			var arrRegionID = this.byId("RegionID").getSelectedKeys();
			var arrServiceName = this.byId("ServiceName").getSelectedKeys();
			var arrSessionName = this.byId("SessionName").getSelectedKeys();

			var arrCase = this.byId("CaseID").getTokens();
			var arrCountry = this.byId("idCountry").getTokens();
			var arrCustomer = this.byId("CustomerName").getTokens();
			if (arrCustomer.length > 0) {
				arrFltr = [];
				for (i = 0; i < arrCustomer.length; i++) {
					if (arrCustomer[i]) {
						arrFltr.push(models.filterCondition_Equal("CustomerID", arrCustomer[i].getKey()));
					}
				}
				if (arrFltr.length > 0) {
					arrFilters.push(models.filterComparison_OR(arrFltr));
				}
			}
			if (arrStatus.length > 0) {
				arrFltr = [];
				for (i = 0; i < arrStatus.length; i++) {
					if (arrStatus[i]) {
						arrFltr.push(models.filterCondition_Equal("StatusCode", arrStatus[i]));
					}
				}
				if (arrFltr.length > 0) {
					arrFilters.push(models.filterComparison_OR(arrFltr));
				}
			}

			if (arrCase.length > 0) {
				arrFltr = [];
				for (i = 0; i < arrCase.length; i++) {
					if (arrCase[i]) {
						arrFltr.push(models.filterCondition_Equal("CaseID", arrCase[i].getKey()));
					}
				}
				if (arrFltr.length > 0) {
					arrFilters.push(models.filterComparison_OR(arrFltr));
				}
			}

			if (arrCountry.length > 0) {
				arrFltr = [];
				for (i = 0; i < arrCountry.length; i++) {
					if (arrCountry[i]) {
						arrFltr.push(models.filterCondition_Equal("Country", arrCountry[i].getKey()));
					}
				}
				if (arrFltr.length > 0) {
					arrFilters.push(models.filterComparison_OR(arrFltr));
				}
			}

			if (arrRespDepName.length > 0) {
				arrFltr = [];
				for (i = 0; i < arrRespDepName.length; i++) {
					if (arrRespDepName[i]) {
						arrFltr.push(models.filterCondition_Equal("RespDepID", arrRespDepName[i]));
					}
				}
				if (arrFltr.length > 0) {
					arrFilters.push(models.filterComparison_OR(arrFltr));
				}
			}

			if (arrRegionID.length > 0) {
				arrFltr = [];
				for (i = 0; i < arrRegionID.length; i++) {
					if (arrRegionID[i]) {
						arrFltr.push(models.filterCondition_Equal("RegionID", arrRegionID[i]));
					}
				}
				if (arrFltr.length > 0) {
					arrFilters.push(models.filterComparison_OR(arrFltr));
				}
			}

			if (arrServiceName.length > 0) {
				arrFltr = [];
				for (i = 0; i < arrServiceName.length; i++) {
					if (arrServiceName[i]) {
						arrFltr.push(models.filterCondition_Equal("ServiceID", arrServiceName[i]));
					}
				}
				if (arrFltr.length > 0) {
					arrFilters.push(models.filterComparison_OR(arrFltr));
				}
			}

			if (arrSessionName.length > 0) {
				arrFltr = [];
				for (i = 0; i < arrSessionName.length; i++) {
					if (arrSessionName[i]) {
						arrFltr.push(models.filterCondition_Equal("SessionID", arrSessionName[i]));
					}
				}
				if (arrFltr.length > 0) {
					arrFilters.push(models.filterComparison_OR(arrFltr));
				}
			}
			
			if (this.byId("ChangedDate").getValue()) {
				arrFltr = [];
				var dateValue = this.byId("ChangedDate").getValue();
				if(dateValue.operator==="DATETIMERANGE"){
					dateValue.values = [new Date(dateValue.values[0]),new Date(dateValue.values[1])];
				}
				var dates = DynamicDateUtil.toDates(dateValue);
				if (dates.length===2) {
					arrFltr.push(models.filterCondition_GreaterThanEquals("ChangedDate", formatter.formatCreationDateFrom(dates[0].oDate)));
					arrFltr.push(models.filterCondition_LessThanEquals("ChangedDate", formatter.formatCreationDateTo(dates[1].oDate)));
					arrFilters.push(models.filterComparison_AND(arrFltr));
				}
			}

			return models.filterComparison_AND(arrFilters);

		},
		setMultiInputForVariants: function (arrValue) {
			var aFilters = [];
			if (arrValue) {
				for (var i = 0; i < arrValue.length; i++) {
					aFilters.push(new sap.m.Token({
						key: arrValue[i].key,
						text: arrValue[i].text
					}));
				}
			}
			return aFilters;
		},
		onExit: function () {
			this._oTPC.destroy();
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.unsubscribe("onSRColumnPress", "onSRColumnPressSuccess", this.onSRColumnPressSuccess, this);
		},
		createSRExportColumnConfig: function () {
			return [{
				label: this.getResourceBundle().getText("customer"),
				property: "CustomerName",
				type: "string",
				width: "25"
			}, {
				label: this.getResourceBundle().getText("caseId"),
				property: "CaseID",
				type: "number",
				width: "10"
			}, {
				label: this.getResourceBundle().getText("servicerequestID"),
				property: "ServiceRequestID",
				type: "number",
				width: "10"
			}, {
				label: this.getResourceBundle().getText("servicerequestTitle"),
				property: "Description",
				type: "string",
				width: "30"
			}, {
				label: this.getResourceBundle().getText("serviceRequestOwner"),
				property: "OwnerName",
				type: "string",
				width: "20"
			}, {
				label: this.getResourceBundle().getText("txtCreated"),
				property: "CreatedDate",
				type: "string",
				width: "20"
			}, {
				label: this.getResourceBundle().getText("requestedDeliveryDate"),
				property: "RequestedDeliveryDate",
				type: "date",
				width: "12"
			}, {
				label: this.getResourceBundle().getText("service"),
				property: "ServiceName",
				type: "string",
				width: "20"
			}, {
				label: this.getResourceBundle().getText("session"),
				property: "SessionName",
				type: "string",
				width: "20"
			}, {
				label: this.getResourceBundle().getText("totalCallOffDays"),
				property: "TotalCallOffDays",
				type: "number",
				width: "10"
			}, {
				label: this.getResourceBundle().getText("status"),
				property: "StatusDescription",
				type: "string",
				width: "12"
			}, {
				label: this.getResourceBundle().getText("serviceOrder"),
				property: "ServiceOrderID",
				type: "string",
				width: "10"
			}, {
				label: this.getResourceBundle().getText("deploymentroom"),
				property: "RespDepName",
				type: "string",
				width: "20"
			}, {
				label: this.getResourceBundle().getText("serviceRequestProcessor"),
				property: "ProcessorName",
				type: "string",
				width: "20"
			}, {
				label: this.getResourceBundle().getText("region"),
				property: "RegionName",
				type: "string",
				width: "20"
			}, {
				label: this.getResourceBundle().getText("txtCountry"),
				property: "Country",
				type: "string",
				width: "20"
			}, {
				label: this.getResourceBundle().getText("txtLastChangedDate"),
				property: "ChangedDate",
				type: "string",
				width: "20"
			}, {
				label: this.getResourceBundle().getText("txtExtRef"),
				property: "ExternalRef",
				type: "string",
				width: "20"
			},{
				label: this.getResourceBundle().getText("txtLastScoper"),
				property: "LastScoperName",
				type: "string",
				width: "20"
			}];
		},
		onExportServiceRequest: function () {
			var that = this;
			var dialog = new Dialog({
				title: this.getResourceBundle().getText("confirmExport"),
				type: "Message",
				state: "Information",
				icon: "sap-icon://message-information",
				content: new Text({
					text: this.getResourceBundle().getText("exportConfirmationMessage")
				}),
				beginButton: new Button({
					text: this.getResourceBundle().getText("dialogChangeStatusYes"),
					press: function () {
						var aCols, oSettings, oSheet;

						//Download data from server
						var SRFilterTemp = [];
						var variantFilters = that.createSearchFiltersArray(false);
						if (variantFilters.aFilters.length > 0) {
							SRFilterTemp.push(variantFilters);
						}

						that.getModel("SRS_Data").read("/ServiceRequestHeaderSet", {
							filters: [models.filterComparison_AND(SRFilterTemp)],
							success: function (oData) {

								for (var i = 0; i < oData.results.length; i++) {
									oData.results[i].ChangedDate = models.formatDateTimeForExcel(oData.results[i].ChangedDate);
									oData.results[i].CreatedDate = models.formatDateTimeForExcel(oData.results[i].CreatedDate);
								}

								// Export downloaded data
								aCols = that.createSRExportColumnConfig();

								oSettings = {
									workbook: {
										columns: aCols,
										context: {
											title: that.getResourceBundle().getText("servicerequestTable"),
											sheetName: that.getResourceBundle().getText("servicerequestTable")
										}
									},
									dataSource: oData.results,
									fileName: that.getResourceBundle().getText("servicerequestTable") + ".xlsx"
								};

								oSheet = new Spreadsheet(oSettings);
								oSheet.build()
									.then(function () {

									})

								.finally(function () {
									oSheet.destroy();
								});
							}.bind(that),
							error: function (error) {
								models.showErrorMessage(that, error);
							}.bind(that)
						});

						dialog.close();
					}
				}),
				endButton: new Button({
					text: this.getResourceBundle().getText("dialogChangeStatusNo"),
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
		onResetFilterBar: function () {
			var variantControl = this.byId("pageVariantId");
			var selectedVariantKey = variantControl.getSelectionKey();
			if (selectedVariantKey !== this.defaultSelectedKey) {
				var selectedModelIndex = variantControl.getItemByKey(selectedVariantKey).getBindingContext();
				if (selectedModelIndex) {
					selectedModelIndex = selectedModelIndex.getPath();
					var selectedModel = variantControl.getModel().getProperty(selectedModelIndex);
					this.setFilterBarControlsContent(selectedModel.VariantContent);
				}
			} else {
				this.setFilterBarControlsContentAsEmpty();
				this.setDefaultFilter(this);
			}
		},
		filterBarInputsOnChange: function (oEvent) {

			if (oEvent) {
				if (oEvent.getSource().getName() === "CREATION_DATE" || oEvent.getSource().getName() === "RQDLDATE") {
					var dateFrom = oEvent.getSource().getFrom();
					var dateTo = oEvent.getSource().getTo();
					if (oEvent.getParameter("valid") !== undefined && !oEvent.getParameter("valid")) {
						oEvent.getSource().setFrom(dateFrom);
						oEvent.getSource().setTo(dateTo);
						if (dateFrom && dateTo) {
							var val = models.date(dateFrom) + " " + oEvent.getSource().getDelimiter() + " " + models.date(dateTo);
							oEvent.getSource().setValue(val);
						} else if (dateFrom && !dateTo) {
							var val = models.date(dateFrom);
							oEvent.getSource().setValue(val);
							oEvent.getSource().setValueState("Warning");
							oEvent.getSource().setValueStateText(this.getResourceBundle().getText("txtValidDateWarning"));
						} else {
							oEvent.getSource().setValue(null);
						}
						return;
					} else {
						if (dateFrom && !dateTo) {
							oEvent.getSource().setValueState("Warning");
							oEvent.getSource().setValueStateText(this.getResourceBundle().getText("txtValidDateWarning"));
						} else {
							oEvent.getSource().setValueState("None");
						}
					}
				}

				if (oEvent.getParameter("valid") !== undefined && !oEvent.getParameter("valid")) {
					try{
						models.dateValidation(oEvent.getSource(), oEvent.getSource().getDateValue(), this);
						return;
					}catch(exception){
						
					}
				}

				if (oEvent.getSource().getName() === "DELIVERY_REGION") {
					var selectedItems = oEvent.getSource().getSelectedItems();
					this.reloadScopingTeams(selectedItems);
				}
				
				if(oEvent.getSource().getName() ===  "LASTCHANGED_DATE"){
					var selectionValue = oEvent.getParameter("value");
					if(selectionValue && selectionValue.operator.toUpperCase() === "PARSEERROR"){
						oEvent.getSource().setValue();
					}
				}
			}

			if (oEvent && oEvent.getSource().getName() === "SERVICE") {
				var selectedKeys = oEvent.getSource().getSelectedKeys();
				var remainingSelectedSessions = [];
				var selectedSessionKeys = this.byId("SessionName").getSelectedKeys();
				if (oEvent.getParameters().selected) {
					models.getSessionForFilter(this, oEvent.getParameters().changedItem.getKey());
				} else {
					var existingSessions = this.getModel("MasterSessionSetModel").getData();
					var tempSessions = [];
					for (var i = 0; i < existingSessions.length; i++) {
						if (oEvent.getParameters().changedItem.getKey() !== existingSessions[i].ProductID) {
							tempSessions.push(existingSessions[i]);
						}
					}
					this.getModel("MasterSessionSetModel").setData(tempSessions);
					tempSessions = models.removeDuplicateSessions(tempSessions);
					for (var j = 0; j < selectedSessionKeys.length; j++) {
						for (var z = 0; z < tempSessions.length; z++) {
							if (selectedSessionKeys[j] === tempSessions[z].ComponentId) {
								remainingSelectedSessions.push(selectedSessionKeys[j]);
								break;
							}
						}
					}
					this.getModel("SessionSetModel").setData(tempSessions);
					this.byId("SessionName").setSelectedKeys(remainingSelectedSessions);
				}

				if (selectedKeys && selectedKeys.length > 0) {
					this.byId("SessionName").setValueState("None");
				} else {
					this.byId("SessionName").setValueState("Information");
				}
			}

			this.modifySavedVariant();
		},
		reloadScopingTeams: function (selectedItems) {
			var DRData;
			if(this.getModel("deplRoomValuesRawModel")){
				DRData = this.getModel("deplRoomValuesRawModel").getData();
			}
			//var DRData = this.getModel("deplRoomValuesRawModel").getData();
			if(DRData){
				if (selectedItems.length > 0) {
					var regionList = "";
					for (var i = 0; i < selectedItems.length; i++) {
						regionList += selectedItems[i].getKey() + ",";
					}
					var filterdDRData = [];
					for (var i = 0; i < DRData.length; i++) {
						if (regionList.includes(DRData[i].SrRegion)) {
							filterdDRData.push(DRData[i]);
						}
					}
					filterdDRData = models.removeDuplicateDR(filterdDRData);
					this.getModel("deplRoomValuesFiltersModel").setData(filterdDRData);
				} else {
					DRData = models.removeDuplicateDR(DRData);
					this.getModel("deplRoomValuesFiltersModel").setData(DRData);
				}
			}
		},
		handleSRListSortBtnPressed: function (oEvent) {
			var oView = this.getView();
			var dialog = oView.byId("idDialogSort");
			if (!dialog) {
				// create dialog via fragment factory
				dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.SRListSort", this);
				oView.addDependent(dialog);
			}
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();
		},
		handleSortDialogConfirm: function (oEvent) {
			var mParams = oEvent.getParameters();
			var sortBy = mParams.sortItem.getKey();
			var sorderOrder = "asc";
			if (mParams.sortDescending) {
				sorderOrder = "desc";
			}
			models.DEFAULT_SORT_BY = sortBy;
			models.DEFAULT_SORT_ORDER = sorderOrder;
			//sap.ui.core.BusyIndicator.show();
			var SRFilterTemp = [];
			var variantFilters = this.createSearchFiltersArray(false);
			if (variantFilters.aFilters.length > 0) {
				SRFilterTemp.push(variantFilters);
			}
			this.byId("servicerequestTable").setModel(new JSONModel({results:[]}));
			this._FilterServiceRequestTable([models.filterComparison_AND(SRFilterTemp)], 0, sortBy, sorderOrder);
			this.modifySavedVariant();
		},
		onCountrySearch: function (oEvent) {
			var countryModel = new JSONModel({
				data: [],
				skip: 0,
				top: 10,
				showMoreButtonVisible: false,
				searchString: "",
				total: 0,
				inlineCount: 0
			});
			this.setModel(countryModel, "countryModel");

			var oView = this.getView();
			var dialog = oView.byId("CountryDialog");

			if (!dialog) {
				// create dialog via fragment factory
				dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.CountrySearch", this);
				oView.addDependent(dialog);
			}
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();
			this.byId("idCountryInput").setValue("");
			models.applyBrowserAutoFillOff();
		},
		onPressCloseCountryDialog: function () {
			this.byId("CountryDialog").close();
		},
		onPressOkCountryDialog: function () {
			var selectedItems = this.byId("srs_Countrytable").getSelectedItems();
			if (selectedItems && selectedItems.length > 0) {
				for (var i = 0; i < selectedItems.length; i++) {
					this.byId("idCountry").addToken(new sap.m.Token({
						key: selectedItems[i].getCells()[0].getText(),
						text: selectedItems[i].getCells()[1].getText()
					}));
				}
				this.byId("CountryDialog").close();
				this.filterBarInputsOnChange();
			}else{
				sap.m.MessageToast.show("Select at least one Country");
			}
			
		},
		onCountrySearchInDialog: function (oEvent) {
			var pageNumber = 0;
			var top = this.getModel("countryModel").getProperty("/top");
			var searchString = this.byId("idCountryInput").getValue();
			this.getModel("countryModel").setProperty("/searchString", searchString);
			this.getModel("countryModel").setProperty("/pageNumber", pageNumber);
			this.getCountry(searchString, pageNumber, top);
			var selectedItems = this.byId("srs_Countrytable").getSelectedItems();
			for (var i = 0; i < selectedItems.length; i++) {
				selectedItems[i].setSelected(false);
			}
		},
		getCountry: function (searchString, pageNumber, top) {
			this.byId("btnCountrySearch").setEnabled(false);
			this.byId("srs_Countrytable").setBusyIndicatorDelay(0);
			this.getModel("busyIndicatorModel").setProperty("/dropdownList", true);
			var that = this;
			var arrFilter = [];
			arrFilter.push(models.filterCondition_Equal("Type", "Country"));
			var urlParam = {
				"$skip": pageNumber * 10,
				"$top": top,
				"$inlinecount": "allpages"
			};
			if (searchString) {
				urlParam["search"] = searchString;
			}
			var filter = models.filterComparison_AND(arrFilter);

			this.getModel("SRS_Data").read("/DropDownListSet", {
				filters: [filter],
				urlParameters: urlParam,
				success: function (oData) {
					this.byId("btnCountrySearch").setEnabled(true);
					var results = oData.results;

					if (pageNumber > 0) {
						var existingDataSet = that.getModel("countryModel").getProperty("/data");
						if (existingDataSet.length > 0) {
							results = existingDataSet.concat(results);
						}
					}

					that.getModel("countryModel").setProperty("/data", results);
					that.getModel("countryModel").setProperty("/total", results.length);
					pageNumber++;
					that.getModel("countryModel").setProperty("/pageNumber", pageNumber);
					that.getModel("countryModel").setProperty("/inlineCount", oData.__count);

					if (oData && oData.results && oData.results.length > 9) {
						that.getModel("countryModel").setProperty("/showMoreButtonVisible", true);
					} else {
						that.getModel("countryModel").setProperty("/showMoreButtonVisible", false);
					}
					that.getModel("busyIndicatorModel").setProperty("/dropdownList", false);
				}.bind(that),
				error: function () {
					that.getModel("busyIndicatorModel").setProperty("/dropdownList", false);
					sap.m.MessageToast.show(that.getResourceBundle().getText("errorText"));
				}.bind(that)
			});
		},
		pressShowMoreCountry: function (oEvent) {
			var searchString = this.getModel("countryModel").getProperty("/searchString");
			var pageNumber = this.getModel("countryModel").getProperty("/pageNumber");
			var top = this.getModel("countryModel").getProperty("/top");
			this.getCountry(searchString, pageNumber, top);
		},
		roleBtnOnPress: function (oEvent) {
			var oView = this.getView();
			var dialog = oView.byId("UserRolesDialog");

			if (!dialog) {
				// create dialog via fragment factory
				dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.UserRolesDialog", this);
				oView.addDependent(dialog);
			}
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();
		},
		onPressCloseRolesDialog: function (oEvent) {
			this.byId("UserRolesDialog").close();
		},
		editPageOnPress: function (oEvent) {
			var oView = this.getView();
			var dialog = oView.byId("PageSizeDialog");

			if (!dialog) {
				// create dialog via fragment factory
				dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.DialogPageSizeSRList", this);
				oView.addDependent(dialog);
			}
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();
			this.byId("pageSizeCombo").setSelectedKey(models.DEFAULT_PAGE_TOP);
			this.byId("pageSizeCombo").setValueState("None");
			this.getModel("buttonControlModel").setProperty("/enablePageSizeOkBtn",true);
		},
		onClosePageSizeDialog: function (oEvent) {
			this.byId("PageSizeDialog").close();
		},
		onChangePageSizeCombo: function(oEvent){
			if(!oEvent.getSource().getSelectedItem()){
				oEvent.getSource().setValueState("Error");
				oEvent.getSource().setValueStateText("Invalid page size");
				this.getModel("buttonControlModel").setProperty("/enablePageSizeOkBtn",false);
			}else{
				oEvent.getSource().setValueState("None");
				oEvent.getSource().setValueStateText("");
				this.getModel("buttonControlModel").setProperty("/enablePageSizeOkBtn",true);
			}
		},
		setPageSize: function (oEvent) {
			if (this.byId("pageSizeCombo").getSelectedKey()) {
				models.DEFAULT_PAGE_TOP = this.byId("pageSizeCombo").getSelectedKey();
				this.onFilterPressed();
				this.modifySavedVariant();
				this.byId("PageSizeDialog").close();
			} 
		},
		showSearchUnassignedSR: function (oEvent) {
			var oButton = oEvent.getSource();
			var that = this;
			if (!this._RelatedPartnerHintPopover) {
				this._RelatedPartnerHintPopover = Fragment.load({
					id: this.getView().getId(),
					name: "sap.com.servicerequest.servicerequest.fragment.SearchUnassignedPopover",
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
		changeSwitchUnassignedSR: function (oEvent) {
			var state = oEvent.getParameters().state;
			this.changeSwitch(state);
			this.modifySavedVariant();
		},
		changeSwitch: function (state) {
			if (state) {
				this.byId("ProcessorUser").setTokens([]);
				this.byId("ProcessorUser").setEnabled(false);
			} else {
				this.byId("ProcessorUser").setEnabled(true);
			}
		},
		onSRColumnPressSuccess: function(channel, event, selectedColumn){
			var SRTableColumns = this.byId("servicerequestTable").getColumns();
			var currentSortIndicator = selectedColumn.getSortIndicator();
			var sortBy = selectedColumn.getBindingInfo("sortIndicator").binding.sPath;
			
			for(var i=0;i<SRTableColumns.length;i++){
				SRTableColumns[i].setSortIndicator("None");
			}
			var sortOrder;
			if(sortBy){
				sortBy = sortBy.split("/")[1];
			}
			if(currentSortIndicator==="Ascending"){
				selectedColumn.setSortIndicator("Descending");
				sortOrder="desc";
			}else if(currentSortIndicator==="Descending"){
				selectedColumn.setSortIndicator("Ascending");
				sortOrder="asc";
			}else{
				if(sortBy === "ServiceRequestID" || sortBy === "CreatedDate" || sortBy === "ChangedDate" || sortBy === "RequestedDeliveryDate" ){
					sortOrder = "desc";
					selectedColumn.setSortIndicator("Descending");
				}else{
					sortOrder = "asc";
					selectedColumn.setSortIndicator("Ascending");
				}
			}
			
			models.DEFAULT_SORT_BY = sortBy;
			models.DEFAULT_SORT_ORDER = sortOrder;
			//sap.ui.core.BusyIndicator.show();
			var SRFilterTemp = [];
			var variantFilters = this.createSearchFiltersArray(false);
			if (variantFilters.aFilters.length > 0) {
				SRFilterTemp.push(variantFilters);
			}
			this.byId("servicerequestTable").setModel(new JSONModel({results:[]}));
			this._FilterServiceRequestTable([models.filterComparison_AND(SRFilterTemp)], 0, sortBy, sortOrder);
			this.modifySavedVariant();
			
		}
	});
});