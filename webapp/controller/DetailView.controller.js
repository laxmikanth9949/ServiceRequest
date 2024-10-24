sap.ui.define(["sap/com/servicerequest/servicerequest/controller/BaseController",
"../model/formatter",
"sap/m/MessageBox",
"sap/ui/model/Filter",
"sap/ui/core/routing/History",
"sap/m/Button",
"sap/m/Dialog",
"sap/m/Text",
"sap/m/Input",
"sap/ui/model/Sorter",
"sap/m/MessageToast",
"sapit/controls/EmployeeDataSearchDialog",
"sapit/controls/EmployeeDataInfoPopover",
"sap/ui/model/json/JSONModel",
"sap/ui/core/Fragment",
"sap/com/servicerequest/servicerequest/model/models",
"sap/m/library",
'sap/viz/ui5/format/ChartFormatter',
'sap/viz/ui5/api/env/Format',
'sap/ui/util/Storage'
], function (BaseController, formatter, MessageBox, Filter, History, Button, Dialog, Text, Input, Sorter, MessageToast,
EmployeeDataSearchDialog, EmployeeDataInfoPopover, JSONModel, Fragment, models, MobileLibrary, ChartFormatter, Format, Storage) {
"use strict";

return BaseController.extend("sap/com/servicerequest/servicerequest/controller/DetailView", {
	formatter: formatter,
	caseId: null,
	directPageAccess: false,
	copySRTitle: false,
	copySRInfo: false,
	statusNewDesc:"New",
   extractedProductParams: null,
   handleRouteMatched: function (oEvent) {
		var oParams = {};
		if (oEvent.getParameter("data").context) {
			this.sContext = oEvent.getParameter("data").context;
			var oPath;
			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}
		}

		// Reset Text Area Growing (Service Request Scope & Agreed Scope) on Display
		this.resetTextAreaGrowing();

		//Apply Auto filter off for Google Chrome
		models.applyBrowserAutoFillOff();
	},
	handleExpand: function (oEvent) {
		var sSelectedKey = oEvent.getSource().getSelectedKey();

		if (sSelectedKey.indexOf("requestTab") > -1) {
			this.byId("send-service-request").setVisible(true);
			this.byId("approve-sr-scope").setVisible(false);
			this.byId("send-sr-to-exception").setVisible(false);
			this.byId("send-so-to-sr-creation").setVisible(false);
			this.byId("create_sr").setVisible(true);
			this.byId("ms").setVisible(false);

		} else if (sSelectedKey.indexOf("ScopeTab") > -1) {
			this.byId("send-service-request").setVisible(false);
			this.byId("approve-sr-scope").setVisible(true);
			this.byId("send-sr-to-exception").setVisible(false);
			this.byId("send-so-to-sr-creation").setVisible(false);
			this.byId("copy_sr").setVisible(false);
			this.byId("create_sr").setVisible(true);
			this.byId("ms").setVisible(true);

		} else if (sSelectedKey.indexOf("ApprovalTab") > -1) {
			this.byId("send-service-request").setVisible(false);
			this.byId("approve-sr-scope").setVisible(false);
			this.byId("send-sr-to-exception").setVisible(true);
			this.byId("send-so-to-sr-creation").setVisible(false);
			this.byId("copy_sr").setVisible(false);
			this.byId("create_sr").setVisible(true);
			this.byId("ms").setVisible(false);

		} else if (sSelectedKey.indexOf("SOCreationTab") > -1) {
			this.byId("send-service-request").setVisible(false);
			this.byId("approve-sr-scope").setVisible(false);
			this.byId("send-sr-to-exception").setVisible(false);
			this.byId("send-so-to-sr-creation").setVisible(true);
			this.byId("copy_sr").setVisible(true);
			this.byId("create_sr").setVisible(false);
			this.byId("ms").setVisible(false);
		}
	},

	_onButtonPress: function () {
		return new Promise(function (fnResolve) {
			var sTargetPos = "default";
			sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;
		}).catch(function (err) {
			if (err !== undefined) {
				MessageBox.error(err.message);
			}
		});
	},

	_onButtonSaveSR: function () {
		return new Promise(function (fnResolve) {
			var sTargetPos = "default";
			sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;
		}).catch(function (err) {
			if (err !== undefined) {
				MessageBox.error(err.message);
			}
		});
	},

	handleEmpSearchValueHelp: function (oEvent) {
		
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

   _handleEmpSearchValueHelpConfirm: function (oEvent) {
		var oSelectedProcessor = oEvent.getParameter("value").user;	
		var SRStatus = this.getModel("servicerequestModel").getProperty("/StatusCode");
		var SROwner = this.getModel("servicerequestModel").getProperty("/OwnerUser");
		if((SRStatus === models.STATUS_INSCOPING || SRStatus === models.STATUS_INEXCEPTION) && SROwner === oSelectedProcessor.ID){
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.information(
				this.getResourceBundle().getText("txtMsgProcessorSameAsRequestor"), {
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				}
			);
			return;		
		}
		
		this.byId("procInput").setTokens([]);
		var name = oSelectedProcessor.firstName + " " + oSelectedProcessor.lastName;
		this.byId("procInput").addToken(new sap.m.Token({
			key: oSelectedProcessor.ID,
			text: name
		}));
		//this.byId("processor-avatar-edit").setEmployeeId(oSelectedProcessor.ID);
		if (this.byId("srs_ownerAndPeople")) {
			var fullName = oSelectedProcessor.firstName + " " + oSelectedProcessor.lastName;
			//this.byId("srs_ownerAndPeople").setValue(oSelectedProcessor.firstName + " " + oSelectedProcessor.lastName);
			models.setTokenForCaseOwner(this, "srs_ownerAndPeople", oSelectedProcessor.ID, fullName);
			this.getModel("caseSearchModel").setProperty("/owner", fullName);
			this.getModel("caseSearchModel").setProperty("/ownerId", oSelectedProcessor.ID);
		}
		this.getModel("servicerequestModel").setProperty("/ProcessorUser", oSelectedProcessor.ID);
		this.getModel("servicerequestModel").setProperty("/ProcessorName", oSelectedProcessor.firstName + " " + oSelectedProcessor.lastName);
	},

	onProcessorChange: function (oEvent) {
		if (oEvent.getParameter('type') === sap.m.Tokenizer.TokenUpdateType.Removed) {
			//this.byId("processor-avatar-edit").setSrc("");
			this.getView().getModel("servicerequestModel").setProperty("/ProcessorUser", "");
		}
	},

	setPageBusy: function () {
		this.byId("DetailPage").setBusy(!this.byId("DetailPage").getBusy());
	},

	setComboBoxContainsFilterDetail: function () {
		this.getView().byId("region-edit").setFilterFunction(function (searchString, oItem) {
			searchString = searchString.trim();
			return models.comboBoxContainsFilterFunction(oItem, searchString, false);
		});
		this.getView().byId("dr-edit").setFilterFunction(function (searchString, oItem) {
			return models.comboBoxContainsFilterFunction(oItem, searchString, true);
		});
	},

	toggleEditDisplaySuccess: function () {
		this.onEdit();
	},

	onInit: function () {
		var oViewInfo = {
			View: "Detail"
		};

		this.setComboBoxContainsFilterDetail();

		var oEventBus = sap.ui.getCore().getEventBus();
		oEventBus.subscribe("onSaveServiceRequest", "onSaveServiceRequestSuccess", this.onSaveServiceRequestSuccess, this);
		oEventBus.subscribe("displayContractItemMessage", "displayContractItemMessageSuccess", this.displayContractItemMessageSuccess,
			this);
		oEventBus.subscribe("onSaveSR", "onSaveSRSuccess", this.onSaveSRSuccess, this);
		oEventBus.subscribe("toggleEditDisplay", "toggleEditDisplaySuccess", this.toggleEditDisplaySuccess, this);
		oEventBus.subscribe("onSendForScoping", "onSendForScopingSuccess", this.onSendForScoping, this);
		oEventBus.subscribe("onCreateSO", "onCreateSOSuccess", this.onCreateSO, this);
		oEventBus.subscribe("evaluateSRProgress", "evaluateSRProgressSuccess", this.evaluateSRProgress, this);
		oEventBus.subscribe("showPotentialLeadTime", "showPotentialLeadTimeSuccess", this.showPotentialLeadTime, this);
		oEventBus.subscribe("enableCreateSOBtnInDialog", "enableCreateSOBtnInDialogSuccess", this.enableCreateSOBtnInDialog, this);
		oEventBus.subscribe("deleteSRItemsForDisplayScope", "setDeleteSRItemsForDisplayScope", this.setDeleteSRItemsForDisplayScope, this);
		oEventBus.subscribe("setFocusForScopingTeam", "setFocusForScopingTeam", this.setFocusForScopingTeam, this);
		oEventBus.subscribe("editSR", "editSRSuccess", this.onEdit, this);
		oEventBus.subscribe("onDetailClose", "onDetailCloseSuccess", this.onDetailClose, this);
		oEventBus.subscribe("toggleDisplayAndEdit", "toggleDisplayAndEdit", this.toggleDisplayAndEdit, this);
		
		this.getView().setModel(new sap.ui.model.json.JSONModel(oViewInfo), "viewModel");
		// Initialize ErrorModel
		this.setModel(new JSONModel({
			message: []
		}), "errorModel");
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		this.oRouter.getTarget("DetailView").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
		this.oEventBus = sap.ui.getCore().getEventBus();
		this.oRouter = this.getRouter();
		this.oRouter.getRoute("DetailView").attachPatternMatched(function (oParams) {
		   if(this.getModel("backNavModel")){
			   this.getModel("backNavModel").setProperty("/isMainViewVisible",false);
		   }
			this.oEventBus.publish("ScopeTableReset", "ScopeTableResetSuccess");
			var caseModel = new JSONModel({
				caseString: "",
				data: [],
				total: 0,
				page: 0,
				current: 0,
				visible: false
			});
			this.setModel(caseModel, "caseModel");
			this.sServiceRequestId = oParams.getParameter("arguments").ServiceRequestID;
			this.caseId = oParams.getParameter("arguments").CaseId;
			this.extractedProductParams = null;
		   if(oParams.getParameter("arguments")["?query"]){
			   if(oParams.getParameter("arguments")["?query"].paramsProduct){
				   this.extractedProductParams = oParams.getParameter("arguments")["?query"].paramsProduct;
			   }
			   if(oParams.getParameter("arguments")["?query"].paramCreateSO){
				   models.extracedParamCreateSO = oParams.getParameter("arguments")["?query"].paramCreateSO;
			   }
		   }
		   if(this.caseId === "0") {
				this.extractedProductParams = null;
		   }
		   this.setButtonControlModelForControlsVisibility();
			if (jQuery.isEmptyObject(this.getModel("SRS_Data_UserSet").getData())) {
				sap.ui.core.BusyIndicator.show();
				this.directPageAccess = true;
				this.getModel("SRS_Data").read("/UserSet", {
					success: function (UserSetData) {
						try {
							var response = UserSetData.results;
						} catch (err) {
							sap.ui.core.BusyIndicator.hide();
							return;
						}
						models.setSRS_Data_UserSet(response, this);
						var SRSdataModel = this.getModel("SRS_Data_UserSet").getData();
						// Track User
						if (SRSdataModel.userId !== "") {
							models.trackUser(this.getOwnerComponent(), SRSdataModel.userId);
						}
						if (!SRSdataModel.isTQM && !SRSdataModel.isScoper && !SRSdataModel.isApprover && !SRSdataModel.isGuest) {
							sap.ui.core.BusyIndicator.hide();
							models.showUnAuthorizedMessage(this);
							return;
						} else {
							this.preLoadOnInit();
						}
					}.bind(this),
					error: function (err) {
						sap.ui.core.BusyIndicator.hide();
						models.showErrorMessage(this, err);
					}.bind(this)
				});
			} else {
				this.preLoadOnInit();
			}
			this.setModel(new JSONModel([]),"valueDriverModel");
			this.setModel(new JSONModel([]),"selectedValueDriverModel");
			this.setModel(new JSONModel([]),"selectedValueDriverRawModel");
		}.bind(this), this);
		this.oModel = this.getModel();

		var oView = this.getView();
		oView.setModel(this.oModel, "main");

		oView.addEventDelegate({
			onBeforeShow: function () {
				if (sap.ui.Device.system.phone) {
					var oPage = oView.getContent()[0];
					if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
						oPage.setShowNavButton(true);
						oPage.attachNavButtonPress(function () {
							this.oRouter.navTo("", {}, true);
						}.bind(this));
					}
				}
			}.bind(this)
		});

		if (sap.ui.Device.resize.width >= 1770) {
			var oColumnLayoutModel = new sap.ui.model.json.JSONModel({
				"layout": "Large"
			});
			this.setModel(oColumnLayoutModel, "ScreenLayoutModel");
		} else {
			var oColumnLayoutModel = new sap.ui.model.json.JSONModel({
				"layout": "Small"
			});
			this.setModel(oColumnLayoutModel, "ScreenLayoutModel");
		}
	},
	growFire: function (oEvent) {
		models.growFire(oEvent);
	},
	displayContractItemMessageSuccess: function () {
		this.byId("msgStripContractItemValidationDisplayMode").setVisible(true);
	},
   setButtonControlModelForControlsVisibility : function(){
	   //init button models in existing record.
	   var buttonControlModel = new JSONModel({
		   isCancelSRVisible: false,
		   isBackToAuthorVisible: false,
		   isApproveScopeVisible: false,
		   isReadyForScoping: false,
		   caseMoreButton: false,
		   createRequestButtonEnabled: false,
		   isEdit: false,
		   isNewRequest: false,
		   displayEditButtonText: this.getResourceBundle().getText("edit"),
		   displayEditButtonIcon: "sap-icon://edit",
		   isSOCreated: false,
		   requestApproval: false,
		   isEditable: true,
		   itemAddBtn: false,
		   statusBtnEnabled: false,
		   refreshBtnVisible: true,
		   isCopyVisible: false,
		   isCopyEnabled: false,
		   showContractValidationMessageStrip: false,
		   showMsgForDatesValidationAgainstCurrentDate: false,
		   showEODServiceControl: false,
		   showMsgStripFilterBarEODContactDialog: false,
		   showAttachMsgStrip: false,
		   showAttachUpload: false,
		   enableAttachDownloadAllBtn: false,
		   attachmentCount: "Uploaded (0)",
		   showUploadDelete: true,
		   enableAttachmentUpload: true,
		   //enableOSPCheckbox: false,
		   isCommentsChanged: false,
		   caseWithoutReasonWarning: false,
		   showContractWorkAtRisk: false,
		   txWorkAtRisk: "",
		   enableDeleteAllItems: false,
		   busyIndicatorSurveyRecpt: false,
		   visibleSurveyRecipientSwitch: true,
		   visibleNoSurveyRecipientLink: false,
		   visibleTxtMandatoryField: false,
		   txtMandatoryField: "Mandatory field is missing.",
		   selectedMandtField: "",
		   showMsgForOCDService: false,
		   showContractFieldsBasedOnSelectedService: true,
		   showCloudRefObjSection: false,
		   busyIndicatorCloudRefTable: false,
		   visibleRowCount: models.DEFAULT_VISIBLEROWCOUNT_CLOUDREFOBJ,
		   isShowMoreCloudRefObjVisible: false,
		   busyIndictorSystemDropdown:false,
		   busyIndicatorFavQualList: false,
		   noDataTextFUQual:"No Data",
		   visibleFeedbackForm: true,
		   visibleMessageStripInSystemDialogForSessionFilter:false,
		   textMessageStripInSystemDialogForSessionFilter:"",
		   showServiceResultReviewfield: false,
		   isScopingTeamFieldVisible: true,
		   busyIndicatorRDLDropdown: false,
		   enableConfirmBtnForCCDialog:false,
		   isSystemVisible: true,
		   showBusyForCancellationPopoverTextArea: false,
		   showRDLfield: false,
		   isAnyRuleViolated:false,
		   IsPreferredSuccessServiceSelected: false,
		   busyIndicatorServiceDropdown: false,
		   showSignavioInstructionsMsgStrip:false,
		   approvalRuleInfoTxt: "",
		   valueDriverDropdowneditable: true,
		   visibleProcessorInfoBtn:false
	   });
	   this.setModel(buttonControlModel, "buttonControlModel");
	   
   },
   removeLocalStorage: function(){
	   var oMyStorage = new Storage(Storage.Type.session, "SRS_Session");
	   oMyStorage.remove(models.STORAGE_KEY_SR_ID);
   },
   preLoadOnInit: function () {
		this.getModel("SRS_Data_UserSet").setProperty("/AvailableCallOffDays", "");
		
		var buttonControlModel = this.getModel("buttonControlModel");
		// Model to handle fields Display/Edit
		var editableFieldsModel = new JSONModel({
			Case: true,
			SRTitle: true,
			DRegion: false,
			DRoom: false,
			Processor: false,
			Customer: false,
			CustomerContact: false,
			//OSPSystem: false,
			System: false, // Get enabled on selection of Case
			GoLiveDate: false, // Get enabled on selection of Case
			Timezone: true,
			SRInfo: true,
			Service: true,
			Session: true,
			ReqDelDate: true,
			Contract: false, // Get enabled on selection Service and Case
			ContractItem: false, // Get enabled on selection Contract
			AgreedScope: false,
			Discussion: true,
			SRItems: true,
			ExtRef: true,
		 	ImmediateSO: true,
      		visibleFeedbackFormCheckboxEditable: true,
			IsPreferredSuccessServiceSelected: false
		});
		var caseSearchModel = new JSONModel({
			caseId: "",
			customer: "",
			owner: this.getModel("SRS_Data_UserSet").getProperty("/userName"),
			ownerId: this.getModel("SRS_Data_UserSet").getProperty("/userId")
		});
		this.setModel(caseSearchModel, "caseSearchModel");
		this.setModel(editableFieldsModel, "editableFieldsModel");

		this.setModel(new JSONModel([]), "defaultItemsModel");

		this.byId("iconViolationAlertDisplay").setVisible(false);
		this.setModel(new sap.ui.model.json.JSONModel([]), "servicerequestAttachmentModel");
		if (!this.copySRInfo) {
			this.setModel(new JSONModel({
				"Text": "",
				"isServiceRequestInfoChanged": "false"
			}), "serviceRequestScopeModel");
		}
		this.setModel(new JSONModel({
			"Text": "",
			"isAgreedScopeChanged": "false"
		}), "agreedServiceRequestScopeModel");
		this.setModel(new JSONModel([]), "cancellationDescModel");
		this.setModel(new JSONModel(), "commentsModel");
		if (this.sServiceRequestId === models.SR_NEW_ID) {
		   this.copySRInfo = false;
			if (this.byId("procInput")) {
				this.byId("procInput").setTokens([]);
			}
			this.setModel(new JSONModel({
				message: []
			}), "errorModel");
			this.setModel(new JSONModel(), "contractSetModel");
			this.setModel(new JSONModel(), "contractItemModel");
			if (this.caseId !== "") {
				models.existingService = "";
				models.existingSession = "";
				models.existingSessionProductName = "";
				var SRSdataModel = this.getModel("SRS_Data_UserSet").getData();

				//only case is editable
				var array = ["SRTitle", "Service", "Session", "ReqDelDate", "SRInfo"];
				models.setDetailPageFieldsToDisplay(array, this);
				if (SRSdataModel.isTQM) {

					var servicerequestModel = new JSONModel({
						CaseID: null,
						Description: null,
						RespDepID: null,
						CustomerID: null,
						ContactID: null,
						RegionID: null,
						ReferenceSystemID: null,
						OwnerUser: this.getModel("SRS_Data_UserSet").getProperty("/userId"),
						OwnerName: this.getModel("SRS_Data_UserSet").getProperty("/userName"),
						ProcessorUser: "",
						ProcessorName: "",
						StatusDescription: this.statusNewDesc,
						StatusCode: models.STATUS_NEW, // New
						ServiceOrderID: "",
						InstNo: "",
						FeedbackEnabled: false,
						ServiceReviewEnabled: false,
						ParentCaseID: "",
					});
					this.setModel(servicerequestModel, "servicerequestModel");
				   if (this.caseId !== "0") {
						//Load Fav Qualifications
						if(this.caseId){
							this.setModel(new JSONModel([]), "favQualificationsModel");
						   models.getServiceRequestByCaseID(this,this.caseId);
						}
						this.getSRDraftHeaderFromCase(this.caseId, "", null, null, null);
					} else {
						this.onCaseSearch();
					}
				   /*
					if (this.byId("processor-avatar-edit")) {
						this.byId("processor-avatar-edit").setEmployeeId("");
					}*/

					this.setBusyIndicatorForCloudRefTable();
					this.toggleDisplayAndEdit();
				   	buttonControlModel.setProperty("/isNewRequest", true);
					this.getModel("buttonControlModel").setProperty("/refreshBtnVisible", false);
					this.getModel("buttonControlModel").setProperty("/showAttachMsgStrip", true);
					this.getModel("buttonControlModel").setProperty("/showAttachUpload", false);
					this.oEventBus.publish("expandSRInfoTextarea", "expandSRInfoTextareaSuccess");
					this.oEventBus.publish("resetSystem", "resetSystemSuccess");
					//reset case
					this.resetCaseState();

					this.setModel(new JSONModel(), "scopeServiceModel");
					this.setModel(new JSONModel([{
						ProductId: null,
						ProductName: null
					}]), "scopeSessionModel");
					this.setModel(new JSONModel(), "servicerequestItemsModel");
					this.setModel(new JSONModel(), "servicerequestApprovalModel");

					this.setServiceRequestInfoTemplate(null,null,this);
					//this.setAgreedScopeTemplate();

					if (jQuery.isEmptyObject(this.getModel("timezoneModel"))) {
						models.getDropDownListModel(this, "/DropDownListSet", "TimeZone", "timezoneModel");
					}
					if (jQuery.isEmptyObject(this.getModel("regionModel"))) {
						models.getDropDownListModel(this, "/DropDownListSet", "Region", "regionModel");
					}
					this.setModel(new JSONModel(), "deplRoomModel");
					if (jQuery.isEmptyObject(this.getModel("qualificationModel"))) {
						models.getQualificationDropDownListModel(this,"qualificationModel");
					}
					if (jQuery.isEmptyObject(this.getModel("roleModel"))) {
						models.getDropDownListModel(this, "/DropDownListSet", "Role", "roleModel");
					}
					if (jQuery.isEmptyObject(this.getModel("cancelReasonModel"))) {
						models.getDropDownListModel(this, "/DropDownListSet", "SRSCancReason", "cancelReasonModel");
					}
					if (jQuery.isEmptyObject(this.getModel("deliveryTeamModel"))) {
						models.getDeliveryTeams(this, "/DeliveryTeamSet", "", "deliveryTeamModel",null);
					}
					if (jQuery.isEmptyObject(this.getModel("carSystemRoleModel"))) {
						models.getDropDownListModel(this, "/DropDownListSet", "CarSystemRole", "carSystemRoleModel");
					}
					this.setModel(new JSONModel(), "systemModel");
					this.getModel("SRS_Data_UserSet").getData().customerId = "";
					
					sap.ui.core.BusyIndicator.hide();

				} else {
					sap.ui.core.BusyIndicator.hide();
					models.showUnAuthorizedMessage(this);
				}

			} else {
				// ToDo Show error message
			}
			this.oEventBus.publish("removeCustomerContact", "removeCustomerContactSuccess");
			this.oEventBus.publish("removeSurevyRecipient", "removeSurevyRecipientSuccess");
			models.wasPreviousServicePreferredSuccess = false;
		   this.removeLocalStorage();
		} else if (this.sServiceRequestId === models.STRING_COPY_SR) {
			if (this.byId("procInput")) {
				this.byId("procInput").setTokens([]);
			}
			if (this.caseId !== "") {

				if (this.caseId !== "0") {
					if (this.getModel("servicerequestModel")) {
						var dialogReqDelDate = this.getModel("servicerequestModel").getProperty("/RequestedDeliveryDate");
					   this.getSRDraftHeaderFromCase(this.caseId, "", this.sServiceRequestId, buttonControlModel, dialogReqDelDate);
					} else {
						//window.history.back();
						var oMyStorage = new Storage(Storage.Type.session, "SRS_Session");
						this.getRouter().navTo("DetailView", {
							ServiceRequestID: oMyStorage.get(models.STORAGE_KEY_SR_ID),
							CaseId: this.caseId
						});
						this.getModel("SRS_Data_UserSet").getData["isCreatingNewSR"] = false;
						var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.information(
							this.getResourceBundle().getText("msgCopyPageOnRefresh"), {
								styleClass: bCompact ? "sapUiSizeCompact" : ""
							}
						);
					}
				}

			} else {
				this.copySRInfo = false;
				// ToDo Show error message
			}

		} else {
			this.copySRInfo = false;
			this.setModel(new JSONModel(), "contractSetModel");
			this.setModel(new JSONModel(), "contractItemModel");
			// display mode
			this.byId("fragmentDetailPageHeaderContentDisplay").setVisible(true);
			this.byId("fragmentDetailDiscussionDisplay").setVisible(true);
			this.byId("fragmentDetailAttachmentDisplay").setVisible(true);
			//this.byId("fragmentDetailRequestDisplay").setVisible(true);
			this.byId("fragmentDetailScopeDisplay").setVisible(true);
			this.byId("fragmentDetailApprovalDisplay").setVisible(true);
			this.byId("fragmentDetailPageHeaderContentEdit").setVisible(false);
			this.byId("detailApproval").setVisible(false);
			this.byId("detailScope").setVisible(false);
			//this.byId("detailRequest").setVisible(false);
			this.byId("detailDiscussion").setVisible(false);
			this.byId("detailAttachments").setVisible(false);

			this.setModel(new JSONModel([{
				ProductId: null,
				ProductName: null
			}]), "scopeSessionModel");

			this.setModel(buttonControlModel, "buttonControlModel");
			this.setBusyIndicatorForCloudRefTable();
			//reset case
			this.resetCaseState();
			this.loadOnInit(false, null, false, false);
		   this.removeLocalStorage();
		}
	},
	setBusyIndicatorForCloudRefTable: function(){
		var CloudReferenceObjectSetModel = this.getModel("CloudReferenceObjectSetModel");
		if(CloudReferenceObjectSetModel && CloudReferenceObjectSetModel.getData()){
			if(models.hasCreationOrDeletionTriggeredForCRO){
				this.getModel("buttonControlModel").setProperty("/busyIndicatorCloudRefTable",true);
			}else{
				this.getModel("buttonControlModel").setProperty("/busyIndicatorCloudRefTable",false);
			}
		}
	},
	copyServiceRequest: function (buttonControlModel) {
		models.setDocumentTitle(this,null,null,null);
		var SRSdataModel = this.getModel("SRS_Data_UserSet").getData();
		if (SRSdataModel.isTQM) {

			var servicerequestModel = this.getModel("servicerequestModel").getData();
			servicerequestModel.ServiceRequestID = "";
			servicerequestModel.StatusDescription = this.statusNewDesc;
			servicerequestModel.StatusCode = models.STATUS_NEW;
			if (!this.copySRTitle) {
				servicerequestModel.Description = "";
			}
			servicerequestModel.OwnerUser = this.getModel("SRS_Data_UserSet").getProperty("/userId");
			servicerequestModel.OwnerName = this.getModel("SRS_Data_UserSet").getProperty("/userName");
			servicerequestModel.ProcessorUser = "";
			servicerequestModel.ProcessorName = "";
			servicerequestModel.HeaderGUID = "";
			delete servicerequestModel["HeaderGUID"];

			var oEventBus = sap.ui.getCore().getEventBus();

			var servicerequestItemsModel = this.getModel("servicerequestItemsModel").getData();
			var reqDelDate = new Date(servicerequestModel.RequestedDeliveryDate);
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
					oEventBus.publish("setItem20_DateTime", "setItem20_DateTimeSuccess", servicerequestItemsModel[i].StartDate);
				}

				servicerequestItemsModel[i].ParentGUID = "";
				servicerequestItemsModel[i].HeaderGUID = "";
				servicerequestItemsModel[i].ItemGUID = "";
			}
			
			buttonControlModel.setProperty("/isNewRequest", true);
			this.setModel(buttonControlModel, "buttonControlModel");

		   	servicerequestModel.ReferenceSystemID = "";
			servicerequestModel.ReferenceSystemName = "";
			servicerequestModel.InstNo = "";
			servicerequestModel.SolmanComponent = "";
			if(servicerequestModel.ServiceID){
				var productSetModel = this.getModel("productSetModel");
				if(productSetModel && productSetModel.getData()){
					var productData = productSetModel.getData();
					for(var i=0;i<productData.length;i++){
						if(productData[i].ProductID === servicerequestModel.ServiceID){
							this.getModel("buttonControlModel").setProperty("/IsPreferredSuccessServiceSelected",productData[i].PreferredSuccess);
							break;
						}
					}
				}
			}
			oEventBus.publish("resetSystem", "resetSystemSuccess");
			
			this.getModel("buttonControlModel").setProperty("/refreshBtnVisible", false);
			this.getModel("buttonControlModel").setProperty("/showAttachMsgStrip", true);
			this.getModel("buttonControlModel").setProperty("/showAttachUpload", false);

			this.setModel(new JSONModel(servicerequestModel), "servicerequestModel");
			this.getModel("servicerequestModel").setProperty("/RequestedDeliveryDate", new Date(reqDelDate));
			this.setModel(new JSONModel(servicerequestItemsModel), "servicerequestItemsModel");
			this.setModel(new sap.ui.model.json.JSONModel(), "servicerequestApprovalModel");
			if (!this.copySRInfo) {
				this.setModel(new JSONModel({
					"Text": "",
					"isServiceRequestInfoChanged": "false"
				}), "serviceRequestScopeModel");

				this.copySRInfo = false;
			} else {
				if (this.getModel("serviceRequestScopeModel").getProperty("/Text")) {
					this.getModel("serviceRequestScopeModel").setProperty("/isServiceRequestInfoChanged", "true");
					this.getModel("serviceRequestScopeModel").setProperty("/data", []);
				}
			}
			this.setModel(new JSONModel({
				"Text": "",
				"isAgreedScopeChanged": "false"
			}), "agreedServiceRequestScopeModel");
			this.setModel(new JSONModel(), "commentsModel");

			this.setServiceRequestInfoTemplate(null,null,this);
			//this.setAgreedScopeTemplate();
			if (jQuery.isEmptyObject(this.getModel("regionModel"))) {
				models.getDropDownListModel(this, "/DropDownListSet", "Region", "regionModel");
			}
			this.getModel("SRS_Data_UserSet").getData().customerId = "";
			sap.ui.core.BusyIndicator.hide();
			oEventBus.publish("loadScopeOnSRCopy", "loadScopeOnSRCopySuccess");
			this.toggleDisplayAndEdit();
		} else {
			sap.ui.core.BusyIndicator.hide();
			models.showUnAuthorizedMessage(this);
		}
	},
	resetCaseState: function () {
		if (this.byId("srs_case-input")) {
			this.byId("srs_case-input").setValueState(null);
		}
	},
	resetISDHubBtnPoperties: function () {
		this.byId("btnISDHub").removeStyleClass(
			"classISDHubBtnGreen classISDHubBtnYellow classISDHubBtnBlue classISDHubBtnRed classISDHubBtnGrey");
		this.byId("btnISDHub").setText(this.getResourceBundle().getText("txtCheckingISDHubStatus"));
	},
	loadOnInit: function (isCalledAfterUpdateSuccess, previousSRStatus, isRefreshedAfterSOCreationFailDialog,
		hasSuccessDialogAppearedAfterSave) {
		//reset error model
		this.setModel(new JSONModel({
			message: []
		}), "errorModel");

		this.getModel("buttonControlModel").setProperty("/isCopyEnabled", false);
		this.byId("msgStripContractItemValidationDisplayMode").setVisible(false);
		this.getModel("buttonControlModel").setProperty("/refreshBtnVisible", true);
		this.byId("edit_SR").setVisible(true);
		this.getModel("buttonControlModel").setProperty("/processorInputEnabled", false);
		this.getModel("buttonControlModel").setProperty("/statusBtnEnabled", false);
		var that = this;
		// Read Notes
		this.reloadNotes();
		sap.ui.core.BusyIndicator.show();
		this.resetISDHubBtnPoperties();
		this.getModel("SRS_Data").read("/ServiceRequestHeaderSet('" + this.sServiceRequestId + "')", {
			success: function (oData, response) {
				sap.ui.core.BusyIndicator.hide();
				if (response.headers['sap-message']) {
					var jsonMessage = JSON.parse(response.headers['sap-message'])
					if (jsonMessage.severity == "error") {
						//push error message to ErrorModel
						//showMessageBox
						jsonMessage.type = sap.ui.core.MessageType.Error;
						var messageData = [];
						messageData.push(jsonMessage);
						this.getModel("errorModel").setProperty("/message", messageData);
						if (jsonMessage.details.length > 0) {
							for (var i = 0; i < jsonMessage.details.length; i++) {
								switch (jsonMessage.details[i].severity) {
								case "error":
									jsonMessage.details[i].type = sap.ui.core.MessageType.Error;
									break;
								case "warning":
									jsonMessage.details[i].type = sap.ui.core.MessageType.Warning;
									break;
								default:
									break;
								}
							}
							this.getModel("errorModel").setProperty("/message", this.getModel("errorModel").getProperty("/message").concat(jsonMessage
								.details));
						}
					}
				}
				if (oData) {
					models.getProductSet(this, "/ProductSet", "ProductID", "productSetModel", this.extractedProductParams,null,oData.CustomerID);
					this.callISDHUbInterface(oData.CustomerID);
					//Load Fav Qualifications
					if(oData.CaseID){
						this.setModel(new JSONModel([]), "favQualificationsModel");
					   	models.getServiceRequestByCaseID(this,oData.CaseID);
					}
				   
					if(oData.ServiceID){
						this.showHideContractAndRelatedFields(oData.ServiceID,oData.CustomerID);
						if(!this.getModel("buttonControlModel").getProperty("/isEdit")){
							models.validateSelectedServiceInSR(this,oData.CustomerID,oData.ServiceID,oData.SessionID,oData.StatusCode);
							models.getValueDriverBySessionId(this,oData.SessionID);
						}
					}
					models.checkSurveyRecipientForCustomer(this, oData.CustomerID);
					this.getchangedHistory(false, null);
					this.setModel(new JSONModel(oData), "servicerequestModel");
					this.getModel("buttonControlModel").setProperty("/isAnyRuleViolated",false);
					var system = this.getModel("servicerequestModel").getProperty("/ReferenceSystemID");
					if (system === "0") {
						this.getModel("servicerequestModel").setProperty("/ReferenceSystemID", "");
					}
					if (oData.CustomerID) {
						this.getModel("caseSearchModel").setProperty("/customer", oData.CustomerID);
						this.getModel("caseSearchModel").setProperty("/owner", "");
						this.getModel("caseSearchModel").setProperty("/ownerId", "");
					}
					this.setModel(new JSONModel([{
						ProductName: oData.ServiceName,
						ProductID: oData.ServiceID
					}]), "scopeServiceModel");

					this.setModel(new JSONModel([{
						ProductName: oData.SessionName,
						ProductID: oData.SessionID
					}]), "scopeSessionModel");

					models.overallBtnsAndFieldsValidations(oData.StatusCode, this);

					if (this.directPageAccess) {
						this.directPageAccess = false;
						if (jQuery.isEmptyObject(this.getModel("timezoneModel"))) {
							models.getDropDownListModel(this, "/DropDownListSet", "TimeZone", "timezoneModel");
						}
						if (jQuery.isEmptyObject(this.getModel("regionModel"))) {
							models.getDropDownListModel(this, "/DropDownListSet", "Region", "regionModel");
						}
						if (jQuery.isEmptyObject(this.getModel("productSetModel"))) {
							models.getProductSet(this, "/ProductSet", "ProductID", "productSetModel", null,{"ServiceID": oData.ServiceID,"RegionID":oData.RegionID,"SrID":oData.ServiceRequestID},oData.CustomerID);
						}
						if (jQuery.isEmptyObject(this.getModel("qualificationModel"))) {
							models.getQualificationDropDownListModel(this,"qualificationModel");
						}
						if (jQuery.isEmptyObject(this.getModel("roleModel"))) {
							models.getDropDownListModel(this, "/DropDownListSet", "Role", "roleModel");
						}

						if (jQuery.isEmptyObject(this.getModel("cancelReasonModel"))) {
							models.getDropDownListModel(this, "/DropDownListSet", "SRSCancReason", "cancelReasonModel");
						}

						if (jQuery.isEmptyObject(this.getModel("carSystemRoleModel"))) {
							models.getDropDownListModel(this, "/DropDownListSet", "CarSystemRole", "carSystemRoleModel");
						}
					} else {
						this.setModel(this.getModel("productSetModel"), "productSetModel");
					}
					if (oData.RegionID) {
						models.getDeploymentRooms(this, "/DeploymentRoomSet", oData.RegionID, "deplRoomModel", null, "dr-edit", false,null);
					} else {
						this.setModel(new JSONModel(), "deplRoomModel");
					}
					models.getDeliveryTeams(this, "/DeliveryTeamSet", "", "deliveryTeamModel",oData.ServiceRequestID);
					// Get Service Order Status
					if (!isCalledAfterUpdateSuccess && oData.StatusCode === models.STATUS_SOCREATED) {
						if(oData.ServiceOrderID){
							models.getServiceOrderStatusModel(this, false, oData.ServiceOrderID, "serviceOrderStatusModel",
								isRefreshedAfterSOCreationFailDialog);
						}
					}

					this.loadBlockViews();
					if (isCalledAfterUpdateSuccess) {
						var msgTxt;
						if (oData.StatusCode === models.STATUS_SOCREATED) {
							if(oData.ServiceOrderID){
								models.getServiceOrderStatusModel(this, true, oData.ServiceOrderID, "serviceOrderStatusModel",
									isRefreshedAfterSOCreationFailDialog);
							}
						} else if (previousSRStatus === models.STATUS_INSCOPING && oData.StatusCode === models.STATUS_INSCOPING && oData.ImmediateSoCreationEnabled) {
							models.isSRStatusReRead = true;
							sap.ui.core.BusyIndicator.show(0);
							setTimeout(function () {
								this.reReadSRStatus(isRefreshedAfterSOCreationFailDialog, oData.ServiceRequestID, msgTxt);
								models.isSRStatusReRead = false;
							}.bind(this), 5000);
						} else if (oData.StatusCode === models.STATUS_INSCOPING) {
							msgTxt = "<div>Service Request <strong>" + oData.ServiceRequestID +
								"</strong> Sent to Scoping.<br/><br/> <strong>What's Next?</strong> Scoping Team will be in touch with you shortly. In the meantime, you can still update your Service Request.</div>";
							models.showSRCreationAndUpdateMessage(this, msgTxt);
						} else if (oData.StatusCode === models.STATUS_AUTHORACTION) {
							msgTxt = "<div>Service Request <strong>" + oData.ServiceRequestID +
								"</strong> updated successfully.<br/><br/> <strong>What's Next?</strong> Finalize Service Request and submit it for Scoping.</div>";
							models.showSRCreationAndUpdateMessage(this, msgTxt);
						} else if (oData.StatusCode === models.STATUS_APPROVED || oData.StatusCode === models.STATUS_VIOLATED) {
							if (previousSRStatus === oData.StatusCode) {
								var roleURL = models.ARM_Link + models.getSystemLandscapeInfo() + models.SU02_PROFILE;
								msgTxt =
									"<div><strong>Your Service Order creation appears incomplete.</strong> Please refresh browser page and check Service Request status to confirm a successful Service Order creation.</br>If your Service Request is still in status APPROVED, please <strong>request missing authorizations <a href='" +
									roleURL +
									"' target='_blank'>here</a></strong> and continue with Service Order creation after you get the authorization granted</div>";
								this.showSRCreationAndUpdateMessageIfSOCreationFails(this, msgTxt);
							} else {
								if (oData.StatusCode === models.STATUS_APPROVED) {
									msgTxt = "<div>Service Request <strong>" + oData.ServiceRequestID +
										"</strong> updated successfully.<br/><br/> <strong>What's Next?</strong>";
									msgTxt = msgTxt + "<ul><li>Service Requester will be able to trigger Service Order creation. </li></ul></div>";
								}
								if (oData.StatusCode === models.STATUS_VIOLATED) {
									msgTxt = "<div>Service Request <strong>" + oData.ServiceRequestID +
										"</strong> updated successfully, but at least one rule was violated (See section APPROVAL).<br/><br/> <strong>What's Next?</strong>";
									msgTxt = msgTxt +
										"<li>Service Requester will have to either put the SR in “Author Action” and correct Service Request to avoid rule violations, or Service Requester should request exception approval. In this case, Scoping Team will assign a CoE Manager to review the Service Request and act on rule violations.</li></ul></div>";
								}
								models.showSRCreationAndUpdateMessage(this, msgTxt, oData.StatusCode);
							}
						} else if (oData.StatusCode === models.STATUS_INEXCEPTION) {
							msgTxt = "<div>Service Request <strong>" + oData.ServiceRequestID +
								"</strong> updated successfully, but is in status “In Exception”.<br/><br/> <strong>What's Next?</strong><li>Scoping Team will assign a CoE Manager who will review the Service Request.</li><li>CoE Manager will go to the APPROVAL section in edit mode, Approve or Reject each violated rule via the green/red action buttons, and add a comment in the discussion section.</li><li>Rejected violations need to be adjusted by the Service Requester. When all violated rules got approved the SR Status turns into “Approved” and Service Requester can trigger “SO Creation”.</li><br/></div>";
							models.showSRCreationAndUpdateMessage(this, msgTxt, oData.StatusCode);
						} else if (oData.StatusCode === models.STATUS_CANCELED) {
							msgTxt = "<div>Service Request <strong>" + oData.ServiceRequestID +
								"</strong> Cancelled Successfully.</div>";
							models.showSRCreationAndUpdateMessage(this, msgTxt);
						} else {
							MessageBox.success(this.getResourceBundle().getText("serviceRequestUpdateSuccess", oData.ServiceRequestID));
						}
					} else {
						if (!hasSuccessDialogAppearedAfterSave) {
							if (oData.StatusCode === models.STATUS_VIOLATED) {
								msgTxt = "<div>Service Request <strong>" + oData.ServiceRequestID +
									"</strong> has at least one violated rule (See section Approval).<br/><br/> <strong>What's Next?</strong><li>Service Requester will have to either put the SR in “Author Action” and correct Service Request to avoid rule violations, or Service Requester should request exception approval. In this case, Scoping Team will assign a CoE Manager to review the Service Request and act on rule violations.</li></div>";
								models.showSRCreationAndUpdateMessage(this, msgTxt, oData.StatusCode);
							} else if (oData.StatusCode === models.STATUS_INEXCEPTION) {
								msgTxt = "<div>Service Request <strong>" + oData.ServiceRequestID +
									"</strong>  is in status “In Exception”.<br/><br/> <strong>What's Next?</strong><li>Scoping Team will assign a CoE Manager who will review the Service Request.</li><li>CoE Manager will go to the APPROVAL section in edit mode, Approve or Reject each violated rule via the green/red action buttons, and add a comment in the discussion section.</li><li>Rejected violations need to be adjusted by the Service Requester. When all violated rules got approved the SR Status turns into “Approved” and Service Requester can trigger “SO Creation”.</li><br/></div>";
								models.showSRCreationAndUpdateMessage(this, msgTxt, oData.StatusCode);
							} else if (oData.StatusCode === models.STATUS_APPROVED) {
								msgTxt = "<div>Service Request <strong>" + oData.ServiceRequestID +
									"</strong>  is in status Approved.<br/><br/> <strong>What's Next?</strong><ul><li>Service Requester will be able to trigger Service Order creation. </li></ul></div>";
								this.showApprovedSRMessage(this, msgTxt, oData.StatusCode);
							}
						} else {
							this.showDialogMessageUponSRSave(oData.StatusCode, oData.ServiceRequestID);
						}
					}
					this.byId("procInput").setTokens([]);
					if (oData.ProcessorUser) {
						this.byId("procInput").addToken(new sap.m.Token({
							key: oData.ProcessorUser,
							text: oData.ProcessorName
						}));
					}
					models.goLiveDate = this.getModel("servicerequestModel").getProperty("/GoLiveDate");
					models.getCloudRefObj(this);
				}
				this.byId("ShowMoreCloudRefObjDisplay").setText("Show less");
				models.showHideMaxRowsForCloudRefObjs(this.byId("idTreeTableCloudRefDisplay"),this.byId("ShowMoreCloudRefObjDisplay"),this);
				if(oData){
					models.setDocumentTitle(this,oData.ServiceRequestID,oData.StatusDescription,oData.Description);
				}
				models.findProductAndReloadScopingTeamForPreferredSuccessService(this,oData.ServiceID, oData.RegionID, oData.ServiceRequestID);
				if($(".hyperLinkClassDetailHeader")){
					$(".hyperLinkClassDetailHeader").contextmenu(function () { return false; });
				}
			}.bind(this),
			error: function () {
				sap.m.MessageToast.show(this.getResourceBundle().getText("errorText"));
				sap.ui.core.BusyIndicator.hide();
				this.hideBusyDialog();
			}.bind(this)
		});
		if (this.sServiceRequestId !== models.SR_NEW_ID) {
			models.getAttachments(this, this.sServiceRequestId);
		}
	},

	reReadSRStatus: function(isRefreshedAfterSOCreationFailDialog, ServiceRequestID, msgTxt){
		this.getModel("buttonControlModel").setProperty("/statusBtnEnabled",false);
		this.getModel("SRS_Data").read("/ServiceRequestHeaderSet('" + ServiceRequestID + "')", {
			success: function (oDataResponse) {
				this.getModel("buttonControlModel").setProperty("/statusBtnEnabled",true);
				if (oDataResponse) {
					var status = oDataResponse.StatusCode;
					if (status !== models.STATUS_SOCREATED) {
						msgTxt = "<div><strong>Your Service Order creation appears incomplete.</strong> Please refresh browser page after few minutes and check Service Request status to confirm a successful Service Order creation.</div>";
						models.showSRCreationAndUpdateMessage(this, msgTxt);
					} else if (oDataResponse.StatusCode === models.STATUS_SOCREATED){
						if(oDataResponse.ServiceOrderID){
							models.getServiceOrderStatusModel(this, true, oDataResponse.ServiceOrderID, "serviceOrderStatusModel",
								isRefreshedAfterSOCreationFailDialog);
						}
						this.setModel(new JSONModel(oDataResponse), "servicerequestModel");	
						this.getModel("buttonControlModel").setProperty("/isApproveScopeVisible",false);
						this.getModel("buttonControlModel").setProperty("/isBackToAuthorVisible",false);
						this.getModel("buttonControlModel").setProperty("/isCancelSRVisible",false);

					}else {
						this.loadOnInit(true, null, false, false);
						this.getModel("buttonControlModel").setProperty("/isNewRequest", false);
					}
				}
				sap.ui.core.BusyIndicator.hide();
			}.bind(this),
			error: function (error) {
				models.showErrorMessage(context, error);
				sap.ui.core.BusyIndicator.hide();
			}.bind(this)
		});
	},

	showSRCreationAndUpdateMessageIfSOCreationFails: function (context, htmlTxt) {
		var resourceI18n = context.getModel("i18n");
		var dialog = new sap.m.Dialog({
			title: resourceI18n.getProperty("txtSRMsgBoxTitleWarning"),
			type: 'Message',
			state: 'Warning',
			contentWidth: "70%",
			content: [
				new sap.m.VBox({
					visible: true,
					items: [
						new sap.ui.core.HTML({
							content: htmlTxt
						})
					]
				})
			],
			beginButton: new sap.m.Button({
				text: 'Refresh',
				type: 'Emphasized',
				press: function () {
					context.loadOnInit(false, null, true, false);
					dialog.destroy();
				}.bind(context)
			}),
			/* endButton: new sap.m.Button({
				text: 'Ok',
				press: function () {
					dialog.destroy();
				}.bind(context)
			}), */
			afterClose: function () {
				dialog.destroy();
			}
		});
	   dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
		dialog.open();
	},

	loadBlockViews: function (stepId) {
		this.oEventBus.publish("DetailScope", "DetailScopeReadSuccess", stepId);
		this.oEventBus.publish("DetailApproval", "DetailApprovalReadSuccess", stepId);
	},

	onRequestApproval: function () {
		// update status = E0004 In Exception
		this.checkStatusValidationForSOCreationAndScopeApproval(models.STATUS_INEXCEPTION, "dialogTextRequestApproval");
	},
	commentInputOnChange: function (oEvent) {
		if (oEvent.getParameters().value) {
			oEvent.getSource().getParent().getBeginButton().setEnabled(true);
		} else {
			oEvent.getSource().getParent().getBeginButton().setEnabled(false);
		}
		return oEvent.getParameters().value;
	},
	onBackToAuthor: function () {
		// update status = E0008 Author Action	
		var discussionComments = this.getModel("commentsModel").getData();
		var lastCommentUserId = "",
			lastCommentCreationDate;
		var currentUserId = this.getModel("SRS_Data_UserSet").getProperty("/userId");
		var todaysDate = new Date();
		if (discussionComments && discussionComments.data.length > 0) {
			var latestComment = discussionComments.data[0];
			lastCommentUserId = latestComment.CreatedBy;
			if (lastCommentUserId.toUpperCase() === currentUserId.toUpperCase()) {
				//lastCommentCreationDate = new Date(lastComment.CreatedOn);
				lastCommentCreationDate = new Date(latestComment.CreatedTmstmp);
			}
		}
		if (lastCommentCreationDate && (todaysDate.getFullYear() === lastCommentCreationDate.getFullYear() && todaysDate.getMonth() ===
				lastCommentCreationDate.getMonth() && todaysDate.getDate() === lastCommentCreationDate.getDate())) {
			this._showDialogForStatusChange(models.STATUS_AUTHORACTION, this.getResourceBundle().getText("dialogTextSendForAuthorAction",
				this.sServiceRequestId));
		} else {
			var msg = this.getResourceBundle().getText("txtBacktoAuthorValidationMsg", this.sServiceRequestId);
			var that = this;
			var commentsText = "";
			var dialog = new sap.m.Dialog({
				title: "Missing Explanation",
				type: 'Message',
				contentWidth: "70%",
				state: 'Information',
				content: [
					new sap.m.TextArea({
						width: "100%",
						placeholder: msg,
						liveChange: function (oEvent) {
							commentsText = that.commentInputOnChange(oEvent, commentsText);
						}
					})
				],
				beginButton: new sap.m.Button({
					text: that.getResourceBundle().getText("txtBtnSubmitAndSendToAuthor"),
					type: "Emphasized",
					enabled: false,
					press: function () {
						var noteSetPayload = {
							"ServiceRequestID": that.sServiceRequestId,
							"NoteType": "ZCOM",
							"Langu": "EN",
							"Text": commentsText.trim()
						};
						sap.ui.core.BusyIndicator.show();
						that.getModel("SRS_Data").create("/NoteSet", noteSetPayload, {
							success: function (oData) {
								sap.ui.core.BusyIndicator.hide();
								that.showBusyDialog();
								that._updateStatus(models.STATUS_AUTHORACTION);
							}.bind(this),
							error: function (error) {
								models.showErrorMessage(that, error);
								sap.ui.core.BusyIndicator.hide();
							}.bind(this)
						});
						dialog.destroy();
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: that.getResourceBundle().getText("close"),
					press: function () {
						dialog.destroy();
					}.bind(this)
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
		   dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();

		}
	},
	dialogShowApprovedSR: "",
	enableCreateSOBtnInDialog: function () {
		if (this.dialogShowApprovedSR && this.dialogShowApprovedSR.isOpen()) {
			this.dialogShowApprovedSR.getBeginButton().setEnabled(this.getModel("buttonControlModel").getProperty("/statusBtnEnabled"));
		}
	},
	showApprovedSRMessage: function (context, htmlTxt, sSOStatusCode) {
		this.dialogShowApprovedSR = "";
		var dialogState = "Success";
		var resourceI18n = context.getModel("i18n");
		var dialogTitle = resourceI18n.getProperty("txtSRMsgBoxTitle");
		this.dialogShowApprovedSR = new sap.m.Dialog({
			title: dialogTitle,
			type: 'Message',
			state: dialogState,
			contentWidth: "70%",
			content: [
				new sap.m.VBox({
					visible: true,
					items: [
						new sap.ui.core.HTML({
							content: htmlTxt
						})
					]
				})
			],
			beginButton: new sap.m.Button({
				text: 'Create Service Order',
				type: "Emphasized",
				enabled: context.getModel("buttonControlModel").getProperty("/statusBtnEnabled"),
				press: function () {
					context.onCreateSO();
					this.dialogShowApprovedSR.destroy();
				}.bind(context)
			}),
			endButton: new sap.m.Button({
				text: 'Close',
				press: function () {
					this.dialogShowApprovedSR.destroy();
				}.bind(context)
			}),
			afterClose: function () {
				this.dialogShowApprovedSR.destroy();
			}
		});
	   this.dialogShowApprovedSR.addStyleClass(this.getOwnerComponent().getContentDensityClass());
		this.dialogShowApprovedSR.open();
	},
	onCreateSO: function () {

		// update status = E0007 Create SO
		var SRID = this.getModel("servicerequestModel").getProperty("/ServiceRequestID");
		var context = this;
		var SOCreationAllowed = this.getModel("SRS_Data_UserSet").getProperty("/canTQMCreateSO");
		if (SOCreationAllowed === true) {
			if (this.getModel("buttonControlModel").getProperty("/showContractValidationMessageStrip")) {
				MessageBox.error(this.getResourceBundle().getText("txtContractValidationMsg"));
			} else {
				this.getModel("buttonControlModel").setProperty("/statusBtnEnabled",false);
				sap.ui.core.BusyIndicator.show(0);
				this.getModel("SRS_Data").read("/ServiceRequestHeaderSet('" + SRID + "')", {
					success: function (oData) {
						this.getModel("buttonControlModel").setProperty("/statusBtnEnabled",true);
						if (oData) {
							var status = oData.StatusCode;
							if (status === models.STATUS_APPROVED) {
								sap.ui.core.BusyIndicator.hide();
								context.checkStatusValidationForSOCreationAndScopeApproval(models.STATUS_SOCREATED, "dialogTextCreateServiceOrder");
							} else {
								context.loadOnInit(true, null, false, false);
								context.getModel("buttonControlModel").setProperty("/isNewRequest", false);
							}
						}
					}.bind(this),
					error: function (error) {
						models.showErrorMessage(context, error);
						sap.ui.core.BusyIndicator.hide();
					}.bind(this)
				});
			}
		} else {
			var linkRequestProfileSU02 = "https://uap.bss.net.sap/sap/bc/webdynpro/sap/yupa_extend_auth?pa_mandt=001&pa_system=" + models.getSystemLandscapeInfo() +
				"&pa_profile=00:SU02__:GP#";
			var linkRequestProfileSU36 = "https://uap.bss.net.sap/sap/bc/webdynpro/sap/yupa_extend_auth?pa_mandt=001&pa_system=" + models.getSystemLandscapeInfo() +
				"&pa_profile=00:SU36__:GP#";

			var htmlTxt =
				"<div>You do not have the necessary authorization to create a Service Order in CRM.<ul><li>If you are a Service Requestor and Scoper (e.g. fTQM), please <a target='_blank' href='" +
				linkRequestProfileSU02 + "'>request Profile SU02</a>.</li><li>If you are a focus Service Requester (from CoE), please <a href='" +
				linkRequestProfileSU36 + "' target='_blank'>request Profile SU36 </a>(and remove SU02 and SU40)</li></ul></div>";
			var dialog = new sap.m.Dialog({
				title: 'Information',
				type: 'Message',
				state: 'Information',
				contentWidth: "70%",
				content: [
					new sap.m.VBox({
						visible: true,
						items: [
							new sap.ui.core.HTML({
								content: htmlTxt
							})
						]
					})
				],
				endButton: new sap.m.Button({
					text: 'Ok',
					press: function () {
						dialog.destroy();
					}.bind(context)
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
		   dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();
		}
   },
	onApproveScope: function () {
		// Validate if creator of Service Request is not approving scope
		if (this.getOwnerComponent().getModel("SRS_Data_UserSet").getData().userId === this.getOwnerComponent().getModel(
				"servicerequestModel").getData().OwnerUser) {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(this.getResourceBundle().getText("creatorCannotApproveSR"),{
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				});
		} else {
			this.checkStatusValidationForSOCreationAndScopeApproval(models.STATUS_APPROVED, "dialogTextApproveScope");
		}
	},
	checkStatusValidationForSOCreationAndScopeApproval: function (statusCode, txtMessage) {
		var SRHeaderModel = this.getModel("servicerequestModel");
		var SRItemsModel = this.getModel("servicerequestItemsModel");
		var agreedScopeModel = this.getModel("agreedServiceRequestScopeModel");
		var serviceInfoModel = this.getModel("serviceRequestScopeModel");
		if (SRHeaderModel && SRHeaderModel.getData() && SRItemsModel && SRItemsModel.getData() && agreedScopeModel && agreedScopeModel.getData() &&
			serviceInfoModel && serviceInfoModel.getData()) {
			var SRHeaderModelData = SRHeaderModel.getData();
			var SRItemsModelData = SRItemsModel.getData();
			var agreedScopeModelData = agreedScopeModel.getData();
			var serviceInfoModelData = serviceInfoModel.getData();
			var emptyFieldsArray = [];
			models.serviceRequestMandFieldsValidation(this, SRHeaderModelData, emptyFieldsArray);
			models.serviceRequestItemsMandFieldsValidation(this, SRItemsModelData, emptyFieldsArray);
			if (agreedScopeModelData && agreedScopeModelData.data.length === 0) {
				emptyFieldsArray.push("Agreed Scope");
			}
			if (serviceInfoModelData && serviceInfoModelData.data.length === 0) {
				emptyFieldsArray.push("Service Request Info");
			}
		   var valueDriverData = this.getModel("valueDriverModel").getData();
		   var selectedValueDriverRawModel = this.getModel("selectedValueDriverRawModel").getData();
		   if(valueDriverData && valueDriverData.length>0 && selectedValueDriverRawModel && selectedValueDriverRawModel.length===0){
				emptyFieldsArray.push("Value Driver (To approve the Service Request, please maintain at least one Value Driver)");
		   }
		   this.checkEmptyFieldsForStatus(emptyFieldsArray, statusCode, txtMessage);
		} else {
			this._showDialogForStatusChange(statusCode, this.getResourceBundle().getText(txtMessage, this.sServiceRequestId));
		}
	},

	getLineItemsWithZeroCallOffDays: function (SRItems) {
		var lineItemsWithZeroCallOffDays = [];
		for (var i = 0; i < SRItems.length; i++) {
			if (SRItems[i].ItemNo !== models.SR_ITEM_10 && SRItems[i].ItemNo !== models.SR_ITEM_20) {
				if (parseFloat(SRItems[i].CallOffDays) === 0) {
					lineItemsWithZeroCallOffDays.push(SRItems[i].ItemNo.replace(/\b0+/g, ''));
				}
			}
		}
		return lineItemsWithZeroCallOffDays;
	},
	showMandFieldsValidationMessage: function (txtMessage) {
		var that = this;
		var oEventBus = sap.ui.getCore().getEventBus();
		var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
		MessageBox.error(
			txtMessage, {
				icon: MessageBox.Icon.ERROR,
				title: this.getResourceBundle().getText("missingInfo"),
				contentWidth: "70%",
				actions: [this.getResourceBundle().getText("continueEditingBtnTxt"), this.getResourceBundle().getText("txtCompleteSRbtn")],
				onClose: function (sAction) {
					if (sAction === that.getResourceBundle().getText("continueEditingBtnTxt")) {
						oEventBus.publish("toggleEditDisplay", "toggleEditDisplaySuccess");
						that.setServiceRequestInfoTemplate(null,null,that);
						//that.setAgreedScopeTemplate();
					}
				},
				emphasizedAction: this.getResourceBundle().getText("continueEditingBtnTxt"),
				initialFocus: this.getResourceBundle().getText("continueEditingBtnTxt"),
				styleClass: bCompact ? "sapUiSizeCompact" : ""
			}
		);
	},
	onSendForScoping: function () {
		// update status = E0003 in scoping	
		var errorModelMessages = this.getModel("errorModel").getProperty("/message");
		if (this.byId("msgStripContractItemValidationDisplayMode").getVisible()) {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.error(
				this.getResourceBundle().getText("txtContractValidationMsg"), {
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				}
			);
			return;
		} else {
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
				this.checkEmptyFieldsForStatus(emptyFieldsArray, models.STATUS_INSCOPING, "dialogTextSendForScoping");

			} else {
				this._showDialogForStatusChange(models.STATUS_INSCOPING, this.getResourceBundle().getText("dialogTextSendForScoping", this.sServiceRequestId));
			}
		}
	},
	checkEmptyFieldsForStatus: function (emptyFieldsArray, statusCode, txtMessage) {
		var emptyFieldsArrayLength = emptyFieldsArray.length;
		var arrayIndexlength = emptyFieldsArray.length - 1;

		if (emptyFieldsArrayLength === 0) {
			var SRHeaderSessionID = this.getModel("servicerequestModel").getProperty("/SessionID");
			var doesSessionDescExist = models.doesSessionDescExist(this, SRHeaderSessionID);
			var that = this;
			if (statusCode === models.STATUS_APPROVED && !doesSessionDescExist) {
				MessageBox.warning(this.getResourceBundle().getText("txtMessageMissingSessionName"), {
					actions: [MessageBox.Action.CLOSE, "Approve As-Is"],
					emphasizedAction: MessageBox.Action.CLOSE,
					onClose: function (sAction) {
						if (sAction === "Approve As-Is") {
							that._showDialogForStatusChange(statusCode, that.getResourceBundle().getText(txtMessage, that.sServiceRequestId));
						}
					}
				});
			} else {
				this._showDialogForStatusChange(statusCode, this.getResourceBundle().getText(txtMessage, this.sServiceRequestId));
			}
		} else {
			var txtEmptyFields = "";
			for (var i = 0; i < emptyFieldsArrayLength; i++) {
				if (i === arrayIndexlength) {
					txtEmptyFields += emptyFieldsArray[i];
				} else {
					txtEmptyFields += emptyFieldsArray[i] + ", ";
				}
			}
			var sMandatoryFieldsValidationMsg;
			if (statusCode === models.STATUS_INSCOPING) {
				sMandatoryFieldsValidationMsg = this.getResourceBundle().getText("missingMandatoryFieldsForScoping", this.sServiceRequestId);
			} else {
				sMandatoryFieldsValidationMsg = this.getResourceBundle().getText("missingMandatoryFields");
			}
			this.showMandFieldsValidationMessage(sMandatoryFieldsValidationMsg + " " + txtEmptyFields);
		}
	},
	cancelSRDesc: null,
	onCancelSR: function (oEvent) {
		// cancel SR send the status to E0006
		var oView = this.getView();
		var dialog = oView.byId("addconfirmCancellationDialog");
			//check if the input owner is null, if null set 
			if (!dialog) {
				// create dialog via fragment factory
				dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.CancelSRConfirmationDialog", this);
				oView.addDependent(dialog);
			}
			dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			dialog.open();
			this.byId("comboCancelReason").setSelectedKey("");
			this.byId("textAreaCancelReasonDesc").setValue("");
			this.cancelSRDesc = null;
			this.getModel("buttonControlModel").setProperty("/enableConfirmBtnForCCDialog",false);
	},

	onCancelCCPopup: function(){
		this.byId("addconfirmCancellationDialog").close();
	},

	onCancelReasonChange: function(oEvent){
		if(oEvent.getSource().getSelectedItem()){
			this.getModel("buttonControlModel").setProperty("/enableConfirmBtnForCCDialog",true);
		}else{
			this.getModel("buttonControlModel").setProperty("/enableConfirmBtnForCCDialog",false);
		}
	},

	onPresssConfirmCancellationBtn: function(){
		var ReasonStatusCode = this.byId("comboCancelReason").getSelectedKey();
		this.getModel("servicerequestModel").setProperty("/ReasonStatusCode",ReasonStatusCode);
		this.showBusyDialog();
		this.cancelSRDesc = this.byId("textAreaCancelReasonDesc").getValue();
		this._updateStatus(models.STATUS_CANCELED);
		this.byId("addconfirmCancellationDialog").close();
	},

	_showDialogForStatusChange: function (targetStatusCode, sDialogMsg) {
		var resourceBundle = this.getModel("i18n");
		var context = this;
		var dialog;
		// If there are line item(s) with 0 call off days, show it in scope approval confirmation,  error dialogs
		if (targetStatusCode === models.STATUS_APPROVED) {
			var sZeroCallOffDaysMsg = "";
			if (parseFloat(this.getModel("servicerequestModel").getProperty("/TotalCallOffDays")) === 0) {
				sZeroCallOffDaysMsg = this.getResourceBundle().getText("zeroTotalCallOffDays");
			} else {
				var arrLineItemsWithZeroCallOffDays = context.getLineItemsWithZeroCallOffDays(context.getModel("servicerequestItemsModel").getData());
				if (arrLineItemsWithZeroCallOffDays.length > 0) {
					sZeroCallOffDaysMsg = this.getResourceBundle().getText("lineItemsWithZeroCallOffDays", arrLineItemsWithZeroCallOffDays.join(
						", "));
				}
			}
		}
		var SOCreationAllowed = this.getModel("SRS_Data_UserSet").getProperty("/canScoperCreateSO");
		var isDialogYesBtnVisible = true;
        var dialogNoBtnTxt = this.getResourceBundle().getText("dialogChangeStatusNo");
		var closeBtnType = "Default";
		var dialogTitle = resourceBundle.getProperty("dialogChangeStatusTitle");

		//check if there are errorMessages
		var errorModelMessages = this.getModel("errorModel").getProperty("/message");
		//var isPrs = this.getModel("buttonControlModel").getProperty("/IsPreferredSuccessServiceSelected");
		if (errorModelMessages.length > 0 && targetStatusCode !== models.STATUS_CANCELED) {
			var dialogMsg = resourceBundle.getProperty("dialogErrorMessageTitle");
			/*if (sZeroCallOffDaysMsg) {
				dialogMsg = sZeroCallOffDaysMsg + resourceBundle.getProperty("dialogErrorMessageTitle");
			}*/

			if(targetStatusCode === models.STATUS_APPROVED){
                dialogMsg = resourceBundle.getProperty("txtPrSErrorSRMsgForApproval");
                isDialogYesBtnVisible = false;
                dialogNoBtnTxt = this.getResourceBundle().getText("close");
				closeBtnType = "Emphasized";
            }
			/*
			if (targetStatusCode === models.STATUS_APPROVED) {
			   var isImmediateSOEnabled = this.getModel("servicerequestModel").getProperty("/ImmediateSoCreationEnabled");
			   if(isImmediateSOEnabled){

				if(SOCreationAllowed){
					var context = this;
					if(this.getModel("buttonControlModel").getProperty("/isAnyRuleViolated")){
						dialogMsg += "<br/><br/> <Strong>Note: </Strong> Service Request has violations and therefore it cannot be approved with <a class='classDialogImmediateSO' target='_self'>'Immediate SO'</a> enabled. Choosing <Strong>[Yes]</Strong> will move the SR to 'Violated' status."
						var context = this;
						$(document).ready(function(){
							$(".classDialogImmediateSO").click(function(e){
								e.preventDefault();
								context.byId("btnImmediateSOInfoBtn").firePress();
							});
						});
					}else {
						dialogMsg += "<br/><br/> <Strong>Note: </Strong> Approving the scope will directly create the Service Order as <a class='classDialogImmediateSO' target='_self'>Immediate SO</a> creation is enabled for this Service Request."
						targetStatusCode = models.STATUS_SOCREATED;
						var context = this;
						$(document).ready(function(){
							$(".classDialogImmediateSO").click(function(e){
								e.preventDefault();
								context.byId("btnImmediateSOInfoBtn").firePress();
							});
						});
					}
				}else{
					this.showMissingAuthSOCreationDialog(targetStatusCode);
					return;
				}
			   }
			  }*/
			
			dialog = new Dialog({
				title: 'Error Message',
				type: 'Message',
				state: 'Error',
				content: new sap.m.FormattedText({
				   htmlText: dialogMsg
				}),
				beginButton: new Button({
					text: 'Yes',
					type: 'Emphasized',
					visible: isDialogYesBtnVisible,
					press: function () {
						dialog.close();
						context.showBusyDialog();
						context._updateStatus(targetStatusCode);
					}
				}),
				endButton: new Button({
					text: dialogNoBtnTxt,
					type: closeBtnType,
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
			if (sZeroCallOffDaysMsg) {
				sDialogMsg = sZeroCallOffDaysMsg + sDialogMsg;
			}
		   if (targetStatusCode === models.STATUS_APPROVED) {
			   var isImmediateSOEnabled = this.getModel("servicerequestModel").getProperty("/ImmediateSoCreationEnabled");
			   if(isImmediateSOEnabled){
				if(SOCreationAllowed){
					if(this.getModel("buttonControlModel").getProperty("/isAnyRuleViolated")){
						sDialogMsg += "<br/><br/> <Strong>Note: </Strong>Service Request has violations and therefore it cannot be approved with <a class='classDialogImmediateSO' target='_self'>'Immediate SO'</a> enabled.<br/>Choosing <Strong>[Yes]</Strong> will move the SR to 'Violated' status."
						var context = this;
						$(document).ready(function(){
							$(".classDialogImmediateSO").click(function(e){
								e.preventDefault();
								context.byId("btnImmediateSOInfoBtn").firePress();
							});
						});
					}else {
						sDialogMsg += "<br/><br/> <Strong>Note: </Strong> Approving the scope will directly create the Service Order as <a class='classDialogImmediateSO' target='_self'>Immediate SO</a> creation is enabled for this Service Request."
						targetStatusCode = models.STATUS_SOCREATED;
						var context = this;
						$(document).ready(function(){
							$(".classDialogImmediateSO").click(function(e){
								e.preventDefault();
								context.byId("btnImmediateSOInfoBtn").firePress();
							});
						});
					}
				}else{
					this.showMissingAuthSOCreationDialog(targetStatusCode);
					return;
				}
			   }
			   var rdd = this.getModel("servicerequestModel").getProperty("/RequestedDeliveryDate");
			   rdd.setHours(0,0,0,0);
			   var todaysDate = new Date();
			   todaysDate.setHours(0,0,0,0);
			   var isPrs = this.getModel("buttonControlModel").getProperty("/IsPreferredSuccessServiceSelected");
			   if(!isPrs && rdd<todaysDate){
					sDialogMsg += "<br/><strong>Warning:</strong> Requested Delivery Date is in the past and will lead to an SO in status NEW only.";
				}else if(isPrs && rdd<todaysDate){
					sDialogMsg = "This Service Request cannot be approved because the Requested Delivery Date is in the past. Please adjust the date.";
					isDialogYesBtnVisible = false;
               		dialogNoBtnTxt = this.getResourceBundle().getText("close");
					closeBtnType = "Emphasized";
					dialogTitle = resourceBundle.getProperty("warning");
				}
			  }
		   //sDialogMsg = "<p>"+sDialogMsg+"</p>"
			dialog = new Dialog({
				title: dialogTitle,
				type: 'Message',
				state: (dialogTitle === resourceBundle.getProperty("warning") ? "Warning" : "Information"),
				icon: (dialogTitle === resourceBundle.getProperty("warning") ? "sap-icon://message-warning" : "sap-icon://lightbulb"),
				content: new sap.m.FormattedText({
				   htmlText: sDialogMsg
				}),
				beginButton: new Button({
					text: resourceBundle.getProperty("dialogChangeStatusYes"),
					type: 'Emphasized',
					visible: isDialogYesBtnVisible,
					press: function () {
						context.showBusyDialog();
						context._updateStatus(targetStatusCode);
						dialog.close();
					}
				}),
				endButton: new Button({
					type: closeBtnType,
					text: dialogNoBtnTxt,
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
		}
	},

	showMissingAuthSOCreationDialog: function(targetStatusCode){
		var context=this;

		var sessionModel = this.getModel("sessionModel");
		var selectedService = this.getModel("servicerequestModel").getProperty("/ServiceID");
		var selectedSession = this.getModel("servicerequestModel").getProperty("/SessionID");
		var customerId = this.getModel("servicerequestModel").getProperty("/CustomerID");
		var isPreferredSuccess = false;
		if(sessionModel && sessionModel.getData()){
			var sessions = sessionModel.getData();
			for(var i=0;i<sessions.length;i++){
				if(sessions[i].ProductID === selectedSession){
					isPreferredSuccess = sessions[i].PreferredSuccess;
					break;
				}
			}
			this.openDialogForMissingAuthSOCreation(isPreferredSuccess,targetStatusCode);
		}else{
			var hostURL = context.getModel("SRS_Data").sServiceUrl;
			var sessionODataJSONModel = new JSONModel(hostURL + "/CustomerSet('"+customerId+"')/toProductStructure?$filter=(ParentProductID eq '"+selectedService+"')");
			this.showBusyDialog();
			var that = this;

			sessionODataJSONModel.attachRequestCompleted(function (resp) {
				if (resp.getParameters("success").success) {
					var results = sessionODataJSONModel.getData().d.results;
					//models.setMemberItemsTemplate(that,results);
					//results = models.filterSessionBasedOnSelectedService(selectedService,results);
					for(var i=0;i<results.length;i++){
						if(results[i].ProductID === selectedSession){
							isPreferredSuccess = results[i].PreferredSuccess;
							break;
						}
					}
					that.hideBusyDialog();
					that.openDialogForMissingAuthSOCreation(isPreferredSuccess,targetStatusCode);
				} else {
					that.hideBusyDialog();
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					that.showErrorMessage(context, resp.getParameters().errorobject);
				}

			});
		}

	},

	openDialogForMissingAuthSOCreation: function(isPreferredSuccess,targetStatusCode){
		var context = this;
		var htmlContentDialogNoSOCReation = "<p>This Service Request is set for <a class='classDialogImmediateSO' target='_self'>Immediate SO</a> creation. However, you do not have the authorization to create SOs.<br/><br/>You can continue as follows:<ol type='a'><li><strong>Approve SR without SO creation.</strong> The 'Immediate SO' flag will be removed and TQM needs to trigger SO creation afterwards.</li><li><strong>Close window</strong> without SR Approval. Ask another Scoper, who has the authorization to create SOs, to approve this SR.</li></ol></p>";
		var isBeginButtonVisible = true;
		if(isPreferredSuccess){
			htmlContentDialogNoSOCReation = "<p>This Service Request is set for <a class='classDialogImmediateSO' target='_self'>Immediate SO</a> creation. However, you do not have the authorization to create SOs.<br/>Please ask another Scoper, who has the authorization to create SOs, to approve this Service Request.";
			isBeginButtonVisible = false;
		}

		var dialogNoSOCReation = new Dialog({
			title: 'Missing Authorization',
			type: 'Message',
			state: 'Information',
			initialFocus: 'endButtonMissingAuth',
			content: new sap.m.FormattedText({
			   htmlText: htmlContentDialogNoSOCReation
			}),
			beginButton: new Button({
				text: 'Approve without SO creation',
				visible: isBeginButtonVisible,
				press: function () {
					dialogNoSOCReation.close();
					context.showBusyDialog();
					context.getModel("servicerequestModel").setProperty("/ImmediateSoCreationEnabled",false);
					context._updateStatus(targetStatusCode);
				}
			}),
			endButton: new Button({
				id:"endButtonMissingAuth",
				text: 'Close',
				type: 'Emphasized',
				press: function () {
					dialogNoSOCReation.close();
				}
			}),
			afterClose: function () {
				dialogNoSOCReation.destroy();
			}
		});
		dialogNoSOCReation.addStyleClass(this.getOwnerComponent().getContentDensityClass());
		dialogNoSOCReation.open();
		$(document).ready(function(){
			$(".classDialogImmediateSO").click(function(e){
				e.preventDefault();
				context.byId("btnImmediateSOInfoBtn").firePress();
			});
		});
	},

	_updateStatus: function (targetStatusCode) {
		var currentSRStatus = this.getModel("servicerequestModel").getProperty("/StatusCode");
		var payload = this.getModel("servicerequestModel").getData();
		payload.StatusCode = targetStatusCode;
		var isPrs = this.getModel("buttonControlModel").getProperty("/IsPreferredSuccessServiceSelected");
	   	var context = this;
		this.getModel("SRS_Data").update("/ServiceRequestHeaderSet('" + this.sServiceRequestId + "')", payload, {
			success: function (oData) {
				this.loadOnInit(true, currentSRStatus, false, false);
				this.getModel("buttonControlModel").setProperty("/isNewRequest", false);
				if (this.getModel("servicerequestModel").getData().StatusCode === models.STATUS_INSCOPING) {
					models.trackEvent(this.getOwnerComponent(), models.TRACK_EVENT_SR_SENT_FOR_SCOPING);
				} else if (this.getModel("servicerequestModel").getData().StatusCode === models.STATUS_INEXCEPTION) {
					models.trackEvent(this.getOwnerComponent(), models.TRACK_EVENT_SR_REQUEST_APPROVAL);
				} else if (this.getModel("servicerequestModel").getData().StatusCode === models.STATUS_APPROVED) {
					models.trackEvent(this.getOwnerComponent(), models.TRACK_EVENT_SR_APPROVED);
				} else if (this.getModel("servicerequestModel").getData().StatusCode === models.STATUS_CANCELED) {
					this.createCancelNote();
					models.trackEvent(this.getOwnerComponent(), models.TRACK_EVENT_SR_CANCELLED);
				} else if (this.getModel("servicerequestModel").getData().StatusCode === models.STATUS_SOCREATED) {
					models.trackEvent(this.getOwnerComponent(), models.TRACK_EVENT_SR_SO_CREATED);
					if(isPrs){
						models.trackEvent(this.getOwnerComponent(), models.TRACK_EVENT_SR_SO_CREATED_PrS);
					}else{
						models.trackEvent(this.getOwnerComponent(), models.TRACK_EVENT_SR_SO_CREATED_PE);
					}
				} else if (this.getModel("servicerequestModel").getData().StatusCode === models.STATUS_AUTHORACTION) {
					models.trackEvent(this.getOwnerComponent(), models.TRACK_EVENT_SR_BACK_TO_AUTHOR);
				}
				this.hideBusyDialog();
			}.bind(this),
			error: function (error) {
			   if(error.statusCode && (error.statusCode.toString() === models.sessionTimeOutErrorCode)){
				   MessageBox.error("Sorry, something snapped. This could be a server error or session timed out. Please consider reducing the number of line items in your Service Request. \nTo check the updated status of Service Request "+this.sServiceRequestId+", please wait for few seconds before refreshing the Service Request.",{
					   actions: ["Refresh"],
					   onClose: function (sAction) {
						   context.onRefresh(null);
					   }
				   });
			   }else{
				   MessageBox.error(JSON.parse(error.responseText).error.message.value);
				   models.onCreateValidate(this);
			   }
			   this.hideBusyDialog();
			}.bind(this)
		});
	},

	createCancelNote: function(){
		if(this.cancelSRDesc){
			var oModel = this.getModel("SRS_Data");
			var ServiceRequestID = this.getModel("servicerequestModel").getProperty("/ServiceRequestID");
			var payload = {"ServiceRequestID":ServiceRequestID,
			"NoteType":models.CANCELLATION_NOTE_TYPE,
			"Langu":"EN",
			"Text":this.cancelSRDesc};
			var context = this;
			context.getModel("buttonControlModel").setProperty("/showBusyForCancellationPopoverTextArea",true);
			oModel.create("/NoteSet", payload, {
				groupId: "createCancelNote",
				success: function (data, resp) {
					var noteSetModel = {
						Text: "",
						data: [data],
					};
					context.setModel(new JSONModel(noteSetModel), "cancellationDescModel");
					context.getModel("buttonControlModel").setProperty("/showBusyForCancellationPopoverTextArea",false);
				},
				error: function (err) {
					models.showErrorMessage(context, err);
				}
			});
		}
	},

	//Cancel Edit
	onCancel: function () {
		var resourceBundle = this.getModel("i18n");
		var that = this;
		var cancelEditConfirmDialog = new Dialog({
			title: resourceBundle.getProperty("warning"),
			type: 'Message',
			state: "Warning",
			icon: "sap-icon://message-warning",
			content: new Text({
				text: resourceBundle.getProperty("unsavedData")
			}),
			beginButton: new Button({
				text: resourceBundle.getProperty("dialogChangeStatusYes"),
				press: function () {
					that.getModel("buttonControlModel").setProperty("/refreshBtnVisible", true);
					that.loadOnInit(false, null, false, false);
					that.showBusyDialog();
					setTimeout(function () {
						that.toggleDisplayAndEdit();
						that.hideBusyDialog();
					}, 300);
					cancelEditConfirmDialog.close();
				}
			}),
			endButton: new Button({
				text: resourceBundle.getProperty("dialogChangeStatusNo"),
				press: function () {
					cancelEditConfirmDialog.close();
				}
			}),
			afterClose: function () {
				cancelEditConfirmDialog.destroy();
			}
		});
	   cancelEditConfirmDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
		cancelEditConfirmDialog.open();
	},

	onSaveServiceRequest: function () {

		//Setting Noteset flag as false
		models.ERROR_FLAG_NOTESET = false;

		//Validation for Template not filled
		var sRequestInfoFilledText = this.getModel("serviceRequestScopeModel").getProperty("/Text");
		var agreedScopeFilledText = this.getModel("agreedServiceRequestScopeModel").getProperty("/Text");
		if (models.checkServiceRequestInfoTemplateValidation(sRequestInfoFilledText,this)) {
			this.getModel("serviceRequestScopeModel").setProperty("/Text", "");
		}

		/*
		if (models.checkAgreedScopeTemplateValidation(agreedScopeFilledText)) {
			this.getModel("agreedServiceRequestScopeModel").setProperty("/Text", "");
		}*/

		//Validation for Empty Line Items - Workaround to find deleted items
		var aScopeItems = jQuery.extend([], this.getModel("servicerequestItemsModel").getData());
		var aScopeNotDeletedItems = [];

		if (this.getView().byId("detailScope").getControlsByFieldGroupId("")) {
			var oControl = this.getView().byId("detailScope").getControlsByFieldGroupId("").filter(function (v) {
				return v.getId().indexOf("idProductsTable-edit") > -1;
			});

			if (oControl && oControl.length) {
				var deletionIndex = oControl[0].getItems().map(function (v, i) {
					if (v.getVisible() === true) {
						return i;
					} else {
						return -1;
					}
				});
				for (var i = 0; i < aScopeItems.length; i++) {
					if (deletionIndex[i] > -1) {
						aScopeNotDeletedItems.push(aScopeItems[i]);
					}
				}
				var validationCheckForItems = models.validateEmptyScopeItems(aScopeNotDeletedItems, this);
				if (validationCheckForItems.Product || validationCheckForItems.DeliveryTeam) {
					models.showEmptyScopeItemsValidationMessage(this, validationCheckForItems);
					return;
				}
			}
		}

		var payload = this.getModel("servicerequestModel").getData();
		this.submitServiceRequestForSave(payload, this);
	}, //on edit
	submitServiceRequestForSave: function (payload, context) {
		this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled",false);
		if (payload.StatusCode === models.STATUS_INEXCEPTION) {
			context.oEventBus.publish("onSaveServiceRequest", "onSaveServiceRequestSuccess");
		} else {
			if (context.getModel("SubmitEntityDuringSaveSRModel").getProperty("/items")) {
				context.oEventBus.publish("saveSRItems", "saveSRItemsSuccess");
			} else if (context.getModel("SubmitEntityDuringSaveSRModel").getProperty("/header")) {
				context.oEventBus.publish("onSaveServiceRequest", "onSaveServiceRequestSuccess");
			} else if (context.getModel("SubmitEntityDuringSaveSRModel").getProperty("/comments")) {
				sap.ui.core.BusyIndicator.show();
				context.processNotes(payload.ServiceRequestID);
			}
		}
	},
	onSaveSRSuccess: function () {
		if (!models.ERROR_FLAG_NOTESET) {
			this.getModel("buttonControlModel").setProperty("/isNewRequest", false);
			this.toggleDisplayAndEdit();
			var SRModel = this.getModel("servicerequestModel").getData();
			var userProfile = this.getModel("SRS_Data_UserSet").getData();
			if (userProfile.isTQM) {
				var msgTxt;
				if (SRModel.StatusCode === models.STATUS_NEW) {
					models.OPR_TYPE = "SAVE_OPR";
				} else if (SRModel.StatusCode === models.STATUS_INSCOPING) {
					if(SRModel.ImmediateSoCreationEnabled){
						msgTxt = "<div>Service Request <strong>" + SRModel.ServiceRequestID +
							"</strong> Updated Successfully.<br/><br/> <strong>What's Next?</strong> Scoping team will review Service Request and approve it. Once Service Request is approved, Service order creation will be triggered immediately as <a class='classDialogImmediateSO' target='_self'>Immediate SO</a> is enabled.</div>";
							var context = this;
							$(document).ready(function(){
								$(".classDialogImmediateSO").click(function(e){
									e.preventDefault();
									context.byId("btnImmediateSOInfoBtn").firePress();
								});
							});
					}else{
						msgTxt = "<div>Service Request <strong>" + SRModel.ServiceRequestID +
							"</strong> Updated Successfully.<br/><br/> <strong>What's Next?</strong> Scoping team will review Service Request and approve it. Once Service Request is approved, you will be able to trigger Service Order creation.</div>";
					}
					models.showSRCreationAndUpdateMessage(this, msgTxt);
					this.hideBusyDialog();
					sap.ui.core.BusyIndicator.hide();
				} else {
					if (!(SRModel.StatusCode === models.STATUS_VIOLATED || SRModel.StatusCode === models.STATUS_INEXCEPTION)) {
						MessageBox.success(this.getResourceBundle().getText("serviceRequestUpdateSuccess", this.sServiceRequestId));
					}
					this.hideBusyDialog();
					sap.ui.core.BusyIndicator.hide();
				}
			} else if (userProfile.isScoper) {
				if (SRModel.StatusCode === models.STATUS_INSCOPING) {
					if(SRModel.ImmediateSoCreationEnabled){
						msgTxt = "<div>Service Request <strong>" + SRModel.ServiceRequestID +
							"</strong> Updated Successfully.<br/><br/> <strong>What's Next?</strong> If you agreed with the scope in this Service Request, please approve it. <br><strong>Note:</strong> Approving the scope will directly create the Service Order as <a class='classDialogImmediateSO' target='_self'>Immediate SO</a> creation is enabled for this Service Request.</div>";
							var context = this;
							$(document).ready(function(){
								$(".classDialogImmediateSO").click(function(e){
									e.preventDefault();
									context.byId("btnImmediateSOInfoBtn").firePress();
								});
							});
					}else{
						msgTxt = "<div>Service Request <strong>" + SRModel.ServiceRequestID +
							"</strong> Updated Successfully.<br/><br/> <strong>What's Next?</strong> If you agreed with the scope in this Service Request, please approve it so that Service Requester can trigger Service Order creation.</div>";
					}
					models.showSRCreationAndUpdateMessage(this, msgTxt);
				} else {
					if (!(SRModel.StatusCode === models.STATUS_VIOLATED || SRModel.StatusCode === models.STATUS_INEXCEPTION)) {
						MessageBox.success(this.getResourceBundle().getText("serviceRequestUpdateSuccess", this.sServiceRequestId));
					}
					//	this.showDialogMessageUponSRSave(SRModel.StatusCode,SRModel.ServiceRequestID);
				}
				this.hideBusyDialog();
				sap.ui.core.BusyIndicator.hide();
			} else {
				if (!(SRModel.StatusCode === models.STATUS_VIOLATED || SRModel.StatusCode === models.STATUS_INEXCEPTION)) {
					MessageBox.success(this.getResourceBundle().getText("serviceRequestUpdateSuccess", this.sServiceRequestId));
				}
				//this.showDialogMessageUponSRSave(SRModel.StatusCode,SRModel.ServiceRequestID);
				this.hideBusyDialog();
				sap.ui.core.BusyIndicator.hide();
			}
			this.loadOnInit(false, null, false, true);
		}
	},
	showDialogMessageUponSRSave: function (statuscode, ServiceRequestID) {
		var msgTxt;
		if (statuscode === models.STATUS_VIOLATED) {
			msgTxt = "<div>Service Request <strong>" + ServiceRequestID +
				"</strong> updated successfully, but at least one violated rule (See section Approval).<br/><br/> <strong>What's Next?</strong><li>Service Requester will have to either put the SR in “Author Action” and correct Service Request to avoid rule violations, or Service Requester should request exception approval. In this case, Scoping Team will assign a CoE Manager to review the Service Request and act on rule violations.</li></div>";
			models.showSRCreationAndUpdateMessage(this, msgTxt, statuscode);
		} else if (statuscode === models.STATUS_INEXCEPTION) {
			msgTxt = "<div>Service Request <strong>" + ServiceRequestID +
				"</strong> updated successfully, but is in status “In Exception”.<br/><br/> <strong>What's Next?</strong><li>Scoping Team will assign a CoE Manager who will review the Service Request.</li><li>CoE Manager will go to the APPROVAL section in edit mode, Approve or Reject each violated rule via the green/red action buttons, and add a comment in the discussion section.</li><li>Rejected violations need to be adjusted by the Service Requester. When all violated rules got approved the SR Status turns into “Approved” and Service Requester can trigger “SO Creation”.</li><br/></div>";
			models.showSRCreationAndUpdateMessage(this, msgTxt, statuscode);
		}
	},
	onSaveServiceRequestSuccess: function () {
		var payload = this.getModel("servicerequestModel").getData();

		if (models.isEmpty(payload.ServiceRequestID)) {
			payload.ServiceRequestID = this.sServiceRequestId;
		}

		if (!models.isEmpty(payload.ServiceRequestID)) {
			this.showBusyDialog();
			this.getModel("SRS_Data").update("/ServiceRequestHeaderSet('" + payload.ServiceRequestID + "')?format=json", payload, {
				success: function (oData) {
					this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled",true);
					models.createTenantsAndModules(this);
					if (this.getModel("serviceRequestScopeModel").getData().isServiceRequestInfoChanged === "true" || this.getModel(
							"agreedServiceRequestScopeModel").getData().isAgreedScopeChanged === "true" || this.getModel("buttonControlModel").getProperty(
							"/isCommentsChanged")) {
						if (this.getModel("SubmitEntityDuringSaveSRModel").getProperty("/comments")) {
							this.processNotes(payload.ServiceRequestID, payload.StatusCode);
						} else {
							this.publishSRSaveForUpdate(payload.StatusCode);
						}
					} else {
						this.publishSRSaveForUpdate(payload.StatusCode);
					}
				}.bind(this),
				error: function (error) {
					models.showErrorMessage(this, error);
					models.onCreateValidate(this);
					this.hideBusyDialog();
					sap.ui.core.BusyIndicator.hide();
					this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled",true);
					//this.onCancel();
				}.bind(this)
			});

		}
	},
	publishSRSaveForUpdate: function (StatusCode) {
		if (StatusCode === models.STATUS_INEXCEPTION) {
			this.oEventBus.publish("saveSRRules", "saveSRRulesSuccess");
		} else {
			this.oEventBus.publish("onSaveSR", "onSaveSRSuccess");
		}
	},
	onAfterRendering: function () {
		this.byId("comment-display").setContent(this.byId("comment-display").getContent());
	},

	onSearchQualiID: function (event) {
		var item = event.getParameter("suggestionItem");
		if (item) {
			// sap.m.MessageToast.show("search for: " + item.getText());
		}
	},

	searchServiceOrderGroup: function (oEvent) {
		if (oEvent.getParameters().value.length >= 3) {
			var setServiceOrderGroupInputValueState = true;
			var filter = [];
			filter.push(models.filterCondition_Contains("Description", oEvent.getParameters().value));
			models.getServiceOrderGroup(this, filter, setServiceOrderGroupInputValueState, "/ServiceOrderGroupSet", "serviceOrderGroupModel");
		} else if (oEvent.getParameters().value.length === 0) {
			this.byId("idServiceOrderGroupInput").setValueState("None");
			this.setModel(new JSONModel(), "serviceOrderGroupModel");
		} else if (oEvent.getParameters().value.length < 3) {
			this.byId("idServiceOrderGroupInput").closeSuggestions();
			this.setModel(new JSONModel(), "serviceOrderGroupModel");
		}
	},

	handleServiceOrderGroupItemSelection: function (oEvent) {
		this.byId("idServiceOrderGroupInput").setValueState("None");
	},

	showServiceOrderGroupHint: function (oEvent) {
		var oButton = oEvent.getSource();
		var that = this;
		if (!this._SOGHintPopover) {
			this._SOGHintPopover = Fragment.load({
				id: this.getView().getId(),
				name: "sap.com.servicerequest.servicerequest.fragment.ServiceOrderGroupPopover",
				controller: this
			}).then(function (oPopover) {
				that.getView().addDependent(oPopover);
				return oPopover;
			});
		}
		this._SOGHintPopover.then(function (oPopover) {
			oPopover.openBy(oButton);
		});
	},

	showProcessorInfoHint: function (oEvent) {
		var oButton = oEvent.getSource();
		var that = this;
		if (!this._ProcessorInfoPopover) {
			this._ProcessorInfoPopover = Fragment.load({
				id: this.getView().getId(),
				name: "sap.com.servicerequest.servicerequest.fragment.ProcessorInfoPopover",
				controller: this
			}).then(function (oPopover) {
				that.getView().addDependent(oPopover);
				return oPopover;
			});
		}
		this._ProcessorInfoPopover.then(function (oPopover) {
			oPopover.openBy(oButton);
		});
	},

   pressImmediateSOInfoBtn: function(oEvent){
	   models.showImmediateSOInfoPopover(this,oEvent);
   },

   handleImmediateSOInfoPopoverClose: function(){
	   this.byId("idImmediateSOInfoPopover").close();
   },

   handleServiceOrderGroupHintPopoverClose: function (oEvent) {
		this.byId("idSOGHintPopover").close();
	},

	handleServiceOrderGroupValueHelpOpen: function (oEvent) {
		this.setModel(new JSONModel(), "serviceOrderGroupModel");
		var oView = this.getView();
		var oSOGDialog = oView.byId("dialogSOG");
		// create value help dialog
		if (!oSOGDialog) {
			oSOGDialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.ServiceOrderGroupValueHelp", this);
			oView.addDependent(oSOGDialog);
		}

		// open value help dialog
	   oSOGDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
		oSOGDialog.open();

		// Set default values to search fields
		this.byId("idCreatedByInput").setValue(this.getModel("SRS_Data_UserSet").getProperty("/userId"));
		this.byId("idDescriptionInput").setValue("");

		var filter = [];
		filter.push(new sap.ui.model.Filter("CreatedBy", sap.ui.model.FilterOperator.EQ, this.getModel("SRS_Data_UserSet").getProperty(
			"/userId")));
		models.getServiceOrderGroup(this, filter, false, "/ServiceOrderGroupSet", "serviceOrderGroupModel");
	},

	handleServiceOrderGroupValueHelpSearchInDialog: function (oEvent) {
		var sCreatedBy = this.byId("idCreatedByInput").getValue().trim();
		var sDescription = this.byId("idDescriptionInput").getValue().trim();

		if (sCreatedBy === "" && sDescription === "") {
			sap.m.MessageToast.show(this.getResourceBundle().getText("serviceOrderGroupSearchWarning"));
		} else {
			var filters = [];
			if (sCreatedBy !== "") {
				filters.push(models.filterCondition_Contains("CreatedBy", sCreatedBy));
			}
			if (sDescription !== "") {
				filters.push(models.filterCondition_Contains("Description", sDescription));
			}
			if (filters.length > 1) {
				var filtersWithAnd = models.filterComparison_AND(filters);
				filters = [];
				filters.push(filtersWithAnd);
			}
			models.getServiceOrderGroup(this, filters, false, "/ServiceOrderGroupSet", "serviceOrderGroupModel");
		}
	},

	handleServiceOrderGroupSelection: function (oEvent) {
		var oSelectedSOGItem = this.byId("SOGTable").getSelectedItem();
		var oSelectedSOG = oSelectedSOGItem.getBindingContext("serviceOrderGroupModel").getObject();
		this.getModel("servicerequestModel").getData().ServiceOrderGroup = oSelectedSOG.Description;
		this.getModel("servicerequestModel").refresh();
		this.byId("idServiceOrderGroupInput").setValueState("None");
		this.byId("dialogSOG").close();
	},

	onServiceOrderGroupDialogClose: function (oEvent) {
		// Reset search field input
		this.byId("idCreatedByInput").setValue(this.getModel("SRS_Data_UserSet").getProperty("/userId"));
		this.byId("idDescriptionInput").setValue();
		// Initialize SOG Model
		this.setModel(new JSONModel(), "serviceOrderGroupModel");
		// Close Service Order Group Value Help Dialog
		oEvent.getSource().getParent().close();
	},

	onSuggestQualiID: function (event) {
		var value = event.getParameter("suggestValue");
		var filters = [];
		if (value) {
			filters = [
				new sap.ui.model.Filter([
					new sap.ui.model.Filter("ProductId", function (sText) {
						return (sText || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
					}),
					new sap.ui.model.Filter("QualiID", function (sDes) {
						return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
					})
				], false)
			];
		}
		this.oSF = event.getSource();
		this.oSF.getBinding("suggestionItems").filter(filters);
		this.oSF.suggest();
	},
	handleChangeStartD: function (oEvent) {

		var oDP = oEvent.getSource();
		var sValue = oEvent.getParameter("value");
		var bValid = oEvent.getParameter("valid");
		this._iEvent++;

		if (bValid) {
			oDP.setValueState(sap.ui.core.ValueState.None);
		} else {
			oDP.setValueState(sap.ui.core.ValueState.Error);
		}
	},
	handleChangeEndD: function (oEvent) {

		var oDP = oEvent.getSource();
		var sValue = oEvent.getParameter("value");
		var bValid = oEvent.getParameter("valid");
		this._iEvent++;

		if (bValid) {
			oDP.setValueState(sap.ui.core.ValueState.None);
		} else {
			oDP.setValueState(sap.ui.core.ValueState.Error);
		}
	},
	handleChangeStartT: function (oEvent) {

		var oTP = oEvent.getSource();
		var sValue = oEvent.getParameter("value");
	},
	handleChangeEndT: function (oEvent) {

		var oTP = oEvent.getSource();
		var sValue = oEvent.getParameter("value");
	},

	onCollapse: function () {
		var hidebutton = this.byId("hidebutton");
		var showbutton = this.byId("showbutton");;

		var oPage = this.byId("ObjectPageLayout");
		oPage.setShowHeaderContent(!oPage.getShowHeaderContent());
		hidebutton.setVisible(!hidebutton.getVisible());
		showbutton.setVisible(!showbutton.getVisible());
	},
	onRefresh: function (stepId) {
		sap.ui.core.BusyIndicator.show();
		// Set Time Zone value in Scope Table Column Header
		if (this.byId("scopeStartDateColumnHeader") !== undefined && this.byId("scopeEndDateColumnHeader") !== undefined) {
			var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			this.byId("scopeStartDateColumnHeader").setText(this.getResourceBundle().getText("startDateTime") + " (" + timeZone + ")");
			this.byId("scopeEndDateColumnHeader").setText(this.getResourceBundle().getText("endDateTime") + " (" + timeZone + ")");
		}
		this.setModel(new JSONModel(), "contractSetModel");
		this.setModel(new JSONModel(), "contractItemModel");
		sap.ui.core.BusyIndicator.attachEventOnce("Open", function () {
			if (this.sServiceRequestId !== models.SR_NEW_ID) {
				//reset Error Message
				this.setModel(new JSONModel({
					"message": []
				}), "errorModel");
				this.resetISDHubBtnPoperties();
				this.getModel("SRS_Data").read("/ServiceRequestHeaderSet('" + this.sServiceRequestId + "')", {
					success: function (oData, response) {
						if (response.headers['sap-message']) {
							var jsonMessage = JSON.parse(response.headers['sap-message'])
							if (jsonMessage.severity == "error") {
								//push error message to ErrorModel
								//showMessageBox
								jsonMessage.type = sap.ui.core.MessageType.Error;
								var messageData = [];
								messageData.push(jsonMessage);
								this.getModel("errorModel").setProperty("/message", messageData);
								if (jsonMessage.details.length > 0) {
									for (var i = 0; i < jsonMessage.details.length; i++) {
										switch (jsonMessage.details[i].severity) {
										case "error":
											jsonMessage.details[i].type = sap.ui.core.MessageType.Error;
											break;
										case "warning":
											jsonMessage.details[i].type = sap.ui.core.MessageType.Warning;
											break;
										default:
											break;
										}
									}
									this.getModel("errorModel").setProperty("/message", this.getModel("errorModel").getProperty("/message").concat(
										jsonMessage
										.details));
								}
							}
						}

						if (oData) {
							models.getProductSet(this, "/ProductSet", "ProductID", "productSetModel", this.extractedProductParams,null,oData.CustomerID);
							this.callISDHUbInterface(oData.CustomerID);
							this.setModel(new sap.ui.model.json.JSONModel(oData), "servicerequestModel");
							if(oData.ServiceID){
								this.showHideContractAndRelatedFields(oData.ServiceID,oData.CustomerID);
								if(!this.getModel("buttonControlModel").getProperty("/isEdit")){
									models.validateSelectedServiceInSR(this,oData.CustomerID,oData.ServiceID,oData.SessionID,oData.StatusCode);
									models.getValueDriverBySessionId(this,oData.SessionID);
								}
						   }
						   models.checkSurveyRecipientForCustomer(this, oData.CustomerID);
							this.getchangedHistory(false, null);
							var system = this.getModel("servicerequestModel").getProperty("/ReferenceSystemID");
							if (system === "0") {
								this.getModel("servicerequestModel").setProperty("/ReferenceSystemID", "");
							}
							models.goLiveDate = this.getModel("servicerequestModel").getProperty("/GoLiveDate");
							this.getModel("buttonControlModel").setProperty("/isAnyRuleViolated",false);
							this.loadBlockViews(stepId);
							var oController = this;
							// Get Service Order Status
							if (oData.StatusCode === models.STATUS_SOCREATED) {
								if(oData.ServiceOrderID){
									models.getServiceOrderStatusModel(this, false, oData.ServiceOrderID, "serviceOrderStatusModel", false);
								}
							}
						   models.getCloudRefObj(this);
							//The Timeout is ineffective but the flow is complex to handle event publish - needs to be rechecked
							setTimeout(function () {
								oController.setServiceRequestInfoTemplate(null,null,oController);
								//oController.setAgreedScopeTemplate();
							}, 300);
						   
						}
						this.byId("ShowMoreCloudRefObjDisplay").setText("Show less");
						models.showHideMaxRowsForCloudRefObjs(this.byId("idTreeTableCloudRefDisplay"),this.byId("ShowMoreCloudRefObjDisplay"),this);
						models.findProductAndReloadScopingTeamForPreferredSuccessService(this,oData.ServiceID, oData.RegionID, oData.ServiceRequestID);
						if($(".hyperLinkClassDetailHeader")){
							$(".hyperLinkClassDetailHeader").contextmenu(function () { return false; });
						}
					}.bind(this),
					error: function () {
						sap.m.MessageToast.show(this.getResourceBundle().getText("errorText"));
						sap.ui.core.BusyIndicator.hide();
					}.bind(this)
				});
				// Read Notes
				this.reloadNotes();
				this.oEventBus.publish("DetailAttachment", "DetailAttachmentReadSuccess", {
					ServiceRequestID: this.sServiceRequestId
				});
			}
		}, this);
	},

	setServiceRequestInfoTemplate: function () {
		var userProfile = this.getModel("SRS_Data_UserSet").getData();
		var model = this.getModel("serviceRequestScopeModel");
		models.setServiceRequestInfoTemplate(userProfile, model,this);
	},

	setAgreedScopeTemplate: function () {
		var userProfile = this.getModel("SRS_Data_UserSet").getData();
		var model = this.getModel("agreedServiceRequestScopeModel");
		//models.setAgreedScopeTemplate(userProfile, model);
	},

	onShowMoreLog: function () {
		var moretrig = $('.myCustomMore > div:last-of-type > div:first-of-type');
		moretrig.tap();
		var moretrignew = $('.myCustomMore > div:last-of-type');
		moretrignew.css("display", "none");
	},
	onDetailClose: function () {
		// If in Edit mode, get confirmation to go back (else might lose data entered in UI)
		if (this.getModel("buttonControlModel").getProperty("/isEdit")) {
			var resourceBundle = this.getModel("i18n");
			var that = this;
			var goBackConfirmDialog = new Dialog({
				title: resourceBundle.getProperty("warning"),
				type: 'Message',
				state: "Warning",
				icon: "sap-icon://message-warning",
				content: new Text({
					text: resourceBundle.getProperty("unsavedData")
				}),
				beginButton: new Button({
					text: resourceBundle.getProperty("dialogChangeStatusYes"),
					press: function () {
						that.getModel("servicerequestModel").setData({});
						that.getModel("servicerequestItemsModel").setData({});
						that.getModel("serviceRequestScopeModel").setData({});
						that.getModel("agreedServiceRequestScopeModel").setData({});
						that.getModel("commentsModel").setData({});
						if (this.getModel("serviceOrderStatusModel") !== undefined) {
							this.getModel("serviceOrderStatusModel").setData({});
						}
						that.onNavBack();
						goBackConfirmDialog.close();
					}
				}),
				endButton: new Button({
					text: resourceBundle.getProperty("dialogChangeStatusNo"),
					press: function () {
						goBackConfirmDialog.close();
					}
				}),
				afterClose: function () {
					goBackConfirmDialog.destroy();
				}
			});
		   goBackConfirmDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			goBackConfirmDialog.open();
		} else {
			this.getModel("servicerequestModel").setData({});
			this.getModel("servicerequestItemsModel").setData({});
			this.getModel("serviceRequestScopeModel").setData({});
			this.getModel("agreedServiceRequestScopeModel").setData({});
			this.getModel("commentsModel").setData({});
			if (this.getModel("serviceOrderStatusModel") !== undefined) {
				this.getModel("serviceOrderStatusModel").setData({});
			}
			this.onNavBack();
		}
	},
	onNavBack: function () {
		var bReplace = true;
		this.getRouter().navTo("RouteMainView", bReplace);
		this.byId("edit_SR").setVisible(true);
	},
	handleCloseFeedBackDialog: function () {
		this._FeedBackDialog.close();
	},
	onPressAvatar: function (oEvent) {
		var empId = oEvent.getSource().data("userid");
		if (empId) {
			var oPopover = new EmployeeDataInfoPopover({
			   endpoint: sap.ui.require.toUrl("sap/com/servicerequest/servicerequest") + "/sapit-employee-data",
			   userId: empId
			});

			oPopover.openBy(oEvent.getSource());
		}
	},

	handleBtnPrevProcessor: function(oEvent){
		var ProcessorUser = this.getModel("servicerequestModel").getProperty("/ProcessorUser");
		var ProcessorName = this.getModel("servicerequestModel").getProperty("/ProcessorName");
		this.getModel("servicerequestModel").setProperty("/LastScoperUser",ProcessorUser);
		this.getModel("servicerequestModel").setProperty("/LastScoperName",ProcessorName);
	},

	onCaseOwnerChange: function (oEvent) {
		models.onCaseOwnerChange(oEvent, this, "srs_ownerAndPeople");
	},

	onCaseSearch: function () {
		var oView = this.getView();
		var dialog = oView.byId("CaseDialog");
		//check if the input owner is null, if null set 
		if (!dialog) {
			// create dialog via fragment factory
			dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.CaseSearch", this);
			oView.addDependent(dialog);
		}
	   dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
		dialog.open();
		var customerID = this.getModel("servicerequestModel").getProperty("/CustomerID");
		if (!customerID) {
			var ownerName = this.getModel("SRS_Data_UserSet").getProperty("/userName");
			var ownerId = this.getModel("SRS_Data_UserSet").getProperty("/userId");
			models.setTokenForCaseOwner(this, "srs_ownerAndPeople", ownerId, ownerName);
		} else {
			this.byId("srs_ownerAndPeople").setTokens([]);
			this.getModel("caseSearchModel").setProperty("/ownerId", "");
			this.getModel("caseSearchModel").setProperty("/owner", "");
		}
	},

	// case Search start
	onPressCaseSearch: function () {
		this.byId("srs_casetable").setBusyIndicatorDelay(0);
		this.byId("srs_casetable").setBusy(true);
		this.byId("btnCaseSearch").setEnabled(false);
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
			visible: false

		});
		this.setModel(caseModel, "caseModel");
		// if sCase or sCustomer + filter after caseSet
		var filterArr = [];
		if (sCase) {
			filterArr.push(models.filterCondition_Contains("CaseSearch", sCase));
		}
		if (sCustomer) {
			filterArr.push(models.filterCondition_Contains("CustomerSearch", sCustomer));
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
				this.byId("btnCaseSearch").setEnabled(true);
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
			error: function (err) {
				if (JSON.parse(err.responseText).error.code === "ZS_CRM_CASE/700") {
					try {
						var errorMsg = JSON.parse(err.responseText).error.message.value;
						sap.m.MessageToast.show(errorMsg);
					} catch (Exception) {
						sap.m.MessageToast.show(this.getResourceBundle().getText("errorTextForCase"));
					}
				} else {
					sap.m.MessageToast.show(this.getResourceBundle().getText("errorTextForCase"));
				}
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

	caseModelSelect: function (oEvent) {
		this.onPressOkInCaseSearchPopUp(oEvent);
	},

	//end of case search
	onPressOkInCaseSearchPopUp: function (oEvent) {
		var currentDescription = this.getModel("servicerequestModel").getProperty("/Description");
		var SRHeader = this.getModel("servicerequestModel").getData();
		var oSelectedItem = this.byId("srs_casetable").getSelectedItem();
		if (oSelectedItem) {
			var oSelectedCase = oSelectedItem.getBindingContext("caseModel").getObject();
			if (oSelectedCase.StatusId === models.CASE_STATUS_CLOSED) { // Closed Case!
				oEvent.getSource().removeSelections();
				sap.m.MessageToast.show(this.getResourceBundle().getText("cannotSelectClosedCase"));
				return;
			} else if (oSelectedCase.ReasonCode === models.CASE_REASON_ENGAGEMENT || oSelectedCase.ReasonCode === models.CASE_REASON_ENGAGEMENT_GLOBAL) {
				oEvent.getSource().removeSelections();
				sap.m.MessageToast.show(this.getResourceBundle().getText("txtCaseEngagment"));
				return;
			} else {
				var CaseID = SRHeader.CaseID;
				var CustomerID = SRHeader.CustomerID;
				var CustomerName = SRHeader.CustomerName;
				this.getModel("SRS_Data_UserSet").getData().customerId = oSelectedItem.getCells()[2].getText();
				var dialogMsg = "";
				if (this.getModel("caseSearchModel")) {
					this.getModel("caseSearchModel").setProperty("/customer", CustomerID);
				}
				if (SRHeader.CustomerID === oSelectedCase.CustomerId) {
					dialogMsg = this.getResourceBundle().getText("txtChangeCaseDialogMsgForSameCustomer", [CaseID, CustomerID, CustomerName,
						oSelectedCase.CaseId,
						oSelectedCase.CustomerId, oSelectedCase.CustomerName
					]);
				} else {
					dialogMsg = this.getResourceBundle().getText("txtChangeCaseDialogMsgForDiffCustomer", [CaseID, CustomerID, CustomerName,
						oSelectedCase.CaseId,
						oSelectedCase.CustomerId, oSelectedCase.CustomerName
					]);
				}

				if (CaseID) {
					var that = this;
					var dialog = new sap.m.Dialog({
						title: "Warning",
						type: 'Message',
						state: 'Warning',
						contentWidth: "70%",
						content: [
							new sap.m.Text({
								text: dialogMsg
							})
						],
						beginButton: new sap.m.Button({
							text: that.getResourceBundle().getText("dialogChangeStatusYes"),
							press: function () {
								//Load Fav Qualifications
								if(oSelectedCase.CaseId){
									this.setModel(new JSONModel([]), "favQualificationsModel");
									models.getServiceRequestByCaseID(this,oSelectedCase.CaseId);
								}
								that.getSRDraftHeaderOnCaseChange(oSelectedCase.CaseId, currentDescription, null, null, null);
								if (oSelectedCase.ReasonCode === models.CASE_REASON_EMPTY) {
									that.getModel("buttonControlModel").setProperty("/caseWithoutReasonWarning", true);
								} else {
									that.getModel("buttonControlModel").setProperty("/caseWithoutReasonWarning", false);
								}
								this.getModel("servicerequestModel").setProperty("/ParentCaseID", oSelectedCase.ParentCaseID);
								dialog.destroy();
							}.bind(this)
						}),
						endButton: new sap.m.Button({
							text: that.getResourceBundle().getText("dialogChangeStatusNo"),
							press: function () {
								dialog.destroy();
							}.bind(this)
						}),
						afterClose: function () {
							dialog.destroy();
						}
					});
					dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					dialog.open();
				} else {
					this.getModel("servicerequestModel").setProperty("/ParentCaseID", oSelectedCase.ParentCaseID);
					this.getModel("SRS_Data_UserSet").getData().customerId = oSelectedItem.getCells()[2].getText();
					var oEventBus = sap.ui.getCore().getEventBus();
					oEventBus.publish("RequestReset", "RequestResetSuccess");
					//Load Fav Qualifications
					if(oSelectedCase.CaseId){
						this.setModel(new JSONModel([]), "favQualificationsModel");
						models.getServiceRequestByCaseID(this,oSelectedCase.CaseId);
					}
					this.getSRDraftHeaderFromCase(oSelectedCase.CaseId, currentDescription, null, null, null);
				
					var userProfile = this.getModel("SRS_Data_UserSet").getData();
					var serviceRequestModel = this.getModel("serviceRequestScopeModel");
					var agreedScopeModel = this.getModel("agreedServiceRequestScopeModel");

					models.setServiceRequestInfoTemplate(userProfile, serviceRequestModel,this);
					//models.setAgreedScopeTemplate(userProfile, agreedScopeModel);
					if (oSelectedCase.ReasonCode === models.CASE_REASON_EMPTY) {
						this.getModel("buttonControlModel").setProperty("/caseWithoutReasonWarning", true);
					} else {
						this.getModel("buttonControlModel").setProperty("/caseWithoutReasonWarning", false);
					}
				}
			}
		} 
		
		this.byId("srs_case").setValue();
		//this.byId("srs_customer").setValue();
		//reset Case Model and more button
		var caseModel = new JSONModel({
			caseString: "",
			data: [],
			total: 0,
			page: 0,
			current: 0,
			visible: false
		});
		this.setModel(caseModel, "caseModel");
		this.getModel("buttonControlModel").setProperty("/caseMoreButton", false);

		if (oSelectedCase === undefined && this.byId("srs_case-input").getValue() === "") {
			this.byId("srs_case-input").setValueState("Error");
			this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
		}
		this.byId("CaseDialog").close();
	},

	onCloseCase: function(){
		var SRHeader = this.getModel("servicerequestModel").getData();
		if(!SRHeader.CaseID){
			this.onNavBack();
		}
		this.byId("CaseDialog").close();
	},

	setErrorResponseForCase: function (response) {
		if (response.headers['sap-message']) {
			var jsonMessage = JSON.parse(response.headers['sap-message'])
			if (jsonMessage.severity == "error") {
				//push error message to ErrorModel
				//showMessageBox
				jsonMessage.type = sap.ui.core.MessageType.Error;
				var messageData = [];
				messageData.push(jsonMessage);
				this.getModel("errorModel").setProperty("/message", messageData);
				if (jsonMessage.details.length > 0) {
					for (var i = 0; i < jsonMessage.details.length; i++) {
						switch (jsonMessage.details[i].severity) {
						case "error":
							jsonMessage.details[i].type = sap.ui.core.MessageType.Error;
							break;
						case "warning":
							jsonMessage.details[i].type = sap.ui.core.MessageType.Warning;
							break;
						default:
							break;
						}
					}
					this.getModel("errorModel").setProperty("/message", this.getModel("errorModel").getProperty("/message").concat(jsonMessage
						.details));
				}
			}
		}
	},

	getSRDraftHeaderOnCaseChange: function (sCaseId, sCurrentDescription, SR_ID, buttonControlModel, dialogReqDelDate) {
		var serviceURL = "/GetDraftSRHeader";
		// reset error Model
		this.setModel(new JSONModel({
			message: []
		}), "errorModel");
	   var sessionID = this.getModel("servicerequestModel").getProperty("/SessionID");
	   if(!sessionID){
		   models.getReferenceObjects(this,sCaseId,null,null,null,null);
	   }
		sap.ui.core.BusyIndicator.show(0);
		this.getModel("SRS_Data").read(serviceURL, {
			urlParameters: {
				"CaseID": "'" + sCaseId + "'"
			},
			success: function (oData, response) {
				this.setErrorResponseForCase(response);
				var existingModel = this.getModel("servicerequestModel").getData();
				var SRItems = this.getModel("servicerequestItemsModel").getData();
				this.getModel("servicerequestModel").setProperty("/CaseID", oData.CaseID);
				if (existingModel.CustomerID !== oData.CustomerID) {
					models.getProductSet(this, "/ProductSet", "ProductID", "productSetModel", this.extractedProductParams,null,oData.CustomerID);
					this.getModel("servicerequestModel").setProperty("/CustomerID", oData.CustomerID);
					this.getModel("servicerequestModel").setProperty("/CustomerName", oData.CustomerName);
					this.getModel("servicerequestModel").setProperty("/StatusCode", models.STATUS_NEW);
					this.getModel("servicerequestModel").setProperty("/StatusDescription", this.statusNewDesc);
					this.getModel("servicerequestModel").setProperty("/ContactID", oData.ContactID);
					this.getModel("servicerequestModel").setProperty("/ContactName", oData.ContactName);
					this.getModel("servicerequestModel").setProperty("/ReferenceSystemID", "");
					this.getModel("servicerequestModel").setProperty("/ReferenceSystemName", "");
					this.getModel("servicerequestModel").setProperty("/SolmanComponent", "");
					this.getModel("servicerequestModel").setProperty("/InstNo", "");
					this.getModel("servicerequestModel").setProperty("/RegionID", oData.RegionID);
					this.getModel("servicerequestModel").setProperty("/FeedbackEnabled", true);
					models.checkSurveyRecipientForCustomer(this, oData.CustomerID);
					this.getModel("servicerequestModel").setProperty("/SurveyRecID", oData.SurveyRecID);
					this.getModel("servicerequestModel").setProperty("/SurveyRecName", oData.SurveyRecName);
					this.getModel("servicerequestModel").setProperty("/ParentCaseID", existingModel.ParentCaseID);

					this.setModel(new JSONModel(), "systemModel");
					models.getDeploymentRooms(this, "/DeploymentRoomSet", oData.RegionID, "deplRoomModel", "001", "dr-edit", false,null);
					this.oEventBus.publish("RequestReset", "RequestResetSuccess");
					this.oEventBus.publish("onCaseReset", "onCaseResetSuccess");
					this.byId("srs_case-input").setValueState("None");
					this.byId("idServiceOrderGroupInput").setValueState("None");
					models.onCreateValidate(this);
				}

				for (var i = 0; i < SRItems.length; i++) {
					if (SRItems[i].ItemNo === models.SR_ITEM_10) {
						if (existingModel.CustomerID !== oData.CustomerID) {
							SRItems[i].ContractID = "";
							SRItems[i].ContractName = "";
							SRItems[i].ContractItemID = "";
							SRItems[i].ContractItemName = "";
						}
						SRItems[i].GoLiveDate = oData.GoLiveDate;
						break;
					}
				}

				if (this.getModel("caseSearchModel")) {
					this.getModel("caseSearchModel").setProperty("/customer", oData.CustomerID);
				}

				this.getModel("servicerequestModel").setProperty("/GoLiveDate", oData.GoLiveDate);

				var userProfile = this.getModel("SRS_Data_UserSet").getData();
				var serviceRequestModel = this.getModel("serviceRequestScopeModel");
				var agreedScopeModel = this.getModel("agreedServiceRequestScopeModel");

				if (!oData.ContactID) {
					this.oEventBus.publish("removeCustomerContact", "removeCustomerContactSuccess");
				}

				if (!oData.SurveyRecID) {
					this.oEventBus.publish("removeSurevyRecipient", "removeSurevyRecipientSuccess");
				}

				models.setServiceRequestInfoTemplate(userProfile, serviceRequestModel,this);
			//	models.setAgreedScopeTemplate(userProfile, agreedScopeModel);
				models.applyBrowserAutoFillOff();
				sap.ui.core.BusyIndicator.hide();
			}.bind(this),
			error: function (error) {
				models.showErrorMessage(this, error);
				sap.ui.core.BusyIndicator.hide();
			}.bind(this)
		});
	},

	getSRDraftHeaderFromCase: function (sCaseId, sCurrentDescription, SR_ID, buttonControlModel, dialogReqDelDate) {
		var serviceURL = "/GetDraftSRHeader";
		// reset error Model
		this.setModel(new JSONModel({
			message: []
		}), "errorModel");
		sap.ui.core.BusyIndicator.show(0);
	   
	   if(!this.extractedProductParams){
		   models.getReferenceObjects(this,sCaseId,null,null,null,null);
	   }

		this.getModel("SRS_Data").read(serviceURL, {
			urlParameters: {
				"CaseID": "'" + sCaseId + "'"
			},
			groupId: "batchDraftHeader",
			success: function (oData, response) {
				models.getProductSet(this, "/ProductSet", "ProductID", "productSetModel", this.extractedProductParams,null,oData.CustomerID);
				this.setErrorResponseForCase(response);
				oData.Description = sCurrentDescription;
				oData.OwnerUser = this.getModel("SRS_Data_UserSet").getProperty("/userId");
				oData.OwnerName = this.getModel("SRS_Data_UserSet").getProperty("/userName");
				oData.StatusDescription = this.statusNewDesc;
				oData.StatusCode = models.STATUS_NEW; // New

				var existingModel = this.getModel("servicerequestModel").getData();
				var existingServiceOrderGroup = existingModel.ServiceOrderGroup;
				var existingServiceID = existingModel.ServiceID;
				var existingDesc = existingModel.Description;
				var existingServiceName = existingModel.ServiceName;
				var existingSessionID = existingModel.SessionID;
				var existingSessionName = existingModel.SessionName;
				var existingReferenceSystem = existingModel.ReferenceSystemID;
				var existingReferenceSystemName = existingModel.ReferenceSystemName;
				var existingSolman = existingModel.SolmanComponent;
				var existingInstNo = existingModel.InstNo;
				var callOffDays = existingModel.TotalCallOffDays;
				var existingcontactId = existingModel.ContactID;
				var existingContactName = existingModel.ContactName;
				var existingServiceContactID = existingModel.ServiceContactID;
				var existingServiceContactName = existingModel.ServiceContactName;
				var existingGoLiveDate = existingModel.GoLiveDate;
				var existingSurveyRecID = existingModel.SurveyRecID;
				var existingSurveyRecName = existingModel.SurveyRecName;
				var existingFeedbackEnabled = existingModel.FeedbackEnabled;
				var existingServiceReviewEnabled = existingModel.ServiceReviewEnabled;
				var existingParentCaseID = existingModel.ParentCaseID ? existingModel.ParentCaseID : oData.ParentCaseID;
				var existingRequestedLanguage = existingModel.RequestedDeliveryLanguage;

			   if((this.sServiceRequestId === models.SR_NEW_ID) && this.extractedProductParams){
				   if(existingServiceID){
					   oData.ServiceID = existingServiceID;
					   oData.ServiceReviewEnabled = existingServiceReviewEnabled;
				   }

				   if(existingSessionID){
					   oData.SessionID = existingSessionID;
				   }
			   }

				this.setModel(new JSONModel(oData), "servicerequestModel");
				if (this.sServiceRequestId !== models.SR_NEW_ID) {
					this.getModel("servicerequestModel").setProperty("/ServiceRequestID", existingModel.ServiceRequestID);
					this.getModel("servicerequestModel").setProperty("/HeaderGUID", existingModel.HeaderGUID);
				}
				models.goLiveDate = this.getModel("servicerequestModel").getProperty("/GoLiveDate");
				models.getDeploymentRooms(this, "/DeploymentRoomSet", oData.RegionID, "deplRoomModel", "001", "dr-edit", false,null);
				this.oEventBus.publish("resetSystem", "resetSystemSuccess");

				var arr = ["System", "GoLiveDate", "DRegion", "SRTitle", "Service", "SRInfo"];
				models.setDetailPageFieldsToEdit(arr, this);

				this.byId("srs_case-input").setValueState("None");
				this.byId("idServiceOrderGroupInput").setValueState("None");
				models.onCreateValidate(this);

				if (this.getModel("caseSearchModel")) {
					this.getModel("caseSearchModel").setProperty("/customer", oData.CustomerID);
				}

				this.getModel("servicerequestModel").setProperty("/ParentCaseID", existingParentCaseID);

				if (SR_ID === models.STRING_COPY_SR) {
					this.getModel("servicerequestModel").setProperty("/ServiceOrderGroup", existingServiceOrderGroup);
					this.getModel("servicerequestModel").setProperty("/Description", existingDesc);
					this.getModel("servicerequestModel").setProperty("/RequestedDeliveryDate", dialogReqDelDate);
					this.getModel("servicerequestModel").setProperty("/ServiceID", existingServiceID);
					this.getModel("servicerequestModel").setProperty("/ServiceName", existingServiceName);
					this.getModel("servicerequestModel").setProperty("/SessionID", existingSessionID);
					this.getModel("servicerequestModel").setProperty("/SessionName", existingSessionName);
					this.getModel("servicerequestModel").setProperty("/ReferenceSystemID", existingReferenceSystem);
					this.getModel("servicerequestModel").setProperty("/ReferenceSystemName", existingReferenceSystemName);
					this.getModel("servicerequestModel").setProperty("/SolmanComponent", existingSolman);
					this.getModel("servicerequestModel").setProperty("/TotalCallOffDays", callOffDays);
					this.getModel("servicerequestModel").setProperty("/InstNo", existingInstNo);
					this.getModel("servicerequestModel").setProperty("/ContactID", existingcontactId);
					this.getModel("servicerequestModel").setProperty("/ContactName", existingContactName);
					this.getModel("servicerequestModel").setProperty("/ServiceContactID", existingServiceContactID);
					this.getModel("servicerequestModel").setProperty("/ServiceContactName", existingServiceContactName);
					this.getModel("servicerequestModel").setProperty("/SurveyRecID", existingSurveyRecID);
					this.getModel("servicerequestModel").setProperty("/SurveyRecName", existingSurveyRecName);
					this.getModel("servicerequestModel").setProperty("/FeedbackEnabled", existingFeedbackEnabled);
					this.getModel("servicerequestModel").setProperty("/RequestedDeliveryLanguage", existingRequestedLanguage);
				   
					this.getModel("editableFieldsModel").setProperty("/ReqDelDate", false);
					this.copyServiceRequest(buttonControlModel, dialogReqDelDate);
				  	models.setVisibleFeedbackForm(this,existingSessionID);
				} else {
					this.getModel("servicerequestModel").setProperty("/FeedbackEnabled", true);
				}
				if (!oData.ContactID) {
					this.oEventBus.publish("removeCustomerContact", "removeCustomerContactSuccess");
				}
				if (!oData.SurveyRecID) {
					this.oEventBus.publish("removeSurevyRecipient", "removeSurevyRecipientSuccess");
				}
				models.checkSurveyRecipientForCustomer(this, oData.CustomerID);
				models.applyBrowserAutoFillOff();
				sap.ui.core.BusyIndicator.hide();
			}.bind(this),
			error: function (error) {
				models.showErrorMessage(this, error);
				sap.ui.core.BusyIndicator.hide();
			}.bind(this)
		});
	},

	// On edit Service Request	
	onEdit: function () {
		this.getModel("buttonControlModel").setProperty("/refreshBtnVisible", false);
		this.onRefresh(null);
		var StatusCode = this.getModel("servicerequestModel").getProperty("/StatusCode");
		if (StatusCode && StatusCode === models.STATUS_APPROVED) {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.warning(
				'In status APPROVED only comments can be added and following fields can be modified: Contract, External Reference, Service Request Title, Service Order Group. \nIf you would like to change other scope definition, please send Service Request back to Author.', {
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				}
			);
		}
		this.toggleDisplayAndEdit();

		//Apply Auto filter off for Google Chrome
		models.applyBrowserAutoFillOff();
	},

	onEditForSRProgress: function (stepId) {
		this.getModel("buttonControlModel").setProperty("/refreshBtnVisible", false);
		this.onRefresh(stepId);
		var StatusCode = this.getModel("servicerequestModel").getProperty("/StatusCode");
		if (StatusCode && StatusCode === models.STATUS_APPROVED) {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.warning(
				'In status APPROVED only comments can be added and contract can be modified. \nIf you would like to change other scope definition, please send Service Request back to Author.', {
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				}
			);
		}
		this.toggleDisplayAndEdit();

		//Apply Auto filter off for Google Chrome
		models.applyBrowserAutoFillOff();

	},

	// toggle button between display and edit.
	toggleDisplayAndEdit: function () {
		var buttonModel = this.getModel("buttonControlModel");

		if (buttonModel.getProperty("/isEdit") == true) {
			this.byId("fragmentDetailPageHeaderContentDisplay").setVisible(true);
			this.byId("fragmentDetailDiscussionDisplay").setVisible(true);
			this.byId("fragmentDetailAttachmentDisplay").setVisible(true);
			this.byId("fragmentDetailScopeDisplay").setVisible(true);
			this.byId("fragmentDetailApprovalDisplay").setVisible(true);
			this.byId("fragmentDetailPageHeaderContentEdit").setVisible(false);
			this.byId("detailApproval").setVisible(false);
			this.byId("detailScope").setVisible(false);
			this.byId("detailDiscussion").setVisible(false);
			this.byId("detailAttachments").setVisible(false);
			this.byId("edit_SR").setVisible(true);
			buttonModel.setProperty("/isEdit", false);
			this.resetTextAreaGrowing();
		} else {
			this.byId("fragmentDetailPageHeaderContentDisplay").setVisible(false);
			this.byId("fragmentDetailDiscussionDisplay").setVisible(false);
			this.byId("fragmentDetailAttachmentDisplay").setVisible(false);
			this.byId("fragmentDetailScopeDisplay").setVisible(false);
			this.byId("fragmentDetailApprovalDisplay").setVisible(false);
			this.byId("fragmentDetailPageHeaderContentEdit").setVisible(true);
			this.byId("detailApproval").setVisible(true);
			this.byId("detailScope").setVisible(true);
			this.byId("detailDiscussion").setVisible(true);
			this.byId("detailAttachments").setVisible(true);
			buttonModel.setProperty("/isEdit", true);
			buttonModel.setProperty("/isSOCreated", false);
			this.resetValueStateOfMandFields();
		}
		models.onCreateValidate(this);
	},

	//on Create Request
	onCreateServiceRequest: function () {
		//reset Brewser URL
	//	models.resetBrowserURL();
		//Setting NoteSet error flag as false
		models.ERROR_FLAG_NOTESET = false;
		models.OPR_TYPE = "SAVE_OPR";
		//Validatioon for Template not filled
		var sRequestInfoFilledText = this.getModel("serviceRequestScopeModel").getProperty("/Text");
		var agreedScopeFilledText = this.getModel("agreedServiceRequestScopeModel").getProperty("/Text");
		if (models.checkServiceRequestInfoTemplateValidation(sRequestInfoFilledText,this)) {
			this.getModel("serviceRequestScopeModel").setProperty("/Text", "");
		}

		/*
		if (models.checkAgreedScopeTemplateValidation(agreedScopeFilledText)) {
			this.getModel("agreedServiceRequestScopeModel").setProperty("/Text", "");
		}
*/
		if (!models.sessionValiation(this)) {
			return;
		}

		this.oEventBus.publish("contractItemValidation", "contractItemValidationSuccess");
		if (!models.contractItemsDurationValid) {
			models.showContractValidationMessage(this);
			return;
		}

		//Validation for Empty Line Items - Workaround to find deleted items
		var aScopeItems = jQuery.extend([], this.getModel("servicerequestItemsModel").getData());
		var aScopeNotDeletedItems = [];
		if (this.getView().byId("detailScope").getControlsByFieldGroupId("")) {
			var oControl = this.getView().byId("detailScope").getControlsByFieldGroupId("").filter(function (v) {
				return v.getId().indexOf("idProductsTable-edit") > -1;
			});

			if (oControl && oControl.length) {
				var deletionIndex = oControl[0].getItems().map(function (v, i) {
					if (v.getVisible() === true) {
						return i;
					} else {
						return -1;
					}
				});
				for (var i = 0; i < aScopeItems.length; i++) {
					if (deletionIndex[i] > -1) {
						aScopeNotDeletedItems.push(aScopeItems[i]);
					}
				}
				var validationCheckForItems = models.validateEmptyScopeItems(aScopeNotDeletedItems, this);
				if (validationCheckForItems.Product || validationCheckForItems.DeliveryTeam) {
					models.showEmptyScopeItemsValidationMessage(this, validationCheckForItems);
					return;
				}
			}
		}

		this.submitServiceRequestCreateToBackend();
	},
	submitServiceRequestCreateToBackend: function () {
		var payload = this.getModel("servicerequestModel").getData();

		this.showBusyDialog();

		var itemCreationIsExecuted = false;
		this.getModel("SRS_Data").create("/ServiceRequestHeaderSet", payload, {
			success: function (oData) {

				this.getModel("servicerequestModel").setData(oData);

				this.getModel("buttonControlModel").setProperty("/isNewRequest", false);
				this.getModel("buttonControlModel").setProperty("/isEdit", true);
				this.getModel("buttonControlModel").setProperty("/displayEditButtonText", this.getResourceBundle().getText("edit"));
				this.toggleDisplayAndEdit();

				if (this.sServiceRequestId === models.STRING_COPY_SR) {
					models.trackEvent(this.getOwnerComponent(), models.TRACK_EVENT_SR_CREATED_VIA_COPY);
				}

				if (this.caseId === "0") {
					models.trackEvent(this.getOwnerComponent(), models.TRACK_EVENT_SR_CREATE_FROM_LIST_VIEW);
				}

				//update Service RequestID
				this.sServiceRequestId = oData.ServiceRequestID;

				if (this.getModel("serviceRequestScopeModel") && this.getModel("serviceRequestScopeModel").getData() && this.getModel(
						"serviceRequestScopeModel").getData().isServiceRequestInfoChanged && this.getModel(
						"serviceRequestScopeModel").getData().isServiceRequestInfoChanged.toLowerCase() === "true") {
					this.createSRInfoAndItems(oData, itemCreationIsExecuted);
				} else if (this.getModel("buttonControlModel").getProperty("/isCommentsChanged") && this.getModel("commentsModel").getData() &&
					this.getModel("commentsModel").getData().Text && this.getModel("commentsModel").getData().Text.trim()) {
					var commentPayload = {
						"ServiceRequestID": oData.ServiceRequestID,
						"NoteType": "ZCOM",
						"Langu": "EN",
						"Text": this.getModel("commentsModel").getData().Text.trim()
					};
					this.createDiscussionForSRCreate(commentPayload, models.STR_COMMENT, oData.StatusCode, oData.ServiceRequestID,
						itemCreationIsExecuted, oData);
				} else {
					if (!itemCreationIsExecuted) {
						itemCreationIsExecuted = true;
						this.oEventBus.publish("createSRItems", "createSRItemsSuccess", oData);
					}
				}
				// Track Event
				
				models.trackEvent(this.getOwnerComponent(), models.TRACK_EVENT_SR_CREATED);
				var isPrs = this.getModel("buttonControlModel").getProperty("/IsPreferredSuccessServiceSelected");
				if(isPrs){
					models.trackEvent(this.getOwnerComponent(), models.TRACK_EVENT_SR_CREATED_PrS);
				}else{
					models.trackEvent(this.getOwnerComponent(), models.TRACK_EVENT_SR_CREATED_PE);
				}

			}.bind(this),
			error: function (error) {
				models.showErrorMessage(this, error);
				models.onCreateValidate(this);
				this.hideBusyDialog();
			}.bind(this)
		});
	},

	createSRInfoAndItems: function (SRModel, itemCreationIsExecuted) {

		var isNoServiceRequestScopeExist = this.getModel("serviceRequestScopeModel").getData().data === undefined ? true : this.getModel(
			"serviceRequestScopeModel").getData().data.length === 0 ? true : false;
		if (isNoServiceRequestScopeExist) { // Create
			if (this.getModel("serviceRequestScopeModel").getData() && this.getModel("serviceRequestScopeModel").getData().Text && this.getModel(
					"serviceRequestScopeModel").getData().Text.trim()) {
				var srScopePayload = {
					"ServiceRequestID": SRModel.ServiceRequestID,
					"NoteType": "ZSQ1",
					"Langu": "EN",
					"Text": this.getModel("serviceRequestScopeModel").getData().Text.trim()
				};

				this.getModel("SRS_Data").create("/NoteSet", srScopePayload, {
					success: function (oData) {
						this.getModel("serviceRequestScopeModel").setProperty("/isServiceRequestInfoChanged", "false");

						if (this.getModel("buttonControlModel").getProperty("/isCommentsChanged") && this.getModel("commentsModel").getData() &&
							this.getModel("commentsModel").getData().Text && this.getModel("commentsModel").getData().Text.trim()) {
							var commentPayload = {
								"ServiceRequestID": SRModel.ServiceRequestID,
								"NoteType": "ZCOM",
								"Langu": "EN",
								"Text": this.getModel("commentsModel").getData().Text.trim()
							};
							this.createDiscussionForSRCreate(commentPayload, models.STR_COMMENT, SRModel.StatusCode, SRModel.ServiceRequestID,
								itemCreationIsExecuted, SRModel);
						} else {
							if (!itemCreationIsExecuted) {
								itemCreationIsExecuted = true;
								this.oEventBus.publish("createSRItems", "createSRItemsSuccess", SRModel);
							}
						}
					}.bind(this),
					error: function (error) {
						MessageBox.error(this.getResourceBundle().getText("errorTextSRInfo"));
						if (!models.ERROR_FLAG_NOTESET) {
							models.ERROR_FLAG_NOTESET = true;
							this.hideBusyDialog();
							sap.ui.core.BusyIndicator.hide();
							if (!this.getModel("buttonControlModel").getProperty("/isEdit")) {
								this.oEventBus.publish("toggleEditDisplay", "toggleEditDisplaySuccess");
							}
						}
					}.bind(this)
				});

			}
		}

	},
	createDiscussionForSRCreate: function (noteSetPayload, noteType, statusCode, sServiceRequestID, itemCreationIsExecuted, SRModel) {
		this.getModel("SRS_Data").create("/NoteSet", noteSetPayload, {
			success: function (oData) {
				this.getModel("buttonControlModel").setProperty("/isCommentsChanged", false);
				if (!itemCreationIsExecuted) {
					itemCreationIsExecuted = true;
					this.oEventBus.publish("createSRItems", "createSRItemsSuccess", SRModel);
				}

			}.bind(this),
			error: function (error) {
				MessageBox.error(this.getResourceBundle().getText("errorTextDiscussion"));
				if (noteType === models.STR_COMMENT) {
					this.hideBusyIndicatorForNotes();
				}
				if (!models.ERROR_FLAG_NOTESET) {
					models.ERROR_FLAG_NOTESET = true;
					this.hideBusyDialog();
					sap.ui.core.BusyIndicator.hide();
					if (!this.getModel("buttonControlModel").getProperty("/isEdit")) {
						this.oEventBus.publish("toggleEditDisplay", "toggleEditDisplaySuccess");
					}
				}
			}.bind(this)
		});
	},
	processNotes: function (sServiceRequestID, statusCode) {
		var hasAnyNoteAlreadyProcessed = false;
		// Service Request Scope
		if (!hasAnyNoteAlreadyProcessed && this.getModel("serviceRequestScopeModel").getData().isServiceRequestInfoChanged === "true") {
			var isNoServiceRequestScopeExist = this.getModel("serviceRequestScopeModel").getData().data === undefined ? true : this.getModel(
				"serviceRequestScopeModel").getData().data.length === 0 ? true : false;
			if (isNoServiceRequestScopeExist) { // Create
				//	if (this.getModel("serviceRequestScopeModel").getData() && this.getModel("serviceRequestScopeModel").getData().Text && this.getModel(
				//			"serviceRequestScopeModel").getData().Text.trim()) {
				var srScopePayload = {
					"ServiceRequestID": sServiceRequestID,
					"NoteType": "ZSQ1",
					"Langu": "EN",
					"Text": this.getModel("serviceRequestScopeModel").getData().Text.trim()
				};
				hasAnyNoteAlreadyProcessed = true;
				this.createNote(srScopePayload, models.STR_SR_INFO, statusCode, sServiceRequestID);
				//	}
			} else { // Update
				//	if (this.getModel("serviceRequestScopeModel").getData().data.length !== 0) {
				this.getModel("serviceRequestScopeModel").getData().data[0].Text = this.getModel("serviceRequestScopeModel").getData().Text.trim();
				hasAnyNoteAlreadyProcessed = true;
				this.updateNote(this.getModel("serviceRequestScopeModel").getData().data[0], models.STR_SR_INFO, statusCode, sServiceRequestID);
				//	}
			}
		}
		// Agreed Service Scope
		if (!hasAnyNoteAlreadyProcessed && this.getModel("agreedServiceRequestScopeModel").getData().isAgreedScopeChanged === "true") {
			var isNoAgreedScopeExist = this.getModel("agreedServiceRequestScopeModel").getData().data === undefined ? true : this.getModel(
				"agreedServiceRequestScopeModel").getData().data.length === 0 ? true : false;
			if (isNoAgreedScopeExist) { // Create
				//if (this.getModel("agreedServiceRequestScopeModel").getData() && this.getModel("agreedServiceRequestScopeModel").getData().Text &&
				//	this.getModel("agreedServiceRequestScopeModel").getData().Text.trim()) {
				var agreedScopePayload = {
					"ServiceRequestID": sServiceRequestID,
					"NoteType": "ZASR",
					"Langu": "EN",
					"Text": this.getModel("agreedServiceRequestScopeModel").getData().Text.trim()
				};
				hasAnyNoteAlreadyProcessed = true;
				this.createNote(agreedScopePayload, models.STR_AGREED_SCOPE, statusCode, sServiceRequestID);
				//	}
			} else { // Update
				//	if (this.getModel("agreedServiceRequestScopeModel").getData().data.length !== 0) {
				this.getModel("agreedServiceRequestScopeModel").getData().data[0].Text = this.getModel("agreedServiceRequestScopeModel").getData()
					.Text.trim();
				hasAnyNoteAlreadyProcessed = true;
				this.updateNote(this.getModel("agreedServiceRequestScopeModel").getData().data[0], models.STR_AGREED_SCOPE, statusCode,
					sServiceRequestID);
				//	}
			}
		}
		// Comment
		if (!hasAnyNoteAlreadyProcessed && this.getModel("buttonControlModel").getProperty("/isCommentsChanged")) {
			if (this.getModel("commentsModel").getData() && this.getModel("commentsModel").getData().Text && this.getModel("commentsModel").getData()
				.Text.trim()) {
				var commentPayload = {
					"ServiceRequestID": sServiceRequestID,
					"NoteType": "ZCOM",
					"Langu": "EN",
					"Text": this.getModel("commentsModel").getData().Text.trim()
				};
				hasAnyNoteAlreadyProcessed = true;
				this.createNote(commentPayload, models.STR_COMMENT, statusCode, sServiceRequestID);
			} else {
				this.getModel("buttonControlModel").setProperty("/isCommentsChanged", false);
			}
		}

	},
	hideBusyIndicatorForNotes: function () {
		var SubmitEntityDuringSaveSRModel = this.getModel("SubmitEntityDuringSaveSRModel");
		if (SubmitEntityDuringSaveSRModel) {
			var SubmitEntityDuringSaveSRModelData = SubmitEntityDuringSaveSRModel.getData();
			if (!SubmitEntityDuringSaveSRModelData.header && !SubmitEntityDuringSaveSRModelData.items && SubmitEntityDuringSaveSRModelData.comments) {
				this.onSaveSRSuccess();
			}
		}
	},
	createNote: function (noteSetPayload, noteType, statusCode, sServiceRequestID) {
		this.getModel("SRS_Data").create("/NoteSet", noteSetPayload, {
			success: function (oData) {
				this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled",true);
				if (noteType === models.STR_SR_INFO) {
					this.getModel("serviceRequestScopeModel").setProperty("/isServiceRequestInfoChanged", "false");
					this.processNotes(sServiceRequestID, statusCode);
				} else if (noteType === models.STR_AGREED_SCOPE) {
					this.getModel("agreedServiceRequestScopeModel").setProperty("/isAgreedScopeChanged", "false");
					this.processNotes(sServiceRequestID, statusCode);
				}

				if (noteType === models.STR_COMMENT) {
					this.getModel("buttonControlModel").setProperty("/isCommentsChanged", false);
				}

				if (this.getModel("agreedServiceRequestScopeModel").getProperty("/isAgreedScopeChanged") === "false" && !this.getModel(
						"buttonControlModel").getProperty("/isCommentsChanged") && this.getModel("serviceRequestScopeModel").getProperty(
						"/isServiceRequestInfoChanged") === "false") {
					this.publishSRSaveForUpdate(statusCode);
				}

			}.bind(this),
			error: function (error) {
				if (noteType === models.STR_SR_INFO) {
					MessageBox.error(this.getResourceBundle().getText("errorTextSRInfo"));
				} else if (noteType === models.STR_AGREED_SCOPE) {
					MessageBox.error(this.getResourceBundle().getText("errorTextAgreedScope"));
				} else if (noteType === models.STR_COMMENT) {
					MessageBox.error(this.getResourceBundle().getText("errorTextDiscussion"));
					models.getNotesSet(this, "/NoteSet", this.sServiceRequestId, "ZCOM", "commentsModel");
				}
				if (noteType === models.STR_COMMENT) {
					this.hideBusyIndicatorForNotes();
				}
				if (!models.ERROR_FLAG_NOTESET) {
					models.ERROR_FLAG_NOTESET = true;
					this.hideBusyDialog();
					sap.ui.core.BusyIndicator.hide();
					if (!this.getModel("buttonControlModel").getProperty("/isEdit")) {
						this.oEventBus.publish("toggleEditDisplay", "toggleEditDisplaySuccess");
					}
				}
			}.bind(this)
		});
	},
	updateNote: function (noteSetPayload, noteType, statusCode, sServiceRequestID) {
		this.getModel("SRS_Data").update("/NoteSet(ServiceRequestID='" + this.sServiceRequestId + "',NoteExtKey='',NoteType='" +
			noteSetPayload.NoteType + "',Langu='EN')", noteSetPayload, {
				success: function (oData) {
					this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled",true);
					if (noteType === models.STR_SR_INFO) {
						this.getModel("serviceRequestScopeModel").setProperty("/isServiceRequestInfoChanged", "false");
						this.processNotes(sServiceRequestID, statusCode);
					} else if (noteType === models.STR_AGREED_SCOPE) {
						this.getModel("agreedServiceRequestScopeModel").setProperty("/isAgreedScopeChanged", "false");
						this.processNotes(sServiceRequestID, statusCode);
					}
					//this.reloadNotes();
					if (noteType === models.STR_COMMENT) {
						this.getModel("buttonControlModel").setProperty("/isCommentsChanged", false);
						//	this.hideBusyIndicatorForNotes();
						//	models.getNotesSet(this, "/NoteSet", this.sServiceRequestId, "ZCOM", "commentsModel");
					}
					if (this.getModel("agreedServiceRequestScopeModel").getProperty("/isAgreedScopeChanged") === "false" && !this.getModel(
							"buttonControlModel").getProperty("/isCommentsChanged") && this.getModel("serviceRequestScopeModel").getProperty(
							"/isServiceRequestInfoChanged") === "false") {
						this.publishSRSaveForUpdate(statusCode);
					}
				}.bind(this),
				error: function (error) {
					if (noteType === models.STR_SR_INFO) {
						MessageBox.error(this.getResourceBundle().getText("errorTextSRInfo"));
					} else if (noteType === models.STR_AGREED_SCOPE) {
						MessageBox.error(this.getResourceBundle().getText("errorTextAgreedScope"));
					}
					if (noteType === models.STR_COMMENT) {
						this.hideBusyIndicatorForNotes();
					}
					if (!models.ERROR_FLAG_NOTESET) {
						models.ERROR_FLAG_NOTESET = true;
						this.hideBusyDialog();
						sap.ui.core.BusyIndicator.hide();
						if (!this.getModel("buttonControlModel").getProperty("/isEdit")) {
							this.oEventBus.publish("toggleEditDisplay", "toggleEditDisplaySuccess");
						}
					}
				}.bind(this)
			});
	},
	reloadNotes: function () {
		models.getNotesSet(this, "/NoteSet", this.sServiceRequestId, "ZSQ1", "serviceRequestScopeModel");
		models.getNotesSet(this, "/NoteSet", this.sServiceRequestId, "ZASR", "agreedServiceRequestScopeModel");
		models.getNotesSet(this, "/NoteSet", this.sServiceRequestId, "ZCOM", "commentsModel");
		if(this.getModel("cancellationDescModel") && jQuery.isEmptyObject(this.getModel("cancellationDescModel").getData())){
			models.getNotesSet(this, "/NoteSet", this.sServiceRequestId, models.CANCELLATION_NOTE_TYPE, "cancellationDescModel");
		}
	},
	regionOnChange: function (event) {
		var selectedKey = event.getSource().getSelectedKey();
		if (selectedKey) {
			this.getModel("servicerequestModel").setProperty("/RegionName", event.getSource().getSelectedItem().getText());
			event.getSource().setValueState("None");
			this.byId("dr-edit").setSelectedKey(null);
			this.setModel(new JSONModel([]), "deplRoomModel");
			models.getDeploymentRooms(this, "/DeploymentRoomSet", selectedKey, "deplRoomModel", "001", "dr-edit", true,null);
			if(this.getModel("buttonControlModel").getProperty("/showSignavioInstructionsMsgStrip")){
				models.getCustomerDetailsForSignavio(this);
			}
		} else {
			event.getSource().setValueState("Error");
			this.setModel(new JSONModel(), "deplRoomModel");
		}
		models.onCreateValidate(this);
		this.resetProcessorToBlank();
	},
	deplRoomOnChange: function (event) {
		var selectedKey = event.getSource().getSelectedKey();
		if (selectedKey) {
			this.getModel("servicerequestModel").setProperty("/RespDepName", event.getSource().getSelectedItem().getText());
			event.getSource().setValueState("None");
		} else {
			event.getSource().setValueState("Error");
		}
		models.onCreateValidate(this);
		this.resetProcessorToBlank();
	},
	resetProcessorToBlank: function () {
		var userProfile = this.getModel("SRS_Data_UserSet").getData();
		if (userProfile.isScoper && this.getModel("servicerequestModel").getProperty("/StatusCode") === models.STATUS_INSCOPING) {
			this.byId("procInput").setTokens([]);
			this.byId("procInput").setEnabled(false);
			//this.byId("processor-avatar-edit").setEmployeeId("");
			this.getView().getModel("servicerequestModel").setProperty("/ProcessorUser", "");
		}
	},
	showOpenCasePopover: function (oEvent) {
		var oButton = oEvent.getSource();

		// create Popover
		this._oCasePopover = sap.ui.xmlfragment(
			"sap.com.servicerequest.servicerequest.fragment.OpenCase",
			this
		);
		this.getView().addDependent(this._oCasePopover);
		this._oCasePopover.openBy(oButton);
	},
	launchCRM: function () {
		var caseId = this.getModel("servicerequestModel").getData().CaseID;
		var host = this.getModel("SRS_Data_UserSet").getProperty("/backendSystem");
		if (host) {
			host = host.toUpperCase();
		}
		if (host.includes(models.BACKND_SYS_ICD)) { // Dev
			window.open(models.CRM_DEV_URL + caseId);
		} else if (host.includes(models.BACKND_SYS_ICT)) { // Test
			window.open(models.CRM_TEST_URL + caseId);
		} else if (host.includes(models.BACKND_SYS_ICP)) { // Prod
			window.open(models.CRM_PROD_URL + caseId);
		}
	},
	launchHEP: function () {
		window.open(models.launchHEP(this));
	},

	// message handler
	handleMessagePopoverPress: function (oEvent) {
		if (!this.oMP) {
			this.createMessagePopover();
		}
		this.oMP.toggle(oEvent.getSource());
	},

	createMessagePopover: function () {
		var that = this;
		this.oMP = new sap.m.MessagePopover({
			activeTitlePress: function (oEvent) {},
			items: {
				path: "errorModel>/message",
				template: new sap.m.MessageItem({
					title: {
						parts: [{
							path: 'errorModel>message'
						}]
					},
					type: "{errorModel>type}"
				})
			}
		});

		this.oMP._oMessageView.setGroupItems(true);
		this.getView().byId("messagePopoverBtn").addDependent(this.oMP);
	},

	onExit: function () {
		var oEventBus = sap.ui.getCore().getEventBus();
		oEventBus.unsubscribe("onSaveServiceRequest", "onSaveServiceRequestSuccess", this.onSaveServiceRequestSuccess, this);
		oEventBus.unsubscribe("displayContractItemMessage", "displayContractItemMessageSuccess", this.displayContractItemMessageSuccess,
			this);
		oEventBus.unsubscribe("onSaveSR", "onSaveSRSuccess", this.onSaveSRSuccess, this);
		oEventBus.unsubscribe("toggleEditDisplay", "toggleEditDisplaySuccess", this.toggleEditDisplaySuccess, this);
		oEventBus.unsubscribe("onSendForScoping", "onSendForScopingSuccess", this.onSendForScoping, this);
		oEventBus.unsubscribe("onCreateSO", "onCreateSOSuccess", this.onCreateSO, this);
		oEventBus.unsubscribe("evaluateSRProgress", "evaluateSRProgressSuccess", this.evaluateSRProgress, this);
		oEventBus.unsubscribe("showPotentialLeadTime", "showPotentialLeadTimeSuccess", this.showPotentialLeadTime, this);
		oEventBus.unsubscribe("enableCreateSOBtnInDialog", "enableCreateSOBtnInDialogSuccess", this.enableCreateSOBtnInDialog, this);
		oEventBus.unsubscribe("deleteSRItemsForDisplayScope", "setDeleteSRItemsForDisplayScope", this.setDeleteSRItemsForDisplayScope, this);
		oEventBus.unsubscribe("setFocusForScopingTeam", "setFocusForScopingTeam", this.setFocusForScopingTeam, this);
		oEventBus.unsubscribe("editSR", "editSRSuccess", this.onEdit, this);
		oEventBus.unsubscribe("onDetailClose", "onDetailCloseSuccess", this.onDetailClose, this);
		oEventBus.unsubscribe("toggleDisplayAndEdit", "toggleDisplayAndEdit", this.toggleDisplayAndEdit, this);
		
		if (this._oCasePopover) {
			this._oCasePopover.destroy();
		}
   },

   setFocusForScopingTeam: function(){
		models.setElementScroll(this, "dr-edit");
   },

	showViolationAlert: function () {
		MessageToast.show(this.getResourceBundle().getText("violationAlert"));
	},
	handleValid: function (oEvent) {
		if (oEvent.getSource().getValue().trim() === "") {
			oEvent.getSource().setValueState("Error");
			this.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
			this.getModel("servicerequestModel").setProperty("/Description", "");
		} else {
			oEvent.getSource().setValueState("None");
		}
		models.onCreateValidate(this);
	},

	onCopySR: function (oEvent) {
		var oView = this.getView();
		var dialog = oView.byId("dialogCopySR");
		var defaultReqDelDate, minDate = new Date();
		defaultReqDelDate = new Date((new Date()).setDate(minDate.getDate() + models.DEFAULT_DAYS_TO_ADD_FOR_RDD));
		if (defaultReqDelDate.getDay() != 1) {
			defaultReqDelDate = new Date(models.findComingMonday(defaultReqDelDate.toString()));
		}

		if (!dialog) {
			// create dialog via fragment factory
			dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.DialogCopySR", this);
			oView.addDependent(dialog);
		}
		var SRItems = this.getModel("servicerequestItemsModel");
	   dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
		dialog.open();
		this.byId("vBoxRDDSelection").setVisible(false);
		this.byId("checkboxCopySRTitle").setSelected(false);
		this.byId("checkboxCopySRInfo").setSelected(false);
		if (SRItems && SRItems.getData().length > 0) {
			this.byId("vBoxRDDSelection").setVisible(true);
			this.byId("dialogReqdDate").setMinDate(minDate);
			this.byId("dialogReqdDate").setDateValue(defaultReqDelDate);
			if (defaultReqDelDate && defaultReqDelDate.getDay() != 1) {
				this.byId("messageStripCopyDialog").setVisible(true);
			} else {
				this.byId("messageStripCopyDialog").setVisible(false);
			}
		}

	},
	onCopySRCancelBtnPress: function (oEvent) {
		this.byId("dialogCopySR").close();
	},
	dialogCopySRrequestDelDateOnChange: function (oEvent) {
		if (oEvent.getSource().getValue()) {
			if (oEvent.getSource().getDateValue().getDay() !== 1) {
				this.byId("messageStripCopyDialog").setVisible(true);
			} else {
				this.byId("messageStripCopyDialog").setVisible(false);
			}
			this.byId("btnDialogCopySR").setEnabled(true);
		} else {
			this.byId("btnDialogCopySR").setEnabled(false);
		}
	},
	setTextAreaGrowing: function (oEvent) {
		if (oEvent.getSource().getId().includes("sr-req-scope-TextMode-Display")) {
			models.toggleTextAreaGrowing(this, "sr-req-display", oEvent);
		} else if (oEvent.getSource().getId().includes("sr-agreed-scope-TextMode-Display")) {
			models.toggleTextAreaGrowing(this, "sr-agreed-scope-display", oEvent);
		}
	},
	resetTextAreaGrowing: function () {
		// Reset Growing property of (Text Area) Service Request Scope & Agreed Scope upon Display
		this.byId("sr-req-scope-TextMode-Display").setText(this.getResourceBundle().getText("showMore"));
		this.byId("sr-req-scope-TextMode-Display").setTooltip(this.getResourceBundle().getText("showMore"));
		this.byId("sr-req-display").setGrowing(false);
		this.byId("sr-req-display").setRows(5);

		this.byId("sr-agreed-scope-TextMode-Display").setText(this.getResourceBundle().getText("showMore"));
		this.byId("sr-agreed-scope-TextMode-Display").setTooltip(this.getResourceBundle().getText("showMore"));
		this.byId("sr-agreed-scope-display").setGrowing(false);
		this.byId("sr-agreed-scope-display").setRows(5);
	},
	onCopySRBtnPress: function (oEvent) {

		this.copySRTitle = this.byId("checkboxCopySRTitle").getSelected();
		this.copySRInfo = this.byId("checkboxCopySRInfo").getSelected();

	   var oMyStorage = new Storage(Storage.Type.session, "SRS_Session");
		oMyStorage.put(models.STORAGE_KEY_SR_ID, this.getModel("servicerequestModel").getData().ServiceRequestID);

		if (this.byId("vBoxRDDSelection").getVisible() && this.byId("dialogReqdDate").getValue()) {
			var caseId = this.getModel("servicerequestModel").getData().CaseID;
			if (!caseId) {
				caseId = "0";
			}
			this.getRouter().navTo("DetailView", {
				ServiceRequestID: models.STRING_COPY_SR,
				CaseId: this.getModel("servicerequestModel").getData().CaseID
			});

			this.getModel("servicerequestModel").setProperty("/RequestedDeliveryDate", this.byId("dialogReqdDate").getDateValue());
			this.getModel("SRS_Data_UserSet").getData["isCreatingNewSR"] = true;
			this.byId("dialogCopySR").close();
			//Reset Value State of SR Title, Region and Delivery Team in Page Header

			this.resetValueStateOfMandFields();
		} else if (this.byId("vBoxRDDSelection").getVisible() && !this.byId("dialogReqdDate").getValue()) {
			this.byId("btnDialogCopySR").setEnabled(false);
		} else {
			var caseId = this.getModel("servicerequestModel").getData().CaseID;
			if (!caseId) {
				caseId = "0";
			}
			this.getRouter().navTo("DetailView", {
				ServiceRequestID: models.STRING_COPY_SR,
				CaseId: this.getModel("servicerequestModel").getData().CaseID
			});

			this.getModel("SRS_Data_UserSet").getData["isCreatingNewSR"] = true;
			this.byId("dialogCopySR").close();
		}
	},
	resetValueStateOfMandFields: function () {
		this.byId("sr_title_edit").setValueState("None");
		this.byId("region-edit").setValueState("None");
		this.byId("dr-edit").setValueState("None");
	},
	onDownloadSelectedButton: function () {
		models.onDownloadAttachmentsSelectedButton(this, "UploadSetDisplay");
	},
	attachmentUserOnPress: function (oEvent) {
	   var employeeID = oEvent.getSource().getText();
	   models.getAvatarForAttachmentUser(employeeID,oEvent);
	},

	onUploadComplete: function (oEvent) {
		models.uploadOnUploadComplete(oEvent, this);
	},

	onBeforeUploadStarts: function (oEvent) {
		models.uploadOnBeforeUploadStarts(oEvent, this);
	},

	onChange: function (oEvent) {
		models.uploadOnChange(oEvent, this);
	},

	onFileSizeExceeded: function (oEvent) {
		models.uploadOnFileSizeExceeded(oEvent, this);
	},
	handleChangeHistoryPress: function () {
		var oView = this.getView();
		var dialog = oView.byId("dialogChangeHistory");

		if (!dialog) {
			// create dialog via fragment factory
			dialog = sap.ui.xmlfragment(oView.getId(), "sap.com.servicerequest.servicerequest.fragment.ChangeHistoryTableDialog", this);
			oView.addDependent(dialog);
		}
	   dialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
		dialog.open();
		this.byId("idSearchChangeHistory").setValue(null);
		this.getchangedHistory(false, null);
	},
	getchangedHistory: function (isAccessedFromPopover, popoverControlSource) {
		var changeHistoryModel = new JSONModel({
			data: [],
			skip: 0,
			top: 10,
			showMoreButtonVisible: false,
			searchString: "",
			total: 0,
			inlineCount: 0
		});
		this.setModel(changeHistoryModel, "changeHistoryModel");
		var that = this;
		if (isAccessedFromPopover) {
			sap.ui.core.BusyIndicator.show();
		} else if (that.byId("tableChangeHistory")) {
			that.byId("tableChangeHistory").setBusy(true);
		}

		this.byId("openForDisplay").setBusy(true);
		this.byId("openForEdit").setBusy(true);

		var url = "/ServiceRequestHeaderSet('" + this.sServiceRequestId + "')/Header2ChangeHistory";
		this.getModel("SRS_Data").read(url, {
			groupId: "changeHistory",
			success: function (oData) {
				var results = oData.results;
				that.getModel("changeHistoryModel").setProperty("/data", results);
				that.getModel("changeHistoryModel").setProperty("/total", results.length);
				that.prepareSLAData();
				that.byId("openForDisplay").setBusy(false);
				that.byId("openForEdit").setBusy(false);
				if (isAccessedFromPopover) {
					that.showLastChangedPopOver(popoverControlSource);
					sap.ui.core.BusyIndicator.hide();
				} else if (that.byId("tableChangeHistory")) {
					that.byId("tableChangeHistory").setBusy(false);
				}
			}.bind(that),
			error: function () {
				sap.m.MessageToast.show(that.getResourceBundle().getText("errorText"));
				if (isAccessedFromPopover) {
					sap.ui.core.BusyIndicator.hide();
				} else if (that.byId("tableChangeHistory")) {
					that.byId("tableChangeHistory").setBusy(false);
				}
				that.byId("openForDisplay").setBusy(false);
				that.byId("openForEdit").setBusy(false);
			}.bind(that)
		});
	},
	onChangeHistoryDialogClose: function () {
		this.byId("dialogChangeHistory").close();
	},
	searchChangeHistory: function (oEvent) {
		var aFilters = [];
		var sQuery = oEvent.getSource().getValue();
		if (sQuery && sQuery.length > 0) {
			aFilters.push(models.filterCondition_Contains("ChangedByName", sQuery));
			aFilters.push(models.filterCondition_Contains("ChangedById", sQuery));
			aFilters.push(models.filterCondition_Contains("NewValue", sQuery));
			aFilters.push(models.filterCondition_Contains("OldValue", sQuery));
			aFilters.push(models.filterCondition_Contains("Action", sQuery));
			aFilters.push(models.filterCondition_Contains("ChangeLevel", sQuery));
			aFilters = models.filterComparison_OR(aFilters);
		}

		// update list binding
		var oList = this.byId("tableChangeHistory");
		var oBinding = oList.getBinding("items");
		oBinding.filter(aFilters, "Application");
	},
	progessIndictaorOnPress: function (oEvent) {
		this.evaluateSRProgress();
		var oButton = oEvent.getSource(),
			oView = this.getView();
		var context = this;
	   if (!this._progressIndictorPopover) {
			this._progressIndictorPopover = Fragment.load({
				id: oView.getId(),
				name: "sap.com.servicerequest.servicerequest.fragment.SRProgressIndicator",
				controller: this
			}).then(function (oPopover) {
				oView.addDependent(oPopover);
				if (sap.ui.Device.system.desktop) {
					var tableItems = context.byId("tableSrIndicator").getItems();
					for (var i = 0; i < tableItems.length; i++) {
						if (tableItems[i].data("step").HeaderElement) {
							tableItems[i].addStyleClass("classSRProgressTable");
						}
					}
				}

				return oPopover;
			});
		}
		this._progressIndictorPopover.then(function (oPopover) {
			oPopover.openBy(oButton);
			if($(".hyperLinkClassDetailHeader")){
				$(".hyperLinkClassDetailHeader").contextmenu(function () { return false; });
			}
		});
	
	},
	SRProgressLinkOnPress: function (oEvent) {
		var stepData = oEvent.getSource().data("step");
		var oEventBus = sap.ui.getCore().getEventBus();
		var editMode = this.getModel("buttonControlModel").getProperty("/isEdit");
		switch (stepData.ID) {
		case "ContactID":
			if (!editMode) {
				this.onEditForSRProgress(stepData.ID);
			} else {
				oEventBus.publish("setFocusForCustContact", "setFocusForCustContactSuccess");
			}
			break;
		case "ReferenceSystemID":
			if (!editMode) {
				this.onEditForSRProgress(stepData.ID);
			} else {
				oEventBus.publish("setFocusForSystem", "setFocusForSystemSuccess");
			}
			break;
		case "SRInfo":
			if (!editMode) {
				this.onEditForSRProgress(stepData.ID);
			} else {
				oEventBus.publish("setFocusForSRInfo", "setFocusForSRInfoSuccess");
			}
			break;
		case models.STATUS_INSCOPING:
			this.onSendForScoping();
			break;
		case "ServiceID":
			if (!editMode) {
				this.onEditForSRProgress(stepData.ID);
			} else {
				oEventBus.publish("setFocusForService", "setFocusForServiceSuccess");
			}
			break;
		case "SessionID":
			if (!editMode) {
				this.onEditForSRProgress(stepData.ID);
			} else {
				oEventBus.publish("setFocusForSession", "setFocusForSessionSuccess");
			}
			break;
		case "ContractID":
			if (!editMode) {
				this.onEditForSRProgress(stepData.ID);
			} else {
				oEventBus.publish("setFocusForContract", "setFocusForContractSuccess");
			}
			break;
		case "RequestedDeliveryDate":
			if (!editMode) {
				this.onEditForSRProgress(stepData.ID);
			} else {
				oEventBus.publish("setFocusForRDD", "setFocusForRDDSuccess");
			}
			break;
		case "ContractItemID":
			if (!editMode) {
				this.onEditForSRProgress(stepData.ID);
			} else {
				oEventBus.publish("setFocusForContractItem", "setFocusForContractItemSuccess");
			}
			break;
		case "AgreedScope":
			if (!editMode) {
				this.onEditForSRProgress(stepData.ID);
			} else {
				oEventBus.publish("setFocusForAgreedScope", "setFocusForAgreedScopeSuccess");
			}
			break;
		case models.STATUS_INEXCEPTION:
			if (!editMode) {
				this.onEditForSRProgress(stepData.ID);
			} else {
				oEventBus.publish("setFocusForApprovalRules", "setFocusForApprovalRulesSuccess");
			}
			break;
		case models.STATUS_APPROVED:
			this.onApproveScope();
			break;
		case models.STATUS_SOCREATED:
			this.onCreateSO();
			break;
		case "AdjustVItems":
			if (!editMode) {
				this.onEditForSRProgress("ServiceID");
			} else {
				oEventBus.publish("setFocusForService", "setFocusForServiceSuccess");
			}
			break;
		case models.STATUS_VIOLATED:
			this.onRequestApproval();
			break;
		}

		if (this.byId("SRProgressPopOver")) {
			this.byId("SRProgressPopOver").close();
		}

	},
	handleCloseButtonForSRProgessPopup: function () {
		if (this.byId("SRProgressPopOver")) {
			this.byId("SRProgressPopOver").close();
		}
	},
	checkIfApprovalRulesAreViolated: function () {
		var approvalModel = this.getModel("servicerequestApprovalModel");
		var rulesViolated = false;
		if (approvalModel && approvalModel.getData()) {
			var approvalModelItems = approvalModel.getData();
			for (var i = 0; i < approvalModelItems.length; i++) {
				if (approvalModelItems[i].StatusID !== models.RULE_NO_VIOLATION) {
					rulesViolated = true;
				}
			}
		}
		return rulesViolated;
	},
	evaluateSRProgress: function () {
		var steps = models.SRProgressMatrix();
		var SRModel = this.getModel("servicerequestModel");

		var SRItems = this.getModel("servicerequestItemsModel");
		var contract = "";
		var contractItem = "";
		var srinfoModel = this.getModel("serviceRequestScopeModel");
		var agreedScopeModel = this.getModel("agreedServiceRequestScopeModel");
		if (SRItems && SRItems.getData() && SRItems.getData().length > 0) {
			contract = SRItems.getData()[0].ContractID;
			contractItem = SRItems.getData()[0].ContractItemID;
		}
		var currentSRStatus = SRModel.getData().StatusCode;
		for (var i = 0; i < steps.length; i++) {
			if (SRModel.getProperty("/" + steps[i].ID)) {
				this.setStepData(steps[i], "C", "", true);
			}

			if (steps[i].ID === "ContractID") {
				if(this.getModel("buttonControlModel").getProperty("/showContractFieldsBasedOnSelectedService")){
					if(contract){
						this.setStepData(steps[i], "C", "", true);
					}
				}else{
					this.setStepData(steps[i], "O", "", true);
				}
			}

			if (steps[i].ID === "ContractItemID") {
				if(this.getModel("buttonControlModel").getProperty("/showContractFieldsBasedOnSelectedService")){
					if (!contract) {
						this.setStepData(steps[i], "P", "NotReady", false);
					} else if (contractItem && contractItem !== "0000000000") {
						this.setStepData(steps[i], "C", "", true);
					}
				}else{
					this.setStepData(steps[i], "O", "", true);
				}
			}

			if (steps[i].ID === "ReferenceSystemID") {
				if(this.getModel("buttonControlModel").getProperty("/isSystemVisible")){
					if (!SRModel.getProperty("/ReferenceSystemID")) {
						this.setStepData(steps[i], "P", "NotReady", false);
					} else if (contractItem && contractItem !== "0000000000") {
						this.setStepData(steps[i], "C", "", true);
					}
				}else{
					this.setStepData(steps[i], "O", "", true);
				}
			}

			if (srinfoModel && srinfoModel.getData() && srinfoModel.getData().data && srinfoModel.getData().data.length > 0 && srinfoModel.getData()
				.data[0].Text && steps[i].ID === "SRInfo") {
				this.setStepData(steps[i], "C", "", true);
			}

			if (agreedScopeModel && agreedScopeModel.getData() && agreedScopeModel.getData() && agreedScopeModel.getData().data && agreedScopeModel.getData().data.length > 0 &&
				agreedScopeModel.getData().data[0].Text && steps[i].ID === "AgreedScope") {
				this.setStepData(steps[i], "C", "", true);
			}
		}

		//setting Session, RDD, Contract,contractitem NotReady
		for (var i = 0; i < steps.length; i++) {
			if (steps[i].ID === "ServiceID" && !SRModel.getProperty("/ServiceID")) {
				this.setStepData(steps[i + 1], "P", "NotReady", false);
				this.setStepData(steps[i + 2], "P", "NotReady", false);
				this.setStepData(steps[i + 3], "P", "NotReady", false);
				this.setStepData(steps[i + 4], "P", "NotReady", false);
				break;
			}
		}

		if (currentSRStatus === models.STATUS_NEW || currentSRStatus === models.STATUS_AUTHORACTION) {
			for (var i = 0; i < steps.length; i++) {
				if (steps[i].ID === models.STATUS_NEW || steps[i].ID === models.STATUS_AUTHORACTION) {
					this.setStepData(steps[i], "C", "", true);
				}
				if (steps[i].ID === models.STATUS_INSCOPING) {
					var isPending = this.checkPendingStatusForProgressTable(steps, i);
					if (isPending) {
						this.setStepData(steps[i], "P", "NotReady", false);
					} else {
						this.setStepData(steps[i], "P", "Ready", false);
					}

				}
				if (steps[i].ID === models.STATUS_VIOLATED || steps[i].ID === models.STATUS_INEXCEPTION || steps[i].ID === "AdjustVItems") {
					this.setStepData(steps[i], "O", "", true);
				}
				if (steps[i].ID === models.STATUS_APPROVED || steps[i].ID === models.STATUS_SOCREATED) {
					this.setStepData(steps[i], "P", "NotReady", false);
				}
				if (steps[i].ID === "AgreedScope") {
					if (agreedScopeModel && agreedScopeModel.getData() && agreedScopeModel.getData() && agreedScopeModel.getData().data && agreedScopeModel.getData().data.length > 0 &&
						agreedScopeModel.getData().data[0].Text) {
						this.setStepData(steps[i], "C", "", true);
					} else {
						this.setStepData(steps[i], "P", "NotReady", false);
					}
				}
			}
		}

		if (currentSRStatus === models.STATUS_INSCOPING) {
			for (var i = 0; i < steps.length; i++) {
				if (steps[i].ID === models.STATUS_NEW || steps[i].ID === models.STATUS_AUTHORACTION) {
					this.setStepData(steps[i], "C", "", true);
				}
				if (steps[i].ID === models.STATUS_INSCOPING) {
					this.setStepData(steps[i], "C", "", true);
				}
				if (steps[i].ID === models.STATUS_VIOLATED || steps[i].ID === models.STATUS_INEXCEPTION || steps[i].ID === "AdjustVItems") {
					this.setStepData(steps[i], "O", "", true);
				}
				if (steps[i].ID === models.STATUS_APPROVED) {
					var isPending = this.checkPendingStatusForProgressTable(steps, i);
					if (isPending) {
						this.setStepData(steps[i], "P", "NotReady", false);
					} else {
						this.setStepData(steps[i], "P", "Ready+Scoper", false);
					}
				}
				if (steps[i].ID === models.STATUS_SOCREATED) {
					this.setStepData(steps[i], "P", "NotReady", false);
				}
			}
		}

		if (currentSRStatus === models.STATUS_VIOLATED) {
			for (var i = 0; i < steps.length; i++) {
				if (steps[i].ID === models.STATUS_NEW || steps[i].ID === models.STATUS_AUTHORACTION) {
					this.setStepData(steps[i], "C", "", true);
				}
				if (steps[i].ID === models.STATUS_INSCOPING) {
					this.setStepData(steps[i], "C", "", true);
				}
				if (steps[i].ID === models.STATUS_VIOLATED) {
					var isPending = this.checkPendingStatusForProgressTable(steps, i - 1);
					if (isPending) {
						this.setStepData(steps[i], "P", "NotReady", false);
					} else {
						this.setStepData(steps[i], "P", "Ready", false);
					}
					this.setStepData(steps[i - 1], "P", "Ready", false);
				}
				if (steps[i].ID === models.STATUS_INEXCEPTION) {
					this.setStepData(steps[i], "O", "", true);
				}
				if (steps[i].ID === models.STATUS_APPROVED) {
					this.setStepData(steps[i], "P", "NotReady", false);
				}
				if (steps[i].ID === models.STATUS_SOCREATED) {
					this.setStepData(steps[i], "P", "NotReady", false);
				}
			}
		}

		if (currentSRStatus === models.STATUS_INEXCEPTION) {
			for (var i = 0; i < steps.length; i++) {
				if (steps[i].ID === models.STATUS_NEW || steps[i].ID === models.STATUS_AUTHORACTION) {
					this.setStepData(steps[i], "C", "", true);
				}
				if (steps[i].ID === models.STATUS_INSCOPING) {
					this.setStepData(steps[i], "C", "", true);
				}
				if (steps[i].ID === models.STATUS_VIOLATED || steps[i].ID === "AdjustVItems") {
					this.setStepData(steps[i], "O", "", true);
				}
				if (steps[i].ID === models.STATUS_INEXCEPTION) {
					this.setStepData(steps[i], "P", "Ready+Manager", false);
				}
				if (steps[i].ID === models.STATUS_APPROVED) {
					this.setStepData(steps[i], "P", "NotReady", false);
				}
				if (steps[i].ID === models.STATUS_SOCREATED) {
					this.setStepData(steps[i], "P", "NotReady", false);
				}
			}
		}

		if (currentSRStatus === models.STATUS_APPROVED) {
			for (var i = 0; i < steps.length; i++) {
				if (steps[i].ID === models.STATUS_NEW || steps[i].ID === models.STATUS_AUTHORACTION) {
					this.setStepData(steps[i], "C", "", true);
				}
				if (steps[i].ID === models.STATUS_INSCOPING) {
					this.setStepData(steps[i], "C", "", true);
				}
				if (steps[i].ID === models.STATUS_VIOLATED || steps[i].ID === models.STATUS_INEXCEPTION || steps[i].ID === "AdjustVItems") {
					this.setStepData(steps[i], "O", "", true);
				}
				if (steps[i].ID === models.STATUS_APPROVED) {
					this.setStepData(steps[i], "C", "", true);
				}
				if (steps[i].ID === models.STATUS_SOCREATED) {
					var isPending = this.checkPendingStatusForProgressTable(steps, i);
					if (isPending) {
						this.setStepData(steps[i], "P", "NotReady", false);
					} else {
						this.setStepData(steps[i], "P", "Ready", false);
					}
				}
			}
		}

		if (currentSRStatus === models.STATUS_SOCREATED) {
			for (var i = 0; i < steps.length; i++) {
				if (steps[i].ID === models.STATUS_VIOLATED || steps[i].ID === models.STATUS_INEXCEPTION || steps[i].ID === "AdjustVItems") {
					this.setStepData(steps[i], "O", "", true);
				} else if(steps[i].ID === "ContractID" || steps[i].ID === "ContractItemID"){
						if(this.getModel("buttonControlModel").getProperty("/showContractFieldsBasedOnSelectedService")){
							this.setStepData(steps[i], "C", "", true);
						}else{
							this.setStepData(steps[i], "O", "", true);
						}
				} else {
					this.setStepData(steps[i], "C", "", true);
				}
			}
		}

		var totalCP = 0;
		for (var i = 0; i < steps.length; i++) {
			if (steps[i].Status === "C" || steps[i].Status === "O") {
				totalCP = totalCP + parseInt(steps[i].CP);
			}
		}
		this.byId("SRProgessIndicator").setPercentValue(totalCP);
		this.byId("SRProgessIndicator").setDisplayValue(totalCP + "%");
		this.byId("SRProgessIndicator").setTooltip(totalCP + "%");
		this.setModel(new JSONModel(steps), "SRProgressIndicator");
		
	},
	setStepData: function (step, status, comment, valueExist) {
		step.Status = status;
		step.Comment = comment;
		step.valueExist = valueExist;
	},
	checkPendingStatusForProgressTable: function (steps, i) {
		var isPending = false;
		for (var j = 0; j < i; j++) {
			if (!steps[j].valueExist) {
				isPending = true;
				break;
			}
		}
		return isPending;
	},
	
	handleBtnAssignMe: function (oEvent) {
		var userId = this.getModel("SRS_Data_UserSet").getProperty("/userId");
		var username = this.getModel("SRS_Data_UserSet").getProperty("/userName");
		this.byId("procInput").setTokens([]);
		this.byId("procInput").addToken(new sap.m.Token({
			key: userId,
			text: username
		}));
		this.getModel("servicerequestModel").setProperty("/ProcessorUser", userId);
		this.getModel("servicerequestModel").setProperty("/ProcessorName", username);
	},
	
	pressBtnMandtField: function () {
		var selectedMandtField = this.getModel("buttonControlModel").getProperty("/selectedMandtField");
		var oEventBus = sap.ui.getCore().getEventBus();
		if (selectedMandtField === models.CaseID) {
			models.setElementScroll(this, "srs_case-input");
		} else if (selectedMandtField === models.Description) {
			models.setElementScroll(this, "sr_title_edit");
		} else if (selectedMandtField === models.RegionID) {
			models.setElementScroll(this, "region-edit");
		} else if (selectedMandtField === models.RespDepID) {
			models.setElementScroll(this, "dr-edit");
		} else if (selectedMandtField === models.SurveyRecID) {
			oEventBus.publish("setFocusForSurveyRecipient", "setFocusForSurveyRecipientSuccess");
		} else if (selectedMandtField === models.SessionID) {
			oEventBus.publish("setFocusForSession", "setFocusForSessionSuccess");
		} else if(selectedMandtField === models.SRItemsDates){
			oEventBus.publish("setFocusForSRItems", "setFocusForSRItemsSuccess");
		}
	},
	linkPotLeadTimeOnPress: function (oEvent) {
		var context = this;
		var htmlString = "<div class='classDivPLT'><span>The Potential Lead Time is simply calculated as follows:</span><br>" +
			"<div class='classSpanPLTequation'>Potential Lead Time = &lt;Requested Delivery Date&gt; – &lt;SR Creation Date&gt;</div><br>" +
			"In contrast to that the true Lead Time is calculated as follows:<br>" +
			"<div class='classSpanPLTequation'>True Lead Time = &lt;Requested Delivery Date&gt; – &lt;Date, when SR was sent for Scoping&gt;</div>" +
			"This means the True Lead Time can be maximum as large as the potential lead time.<br><br>" +
			"Any lead time of less than two weeks is considered critical and will be marked <span style='color: red;font-weight: bold;'>red</span>.</div>";
		var popover = new sap.m.ResponsivePopover({
			title: this.getResourceBundle().getText("txtPotentialLeadTime"),
			showHeader: true,
			showCloseButton: true,
			content: [
				new sap.ui.core.HTML({
					content: htmlString
				})
			]

		}).addStyleClass("sapUiContentPadding");
		popover.openBy(oEvent.getSource());
	},
	showPotentialLeadTime: function (channel, event, RDD) {
		var creationDate = this.getModel("servicerequestModel").getProperty("/CreatedDate");
		if (creationDate && RDD) {
			this.byId("linkPLT").setVisible(true);
			var date = new Date(creationDate.getFullYear(), creationDate.getMonth(), creationDate.getDate());
			var dateRDD = new Date(RDD.getFullYear(), RDD.getMonth(), RDD.getDate());
			var calcPLT = models.calculateDateDifference(date, dateRDD);
			if (calcPLT === 1 || calcPLT === -1) {
				this.byId("linkPLT").setText(models.prefixPTL + calcPLT + " day" + models.suffixPTL);
			} else {
				this.byId("linkPLT").setText(models.prefixPTL + calcPLT + " days" + models.suffixPTL);
			}

			if (calcPLT < 14) {
				this.byId("linkPLT").getCustomData()[0].setValue("boldRed");
			} else {
				this.byId("linkPLT").getCustomData()[0].setValue("");
			}
		} else {
			this.byId("linkPLT").setVisible(false);
		}
	},
	linkLastChangedOnPress: function (oEvent) {
		var changeHistoryModel = this.getModel("changeHistoryModel");
		if (changeHistoryModel) {
			this.showLastChangedPopOver(oEvent.getSource());
		} else {
			this.getchangedHistory(true, oEvent.getSource());
		}
	},
	showLastChangedPopOver: function (oEventSource) {
		sap.ui.core.BusyIndicator.show(0);
		var oView = this.getView();
		if (!this._LastChangedPopover) {
			this._LastChangedPopover = Fragment.load({
				id: oView.getId(),
				name: "sap.com.servicerequest.servicerequest.fragment.LastChangedPopover",
				controller: this
			}).then(function (oPopover) {
				oView.addDependent(oPopover);
				return oPopover;
			});
		}
		var context = this;
		this._LastChangedPopover.then(function (oPopover) {
			oPopover.openBy(oEventSource);
			context.renderLastChangedPopover();
			$(".classLinkChangeHistory").click(function () {
				context.handleChangeHistoryPress();
			});
			sap.ui.core.BusyIndicator.hide();
		});
	},
	renderLastChangedPopover: function () {
		var slaData = this.getModel("slaModel").getData();
		var frontofficeDays = slaData.SLA[0].Days;
		var backofficeDays = slaData.SLA[1].Days;
		var data = {
			"sla": [{
				"OpenTime": "Frontoffice",
				"Days": frontofficeDays,
			}, {
				"OpenTime": "Backoffice",
				"Days": backofficeDays,
			}]
		};
		var oVizFrame = this.oVizFrame = this.byId("idVizFrame");
		oVizFrame.setVizProperties({
			legend: {
				title: {
					visible: false
				}
			},
			title: {
				visible: false
			},
			plotArea: {
				"colorPalette": ['#FFD2B9', '#E4D3F1'],
				dataLabel: {
					visible: true
				}
			},
		});
		var dataModel = new JSONModel(data);
		oVizFrame.setModel(dataModel);
		if (frontofficeDays === 0 && backofficeDays === 0) {
			this.byId("chartFixFlex").setVisible(false);
		} else {
			this.byId("chartFixFlex").setVisible(true);
		}

		var oPopOver = this.getView().byId("idPopOver");
		oPopOver.connect(oVizFrame.getVizUid());
		//oPopOver.setFormatString(ChartFormatter.DefaultPattern.SHORTFLOAT);

		if (sap.ui.Device.system.phone) {
			this.byId("idTableLastChangedPopover").removeStyleClass("tableLastChangedPoOver");
		}

	},
	prepareSLAData: function () {
		var historyData = this.getModel("changeHistoryModel").getProperty("/data");
		var statusNew = "NEW",
			statusAA = "AUTHOR ACTION",
			statusAprvd = "APPROVED",
			statusViol = "VIOLATED",
			statusInScpng = "IN SCOPING",
			statusInExcptn = "IN EXCEPTION";
		var SRStatus = [statusNew, statusAA, statusAprvd, statusViol, statusInScpng, statusInExcptn];
		var filteredHistoryData = [];
		for (var i = historyData.length - 1; i >= 0; i--) {
			for (var j = 0; j < SRStatus.length; j++) {
				if (historyData[i].NewValue.toUpperCase() === SRStatus[j]) {
					filteredHistoryData.push(historyData[i]);
				}
			}
		}

		var frontofficeDays = 0.0,
			backofficeDays = 0.0;
		for (var i = 0; i < filteredHistoryData.length; i++) {
			if (i < filteredHistoryData.length - 1) {
				var dateDiff = (filteredHistoryData[i + 1].ChangedTmstmp - filteredHistoryData[i].ChangedTmstmp) / (24 * 3600 * 1000);
				if (filteredHistoryData[i].NewValue.toUpperCase() === statusNew || filteredHistoryData[i].NewValue.toUpperCase() === statusAA ||
					filteredHistoryData[i].NewValue.toUpperCase() === statusAprvd || filteredHistoryData[i].NewValue.toUpperCase() === statusViol) {
					frontofficeDays = frontofficeDays + parseFloat(dateDiff);
				} else if (filteredHistoryData[i].NewValue.toUpperCase() === statusInScpng || filteredHistoryData[i].NewValue.toUpperCase() ===
					statusInExcptn) {
					backofficeDays = backofficeDays + parseFloat(dateDiff);
				}
			}

			if (i === filteredHistoryData.length - 1) {
				var currentSRStatus = this.getModel("servicerequestModel").getProperty("/StatusDescription");
				var dateDiff = (new Date() - filteredHistoryData[i].ChangedTmstmp) / (24 * 3600 * 1000);
				if (currentSRStatus.trim().toUpperCase() === statusNew || currentSRStatus.trim().toUpperCase() === statusAA || currentSRStatus.trim()
					.toUpperCase() === statusAprvd || currentSRStatus.trim().toUpperCase() === statusViol) {
					frontofficeDays = frontofficeDays + parseFloat(dateDiff);
				} else if (currentSRStatus.trim().toUpperCase() === statusInScpng || currentSRStatus.trim().toUpperCase() === statusInExcptn) {
					backofficeDays = backofficeDays + parseFloat(dateDiff);
				}
			}
		}
		if (frontofficeDays < 10.0) {
			frontofficeDays = parseFloat(frontofficeDays.toFixed(1));
		} else {
			frontofficeDays = Math.round(frontofficeDays);
		}

		if (backofficeDays < 10.0) {
			backofficeDays = parseFloat(backofficeDays.toFixed(1));
		} else {
			backofficeDays = Math.round(backofficeDays);
		}

		var totalOpenTime = frontofficeDays + backofficeDays;
		if (totalOpenTime < 10.0) {
			totalOpenTime = parseFloat(totalOpenTime.toFixed(1));
		} else {
			totalOpenTime = Math.round(totalOpenTime);
		}

		var SLAData = {
			"SLA": [{
				"OpenTime": "Time open with Frontoffice",
				"Days": frontofficeDays,
				"Status": "New, Author Action, Violation, Approved"
			}, {
				"OpenTime": "Time open with Backoffice",
				"Days": backofficeDays,
				"Status": "In Scoping, In Exception"
			}, {
				"OpenTime": "Total Time open",
				"Days": totalOpenTime,
				"Status": ""
			}]
		};

		this.setModel(new JSONModel(SLAData), "slaModel");
		if (totalOpenTime >= 0 && totalOpenTime < 1) {
			totalOpenTime = "(Open for less than a day)";
		} else if (totalOpenTime === 1) {
			totalOpenTime = "(" + totalOpenTime + " day open)";
		} else {
			totalOpenTime = "(" + totalOpenTime + " days open)";
		}
		this.byId("openForDisplay").setText(totalOpenTime);
		this.byId("openForDisplay").setTooltip(totalOpenTime);
		this.byId("openForEdit").setText(totalOpenTime);
		this.byId("openForEdit").setTooltip(totalOpenTime);
	},
	setGoLiveDate: function (oEvent) {
		this.getModel("servicerequestModel").setProperty("/GoLiveDate", oEvent.getSource().getDateValue());
		models.goLiveDate = oEvent.getSource().getDateValue();
	},
	pressISDHubBtn: function (oEvent) {
		var btnSource = oEvent.getSource();
		this.showISDHubPopover(btnSource);
	},
	callISDHUbInterface: function (customerId) {
		//var customerId = this.getModel("servicerequestModel").getProperty("/CustomerID");
		//customerId = "181378wwwwww"; //invalid customerId
		this.byId("btnISDHub").setEnabled(false);
		var jsonmodel = new JSONModel("ext_xalm/api/wkcserviceapi/v1/calmstatus/" + customerId);
		var context = this;
		
		jsonmodel.attachRequestCompleted(function (resp) {
			if(resp.getParameter("success")){
				context.setModel(jsonmodel, "ISDHubResponseModel");
				var data = jsonmodel.getData();
				var calmTenant = data.calmTenant;
				var consent = data.consent;
				var exceptionGiven = data.exceptionGiven;
				var exceptionExpiry = new Date(data.exceptionExpiry);
				exceptionExpiry.setHours(0, 0, 0, 0);
				var todayDate = new Date();
				todayDate.setHours(0, 0, 0, 0);
				var constantDate = new Date("January 01, 2050 00:00:00");
				var btnText = models.TXT_ISD_Hub_status_unknown;
				var btnClass = "classISDHubBtn";
				if (calmTenant && consent) {
					btnText = models.TXT_ISD_Hub_Status_Prefix + models.TXT_ISD_Hub_Ready;
					btnClass = btnClass + "Green";
				} else if (!consent && exceptionGiven && exceptionExpiry >= todayDate && exceptionExpiry <= constantDate) {
					btnText = models.TXT_ISD_Hub_Status_Prefix + models.TXT_ISD_Hub_Exception_granted;
					btnClass = btnClass + "Yellow";
				} else if (!consent && exceptionGiven && exceptionExpiry > constantDate) {
					btnText = models.TXT_ISD_Hub_Status_Prefix + models.TXT_ISD_Hub_usage_waived;
					btnClass = btnClass + "Blue";
				} else if ((!consent && !exceptionGiven) || (!calmTenant && !exceptionGiven) || (!consent && exceptionGiven) || (!calmTenant &&
						exceptionGiven)) {
					btnText = models.TXT_ISD_Hub_Status_Prefix + models.TXT_ISD_Hub_not_ready;
					btnClass = btnClass + "Red";
				} else {
					btnText = models.TXT_ISD_Hub_Status_Prefix + models.TXT_ISD_Hub_status_unknown;
					btnClass = btnClass + "Grey";
				}
				
				context.byId("btnISDHub").setText(btnText);
				context.byId("btnISDHub").addStyleClass(btnClass);
				context.byId("btnISDHub").setEnabled(true);
			}else{
				context.byId("btnISDHub").setText("No ISDH Info found for this Customer");
				/*
				if(resp.getParameter("errorobject").statusCode === 404){
					context.byId("btnISDHub").setText("No ISDH Info found for this Customer");
				}else{
					context.byId("btnISDHub").setText(resp.getParameter("errorobject").responseText);
				}*/
			}
		});
	},

	getCustomerDetails: function () {
		sap.ui.core.BusyIndicator.show(0);
		
		var customerId = this.getModel("servicerequestModel").getProperty("/CustomerID");
		this.getModel("SRS_Data").read("/CustomerSet('" + customerId + "')", {
			groupId: "CustomerDetails",
			success: function (oData) {
				var prefixCRMActivityURL = models.MCC_SOS_ACTIVITY_CREATION_TEST_URL_PREFIX;
				var category = "ZWE";
				var SRModel = this.getModel("servicerequestModel").getData();
				var serviceTeam = "";
				var scopingTeams = [{
					"Region": "ANZ",
					"PartnerNumnber": "29219507"
				}, {
					"Region": "ASIA",
					"PartnerNumnber": "29219507"
				}, {
					"Region": "EMEA",
					"PartnerNumnber": "15035975"
				}, {
					"Region": "LA",
					"PartnerNumnber": "29219506"
				}, {
					"Region": "NA",
					"PartnerNumnber": "29219505"
				}, {
					"Region": "NASIA",
					"PartnerNumnber": "29219507"
				}];

				for (var i = 0; i < scopingTeams.length; i++) {
					if (scopingTeams[i].Region === SRModel.RegionID) {
						serviceTeam = scopingTeams[i].PartnerNumnber;
						break;
					}
				}

				if (models.getSystemLandscapeInfo() === models.BACKND_SYS_ICP) {
					prefixCRMActivityURL = models.MCC_SOS_ACTIVITY_CREATION_PROD_URL_PREFIX;
					//category = "ZWC";
				}
				var formattedCustomerName = SRModel.CustomerName;
				if(formattedCustomerName){
					if(formattedCustomerName.includes("/")){
						formattedCustomerName = formattedCustomerName.replace("/"," ");
					}
					if(SRModel.CustomerName.length>23){
						formattedCustomerName = formattedCustomerName.substring(0,23);
					}
				}
				
				var tenant, consent;
				
				if(!this.calmTenantForISDH){
					tenant = "Not available"
				}else{
					tenant = "Available"
				}
				
				if(!this.consentForISDH){
					consent = "Not provided"
				}else{
					consent = "Provided"
				}
				
			   var suffixCRMActivityURL =
					"/createByDefault/OneColumn/erpcust=" + oData.ERPNo +
					"&caseid=" + SRModel.CaseID + "&title=ISDH support for " + formattedCustomerName +
					"&category=" + category + "&serviceteam=" +
					serviceTeam +
					"&desc=This Activity was created via SRS App.%0DCustomer is not ready for delivery via ISD Hub !%0DCALM tenant: "+tenant+"%0DConsent: "+consent+"%0DTo onboard the customer please contact the Service Requester: " +
					SRModel.OwnerName + " (" + SRModel.OwnerUser + ").%0DMore details in SR " + SRModel.ServiceRequestID + ".";

				var CRMActivityURL = prefixCRMActivityURL + suffixCRMActivityURL;
			   
				if(sap.ui.Device.system.phone){
					window.location.href = CRMActivityURL;
				}else{
					$(".linkCRMActivity").attr("href",CRMActivityURL);
					$(".linkCRMActivity").attr("target","_blank");
					$(".linkCRMActivity")[0].click();
				}
				sap.ui.core.BusyIndicator.hide();
				if(this.byId("idCustomerDetailsFromISDHubPopover").isOpen()){
					this.byId("idCustomerDetailsFromISDHubPopover").close();
				}
				
			}.bind(this),
			error: function (err) {
				sap.ui.core.BusyIndicator.hide();
				models.showErrorMessage(this, err);
		   }.bind(this)
		});
	},
	getPreDefinedButtonText: function(txt){
		return models.TXT_ISD_Hub_Status_Prefix + txt;
	},
	calmTenantForISDH: null,
	consentForISDH: null,
	showISDHubPopover: function (oButton) {
		this.consentForISDH = null;
		this.consentForISDH = null;
		var that = this;
		if (!this._CustomerDetailsFromISDHubPopover) {
			this._CustomerDetailsFromISDHubPopover = Fragment.load({
				id: this.getView().getId(),
				name: "sap.com.servicerequest.servicerequest.fragment.CustomerDetailsFromISDHubPopover",
				controller: this
			}).then(function (oPopover) {
				that.getView().addDependent(oPopover);
				return oPopover;
			});
		}
		this._CustomerDetailsFromISDHubPopover.then(function (oPopover) {
			oPopover.openBy(oButton);
			var calmTenant = that.getModel("ISDHubResponseModel").getProperty("/calmTenant");
			that.calmTenantForISDH = calmTenant;
			var imgStyle="vertical-align: bottom !important; margin-left: 5px !important;";
			var imagePath = that.getModel("imageModel").getProperty("/path");
			var approveImgHTML = '<img src="'+imagePath+'/css/img/Approve.png" alt="Given" width="15" height="15" style="'+imgStyle+'" >';	
			var rejectImgHTML = '<img src="'+imagePath+'/css/img/Reject.png" alt="none" width="15" height="15" style="'+imgStyle+'" >';
			if (!calmTenant) {
				calmTenant = rejectImgHTML;
			}else{
				calmTenant = approveImgHTML + " <strong>("+calmTenant+")</strong>";
			}
			var consent = that.getModel("ISDHubResponseModel").getProperty("/consent");
			that.consentForISDH = consent;
			if(!consent){
				consent = rejectImgHTML;
			}else{
				consent = approveImgHTML;
			}
			var exceptionExpiry = that.getModel("ISDHubResponseModel").getProperty("/exceptionExpiry");
			if (exceptionExpiry) {
				exceptionExpiry = new Date(exceptionExpiry);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					displayFormat: "MMM dd,yyyy"
				});
				exceptionExpiry = oDateFormat.format(exceptionExpiry);
			}

			var btnText = that.byId("btnISDHub").getText(); // models.TXT_ISD_Hub_Exception_granted;//that.byId("btnISDHub").getText(); //models.TXT_ISD_Hub_Ready;
			var CustomerName = that.getModel("servicerequestModel").getProperty("/CustomerName");
			var CustomerID = that.getModel("servicerequestModel").getProperty("/CustomerID");
			var classParentDiv = "margin: 2% !important; font-size: small !important;";
			var classRoundedBorder = "border-radius: 25px; padding-left: 5px !important; padding-right: 5px !important";
			var htmlContentDefault = '<div style="' + classParentDiv + '"><p>Please wait while the content loads ...</p></div>';
			var rowBlockForTenantAndConsentHTML = '<tr><td><strong>SAP Cloud ALM Tenant</td><td> ' + calmTenant + ' </strong></td></tr><tr><td><strong>SAP Cloud ALM Consent </td><td>'+consent+'</strong></td></tr>';
			var htmlFooterContent =
				'<p>For further information see the <a target="_blank" href=https://sap.sharepoint.com/sites/204811>ISD Hub Backoffice Homepage</a></p>';
			var htmlContent = '<div style="' + classParentDiv +
				'"><strong><span style="color: #ffffff !important;background: #5E696E !important;' + classRoundedBorder +
				'">Customer’s status of SAP Cloud ALM for Service is unknown !</span></strong><br/><table><tr><td><strong>Customer found in ISD Hub</strong></td><td>'+rejectImgHTML+'</td></tr>'+rowBlockForTenantAndConsentHTML+'</table><br/><p>There is no information available, whether Customer <strong>' + CustomerName + ' (' + CustomerID +
				') </strong>has given their consent for data exchange to enable the new PE Service Delivery Platform or not. </p><p><strong>ACTION:  </strong><ul><li>Frontoffice team must arrange a call with the customer and position the new PE Service Delivery Platform.</li><li>If the customer has given consent in the meanwhile, frontoffice may inform the VPR accordingly. </li></ul>' +
				htmlFooterContent + '</div>';
			if (btnText === that.getPreDefinedButtonText(models.TXT_ISD_Hub_Ready)) {
				htmlContent = '<div style="' + classParentDiv +
					'"><p><strong><span style="color: #ffffff !important;background: #2B7D2B !important;' + classRoundedBorder +
					'">'+models.TXT_ISD_Hub_Status_Prefix +'READY for delivery via ISD Hub  !</span></strong><br/><table>'+rowBlockForTenantAndConsentHTML+'</table></p><p>Customer <strong>' + CustomerName + ' (' +
					CustomerID +
					') </strong>have set up a SAP Cloud ALM Tenant and have given their consent for data exchange to enable the new PE Service Delivery Platform.<br/>No action required here.</p>' +
					htmlFooterContent + '</div>';
			} else if (btnText === that.getPreDefinedButtonText(models.TXT_ISD_Hub_Exception_granted)) {
				htmlContent = '<div style="' + classParentDiv +
					'"><p><strong><span style="color: #000000 !important;background: #FABD64 !important;' + classRoundedBorder +
					'">'+models.TXT_ISD_Hub_Status_Prefix+'Temporary EXCEPTION granted ! </span><table>'+rowBlockForTenantAndConsentHTML+'<tr><td><strong>Exception granted</td></strong><td><strong>'+approveImgHTML+' (until ' + exceptionExpiry +
					')</strong></td></tr></table></strong></p><p>Customer <strong>' + CustomerName + ' (' + CustomerID +
					')</strong> has not given their consent for data exchange to enable service delivery in SAP Cloud ALM but a <strong>temporary Exception until ' +
					exceptionExpiry +
					'</strong> has been granted, allowing a PE Service Delivery without the customer set up being ready yet.</p><p><strong>ACTION:  </strong><ul><li>Frontoffice team must arrange a call with the customer to position the new PE Service Delivery Platform. </li><li>Scoping and service delivery for this Service Request can be continued.</li><li>If the above information is incorrect and the customer has given consent in the meanwhile, frontoffice may inform the VPR accordingly. </li></ul></p>' +
					htmlFooterContent + '</div>';
			} else if (btnText === that.getPreDefinedButtonText(models.TXT_ISD_Hub_usage_waived)) {
				htmlContent = '<div style="' + classParentDiv +
					'"><p><strong><span style="color: #ffffff !important;background: #427cac !important;' + classRoundedBorder +
					'">'+models.TXT_ISD_Hub_Status_Prefix+'Customer EXEMPTED !</span></strong><br/><table>'+rowBlockForTenantAndConsentHTML+'<tr><td><strong>Permanent Exception granted</td><td>'+approveImgHTML+'</td></tr></table></strong></p><p>Customer <strong>' +
					CustomerName + ' (' + CustomerID +
					') </strong> has been permanently exempted from using the new PE Service Delivery Platform.</p>' +
					htmlFooterContent + '</div>';
			} else if (btnText === that.getPreDefinedButtonText(models.TXT_ISD_Hub_not_ready)) {
				var exceptionExpiryDate = that.getModel("ISDHubResponseModel").getProperty("/exceptionExpiry");
				if(exceptionExpiryDate){
					exceptionExpiryDate = new Date(exceptionExpiryDate);
				}
				var todaysDate = new Date();
				if(exceptionExpiryDate && exceptionExpiryDate<todaysDate){
					htmlContent = '<div style="' + classParentDiv +
						'"><p><strong><span style="color: #ffffff !important;background: #BB0000 !important;' + classRoundedBorder +
						'">Customer’s SAP Cloud ALM for Service is NOT READY for ISD Hub Delivery !</span></strong><br/><table>'+rowBlockForTenantAndConsentHTML+'<tr><td><strong>Exception granted</strong></td><td><strong>'+rejectImgHTML+' (Expired on '+exceptionExpiry+')</strong></td></tr></table> </p></strong><p>Customer <strong>' +
						CustomerName + ' (' +
						CustomerID +
						')</strong> has not given their consent for data exchange to enable the new PE Service Delivery Platform. <strong>Exception</strong> that was previously granted has <strong>expired on '+exceptionExpiry+'</strong></p><p><strong>ACTION:</strong>  <ul><li>Frontoffice team must arrange a call with the customer and position the new PE Service Delivery Platform. ISDH Backoffice may support the frontoffice with positioning.</li><li>Scoping and service delivery for this Service Request can be continued.</li><li>If the above information is incorrect and the customer has given consent in the meanwhile, frontoffice may inform the VPR accordingly.</li></ul></p>' +
						htmlFooterContent + '</div>';
				}else{
					htmlContent = '<div style="' + classParentDiv +
						'"><p><strong><span style="color: #ffffff !important;background: #BB0000 !important;' + classRoundedBorder +
						'">Customer’s SAP Cloud ALM for Service is NOT READY for ISD Hub Delivery !</span></strong><br/><table>'+rowBlockForTenantAndConsentHTML+'</table> </p></strong><p>Customer <strong>' +
						CustomerName + ' (' +
						CustomerID +
						')</strong> has not given their consent for data exchange to enable the new PE Service Delivery Platform. </p><p><strong>ACTION:</strong>  <ul><li>Scoper <a class="classHyperLinkCRMActivity">clicks here to create a task for the ISDH Backoffice</a><a class="linkCRMActivity"></a> to support the frontoffice in positioning the new PE Service Delivery Platform. </li><li>Frontoffice team must arrange a call with the customer and position the new PE Service Delivery Platform.</li><li>Scoping and service delivery for this Service Request can be continued.</li><li>If the above information is incorrect and the customer has given consent in the meanwhile, frontoffice may inform the VPR accordingly.</li></ul></p>' +
						htmlFooterContent + '</div>';
				}
			}
			that.byId("htmlPopoverISDHUb").setContent(htmlContent);
			if($(".classHyperLinkCRMActivity")[0]){
				$(".classHyperLinkCRMActivity").click(function () {
					that.getCustomerDetails();
				});
			}
		});
	},
	handleCustomerDetailsFromISDHubPopoverClose: function (oEvent) {
		this.byId("idCustomerDetailsFromISDHubPopover").close();
	},
	ISDHPopoverHtmlContentAfterRendering: function(){
		var context = this;
		if($(".classHyperLinkCRMActivity")[0]){
			$(".classHyperLinkCRMActivity").click(function () {
				context.getCustomerDetails();
			});
		}
	},
	onPressShare: function(oEvent){
		var oButton = oEvent.getSource(),
			oView = this.getView();
	   if (!this._sharePopover) {
			this._sharePopover = Fragment.load({
				id: oView.getId(),
				name: "sap.com.servicerequest.servicerequest.fragment.ShareSRPopover",
				controller: this
			}).then(function (oPopover) {
				oView.addDependent(oPopover);
				return oPopover;
			});
		}
		var context = this;
		this._sharePopover.then(function (oPopover) {
			oPopover.openBy(oButton);
			if (sap.ui.Device.system.phone) {
				context.byId("shareSRPopOver").setShowHeader(true);
			}else{
				context.byId("shareSRPopOver").setShowHeader(false);
			}
		});
		
	},
	handleEmailPress: function (evt) {
		var URLHelper = MobileLibrary.URLHelper;
	   this.byId("shareSRPopOver").close();
	   URLHelper.triggerEmail("", "Service Request "+this.sServiceRequestId, "\n"+window.location.href, false, false, true);
   },
   handleCopyURLPress: function(evt){
	   var copyURL = window.location.href;
   
	   // Copy the URL to clipboard
	   navigator.clipboard.writeText(copyURL);
	   this.byId("shareSRPopOver").close();
	   sap.m.MessageToast.show("Service Request URL is copied to clipboard");
   },
   showHideContractAndRelatedFields: function(selectedService,customerId){
	   var isContractMandatory = true;
	   var showServiceResultReviewfield = false;
	   var isPreferredSuccess = false;
	   if(jQuery.isEmptyObject(this.getModel("productSetModel"))){
		   this.byId("idSRProgressBarBtn").setEnabled(false);
		   var hostURL = this.getModel("SRS_Data").sServiceUrl;
		   var context = this;
		   var productModel = new JSONModel(hostURL + "/CustomerSet('"+customerId+"')/toProducts?$filter=(ProductID eq '"+selectedService+"')");
		   productModel.attachRequestCompleted(function (resp) {
			   if (resp.getParameters("success").success) {
				   var results = productModel.getData().d.results;
				   if(results){
						for(var i=0;i<results.length;i++){
							if(results[i].ProductID === selectedService){
								isContractMandatory = results[i].ContractMandatory;
								showServiceResultReviewfield = results[i].ReviewMandatory;
								isPreferredSuccess = results[i].PreferredSuccess
								break;
							}
						}
						context.getModel("buttonControlModel").setProperty("/showContractFieldsBasedOnSelectedService",isContractMandatory);
						context.getModel("buttonControlModel").setProperty("/showServiceResultReviewfield",showServiceResultReviewfield);	
						context.getModel("buttonControlModel").setProperty("/IsPreferredSuccessServiceSelected",isPreferredSuccess);
				 	}
					 context.byId("idSRProgressBarBtn").setEnabled(true);
			   } else {
					context.byId("idSRProgressBarBtn").setEnabled(true);
					sap.ui.core.BusyIndicator.hide();
					models.showErrorMessage(context, err);
			   }

		   });
	   }else{
		   var productSetModel = this.getModel("productSetModel").getData();
		   for(var i=0;i<productSetModel.length;i++){
			   if(productSetModel[i].ProductID === selectedService){
				   isContractMandatory = productSetModel[i].ContractMandatory;
				   showServiceResultReviewfield = productSetModel[i].ReviewMandatory;
				   isPreferredSuccess = productSetModel[i].PreferredSuccess;
				   break;
			   }
		   }
		   this.getModel("buttonControlModel").setProperty("/showContractFieldsBasedOnSelectedService",isContractMandatory);
		   this.getModel("buttonControlModel").setProperty("/showServiceResultReviewfield",showServiceResultReviewfield);
		   this.getModel("buttonControlModel").setProperty("/IsPreferredSuccessServiceSelected",isPreferredSuccess);	
	   }
   
   },
   setDeleteSRItemsForDisplayScope: function(channel, event, index){
	   var items = this.byId("idProductsTable-display").getItems();
	   if(items.length>1){
		   for (var i = parseInt(index); i < items.length; i++) {
			   items[i].setVisible(false);
		   }
		   items[0].getCells()[4].setText("0");
	   }
   },
   pressShowMoreCloudRefObjBtn: function(oEvent){
	   this.byId("panelCloudRefObjDisplay").setExpanded(true);
	   models.showHideMaxRowsForCloudRefObjs(this.byId("idTreeTableCloudRefDisplay"),this.byId("ShowMoreCloudRefObjDisplay"),this);
   },
   onCloudRefObjectInfoButton: function(oEvent){
	   models.showCloudRefObjInfo(oEvent,this);
   },
   toggleOpenStateForCROTreeTable: function(oEvent){
	   models.toggleOpenStateForCROTreeTable(oEvent,this);
   },
   onDiscussionUserNameClick: function(oEvent){
	   var employeeId = oEvent.getSource().data("createdBy");
	   models.getAvatarForAttachmentUser(employeeId,oEvent);
   },
   pressServiceDelDetailsInfoBtn: function(oEvent){
		models.showServiceDelDetailsPopover(oEvent,this);
	},
   handleServiceDelDetailsInfoPopoverClose: function(oEvent){
		models.closeServiceDelDetailsInfoPopover(this,"idServiceDelDetailsInfoPopover");
   },
   pressServiceReviewInfoBtn: function (oEvent) {
		models.pressServiceReviewInfoBtn(this,oEvent);
   },
   handleServiceResultsReviewPopoverClose: function(){
		this.byId("idServiceResultReviewHintPopover").close();
   },

   pressRDLInfoBtn: function (oEvent) {
		models.pressRDLInfoBtn(this,oEvent);
  },
   handleRDLPopoverClose: function(){
		this.byId("idRDLHintPopover").close();
   },
   cancellationReasonOnPress: function (oEvent) {
		var oButton = oEvent.getSource();
		var context = this;
		if (!this._CancellationReasonInfoPopover) {
			this._CancellationReasonInfoPopover = Fragment.load({
				id: this.getView().getId(),
				name: "sap.com.servicerequest.servicerequest.fragment.CancellationReasonInfoPopover",
				controller: this
			}).then(function (oPopover) {
				context.getView().addDependent(oPopover);
				return oPopover;
			});
		}
		sap.ui.core.BusyIndicator.show(0);
		this._CancellationReasonInfoPopover.then(function (oPopover) {
			sap.ui.core.BusyIndicator.hide();
			oPopover.openBy(oButton);
			if(context.getModel("cancellationDescModel") && jQuery.isEmptyObject(context.getModel("cancellationDescModel").getData())){
				models.getNotesSet(context, "/NoteSet", context.sServiceRequestId, "ZV09", "cancellationDescModel");
			}
		});
	},
	handleLastChangedInfoPopoverClose: function(){
		this.byId("idRelatedPartnerHintPopover").close();
	},
	approvalRuleInfoBtnOnPress: function(oEvent){
		models.showApprovalRuleInfoPopover(this,oEvent);
	},
	SRInfoBtnOnPress: function(oEvent){
		models.showSRInfoPopover(oEvent,this);
	},
	agreedScopeBtnOnPress: function(oEvent){
		models.showAgreedScopePopover(oEvent,this);
	},
	handleBtnAssignAsProcessor: function(oEvent){
		let lastScoperUser = this.getModel("servicerequestModel").getProperty("/LastScoperUser");
		let lastScoperName = this.getModel("servicerequestModel").getProperty("/LastScoperName");
		this.getModel("servicerequestModel").setProperty("/ProcessorUser",lastScoperUser);
		this.getModel("servicerequestModel").setProperty("/ProcessorName",lastScoperName);
		this.byId("procInput").setTokens([]);
		this.byId("procInput").addToken(new sap.m.Token({
			key: lastScoperUser,
			text: lastScoperName
		}));
	}

});
}, true);