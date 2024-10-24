sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/m/Button",
	"sap/m/MessageBox",
	"sap/ui/table/library",
	"sap/m/MessageToast",
	"sapit/controls/EmployeeDataInfoPopover",
	"sap/m/UploadCollectionParameter",
	"sap/ui/core/Fragment",
	"sap/m/BusyDialog",
	"sap/base/util/deepClone"
], function (JSONModel, Device, Filter, FilterOperator, Dialog, List, StandardListItem, Button, MessageBox, library, MessageToast,
	EmployeeDataInfoPopover, UploadCollectionParameter,Fragment, BusyDialog,deepClone) {
	"use strict";

	return {
		STATUS_NEW: "E0001",
		STATUS_VIOLATED: "E0002",
		STATUS_INSCOPING: "E0003",
		STATUS_INEXCEPTION: "E0004",
		STATUS_APPROVED: "E0005",
		STATUS_CANCELED: "E0006",
		STATUS_SOCREATED: "E0007",
		STATUS_AUTHORACTION: "E0008",
		RULE_VIOLATED: "VIO",
		RULE_NO_VIOLATION: "NVI",
		RULE_EXCEPTION_APPROVED: "EAP",
		RULE_EXCEPTION_REJECTED: "ERE",
		RULE_VIOLATED_TEXT: "Violation",
		RULE_NO_VIOLATION_TEXT: "No Violation",
		RULE_EXCEPTION_APPROVED_TEXT: "Exception Approved",
		RULE_EXCEPTION_REJECTED_TEXT: "Exception Rejected",
		RULE_APPROVE: "APR",
		RULE_REJECT: "REJ",
		RULE_NO_ACTION: "",
		SO_STATUS_NEW: "E0001",
		SO_STATUS_DELIVERY_CONFIRMED: "E0002",
		SO_STATUS_DELIVERED: "E0005",
		SO_STATUS_CANCELED: "E0007",
		SO_STATUS_PLANNING: "E0015",
		SO_STATUS_DELIVERY_PREP: "E0016",
		SO_STATUS_RESTRICTED: "E0017",
		SO_STATUS_DRAFT: "E0018",
		SR_ITEM_0: "0000000000",
		SR_ITEM_10: "0000000010",
		SR_ITEM_15: "0000000015",
		SR_ITEM_20: "0000000020",
		ItemGUID_20: null,
		ItemGUID_10: null,
		CASE_STATUS_CLOSED: "90",
		isServiceSelected: false,
		isSessionSelected: false,
		existingService: "",
		existingSession: "",
		existingSessionProductName: "",
		goLiveDate: null,
		OPR_TYPE: null,
		contractItemsDurationValid: true,
		CRM_DEV_URL: "https://icd.wdf.sap.corp/sap(bD1lbiZjPTAwMSZkPW1pbg==)/bc/bsp/sap/crm_ui_start/default.htm?saprole=ZSU_DEFAULT&crm-object-type=CRM_CMG&crm-object-action=B&crm-object-keyname=EXT_KEY&crm-object-value=",
		CRM_TEST_URL: "https://ict.wdf.sap.corp/sap(bD1lbiZjPTAwMSZkPW1pbg==)/bc/bsp/sap/crm_ui_start/default.htm?saprole=ZSU_DEFAULT&crm-object-type=CRM_CMG&crm-object-action=B&crm-object-keyname=EXT_KEY&crm-object-value=",
		CRM_PROD_URL: "https://icp.wdf.sap.corp/sap(bD1lbiZjPTAwMSZkPW1pbg==)/bc/bsp/sap/crm_ui_start/default.htm?saprole=ZSU_DEFAULT&crm-object-type=CRM_CMG&crm-object-action=B&crm-object-keyname=EXT_KEY&crm-object-value=",
		HEP_DEV_URL: "https://holisticengagementplanner-br339jmc4c.dispatcher.int.sap.eu2.hana.ondemand.com/index.html#/",
		HEP_TEST_URL: "https://fiorilaunchpad-sapitcloudt.dispatcher.hana.ondemand.com/sites?hc_reset#holisticengagementplanner-Display&/",
		HEP_PROD_URL: "https://sapit-home-prod-004.launchpad.cfapps.eu10.hana.ondemand.com/site#holisticengagementplanner-Display&/",
		ARM_Link: "https://uap.bss.net.sap/sap/bc/webdynpro/sap/yupa_extend_auth?pa_mandt=001&pa_system=",
		TQM_PROFILE: "&pa_profile=0000_CRM_SU_TQM_PE",
		SCOPER_PROFILE: "&pa_profile=0000_CRM_SU_COE_SCOPING",
		SU02_PROFILE: "&pa_profile=00:SU02__:GP#",
		BACKND_SYS_ICD: "ICD",
		BACKND_SYS_ICT: "ICT",
		BACKND_SYS_ICP: "ICP",
		TRACK_EVENT_SR_CREATED: "SR Created",
		TRACK_EVENT_SR_CREATED_PE: "PE SR Created",
		TRACK_EVENT_SR_CREATED_PrS: "PrS SR Created",
		TRACK_EVENT_SR_SENT_FOR_SCOPING: "SR Sent For Scoping",
		TRACK_EVENT_SR_REQUEST_APPROVAL: "SR Request Approval",
		TRACK_EVENT_SR_APPROVED: "SR Approved",
		TRACK_EVENT_SR_CANCELLED: "SR Cancelled",
		TRACK_EVENT_SR_SO_CREATED: "SO Created",
		TRACK_EVENT_SR_SO_CREATED_PE: "PE SO Created",
		TRACK_EVENT_SR_SO_CREATED_PrS: "PrS SO Created",
		TRACK_EVENT_SR_BACK_TO_AUTHOR: "SR Back To Author",
		TRACK_EVENT_SR_CREATED_VIA_COPY: "SR created via Copy",
		TRACK_EVENT_SR_CREATE_FROM_LIST_VIEW: "SR Created from List View",
		STR_AGREED_SCOPE: "AGREED_SCOPE",
		STR_SR_INFO: "SR_INFO",
		STR_COMMENT: "COMMENT",
		SR_NEW_ID: "NEW_SR",
		DEFAULT_DAYS_TO_ADD_FOR_RDD: 21,
		EOD_PRODUCT: "9503596",
		STRING_SUCCESS: "SUCCESS",
		STRING_ERRO: "ERROR",
		STRING_COPY_SR: "COPY_SR",
		ERROR_FLAG_NOTESET: false,
		DEFAULT_SORT_BY: "RequestedDeliveryDate",
		DEFAULT_SORT_ORDER: "desc",
		DEFAULT_PAGE_TOP: "10",
		GUEST_PROFILE: "&pa_profile=0000_CRM_SU_SRS_GUEST",
		CASE_REASON_EMPTY: "",
		CASE_REASON_ENGAGEMENT: "ENG2",
		CASE_REASON_ENGAGEMENT_GLOBAL: "ENG1",
		SESSION_READINESS_CHECK: "9503673",
		SO_CREATION_VALIDITY: true,
		CaseID: "CaseID",
		Description: "Description",
		RegionID: "RegionID",
		RespDepID: "RespDepID",
		SurveyRecID: "SurveyRecID",
		SessionID: "SessionID",
		SRItemsDates:"SRItemsDates",
		prefixPTL: "(",
		suffixPTL: " Potential Lead Time)",
		TXT_ISD_Hub_Status_Prefix: "SAP Cloud ALM for Service – ",
		TXT_ISD_Hub_Ready: "READY",
		TXT_ISD_Hub_Exception_granted: "EXCEPTION",
		TXT_ISD_Hub_usage_waived: "EXEMPTED",
		TXT_ISD_Hub_not_ready: "NOT READY",
		TXT_ISD_Hub_status_unknown: "NO INFO",
		SERVICE_ON_CALL_DUTY: "9500310",
		DeployModCloud: "CLOUD",
		hasCreationOrDeletionTriggeredForCRO: false,
		DEFAULT_VISIBLEROWCOUNT_CLOUDREFOBJ: 5,
		HAS_SYSTEM_VALIDATION_TRIGGERED: false,
		SEARCH_SYSTEM_KEY: "SEARCH_SYSTEM",
		extracedParamCreateSO: false,
		sessionTimeOutErrorCode:"504",
		STORAGE_KEY_SR_ID:"SR_ID",
		CANCELLATION_NOTE_TYPE:"ZSCR",
		wasPreviousServicePreferredSuccess: false,
		PRODUCT_TYPE_SERVICE:"SERVICE",
		PRODUCT_TYPE_SESSION:"SESSION",
		isSRStatusReRead: false,
		SESSION_READINESS_CHECK_QUALID:"93202700",
		MCC_SOS_ACTIVITY_CREATION_TEST_URL_PREFIX: "https://sapit-customersupport-test-kinkajou.launchpad.cfapps.eu10.hana.ondemand.com/007bc8dd-4279-4218-b471-43eb9bcce245.sapsupportfsc2.sapsupportfsc2/index.html#",
		MCC_SOS_ACTIVITY_CREATION_PROD_URL_PREFIX: "https://sapit-customersupport-prod-kestrel.launchpad.cfapps.eu10.hana.ondemand.com/9dc5e327-a3c0-4383-94e1-2b40ae9836ea.sapsupportfsc2.sapsupportfsc2/index.html#",
		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		dateValidation: function (oControl, previousDate, context) {
			oControl.setDateValue(previousDate);
			oControl.setValue(this.date(previousDate));
		},
		dateValidationSRItems: function (oControl, dateValue, value, context) {
			oControl.setDateValue(null);
			oControl.setValue(null);
		},
		createFLPModel: function () {
			var fnGetuser = jQuery.sap.getObject("sap.ushell.Container.getUser"),
				bIsShareInJamActive = fnGetuser ? fnGetuser().isJamActive() : false,
				oModel = new JSONModel({
					isShareInJamActive: bIsShareInJamActive
				});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		trackUser: function (component, sUserId) {
			try {
				if (this.getSystemLandscapeInfo() === this.BACKND_SYS_ICP) {
					sap.git.usage.Reporting.setUser(component, sUserId);
				}
			} catch (err) {
				console.log("Error while triggering event for User: " + sUserId);
			}
		},
		trackEvent: function (component, sEventName) {
			try {
				if (this.getSystemLandscapeInfo() === this.BACKND_SYS_ICP) {
					sap.git.usage.Reporting.addEvent(component, sEventName);
				}
			} catch (err) {
				console.log("Error while triggering event: " + sEventName);
			}
		},
		growFire: function (oEvent) {
			var timeLine = oEvent.getSource();
			if (timeLine._iItemCount === 0) {
				var k = timeLine._displayShowMore() ? timeLine.getGrowingThreshold() : timeLine._calculateItemCountToLoad(this.$());
				timeLine._iItemCount += k;
				timeLine._iItemCount = Math.min(timeLine._getMaxItemsCount(), timeLine._iItemCount);
			}
		},
		getDropDownListModel: function (context, entitySet, filterPath, clientModel) {
			context.getModel("busyIndicatorModel").setProperty("/dropdownList", true);
			var that = this;
			context.getModel("SRS_Data").read(entitySet, {
				filters: [new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, filterPath)],
				groupId: "group" + filterPath,
				success: function (oData) {
					var results = oData.results;
					context.setModel(new JSONModel(results), clientModel);
					context.getModel("busyIndicatorModel").setProperty("/dropdownList", false);
					//Apply Auto filter off for Google Chrome
					that.applyBrowserAutoFillOff();
				}.bind(context),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					//Apply Auto filter off for Google Chrome
					that.applyBrowserAutoFillOff();
				}.bind(context)
			});
		},
		getQualificationDropDownListModel: function (context, clientModel) {
			var hostURL = context.getModel("SRS_Data").sServiceUrl;
			var qualificationModel = new JSONModel(hostURL + "/DropDownListSet?sap-language=en&$filter=Type eq 'Qualification'");
			context.getModel("busyIndicatorModel").setProperty("/dropdownList", true);
			var that = this;

			qualificationModel.attachRequestCompleted(function (resp) {
				if (resp.getParameters("success").success) {
					var results = qualificationModel.getData().d.results;
					results = that.filterQualifications(results);
					results = results.sort(that.sortByQualName());
					context.setModel(new JSONModel(results), clientModel);
					context.getModel("busyIndicatorModel").setProperty("/dropdownList", false);
					that.validateFUQual(context);
					//Apply Auto filter off for Google Chrome
					that.applyBrowserAutoFillOff();
				} else {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					that.showErrorMessage(context, resp.getParameters().errorobject);
					//Apply Auto filter off for Google Chrome
					that.applyBrowserAutoFillOff();
				}

			});
		},
		filterQualifications: function (data) {
			var filteredQual = [];
			for (var i = 0; i < data.length; i++) {
				var subStr = data[i].Value.toUpperCase();
				if (!subStr.includes("OSD:") && !subStr.includes("BO:") && !subStr.includes("MCC:")) {
					filteredQual.push(data[i]);
				}
			}
			return filteredQual;
		},
		getDeploymentRooms: function (context, entitySet, filterPath, clientModel, seqNo, controlID, isCalledOnDRControlChange, SrID,selectedScopingTeam) {
			context.getModel("busyIndicatorModel").setProperty("/deploymentRoom", true);
			var arrFilter = [];
			var groupId = "deploymentRoom";
			if (filterPath) {
				arrFilter.push(new sap.ui.model.Filter("SrRegion", sap.ui.model.FilterOperator.EQ, filterPath));
			}

			if(SrID){
				arrFilter.push(new sap.ui.model.Filter("SrID", sap.ui.model.FilterOperator.EQ, SrID));
				groupId = "deploymentRoom_"+SrID;
			}

			var models = this;
			
			context.getModel("SRS_Data").read(entitySet, {
				filters: arrFilter,
				groupId: groupId,
				success: function (oData) {
					var results = oData.results;
					results = results.sort(models.sortByProperty("SeqNo"));
					if (clientModel === "deplRoomValuesFiltersModel") {
						context.setModel(new JSONModel(results), "deplRoomValuesRawModel");
						results = models.removeDuplicateDR(results);
					}
					context.setModel(new JSONModel(results), clientModel);
					if (results.length > 0 && controlID) {
						var SRModel = context.getModel("servicerequestModel").getData();
						if (!isCalledOnDRControlChange) {
							models.overallBtnsAndFieldsValidations(SRModel.StatusCode, context);
						} else {
							context.resetProcessorToBlank();
						}
					} else if (controlID) {
						context.byId(controlID).setEnabled(false);
					}

					if(selectedScopingTeam){
						context.getModel("servicerequestModel").setProperty("/RespDepID", selectedScopingTeam);
					}else if (seqNo) {
						var selectedKey = "";
						var selectedName = "";
						for (var i = 0; i < results.length; i++) {
							if (results[i].SeqNo === seqNo) {
								selectedKey = results[i].DrPartner;
								selectedName = results[i].DrName;
								break;
							}
						}
						context.getModel("servicerequestModel").setProperty("/RespDepID", selectedKey);
						context.getModel("servicerequestModel").setProperty("/RespDepName", selectedName);
					}

					context.getModel("busyIndicatorModel").setProperty("/deploymentRoom", false);
					models.onCreateValidate(context);
					models.applyBrowserAutoFillOff();
				}.bind(context),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					context.getModel("busyIndicatorModel").setProperty("/deploymentRoom", false);
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					models.applyBrowserAutoFillOff();
				}.bind(context)
			});
		},
		addContractToEngagementCase: function(context,parentCaseId,entitySet, data, clientModel, controlID, loadDefaultContract, selectedContract, selectedContractItem){
			var models = this;
			var payload = {
				"CaseID":parentCaseId,
				"ContractID":selectedContract
			};
			sap.ui.core.BusyIndicator.show(0);
			context.getModel("SRS_Data").create("/CaseContractSet", payload, {
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					var bCompact = !!context.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.information("Contract "+selectedContract+" has been successfully assigned to Engagment.",{
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					});
					models.getContracts(context, entitySet, data, clientModel, controlID, loadDefaultContract, selectedContract, selectedContractItem);
				}.bind(context),
				error: function (error) {
					sap.ui.core.BusyIndicator.hide();
					models.showErrorMessage(context, error);
				}.bind(context)
			});
		},
		getContracts: function (context, entitySet, data, clientModel, controlID, loadDefaultContract, selectedContract, selectedContractItem) {
			context.getModel("buttonControlModel").setProperty("/showContractWorkAtRisk", false);
			context.byId(controlID).setBusy(true);
			context.byId(controlID).setEnabled(false);
			var arrFilter = [];
			var requestFilter;
			if (data) {
				if (data.CustomerID) {
					arrFilter.push(new sap.ui.model.Filter("CustomerID", sap.ui.model.FilterOperator.EQ, data.CustomerID));
				}
				if (data.ProductID) {
					arrFilter.push(new sap.ui.model.Filter("ProductID", sap.ui.model.FilterOperator.EQ, data.ProductID));
				}
				if (data.RecDelDate) {
					arrFilter.push(new sap.ui.model.Filter("RecDelDate", sap.ui.model.FilterOperator.EQ, data.RecDelDate));
				}
				if (data.ContractID) {
					arrFilter.push(new sap.ui.model.Filter("ContractID", sap.ui.model.FilterOperator.EQ, data.ContractID));
				}
				if (data.ParentCaseID) {
					arrFilter.push(new sap.ui.model.Filter("EngagementID", sap.ui.model.FilterOperator.EQ, data.ParentCaseID));
				}
				requestFilter = this.filterComparison_AND(arrFilter);
			}
			var models = this;
			var oEventBus = sap.ui.getCore().getEventBus();
			context.getModel("SRS_Data").read(entitySet, {
				filters: [requestFilter],
				group: "ContractSet",
				success: function (oData) {
					var SRModel = context.getModel("servicerequestModel").getData();
					context.byId("idTextContactType").setText("");
					if (oData.results.length > 0) {
						context.setModel(new JSONModel(oData.results), clientModel);
						models.overallBtnsAndFieldsValidations(SRModel.StatusCode, context);
						if (controlID === "contractItemId-edit") {

							var selectedKey = context.byId(controlID).getSelectedKey();
							if (!selectedKey) {
								selectedKey = selectedContractItem;
							}

							var results = oData.results;
							for (var i = 0; i < results.length; i++) {
								if (results[i].ContractItemID === selectedKey) {
									context.setModel(new JSONModel(results[i]), "contractItemsDateModel");
									var callOffDays = context.byId("totalcalloff-Edit").getText();
									context.getModel("SRS_Data_UserSet").setProperty("/AvailableCallOffDays", results[i].ContractItemAvailableDays);
									if (SRModel.StatusCode != models.STATUS_SOCREATED) {
										models.validateContractItemBasedOnCallOffDays(results[i], callOffDays, context, "msgStripContractItemValidation");
									}
									var workAtRisk = results[i].WorkAtRisk;
									if (workAtRisk && workAtRisk.toUpperCase() === "X") {
										context.getModel("buttonControlModel").setProperty("/showContractWorkAtRisk", true);
										models.setTxtMsgWorkAtRisk(context, data.ContractID, selectedKey);
									}
									break;
								}
							}
							if (results.length > 0) {
								var contractItem = results[0];
								var contractTypeDesc = models.formatContractType(contractItem.ContractMainProdID, contractItem.ContractMainProdDescr);
								context.byId("idTextContactType").setText(contractTypeDesc);
							}
						}
						if (oData.results.length === 1 && loadDefaultContract) {
							var SRItems = context.getModel("servicerequestItemsModel")?context.getModel("servicerequestItemsModel").getData():[];
							if (controlID === "contractItemId-edit") {
								if (oData.results[0].ContractItemID === selectedContractItem) {
									//context.byId(controlID).setSelectedKey(oData.results[0].ContractItemID);
									context.getModel("SRS_Data_UserSet").setProperty("/AvailableCallOffDays", oData.results[0].ContractItemAvailableDays);
								} else {
									context.getModel("SRS_Data_UserSet").setProperty("/AvailableCallOffDays", "0");
								}
								context.byId(controlID).setSelectedKey(oData.results[0].ContractItemID);
								var contractItem = oData.results[0];
								var contractTypeDesc = models.formatContractType(contractItem.ContractMainProdID, contractItem.ContractMainProdDescr);
								context.byId("idTextContactType").setText(contractTypeDesc);
								context.setModel(new JSONModel(oData.results[0]), "contractItemsDateModel");
								oEventBus.publish("contractItemValidation", "contractItemValidationSuccess");
								var workAtRisk = oData.results[0].WorkAtRisk;
								if (workAtRisk && workAtRisk.toUpperCase() === "X") {
									context.getModel("buttonControlModel").setProperty("/showContractWorkAtRisk", true);
									models.setTxtMsgWorkAtRisk(context, data.ContractID, oData.results[0].ContractItemID);
								}
								for(var i=0;i<SRItems.length;i++){
									if(SRItems[i].ItemNo===models.SR_ITEM_10){
										SRItems[i].ContractItemID = oData.results[0].ContractItemID;
									}
								}
							} else {
								context.byId(controlID).setSelectedKey(oData.results[0].ContractID);
								if(SRModel.ParentCaseID && !oData.results[0].InEngagement){
									models.addContractToEngagementCase(context,SRModel.ParentCaseID,entitySet, data, clientModel, controlID, true, oData.results[0].ContractID, selectedContractItem);
								}else{
									models.getContracts(context, "/ContractSet", {
										"RecDelDate": data.RecDelDate,
										"ProductID": data.ProductID,
										"ContractID": oData.results[0].ContractID
									}, "contractItemModel", "contractItemId-edit", true, null, selectedContractItem);
								}
								for(var i=0;i<SRItems.length;i++){
									if(SRItems[i].ItemNo===models.SR_ITEM_10){
										SRItems[i].ContractID = oData.results[0].ContractID;
									}
								}
							}
						}
						if (loadDefaultContract && selectedContract && oData.results.length > 1) {
							context.byId("contractId-edit").setSelectedKey(selectedContract);
							var contractNeedsToBeAddedToEngagement = false;
							for(var k=0;k<oData.results.length;k++){
								if(oData.results[k].ContractID === selectedContract && !oData.results[k].InEngagement && SRModel.ParentCaseID){
									contractNeedsToBeAddedToEngagement = true;
									models.addContractToEngagementCase(context,SRModel.ParentCaseID,entitySet, data, clientModel, controlID, true, selectedContract, selectedContractItem);
									break;
								}
							}
							if (selectedContract && !contractNeedsToBeAddedToEngagement) {
								models.getContracts(context, "/ContractSet", {
									"RecDelDate": data.RecDelDate,
									"ProductID": data.ProductID,
									"ContractID": selectedContract
								}, "contractItemModel", "contractItemId-edit", true, null, selectedContractItem);
							}
						}

						if (loadDefaultContract && selectedContractItem && !selectedContract && oData.results.length > 1) {
							context.byId("contractItemId-edit").setSelectedKey(selectedContractItem);
							if (context.byId("contractItemId-edit").getSelectedItem()) {
								var selectedItem = context.byId("contractItemId-edit").getSelectedItem().data().contractItem;
								context.setModel(new JSONModel(selectedItem), "contractItemsDateModel");
								oEventBus.publish("contractItemValidation", "contractItemValidationSuccess");
							}
							var contractTypeDesc = models.formatContractType(oData.results[0].ContractMainProdID, oData.results[0].ContractMainProdDescr);
							context.byId("idTextContactType").setText(contractTypeDesc);
						}

					} else {
						var resourceI18n = context.getModel("i18n");
						if (controlID === "contractItemId-edit") {
							context.byId(controlID).setValue(resourceI18n.getProperty("txtMsgEmptyContractItem"));
							context.getModel("SRS_Data_UserSet").setProperty("/AvailableCallOffDays", "0");
							if (SRModel.StatusCode === models.STATUS_APPROVED && context.getModel("buttonControlModel").getProperty("/isEdit")) {
								context.byId(controlID).setValueState("Error");
								context.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
								MessageBox.error("Please select valid contract");
							}
							models.deleteContractWithinItems(context,controlID);
						} else {
							context.byId(controlID).setValue(resourceI18n.getProperty("txtMsgEmptyContract"));
							context.byId("contractItemId-edit").setValue(resourceI18n.getProperty("txtMsgEmptyContractItem"));
							context.getModel("SRS_Data_UserSet").setProperty("/AvailableCallOffDays", "0");
							models.deleteContractWithinItems(context,controlID);
						}
					}
					context.byId(controlID).setBusy(false);
					models.applyBrowserAutoFillOff();
					//Workaround  current drop-down issue in scope section
					//models.tempSolutionforDropDownIssue();

				}.bind(context),
				error: function (err) {
					context.byId(controlID).setBusy(false);
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
				}.bind(context)
			});
		},
		deleteContractWithinItems: function(context,contractControlId){
            var srItemsModel = context.getModel("servicerequestItemsModel");
            if(srItemsModel && srItemsModel.getData()){
                var srItemsData = srItemsModel.getData();
                for(var i=0;i<srItemsData.length;i++){
                    if(srItemsData[i].ItemNo === this.SR_ITEM_10){
                        if(contractControlId === "contractItemId-edit"){
                            srItemsData[i].ContractItemID = "";
                        }else{
                            srItemsData[i].ContractID = "";
                            srItemsData[i].ContractItemID = "";
                        }   
                        break;
                    }
                }
            }
        },
		setTxtMsgWorkAtRisk: function (context, contractID, contractItemID) {
			var SRItems = context.getModel("servicerequestItemsModel").getData();
			var txtMsg = "Warning: Contract has not been signed yet. Work@Risk Item: ";
			if (SRItems && SRItems.length > 0) {
				if (contractItemID) {
					contractItemID = contractItemID.replace(/\b0+/g, '');
				}
				txtMsg += contractID + " / " + contractItemID;
			}
			context.getModel("buttonControlModel").setProperty("/txWorkAtRisk", txtMsg);
		},
		getSystems: function (context, entitySet, data, clientModel, controlID, shallAppendSolmanAtBotton) {
			context.byId(controlID).setBusy(true);
			context.byId(controlID).setNoData("Please wait while systems are loading...");
			context.byId("filterbar").setSearchEnabled(false);
			var arrFilter = [];
			var requestFilter;
			if (data) {
				if (data.Customer) {
					arrFilter.push(this.filterCondition_Equal("Customer", data.Customer));
				}
				if (data.InstNo) {
					arrFilter.push(this.filterCondition_Contains("InstNo", data.InstNo));
				}
				if (data.Sid) {
					arrFilter.push(this.filterCondition_Contains("Sid", data.Sid));
				}
				if (data.relatedPartner) {
					arrFilter.push(this.filterCondition_Equal("PartnerRelFlag", data.relatedPartner));
				}

				if (data.CarSysRole) {
					arrFilter.push(this.filterCondition_Equal("CarSysRole", data.CarSysRole));
				}

				if(data.SessionID){
					arrFilter.push(this.filterCondition_Equal("SessionProductID", data.SessionID));
				}

				if(data.DeletionFlag && data.DeletionFlag !== "ALL"){
					arrFilter.push(this.filterCondition_Equal("DeletionFlag", data.DeletionFlag));
				}

				//arrFilter.push(this.filterCondition_Equal("DeletionFlag", "N"));

				requestFilter = this.filterComparison_AND(arrFilter);
			}
			var ReferenceObjectsModel = context.getModel("ReferenceObjectsModel").getData();
			var that = this;
			context.getModel("SRS_Data").read(entitySet, {
				filters: [requestFilter],
				success: function (oData) {
					context.byId("filterbar").setSearchEnabled(true);
					var systems = that.removeDuplicateSystems(oData.results, shallAppendSolmanAtBotton, ReferenceObjectsModel);
					context.setModel(new JSONModel(systems), clientModel);
					if (controlID != "systemTable") {
						if (data.ReferenceSystemID && context.getModel("servicerequestModel").getData().CaseID) {
							context.byId(controlID).setSelectedKey(data.ReferenceSystemID);
						} else {
							context.byId(controlID).setSelectedKey(null);
						}
					} else {
						context.byId("systemTable").setModel(new JSONModel(systems));
						context.byId("titleSystemTable").setText("Systems (" + systems.length + ")");
						that.setSystemVisibleRowCount(context);
					}
					context.byId(controlID).setBusy(false);
					that.applyBrowserAutoFillOff();
					context.byId(controlID).setNoData("No System Found");
				}.bind(context),
				error: function (err) {
					context.byId("filterbar").setSearchEnabled(true);
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					context.byId(controlID).setBusy(false);
					that.applyBrowserAutoFillOff();
				}.bind(context)
			});
		},
		getDeliveryTeams: function (context, entitySet, filterPath, clientModel,ServiceRequestID) {
			var models = this;
			var arrFilter = [];
			if (ServiceRequestID) {
				arrFilter.push(this.filterCondition_Equal("SrID", ServiceRequestID));
			}
			context.getModel("SRS_Data").read(entitySet, {
				groupId: "DeliveryTeams",
				filters: arrFilter,
				success: function (oData) {
					var delTeams = models.removeDuplicateDeliveryTeams(oData.results);
					context.setModel(new JSONModel(delTeams), clientModel);
				}.bind(context),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
				}.bind(context)
			});
		},
		removeDuplicateDeliveryTeams: function (arrDeliveryTeams) {
			var filteredDT = [];
			var doesDTExist = false;
			for (var i = 0; i < arrDeliveryTeams.length; i++) {
				doesDTExist = false;
				if (filteredDT.length === 0) {
					filteredDT.push(arrDeliveryTeams[i]);
				} else {
					for (var j = 0; j < filteredDT.length; j++) {
						if (filteredDT[j].TeamID === arrDeliveryTeams[i].TeamID) {
							doesDTExist = true;
							break;
						}
					}
					if (!doesDTExist) {
						filteredDT.push(arrDeliveryTeams[i]);
					}
				}
			}
			return filteredDT;
		},
		removeDuplicateDR: function (deploymentRooms) {
			var filteredDR = [];
			var doesDRExist = false;
			for (var i = 0; i < deploymentRooms.length; i++) {
				doesDRExist = false;
				if (filteredDR.length === 0) {
					filteredDR.push(deploymentRooms[i]);
				} else {
					for (var j = 0; j < filteredDR.length; j++) {
						if (filteredDR[j].DrName === deploymentRooms[i].DrName) {
							doesDRExist = true;
							break;
						}
					}
					if (!doesDRExist) {
						filteredDR.push(deploymentRooms[i]);
					}
				}
			}
			return filteredDR;
		},
		removeDuplicateSessions: function (arrSession) {
			var filteredArray = [];
			var doesSessionExist = false;
			for (var i = 0; i < arrSession.length; i++) {
				doesSessionExist = false;
				if (filteredArray.length === 0) {
					filteredArray.push(arrSession[i]);
				} else {
					for (var j = 0; j < filteredArray.length; j++) {
						if (filteredArray[j].ComponentId === arrSession[i].ComponentId) {
							doesSessionExist = true;
							break;
						}
					}
					if (!doesSessionExist) {
						filteredArray.push(arrSession[i]);
					}
				}
			}
			return filteredArray;
		},
		removeDuplicateSessionsInMasterData: function (arrSession) {
			var filteredArray = [];
			var doesSessionExist = false;
			for (var i = 0; i < arrSession.length; i++) {
				doesSessionExist = false;
				if (filteredArray.length === 0) {
					filteredArray.push(arrSession[i]);
				} else {
					for (var j = 0; j < filteredArray.length; j++) {
						if (filteredArray[j].ComponentId === arrSession[i].ComponentId && filteredArray[j].ProductID === arrSession[i].ProductID) {
							doesSessionExist = true;
							break;
						}
					}
					if (!doesSessionExist) {
						filteredArray.push(arrSession[i]);
					}
				}
			}
			return filteredArray;
		},
		getServiceOrderGroup: function (context, filters, setServiceOrderGroupInputValueState, entitySet, clientModel) {
			var that = this;
			if (context.byId("SOGTable") !== undefined) {
				context.byId("SOGTable").setBusy(true);
			}
			context.getModel("SRS_Data").read(entitySet, {
				filters: filters,
				success: function (oData) {
					context.setModel(new JSONModel(oData.results), clientModel);
					if (context.byId("titleSOGTable") !== undefined) {
						context.byId("titleSOGTable").setText(context.getResourceBundle().getText("serviceOrderGroupsTitle") + " (" + oData.results.length +
							")");
					}
					if (setServiceOrderGroupInputValueState) {
						var isShowWarning = false;
						if (oData.results.length > 0) {
							for (var i = 0; i < oData.results.length; i++) {
								if (context.byId("idServiceOrderGroupInput").getValue().trim() === oData.results[i].Description) {
									isShowWarning = false;
									break;
								} else {
									isShowWarning = true;
								}
							}
						} else {
							isShowWarning = true;
						}
						if (!isShowWarning) {
							context.byId("idServiceOrderGroupInput").setValueState("None");
						} else {
							context.byId("idServiceOrderGroupInput").setValueState("Warning");
							context.byId("idServiceOrderGroupInput").setValueStateText(context.getResourceBundle().getText("serviceOrderGroupWarning"));
						}
					}
					that.applyBrowserAutoFillOff();
					if (context.byId("SOGTable") !== undefined) {
						context.byId("SOGTable").setBusy(false);
					}
				}.bind(context),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					if (context.byId("SOGTable") !== undefined) {
						context.byId("SOGTable").setBusy(false);
					}
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					that.applyBrowserAutoFillOff();
				}.bind(context)
			});
		},
		getProductSetForMainView: function (context, entitySet, sorter, clientModel, productParams,selectedServiceSetToReloadScopingTeam) {
			var modelContext = this;
			context.getModel("busyIndicatorModel").setProperty("/serviceDropDown", true);
			context.getModel("SRS_Data").read(entitySet, {
				sorters: [new sap.ui.model.Sorter(sorter, false, false, null)],
				success: function (oData) {
					var results = modelContext.filterProductSet(oData.results);
					for(var i=0;i<results.length;i++){
						results[i].ProductText = modelContext.capitalizeString(results[i].ProductText);
					}
					context.setModel(new JSONModel(results), clientModel);
					modelContext.addBrandVoiceTextForService(context);
					context.getModel("busyIndicatorModel").setProperty("/serviceDropDown", false);
				}.bind(context),
				error: function () {
					context.getModel("busyIndicatorModel").setProperty("/serviceDropDown", false);
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
				}.bind(context)
			});
		},
		getProductSet: function (context, entitySet, sorter, clientModel, productParams,selectedServiceSetToReloadScopingTeam,customerId) {
			var modelContext = this;
			var hostURL = context.getModel("SRS_Data").sServiceUrl;
			var productSetModel = new JSONModel(hostURL + "/CustomerSet('"+customerId+"')/toProducts");
			context.getModel("buttonControlModel").setProperty("/busyIndicatorServiceDropdown",true);
			productSetModel.attachRequestCompleted(function (resp) {
				if (resp.getParameters("success").success) {
					var results = modelContext.filterProductSet(productSetModel.getData().d.results);
					for(var i=0;i<results.length;i++){
						results[i].ProductText = modelContext.capitalizeString(results[i].ProductText);
					}
					context.setModel(new JSONModel(results), clientModel);
					modelContext.addBrandVoiceTextForService(context);
					var ServiceId, SessionId;
					if (productParams) {
						if (productParams.includes("-")) {
							productParams = productParams.split("-");
							ServiceId = productParams[0];
							if (productParams[1] && productParams[1] !== "0") {
								SessionId = productParams[1];
							}
						} else {
							ServiceId = productParams;
						}
						var oEventBus = sap.ui.getCore().getEventBus();
						oEventBus.publish("eventSetNewServiceAndSession", "eventSetNewServiceAndSession", [ServiceId, SessionId]);
					}

					if(selectedServiceSetToReloadScopingTeam && !productParams){
						modelContext.findProductAndReloadScopingTeamForPreferredSuccessService(context,selectedServiceSetToReloadScopingTeam.ServiceID,selectedServiceSetToReloadScopingTeam.RegionID,selectedServiceSetToReloadScopingTeam.SrID);
					}
				} else {
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					modelContext.showErrorMessage(context, resp.getParameters().errorobject);
				}
				context.getModel("buttonControlModel").setProperty("/busyIndicatorServiceDropdown",false);
			});

		},
		filterProductSet: function (productSet) {
			var productsToRemove = "9500010,9500011,9500012,9500013,9500014,9500102,9500242,9500771";
			var filteredProducts = [];
			if (productSet) {
				for (var i = 0; i < productSet.length; i++) {
					var productText = productSet[i].ProductText;
					if (!productsToRemove.includes(productSet[i].ProductID) && !productText.includes("CQC")) {
						filteredProducts.push(productSet[i]);
					}
				}
			}
			return filteredProducts;
		},
		getNotesSet: function (context, entitySet, sServiceRequestId, sNoteType, clientModel) {
			var that = this;
			if(sNoteType===this.CANCELLATION_NOTE_TYPE){
				context.getModel("buttonControlModel").setProperty("/showBusyForCancellationPopoverTextArea",true);
			}
			context.getModel("SRS_Data").read(entitySet, {
				filters: [new sap.ui.model.Filter("ServiceRequestID", sap.ui.model.FilterOperator.EQ, sServiceRequestId),
					new sap.ui.model.Filter("Langu", sap.ui.model.FilterOperator.EQ, "EN"),
					new sap.ui.model.Filter("NoteType", sap.ui.model.FilterOperator.EQ, sNoteType)
				],
				groupId: "NoteSet" + sNoteType,
				success: function (oData) {
					var noteSetModel;
					if (clientModel === "serviceRequestScopeModel") {
						noteSetModel = {
							Text: "",
							data: oData.results,
							isServiceRequestInfoChanged: "false"
						};
					} else if (clientModel === "agreedServiceRequestScopeModel") {
						noteSetModel = {
							Text: "",
							data: oData.results,
							isAgreedScopeChanged: "false"
						};
					} else {
						noteSetModel = {
							Text: "",
							data: oData.results,
						};
					}

					if(sNoteType===that.CANCELLATION_NOTE_TYPE){
						context.getModel("buttonControlModel").setProperty("/showBusyForCancellationPopoverTextArea",false);
					}

					context.setModel(new JSONModel(noteSetModel), clientModel);
					var oEventBus = sap.ui.getCore().getEventBus();
					if (sNoteType === 'ZSQ1' && oData.results[0] && oData.results[0].Text !== "") {
						oEventBus.publish("setServiceRequestScope", "setServiceRequestScopeSuccess");
					}
					if (sNoteType === 'ZASR' && oData.results[0] && oData.results[0].Text !== "") {
						oEventBus.publish("setAgreedScope", "setAgreedScopeSuccess");
					}
					that.applyBrowserAutoFillOff();
				}.bind(context),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					that.applyBrowserAutoFillOff();
				}.bind(context)
			});
		},
		getServiceOrderStatusModel: function (context, isCalledAfterSOcreated, serviceOrderId, clientModel,
			isRefreshedAfterSOCreationFailDialog) {
			var that = this;
			context.showBusyDialog();
			context.getModel("SRS_Data").read("/ServiceOrderSet('" + serviceOrderId + "')", {
				groupId: "ServiceOrderSet",
				success: function (oData) {
					context.setModel(new JSONModel(oData), clientModel);
					context.hideBusyDialog();
					// if (isCalledAfterSOcreated) {
					var isUserTQM = context.getModel("SRS_Data_UserSet").getProperty("/isTQM");
					var serviceOrderTQMMessage = "";
					var serviceRequestUpdatedTxt = "<p>Service Request " + context.getModel("servicerequestModel").getData().ServiceRequestID +
						" has been successfully updated and became a final read-only document.<br/>If you are planning similar services in future, you can create a copy of your existing Service Requests and submit them for scoping.</p>";
					var msgTxt = "";
					if (oData.StatusCode === that.SO_STATUS_NEW) {
						if (isRefreshedAfterSOCreationFailDialog) {
							serviceOrderTQMMessage = "has been created but did NOT go into staffing (status: <b>New</b>) and <b>needs your action</b>." +
								serviceRequestUpdatedTxt;
						} else {
							serviceOrderTQMMessage =
								"created from this Service Request <b>needs attention</b> as it is in status <b>New</b> (i.e., not in Staffing).";
						}
					} else if (oData.StatusCode === that.SO_STATUS_DELIVERY_PREP && isCalledAfterSOcreated) {
						serviceOrderTQMMessage = "has been created and already <b>went into staffing</b>." + serviceRequestUpdatedTxt;
					} else if ((oData.StatusCode === that.SO_STATUS_DELIVERY_CONFIRMED ||
							oData.StatusCode === that.SO_STATUS_DELIVERED ||
							oData.StatusCode === that.SO_STATUS_CANCELED ||
							oData.StatusCode === that.SO_STATUS_PLANNING ||
							oData.StatusCode === that.SO_STATUS_RESTRICTED ||
							oData.StatusCode === that.SO_STATUS_DRAFT) && isCalledAfterSOcreated) {
						serviceOrderTQMMessage = "has been created and is <b>available for your review</b>." + serviceRequestUpdatedTxt;
					}
					if (serviceOrderTQMMessage !== "") {
						msgTxt = "<div>Service Order <b><a target='_blank' href=" + that.SONavigationLink(isUserTQM, context.getModel(
								"servicerequestModel").getData().ServiceOrderID, context.getModel("servicerequestModel").getData().SerivceOrderURL, context) +
							" class=&quot;classLinkSO&quot;>" + context.getModel("servicerequestModel").getData().ServiceOrderID +
							"</a> </b>" + serviceOrderTQMMessage + "</div>";
						that.showSRCreationAndUpdateMessage(context, msgTxt, oData.StatusCode);
					}
					// }
				}.bind(context),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
				}.bind(context)
			});
		},
		setSRS_Data_UserSet: function (dataObject, context) {
			var IsScoper = false;
			var IsTQM = false;
			var IsApprover = false;
			var IsGuest = false;
			var userId = "";
			var timezone = "";
			var userName = "";
			var lastName, firstName;
			var backendSystem, NoUserTzMaintained;
			var canTQMCreateSO = false;
			var canScoperCreateSO = false;
			for (var i = 0; i < dataObject.length; i++) {
				userId = dataObject[i].UserID;
				userName = dataObject[i].BpNameFirst + " " + dataObject[i].BpNameLast;
				lastName = dataObject[i].BpNameLast;
				firstName = dataObject[i].BpNameFirst;
				timezone = dataObject[i].TimeZone;
				NoUserTzMaintained = dataObject[i].NoUserTzMaintained;
				if (dataObject[i].__metadata && dataObject[i].__metadata.id) {
					backendSystem = dataObject[i].__metadata.id;
				}
				if (dataObject[i].UserRole === "IS_TQM") {
					IsTQM = true;
					canTQMCreateSO = dataObject[i].CanCreateZSK1;
				} else if (dataObject[i].UserRole === "IS_SCOPER") {
					IsScoper = true;
					canScoperCreateSO = dataObject[i].CanCreateZSK1;
				} else if (dataObject[i].UserRole === "IS_APPROVER") {
					IsApprover = true;
				} else if (dataObject[i].UserRole === "IS_GUEST") {
					IsGuest = true;
				}
			}

			var SRfilters, selectedStatus = [];

			if (IsTQM) {
				var filter1 = this.filterCondition_Equal("OwnerUser", userId);
				var filter2 = this.filterComparison_OR([this.filterCondition_Equal("StatusCode", this.STATUS_NEW), this.filterCondition_Equal(
						"StatusCode", this.STATUS_VIOLATED), this.filterCondition_Equal("StatusCode", this.STATUS_INSCOPING), this.filterCondition_Equal(
						"StatusCode", this.STATUS_INEXCEPTION), this.filterCondition_Equal("StatusCode", this.STATUS_APPROVED),
					this.filterCondition_Equal("StatusCode", this.STATUS_AUTHORACTION)
				]);

				selectedStatus.push(this.STATUS_NEW);
				selectedStatus.push(this.STATUS_VIOLATED);
				selectedStatus.push(this.STATUS_INSCOPING);
				selectedStatus.push(this.STATUS_INEXCEPTION);
				selectedStatus.push(this.STATUS_APPROVED);
				selectedStatus.push(this.STATUS_AUTHORACTION);

				SRfilters = this.filterComparison_AND([filter1, filter2]);
			} else {
				if (IsApprover || (IsApprover && IsScoper)) {
					SRfilters = this.filterComparison_AND([this.filterCondition_Equal("ProcessorUser", userId), this.filterCondition_Equal(
						"StatusCode", this.STATUS_INEXCEPTION)]);
					selectedStatus.push(this.STATUS_INEXCEPTION);
				} else if (IsScoper && !IsApprover) {
					SRfilters = this.filterComparison_OR([this.filterCondition_Equal("StatusCode", this.STATUS_INSCOPING), this.filterCondition_Equal(
						"StatusCode", this.STATUS_INEXCEPTION)]);
					selectedStatus.push(this.STATUS_INSCOPING);
					selectedStatus.push(this.STATUS_INEXCEPTION);
				} else if (IsGuest && !IsTQM && !IsApprover && !IsScoper) {
					SRfilters = this.filterComparison_OR([this.filterCondition_Equal("StatusCode", this.STATUS_NEW), this.filterCondition_Equal(
							"StatusCode", this.STATUS_VIOLATED), this.filterCondition_Equal("StatusCode", this.STATUS_INSCOPING), this.filterCondition_Equal(
							"StatusCode", this.STATUS_INEXCEPTION), this.filterCondition_Equal("StatusCode", this.STATUS_APPROVED),
						this.filterCondition_Equal("StatusCode", this.STATUS_AUTHORACTION)
					]);
					selectedStatus.push(this.STATUS_NEW);
					selectedStatus.push(this.STATUS_VIOLATED);
					selectedStatus.push(this.STATUS_INSCOPING);
					selectedStatus.push(this.STATUS_INEXCEPTION);
					selectedStatus.push(this.STATUS_APPROVED);
					selectedStatus.push(this.STATUS_AUTHORACTION);
				}
			}
			context.getModel("SRS_Data_UserSet").setData({
				isTQM: IsTQM,
				isApprover: IsApprover,
				isScoper: IsScoper,
				isGuest: IsGuest,
				userFilter: SRfilters,
				isCreatingNewSR: false,
				timezone: timezone,
				customerId: "",
				userId: userId,
				userName: userName,
				selectedStatus: selectedStatus,
				firstName: firstName,
				lastName: lastName,
				backendSystem: backendSystem,
				NoUserTzMaintained: NoUserTzMaintained,
				AvailableCallOffDays: "",
				RequestedDeliveryDate: null,
				canTQMCreateSO: canTQMCreateSO,
				canScoperCreateSO: canScoperCreateSO
			});

			var busyIndicatorModel = {
				"deploymentRoom": false,
				"itemsTable": false,
				"approvalRulesTable": false,
				"attachmentBusyIndicator": false,
				"serviceDropDown":false
			};

			context.setModel(new JSONModel(busyIndicatorModel), "busyIndicatorModel");
		},
		getCustomerByPageNumber: function (context, pageNumber) {
			context.byId("srs_customertable").setBusy(true);
			var sCustomer = context.getModel("customerSearchModel").getProperty("/customer");
			var that = this;
			var filterString = [];

			if (sCustomer !== "") {
				filterString = "substringof('" + sCustomer + "',CustomerSearch)";
			}
			context.getModel("SRS_Data").read("/CaseSet", {
				urlParameters: {
					"$skip": pageNumber * 10,
					"$top": "10",
					"$filter": filterString,
					"$inlinecount": "allpages"
				},
				success: function (oData) {
					if (oData.results.length) {
						var currentPage = pageNumber * 10 + 10;
						// last page set the more button to invisile
						if (currentPage > oData.__count) {
							currentPage = oData.__count;
							context.getModel("buttonControlModel").setProperty("/customerMoreButton", false);
						}
						//update current result
						var arrayData = context.getModel("customerModel").getProperty("/data").concat(oData.results);
						context.getModel("customerModel").setProperty("/data", arrayData);
						context.getModel("customerModel").setProperty("/current", currentPage);
						context.getModel("customerModel").setProperty("/total", oData.__count);
					}
					context.byId("srs_customertable").setBusy(false);
					that.applyBrowserAutoFillOff();
				}.bind(context),
				error: function () {
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorTextForCase"));
					context.getModel("buttonControlModel").setProperty("/customerMoreButton", false);
					context.byId("srs_customertable").setBusy(false);
					that.applyBrowserAutoFillOff();
				}.bind(context)
			});
		},
		getCaseByPageNumber: function (context, pageNumber) {
			context.byId("srs_casetable").setBusy(true);
			var sCase = context.byId("srs_case").getValue();
			var sCustomer = context.byId("srs_customer").getValue();
			var sOwner = context.getModel("caseSearchModel").getProperty("/ownerId");
			var filterString = [];
			var that = this;
			if (sCase !== "") {
				filterString.push("substringof('" + sCase + "',CaseSearch)");
			}
			if (sCustomer !== "") {
				filterString = "substringof('" + sCustomer + "',CustomerSearch)";
			}
			if (sOwner !== "") {
				filterString.push("substringof('" + sOwner + "',OwnerSearch)");
			} // add owner filter string
			context.getModel("buttonControlModel").setProperty("/enableShowMoreBtnInCaseSearch",false);
			context.getModel("buttonControlModel").setProperty("/enableCaseSearchBtn",false);
			context.getModel("SRS_Data").read("/CaseSet", {
				urlParameters: {
					"$skip": pageNumber * 10,
					"$top": "10",
					"$filter": filterString,
					"$inlinecount": "allpages"
				},
				success: function (oData) {
					if (oData.results.length) {
						var currentPage = pageNumber * 10 + 10;
						// last page set the more button to invisile
						if (currentPage > oData.__count) {
							currentPage = oData.__count;
							context.getModel("buttonControlModel").setProperty("/caseMoreButton", false);
						}
						//update current result
						var arrayData = context.getModel("caseModel").getProperty("/data").concat(oData.results);
						context.getModel("caseModel").setProperty("/data", arrayData);
						context.getModel("caseModel").setProperty("/current", currentPage);
						context.getModel("caseModel").setProperty("/total", oData.__count);
					}
					context.byId("srs_casetable").setBusy(false);
					context.getModel("buttonControlModel").setProperty("/enableShowMoreBtnInCaseSearch",true);
					context.getModel("buttonControlModel").setProperty("/enableCaseSearchBtn",true);
					that.applyBrowserAutoFillOff();
				}.bind(context),
				error: function () {
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorTextForCase"));
					context.getModel("buttonControlModel").setProperty("/caseMoreButton", false);
					context.byId("srs_casetable").setBusy(false);
					that.applyBrowserAutoFillOff();
				}.bind(context)
			});
		},
		filterCondition_Equal: function (fPath, value) {
			var oFilter = new Filter({
				path: fPath,
				operator: sap.ui.model.FilterOperator.EQ,
				value1: value
			});
			return oFilter;
		},

		filterCondition_Contains: function (fPath, value) {
			var oFilter = new Filter({
				path: fPath,
				operator: sap.ui.model.FilterOperator.Contains,
				value1: value
			});
			return oFilter;
		},

		filterCondition_StartsWith: function (fPath, value) {
			var oFilter = new Filter({
				path: fPath,
				operator: sap.ui.model.FilterOperator.StartsWith,
				value1: value
			});
			return oFilter;
		},

		filterCondition_EndsWith: function (fPath, value) {
			var oFilter = new Filter({
				path: fPath,
				operator: sap.ui.model.FilterOperator.EndsWith,
				value1: value
			});
			return oFilter;
		},

		filterCondition_GreaterThanEquals: function (fPath, value) {
			var oFilter = new Filter({
				path: fPath,
				operator: sap.ui.model.FilterOperator.GE,
				value1: value
			});
			return oFilter;
		},
		filterCondition_LessThanEquals: function (fPath, value) {
			var oFilter = new Filter({
				path: fPath,
				operator: sap.ui.model.FilterOperator.LE,
				value1: value
			});
			return oFilter;
		},
		filterComparison_OR: function (filter) {
			var oFilter = new Filter({
				filters: filter,
				and: false
			});
			return oFilter;
		},
		filterComparison_AND: function (filter) {
			var oFilter = new Filter({
				filters: filter,
				and: true
			});
			return oFilter;
		},
		getSystemLandscapeInfo: function () {
			var sSystem = this.BACKND_SYS_ICD; // Default - Dev
			if (window.location.host.toLowerCase().includes("prod-elephant")) {
				sSystem = this.BACKND_SYS_ICP;
			} else if (window.location.host.toLowerCase().includes("test-echidna")) {
				sSystem = this.BACKND_SYS_ICT;
			}
			return sSystem;
		},
		showUnAuthorizedMessage: function (context) {
			var resourceI18n = context.getModel("i18n");
			var sSystem = this.getSystemLandscapeInfo();
			var htmlTxt =
				"<div><p>As a first-time user, please select one of the following options to request access to SRS App:</p><ul><li>As a <strong>Service Requester</strong>, you need to submit a service request for your customer and want to use SRS App for a smooth service request scoping process. <a target='_blank' href='" +
				this.ARM_Link + sSystem + this.TQM_PROFILE +
				"'>Click here to request a Service Requester role</a></li><li>As a <strong>services and support expert</strong>, you work with Service Requestors on scoping their service requests. <a target='_blank' href='" +
				this.ARM_Link + sSystem + this.SCOPER_PROFILE +
				"'>Click here to request a Scoping role</a><li>If none of the above applies to you, <a target='_blank' href='" + this.ARM_Link +
				sSystem + this.GUEST_PROFILE +
				"'>click here to request a Guest role</a> for display-only access to SRS App.</li></ul><p>For additional guidance, please contact your regional Virtual Project Room (VPR).</p><p><u><a target='_blank' href='https://sap.sharepoint.com/teams/SRSApp'>Your SRS App Team</a></u></p></div>";
			var dialog = new sap.m.Dialog({
				title: resourceI18n.getProperty("txtDialogHeading"),
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
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.addStyleClass(context.getOwnerComponent().getContentDensityClass());
			dialog.open();
		},
		showSRCreationAndUpdateMessage: function (context, htmlTxt, sSOStatusCode) {

			var dialogState = "Success";
			var resourceI18n = context.getModel("i18n");
			var dialogTitle = resourceI18n.getProperty("txtSRMsgBoxTitle");
			if (sSOStatusCode === this.STATUS_VIOLATED || sSOStatusCode === this.STATUS_INEXCEPTION || sSOStatusCode === this.SO_STATUS_NEW) {
				dialogState = "Warning";
				dialogTitle = resourceI18n.getProperty("txtSRMsgBoxTitleWarning");
			}

			var dialog = new sap.m.Dialog({
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
				endButton: new sap.m.Button({
					text: 'Ok',
					type: 'Emphasized',
					press: function () {
						dialog.destroy();
					}.bind(context)
				}).addStyleClass(context.getOwnerComponent().getContentDensityClass()),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.addStyleClass(context.getOwnerComponent().getContentDensityClass());
			dialog.open();
		},
		showSRCreationAndUpdateMessageForStatusNew: function (context, htmlTxt, isValid, sServiceRequestId) {
			var resourceI18n = context.getModel("i18n");
			var oEventBus = sap.ui.getCore().getEventBus();
			var contextModel = this;
			var dialog;
			var sendForScopingButton;
			if (isValid) {
				sendForScopingButton = new sap.m.Button({
					text: resourceI18n.getProperty("sendServiceRequestForScoping"),
					type: 'Emphasized',
					press: function () {
						oEventBus.publish("onSendForScoping", "onSendForScopingSuccess");
						dialog.destroy();
					}.bind(context)
				});
			}
			/*var dialogWidth = "100%";
			if(sap.ui.Device.system.phone){
				dialogWidth = "";
			}*/
			dialog = new sap.m.Dialog({
				title: resourceI18n.getProperty("txtSRMsgBoxTitle"),
				type: 'Message',
				state: 'Success',
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
				buttons: [
					sendForScopingButton,
					new sap.m.Button({
						text: resourceI18n.getProperty("continueEditingBtnTxt"),
						type: (isValid === false ? 'Emphasized' : 'Default'),
						press: function () {
							oEventBus.publish("toggleEditDisplay", "toggleEditDisplaySuccess");
							var userProfile = context.getModel("SRS_Data_UserSet").getData();
							var model = context.getModel("serviceRequestScopeModel");
							contextModel.setServiceRequestInfoTemplate(userProfile, model,context);
							dialog.destroy();
						}.bind(context)
					}),
					new sap.m.Button({
						text: resourceI18n.getProperty("txtCompleteSRbtn"),
						press: function () {
							dialog.destroy();
						}.bind(context)
					})
				],
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.addStyleClass(context.getOwnerComponent().getContentDensityClass());
			dialog.open();
		},
		showErrorMessage: function (context, error) {
			var errorMessage = "Oops, something went wrong. Please try again later.";
			var resourceI18n = context.getModel("i18n");
			try {
				if (error.responseText) {
					if (JSON.parse(error.responseText).error && JSON.parse(error.responseText).error.code === "ZS_APP_OBJECTS/003") {
						errorMessage = resourceI18n.getProperty("txtClosedCaseError");
					} else if (JSON.parse(error.responseText).error && JSON.parse(error.responseText).error.code === "ZS_APP_SRS/003") {
						this.showUnAuthorizedMessage(context);
						return;
					} else if (JSON.parse(error.responseText).error && JSON.parse(error.responseText).error.code === "ZS_APP_OBJECTS/050") {
						errorMessage = resourceI18n.getProperty("txtMsgItemsError");
					} else {
						errorMessage = JSON.parse(error.responseText).error.message.value;
					}
				}
			} catch (errorSecond) {
				var parser = new DOMParser();
				var xmlDoc = parser.parseFromString(error.responseText, "text/xml");
				var erroJson = this.xml2json(xmlDoc);

				if (error.responseText) {
					if (erroJson.error !== undefined) {
						if (erroJson.error.code === "ZS_APP_OBJECTS/003") {
							errorMessage = resourceI18n.getProperty("txtClosedCaseError");
						} else if (erroJson.error.code === "ZS_APP_SRS/003") {
							this.showUnAuthorizedMessage(context);
							return;
						} else if (erroJson.error.code === "ZS_APP_OBJECTS/050") {
							errorMessage = resourceI18n.getProperty("txtMsgItemsError");
						} else {
							errorMessage = erroJson.error.message;
						}
					} else {
						errorMessage = 
							"Sorry, something snapped. This could be a server error or session time out. Note: To prevent data loss please open the Service Request Scoping app in a new tab and copy + paste your unsaved changes from here.";
					}
				}
			}
			context.setModel(new JSONModel({
				message: []
			}), "oErrorModel");
			var errorModelData = context.getModel("oErrorModel").getProperty("/message");
			errorModelData.push({
				value: errorMessage
			});
			var listview = new List({
				items: {
					path: '/message',
					template: new sap.m.StandardListItem({
						title: "{value}",
						wrapping: true
					})
				}
			});
			listview.setModel(context.getModel("oErrorModel"));
			var resourceBundle = context.getModel("i18n");
			var dialog = new Dialog({
				title: resourceBundle.getProperty("errorTitle"),
				type: 'Message',
				state: 'Error',
				content: listview,
				beginButton: new Button({
					text: resourceBundle.getProperty("close"),
					press: function () {
						dialog.close();
					}.bind(this)
				})
			});

			dialog.addStyleClass(context.getOwnerComponent().getContentDensityClass());
			dialog.open();
		},
		showErrorList: function (context) {
			var listview = new List({
				items: {
					path: '/message',
					template: new sap.m.StandardListItem({
						title: "{value}"
					})
				}
			});
			listview.setModel(context.getModel("errorModel"));
			var resourceBundle = context.getModel("i18n");
			var dialog = new Dialog({
				title: resourceBundle.getProperty("errorTitle"),
				type: 'Message',
				state: 'Error',
				content: listview,
				beginButton: new Button({
					text: resourceBundle.getProperty("close"),
					press: function () {
						dialog.close();
					}.bind(this)
				})
			});
		},
		xml2json: function (xml) {
			try {
				var obj = {};
				if (xml.children.length > 0) {
					for (var i = 0; i < xml.children.length; i++) {
						var item = xml.children.item(i);
						var nodeName = item.nodeName;

						if (typeof (obj[nodeName]) === "undefined") {
							obj[nodeName] = this.xml2json(item);
						} else {
							if (typeof (obj[nodeName].push) === "undefined") {
								var old = obj[nodeName];

								obj[nodeName] = [];
								obj[nodeName].push(old);
							}
							obj[nodeName].push(this.xml2json(item));
						}
					}
				} else {
					obj = xml.textContent;
				}
				return obj;
			} catch (e) {
				console.log(e.message);
			}
		},
		//save Check
		onCreateValidate: function (context) {
			if (context.getModel("servicerequestModel")) {
				var payload = context.getModel("servicerequestModel").getData();
				var missingField = "",
					count = 0;

				if (this.isServiceSelected && !this.isSessionSelected) {
					missingField = context.getResourceBundle().getText("session");
					count++;
					context.getModel("buttonControlModel").setProperty("/selectedMandtField", this.SessionID);
				}
				if (this.isEmpty(payload.RespDepID)) {
					missingField = context.getResourceBundle().getText("deploymentRoom");
					count++;
					context.getModel("buttonControlModel").setProperty("/selectedMandtField", this.RespDepID);
				}
				if (this.isEmpty(payload.RegionID)) {
					missingField = context.getResourceBundle().getText("region");
					count++;
					context.getModel("buttonControlModel").setProperty("/selectedMandtField", this.RegionID);
				}
				if (this.isEmpty(payload.Description)) {
					missingField = context.getResourceBundle().getText("servicerequestTitle");
					count++;
					context.getModel("buttonControlModel").setProperty("/selectedMandtField", this.Description);
				}
				if (this.isEmpty(payload.CaseID)) {
					missingField = context.getResourceBundle().getText("Case");
					count++;
					context.getModel("buttonControlModel").setProperty("/selectedMandtField", this.CaseID);
				}
				
				if (missingField) {
					this.showMandtFieldsTxtMsg(context, missingField, count);
				}
				var invalidItemDatesExist = false; 
				if(context.getModel("servicerequestItemsModel")){
					var srItems = context.getModel("servicerequestItemsModel").getData();
					for(var i=0;i<srItems.length;i++){
						if(srItems[i].EndDate < srItems[i].StartDate){
							invalidItemDatesExist = true;
							break;
						}
					}
				}

				if(!missingField && invalidItemDatesExist){
					var txt = "Invalid start/end dates for items." ;
					context.getModel("buttonControlModel").setProperty("/selectedMandtField", this.SRItemsDates);
					context.getModel("buttonControlModel").setProperty("/visibleTxtMandatoryField", true);
					context.getModel("buttonControlModel").setProperty("/txtMandatoryField", txt);
				}

				if (!this.isEmpty(payload.CaseID) && payload.Description && !this.isEmpty(payload.Description.trim()) && !this.isEmpty(payload.RegionID) &&
					!this.isEmpty(
						payload.RespDepID) && !invalidItemDatesExist) {
					if (this.isServiceSelected && !this.isSessionSelected) {
						context.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
					} else {
						context.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", true);
						context.getModel("buttonControlModel").setProperty("/visibleTxtMandatoryField", false);
					}
				} else {
					context.getModel("buttonControlModel").setProperty("/createRequestButtonEnabled", false);
				}
			}
		},
		isEmpty: function (value) {
			if (value === null || value == "") {
				return true;
			} else {
				return false;
			}
		},
		sortByProperty: function (property) {
			return function (x, y) {
				return ((parseInt(x[property]) === parseInt(y[property])) ? 0 : ((parseInt(x[property]) > parseInt(y[property])) ? 1 : -1));
			};
		},
		sortByQualName: function () {
			return function (x, y) {
				return ((x.Value == y.Value) ? 0 : ((x.Value > y.Value) ? 1 : -1 ));
			};
		},
		sessionValiation: function (context) {
			var resourceBundle = context.getModel("i18n");

			if (this.isServiceSelected && !this.isSessionSelected) {
				var bCompact = !!context.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(
					resourceBundle.getProperty("txtMessageSession"), {
						actions: [sap.m.MessageBox.Action.CLOSE],
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
				return false;
			} else {
				return true;
			}
		},
		idAndNameFormatter: function (id, value) {
			if (id) {
				return "(" + id + ") " + value;
			}
			return value;
		},
		removeDuplicateSystems: function (arr, shallAppendSolmanAtBotton, ReferenceObjectsModel) {
			/*arr = arr.filter(function (item) {
				return item.DeletionFlag.toUpperCase() !== "Y";
			});*/
			var filteredArray = [];
			for (var i = 0; i < arr.length; i++) {
				if (filteredArray.length === 0) {
					arr[i]["shallAppendSolmanAtBotton"] = shallAppendSolmanAtBotton;
					arr[i]["doesSystemAlreadyExistInDropDown"] = false;
					filteredArray.push(arr[i]);
				} else {
					var doesSystemEntryExist = false;
					for (var j = 0; j < filteredArray.length; j++) {
						if (filteredArray[j].Sid === arr[i].Sid && filteredArray[j].SolmanSid === arr[i].SolmanSid && filteredArray[j].SystemUsage === arr[
								i].SystemUsage && filteredArray[j].InstNo === arr[i].InstNo && filteredArray[j].ReferenceProductID === arr[i].ReferenceProductID ) {
							doesSystemEntryExist = true;
							break;
						}
					}
					if (!doesSystemEntryExist) {
						arr[i]["shallAppendSolmanAtBotton"] = shallAppendSolmanAtBotton;
						arr[i]["doesSystemAlreadyExistInDropDown"] = false;
						filteredArray.push(arr[i]);
					}
				}
			}

			//Check if system already exist in reference objects
			var countAllRefObjCovered = 0;
			if (ReferenceObjectsModel.length > 0) {
				for (var k = 0; k < filteredArray.length; k++) {
					var refObjAlreadyExist = false;
					for (var j = 0; j < ReferenceObjectsModel.length; j++) {
						if (ReferenceObjectsModel[j].IbComponent === filteredArray[k].IbComponent && ReferenceObjectsModel[j].SolmanComponent ===
							filteredArray[k].SolmanComponent) {
							refObjAlreadyExist = true;
							countAllRefObjCovered++;
							break;
						}
					}
					if (refObjAlreadyExist) {
						filteredArray[k].doesSystemAlreadyExistInDropDown = true;
					}
					if (countAllRefObjCovered === ReferenceObjectsModel.length) {
						break;
					}
				}
			}

			filteredArray = this.sortJSONArrayByKey(filteredArray, "Sid");
			if (shallAppendSolmanAtBotton) {
				var newFilteredArrayWithSolman = [];
				var newFilteredArrayWithoutSolman = [];
				for (var i = 0; i < filteredArray.length; i++) {
					if (filteredArray[i].DeployModT.toUpperCase() === this.DeployModCloud) {
						newFilteredArrayWithSolman.push(filteredArray[i]);
					} else {
						if (filteredArray[i].SolmanSid) {
							newFilteredArrayWithSolman.push(filteredArray[i]);
						} else {
							newFilteredArrayWithoutSolman.push(filteredArray[i]);
						}
					}
				}

				newFilteredArrayWithSolman = this.sortJSONArrayByKey(newFilteredArrayWithSolman, "Sid");
				newFilteredArrayWithoutSolman = this.sortJSONArrayByKey(newFilteredArrayWithoutSolman, "Sid");
				var newFilteredArray = newFilteredArrayWithSolman.concat(newFilteredArrayWithoutSolman);
				return newFilteredArray;
			}
			return filteredArray;

		},
		getSRHeaderByID: function (context, serviceRequestId, oEventBus) {
			var modelContext = this;
			context.getModel("SRS_Data").read("/ServiceRequestHeaderSet('" + serviceRequestId + "')", {
				success: function (oData) {
					if (oData) {
						var newStatus = oData.StatusCode;
						context.getModel("servicerequestModel").getData().StatusCode = newStatus;
						oEventBus.publish("onSaveServiceRequest", "onSaveServiceRequestSuccess");
					}
				}.bind(context),
				error: function (error) {
					modelContext.showErrorMessage(context, error);
					sap.ui.core.BusyIndicator.hide();
				}.bind(context)
			});
		},
		setDetailPageFieldsToEdit: function (arr, context) {
			for (var i = 0; i < arr.length; i++) {
				var field = "/" + arr[i];
				context.getModel("editableFieldsModel").setProperty(field, true);
			}
		},
		setDetailPageFieldsToDisplay: function (arr, context) {
			for (var i = 0; i < arr.length; i++) {
				var field = "/" + arr[i];
				context.getModel("editableFieldsModel").setProperty(field, false);
			}
		},
		hideAllStatusButtons: function (context) {
			context.getModel("buttonControlModel").setProperty("/isSOCreated", false);
			context.getModel("buttonControlModel").setProperty("/isCancelSRVisible", false);
			context.getModel("buttonControlModel").setProperty("/isBackToAuthorVisible", false);
			context.getModel("buttonControlModel").setProperty("/isApproveScopeVisible", false);
			context.getModel("buttonControlModel").setProperty("/isReadyForScoping", false);
			context.getModel("buttonControlModel").setProperty("/requestApproval", false);
		},

		disableAddItemBtn: function (context, statusCode) {
			var session = context.getModel("servicerequestModel").getProperty("/SessionID");
			if (session === this.SESSION_READINESS_CHECK || statusCode === this.STATUS_APPROVED) {
				context.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
				context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", false);
			} else {
				var SRitems = context.getModel("servicerequestItemsModel");
				if (SRitems && SRitems.getData().length > 0) {
					context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", this.setDeleteAllButtonEnabled(SRitems.getData()));
					context.getModel("buttonControlModel").setProperty("/itemAddBtn", true);
				} else {
					context.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
				}
			}
		},

		overallBtnsAndFieldsValidations: function (statusCode, context) {
			this.hideAllStatusButtons(context);
			var userProfile = context.getModel("SRS_Data_UserSet").getData();

			if (userProfile.isGuest && !userProfile.isTQM && !userProfile.isScoper && !userProfile.isApprover) {
				context.getModel("buttonControlModel").setProperty("/isCopyVisible", false);
				this.StatusCANCELLEDCheck(context);
				return;
			}

			if (userProfile.isTQM) {
				context.getModel("buttonControlModel").setProperty("/isCopyVisible", true);
			}

			context.setModel(new JSONModel({
				"header": true,
				"items": true,
				"comments": true
			}), "SubmitEntityDuringSaveSRModel");

			context.getModel("buttonControlModel").setProperty("/showUploadDelete", true);

			switch (statusCode) {
			case this.STATUS_NEW:
				this.StatusNEWCheck(context);
				break;
			case this.STATUS_VIOLATED:
				this.StatusVIOLATEDCheck(context);
				break;
			case this.STATUS_INSCOPING:
				this.StatusINSCOPINGCheck(context);
				this.validationProcessorSameAsSROwner(context,userProfile);
				break;
			case this.STATUS_INEXCEPTION:
				this.StatusEXCEPTIONCheck(context);
				this.validationProcessorSameAsSROwner(context,userProfile);
				break;
			case this.STATUS_APPROVED:
				this.StatusAPPROVEDCheck(context);
				break;
			case this.STATUS_CANCELED:
				this.StatusCANCELLEDCheck(context);
				break;
			case this.STATUS_SOCREATED:
				this.StatusSOCREATEDCheck(context);
				break;
			case this.STATUS_AUTHORACTION:
				this.StatusAUTHORACTIONCheck(context);
				break;
			default:
				break;
			}

			this.disableAddItemBtn(context, statusCode);
		},

		validationProcessorSameAsSROwner: function(context,userProfile){
			var userId = context.getModel("SRS_Data_UserSet").getProperty("/userId");
			var OwnerUser = context.getModel("servicerequestModel").getProperty("/OwnerUser");
			if(userId === OwnerUser && userProfile.isTQM && userProfile.isScoper){
				context.getModel("editableFieldsModel").setProperty("/Processor",false);
				context.getModel("buttonControlModel").setProperty("/visibleProcessorInfoBtn",true);
			}else{
				context.getModel("buttonControlModel").setProperty("/visibleProcessorInfoBtn",false);

			}
		},

		StatusNEWCheck: function (context) {
			var userProfile = context.getModel("SRS_Data_UserSet").getData();

			//buttons check
			if (userProfile.isTQM) {
				context.getModel("buttonControlModel").setProperty("/isReadyForScoping", true);
				context.getModel("buttonControlModel").setProperty("/isCancelSRVisible", true);
			}

			//Fields Check
			var arrEdit, arrDisplay;
			if (userProfile.isTQM) {

				arrEdit = ["Case", "SRTitle", "DRegion", "GoLiveDate", "Timezone", "SRInfo", "Service",
					"Discussion", "SRItems", "CustomerContact", "DRoom"
				];

				//Contract Validation
				var contracts = context.getModel("contractSetModel").getData();
				if (contracts && contracts.length > 0) {
					arrEdit.push("Contract");
				}
				var contractItems = context.getModel("contractItemModel").getData();
				if (contractItems && contractItems.length > 0) {
					arrEdit.push("ContractItem");
				}

				var SRitems = context.getModel("servicerequestItemsModel");
				if (SRitems && SRitems.getData().length > 0) {
					context.getModel("buttonControlModel").setProperty("/itemAddBtn", true);
					context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", this.setDeleteAllButtonEnabled(SRitems.getData()));
					arrEdit.push("ReqDelDate");
				}
				arrDisplay = ["Processor", "Customer", "AgreedScope", "ExtRef"];

				var service = context.getModel("servicerequestModel").getProperty("/ServiceID");
				if (service) {
					arrEdit.push("Session");
					arrEdit.push("ReqDelDate");
					/*
					if (service === this.EOD_PRODUCT) {
						arrDisplay.push("OSPSystem");
					} else {
						arrEdit.push("OSPSystem");
					}*/
				} else {
					arrDisplay.push("Session");
					arrDisplay.push("ReqDelDate");
					//arrEdit.push("OSPSystem");
				}

				var referenceSystemID = context.getModel("servicerequestModel").getProperty("/ReferenceSystemID");
				/*
				if (referenceSystemID === this.OSP_SYSTEM_REFERENCESYSTEMID) {
					arrDisplay.push("System");
				} else {
					arrEdit.push("System");
				}*/
				arrEdit.push("System");

				//set SubmitSRModel
				this.setSubmitEntityDuringSaveSRModel(context, true, true, true);

			} else if (userProfile.isScoper) {
				arrEdit = ["Discussion"];
				arrDisplay = ["Case", "SRTitle", "DRegion", "DRoom", "System", "GoLiveDate", "Timezone", "SRInfo", "Service", "Session",
					"ReqDelDate", "Processor", "Customer", "CustomerContact", "AgreedScope", "Contract", "ContractItem", "SRItems",
					"ExtRef"
				];
				context.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
				context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", false);

				//set SubmitSRModel
				this.setSubmitEntityDuringSaveSRModel(context, false, false, true);

			} else if (userProfile.isApprover) {
				arrEdit = ["Discussion"];
				arrDisplay = ["Case", "SRTitle", "DRegion", "DRoom", "System", "GoLiveDate", "Timezone", "SRInfo", "Service", "Session",
					"ReqDelDate", "Processor", "Customer", "CustomerContact", "AgreedScope", "Contract", "ContractItem", "SRItems",
					"ExtRef"
				];
				context.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
				context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", false);

				//set SubmitSRModel
				this.setSubmitEntityDuringSaveSRModel(context, false, false, true);
			}

			this.setDetailPageFieldsToEdit(arrEdit, context);
			this.setDetailPageFieldsToDisplay(arrDisplay, context);
		},

		StatusVIOLATEDCheck: function (context) {
			var userProfile = context.getModel("SRS_Data_UserSet").getData();

			//buttons check
			if (userProfile.isTQM) {
				context.getModel("buttonControlModel").setProperty("/requestApproval", true);
				context.getModel("buttonControlModel").setProperty("/isCancelSRVisible", true);
			}

			//Fields Check
			var arrEdit, arrDisplay;
			if (userProfile.isTQM) {

				arrEdit = ["Case", "SRTitle", "DRegion", "GoLiveDate", "Timezone", "SRInfo", "Service", "Session",
					"Discussion", "SRItems", "CustomerContact", "DRoom"
				];

				//contract Validation
				var contracts = context.getModel("contractSetModel").getData();
				if (contracts && contracts.length > 0) {
					arrEdit.push("Contract");
				}
				var contractItems = context.getModel("contractItemModel").getData();
				if (contractItems && contractItems.length > 0) {
					arrEdit.push("ContractItem");
				}

				var SRitems = context.getModel("servicerequestItemsModel");
				if (SRitems && SRitems.getData().length > 0) {
					context.getModel("buttonControlModel").setProperty("/itemAddBtn", true);
					context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", this.setDeleteAllButtonEnabled(SRitems.getData()));
					arrEdit.push("ReqDelDate");
				}
				arrDisplay = ["Processor", "Customer", "AgreedScope", "ExtRef"];

				var referenceSystemID = context.getModel("servicerequestModel").getProperty("/ReferenceSystemID");
				/*if (referenceSystemID === this.OSP_SYSTEM_REFERENCESYSTEMID) {
					arrDisplay.push("System");
				} else {
					arrEdit.push("System");
				}*/

				arrEdit.push("System")

				//set SubmitSRModel
				this.setSubmitEntityDuringSaveSRModel(context, true, true, true);

			} else if (userProfile.isScoper || userProfile.isApprover) {
				arrEdit = ["Discussion"];
				arrDisplay = ["Case", "SRTitle", "DRegion", "DRoom", "System", "GoLiveDate", "Timezone", "SRInfo", "Service", "Session",
					"ReqDelDate", "Processor", "Customer", "CustomerContact", "AgreedScope", "Contract", "ContractItem", "SRItems",
					"ExtRef"
				];
				context.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
				context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", false);

				//set SubmitSRModel
				this.setSubmitEntityDuringSaveSRModel(context, false, false, true);
			}
			this.setDetailPageFieldsToEdit(arrEdit, context);
			this.setDetailPageFieldsToDisplay(arrDisplay, context);
		},

		StatusINSCOPINGCheck: function (context) {
			var userProfile = context.getModel("SRS_Data_UserSet").getData();

			//buttons check
			if (userProfile.isTQM) {
				context.getModel("buttonControlModel").setProperty("/isBackToAuthorVisible", true);
				context.getModel("buttonControlModel").setProperty("/isCancelSRVisible", true);
			}

			if (userProfile.isScoper) {
				context.getModel("buttonControlModel").setProperty("/isBackToAuthorVisible", true);
				context.getModel("buttonControlModel").setProperty("/isApproveScopeVisible", true);
			}

			//Fields Check
			var arrEdit, arrDisplay;
			if (userProfile.isScoper) {

				arrEdit = ["Case", "SRTitle", "DRegion", "DRoom", "GoLiveDate", "Timezone", "Service",
					"Discussion", "Processor", "AgreedScope", "SRItems", "CustomerContact", "ExtRef", "SRInfo"
				];

				//Contract Validation
				var contracts = context.getModel("contractSetModel").getData();
				if (contracts && contracts.length > 0) {
					arrEdit.push("Contract");
				}
				var contractItems = context.getModel("contractItemModel").getData();
				if (contractItems && contractItems.length > 0) {
					arrEdit.push("ContractItem");
				}

				var SRitems = context.getModel("servicerequestItemsModel");
				if (SRitems && SRitems.getData().length > 0) {
					context.getModel("buttonControlModel").setProperty("/itemAddBtn", true);
					context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", this.setDeleteAllButtonEnabled(SRitems.getData()));
					arrEdit.push("ReqDelDate");
				}

				arrDisplay = ["Customer"];

				var service = context.getModel("servicerequestModel").getProperty("/ServiceID");
				if (service) {
					arrEdit.push("Session");
					arrEdit.push("ReqDelDate");
					/*
					if (service === this.EOD_PRODUCT) {
						arrDisplay.push("OSPSystem");
					} else {
						arrEdit.push("OSPSystem");
					}*/
				} else {
					arrDisplay.push("Session");
					arrDisplay.push("ReqDelDate");
					//arrEdit.push("OSPSystem");
				}

				var referenceSystemID = context.getModel("servicerequestModel").getProperty("/ReferenceSystemID");
				/*
				if (referenceSystemID === this.OSP_SYSTEM_REFERENCESYSTEMID) {
					arrDisplay.push("System");
				} else {
					arrEdit.push("System");
				}*/
				arrEdit.push("System");
				//set SubmitSRModel
				this.setSubmitEntityDuringSaveSRModel(context, true, true, true);

			} else if (userProfile.isTQM) {

				arrEdit = ["Case", "SRTitle", "DRegion", "GoLiveDate", "Timezone", "Service",
					"Discussion", "Contract", "ContractItem", "SRItems", "CustomerContact", "SRInfo", "DRoom"
				];

				//contractValidation
				var contracts = context.getModel("contractSetModel").getData();
				if (contracts && contracts.length > 0) {
					arrEdit.push("Contract");
				}
				var contractItems = context.getModel("contractItemModel").getData();
				if (contractItems && contractItems.length > 0) {
					arrEdit.push("ContractItem");
				}

				var SRitems = context.getModel("servicerequestItemsModel");
				if (SRitems && SRitems.getData().length > 0) {
					context.getModel("buttonControlModel").setProperty("/itemAddBtn", true);
					context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", this.setDeleteAllButtonEnabled(SRitems.getData()));
					arrEdit.push("ReqDelDate");
				}

				arrDisplay = ["Processor", "Customer", "AgreedScope", "ExtRef"];

				var service = context.getModel("servicerequestModel").getProperty("/ServiceID");
				if (service) {
					arrEdit.push("Session");
					arrEdit.push("ReqDelDate");
					/*
					if (service === this.EOD_PRODUCT) {
						arrDisplay.push("OSPSystem");
					} else {
						arrEdit.push("OSPSystem");
					}*/

				} else {
					arrDisplay.push("Session");
					arrDisplay.push("ReqDelDate");

				}

				var referenceSystemID = context.getModel("servicerequestModel").getProperty("/ReferenceSystemID");
				/*
				if (referenceSystemID === this.OSP_SYSTEM_REFERENCESYSTEMID) {
					arrDisplay.push("System");
				} else {
					arrEdit.push("System");
				}
				*/
				arrEdit.push("System");

				//set SubmitSRModel
				this.setSubmitEntityDuringSaveSRModel(context, true, true, true);

			} else if (userProfile.isApprover) {
				arrEdit = ["Discussion"];
				arrDisplay = ["Case", "SRTitle", "DRegion", "DRoom", "System", "GoLiveDate", "Timezone", "SRInfo", "Service", "Session",
					"ReqDelDate", "Processor", "Customer", "CustomerContact", "AgreedScope", "Contract", "ContractItem", "SRItems",
					"ExtRef"
				];
				context.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
				context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", false);

				//set SubmitSRModel
				this.setSubmitEntityDuringSaveSRModel(context, false, false, true);

			}

			this.setDetailPageFieldsToEdit(arrEdit, context);
			this.setDetailPageFieldsToDisplay(arrDisplay, context);
		},

		StatusEXCEPTIONCheck: function (context) {
			var userProfile = context.getModel("SRS_Data_UserSet").getData();

			//buttons check
			if (userProfile.isTQM) {
				context.getModel("buttonControlModel").setProperty("/isBackToAuthorVisible", true);
				context.getModel("buttonControlModel").setProperty("/isCancelSRVisible", true);
			}

			//Fields Check
			var arrEdit, arrDisplay;
			if (userProfile.isScoper || userProfile.isApprover) {
				arrEdit = ["Discussion", "Processor", "ExtRef"];
				arrDisplay = ["Case", "SRTitle", "DRegion", "DRoom", "System", "GoLiveDate", "Timezone", "SRInfo", "Service", "Session",
					"ReqDelDate", "Customer", "CustomerContact", "Contract", "ContractItem", "SRItems"
				];
				context.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
				context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", false);

				//set SubmitSRModel
				this.setSubmitEntityDuringSaveSRModel(context, true, false, true);

			} else if (userProfile.isTQM) {
				arrEdit = ["Discussion"];
				arrDisplay = ["Case", "SRTitle", "DRegion", "DRoom", "System", "GoLiveDate", "Timezone", "SRInfo", "Service", "Session",
					"ReqDelDate", "Processor", "Customer", "CustomerContact", "AgreedScope", "Contract", "ContractItem", "SRItems",
					"ExtRef"
				];
				context.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
				context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", false);

				//set SubmitSRModel
				this.setSubmitEntityDuringSaveSRModel(context, false, false, true);

			}
			this.setDetailPageFieldsToEdit(arrEdit, context);
			this.setDetailPageFieldsToDisplay(arrDisplay, context);
		},

		StatusAPPROVEDCheck: function (context) {
			var userProfile = context.getModel("SRS_Data_UserSet").getData();
			if (userProfile.isTQM) {
				context.getModel("buttonControlModel").setProperty("/isBackToAuthorVisible", true);
				context.getModel("buttonControlModel").setProperty("/isCancelSRVisible", true);
				context.getModel("buttonControlModel").setProperty("/isSOCreated", true);
			}

			//Fields Check
			var arrEdit, arrDisplay;
			if (userProfile.isTQM || userProfile.isScoper || userProfile.isApprover) {
				arrEdit = ["Discussion", "Contract", "ContractItem", "SRTitle"];
				arrDisplay = ["Case", "DRegion", "DRoom", "System", "GoLiveDate", "Timezone", "SRInfo", "Service", "Session",
					"ReqDelDate", "Processor", "Customer", "CustomerContact", "AgreedScope", "SRItems", "ExtRef"
				];
				context.getModel("buttonControlModel").setProperty("/itemAddBtn", false);
				context.getModel("buttonControlModel").setProperty("/enableDeleteAllItems", false);

				//set SubmitSRModel
				this.setSubmitEntityDuringSaveSRModel(context, false, true, true);
			}
			//disable attachment deletion 
			context.getModel("buttonControlModel").setProperty("/showUploadDelete", false);
			this.setDetailPageFieldsToEdit(arrEdit, context);
			this.setDetailPageFieldsToDisplay(arrDisplay, context);
		},

		StatusCANCELLEDCheck: function (context) {
			if (context.byId("edit_SR")) {
				context.byId("edit_SR").setVisible(false);
			}
			//show attachment upload 
			context.getModel("buttonControlModel").setProperty("/enableAttachmentUpload", false);
		},

		StatusSOCREATEDCheck: function (context) {
			if (context.byId("edit_SR")) {
				context.byId("edit_SR").setVisible(false);
			}
			context.getModel("buttonControlModel").setProperty("/enableAttachmentUpload", false);
		},

		comboBoxContainsFilterFunction: function (oItem, searchString, isAdditionalText) {
			// A case-insensitive 'string contains' filter
			try {
				if (isAdditionalText) {
					return oItem.getKey().match(new RegExp(searchString, "i")) || oItem.getText().match(new RegExp(searchString, "i")) || oItem.getAdditionalText()
						.match(new RegExp(searchString, "i"));
				} else {
					return oItem.getKey().match(new RegExp(searchString, "i")) || oItem.getText().match(new RegExp(searchString, "i"));
				}
			} catch (err) {
				// Do Nothing!
			}
		},

		StatusAUTHORACTIONCheck: function (context) {
			//same as Status New
			this.StatusNEWCheck(context);
		},

		showContractValidationMessage: function (context) {
			var resourceBundle = context.getModel("i18n");

			var bCompact = !!context.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.error(
				resourceBundle.getProperty("txtMessageInvalidItemsDuration"), {
					actions: [sap.m.MessageBox.Action.CLOSE],
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				}
			);
		},

		validateContractItemBasedOnCallOffDays: function (contractItemData, callOffDays, context, controlId) {
			var validationCheckFail = false;
			var availableContractDays = contractItemData.ContractItemAvailableDays;
			if (!availableContractDays) {
				availableContractDays = 0;
			}
			if (!callOffDays) {
				callOffDays = 0;
			}
			if (parseFloat(callOffDays) > parseFloat(availableContractDays)) {
				context.getModel("buttonControlModel").setProperty("/showContractValidationMessageStrip", true);
				validationCheckFail = true;
			} else {
				context.getModel("buttonControlModel").setProperty("/showContractValidationMessageStrip", false);
				validationCheckFail = false;
			}
			return validationCheckFail;
		},

		validateEmptyScopeItems: function (aScopeItems, context) {
			var validationCheckFail = {
				"Product": false,
				"DeliveryTeam": false
			};
			//var emptyDeliveryTeamIfSystemIsOSP;
			if (aScopeItems && aScopeItems.length) {
				var EmptyProductItems = aScopeItems.filter(function (v) {
					return v.ProductID === "";
				});

				var referenceSystemId = context.getModel("servicerequestModel").getProperty("/ReferenceSystemID");

				/*
				if (referenceSystemId === this.OSP_SYSTEM_REFERENCESYSTEMID) {
					emptyDeliveryTeamIfSystemIsOSP = aScopeItems.filter(function (v) {
						var deliveryTeam = v.DeliveryTeamID;
						if (deliveryTeam === "00000000" || deliveryTeam === "") {
							return true;
						}
					});
				}
				*/
				if (EmptyProductItems.length > 0) {
					validationCheckFail.Product = true;
				}

				/*
				if (emptyDeliveryTeamIfSystemIsOSP && emptyDeliveryTeamIfSystemIsOSP.length > 0) {
					validationCheckFail.DeliveryTeam = true;
				}*/
			}

			return validationCheckFail;

		},

		showEmptyScopeItemsValidationMessage: function (context, validateEmptyScopeItems) {

			var resourceBundle = context.getModel("i18n");
			var txtMsg = "";
			if (validateEmptyScopeItems.Product && validateEmptyScopeItems.DeliveryTeam) {
				txtMsg = resourceBundle.getProperty("txtMsgEmptyDeliveryTeamAndProduct");
			}

			if (validateEmptyScopeItems.DeliveryTeam && !validateEmptyScopeItems.Product) {
				txtMsg = resourceBundle.getProperty("txtMsgEmptyDeliveryTeam");
			}

			if (!validateEmptyScopeItems.DeliveryTeam && validateEmptyScopeItems.Product) {
				txtMsg = resourceBundle.getProperty("txtMsgEmptyProductItem");
			}

			var bCompact = !!context.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.error(
				txtMsg, {
					actions: [sap.m.MessageBox.Action.CLOSE],
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				}
			);
		},

		incrementDateBasedOnCallOffDays: function (callOffDays, date) {
			if (parseFloat(callOffDays) > 1) {
				var daysToadd = Math.ceil(callOffDays) - 1;
				date.setDate(date.getDate() + daysToadd);
			}
			return date;
		},
		dateShiftForItems: function (shiftDays, date) {
			if (date) {
				var tempDate = date;
				var hours = date.getHours();
				var minutes = date.getMinutes();
				var second = date.getSeconds();
				tempDate.setHours(0, 0, 0, 0);
				//var newDate = new Date(tempDate.getTime() + shiftDays);
				var days = Math.round(shiftDays / 86400000);
				var newDate = new Date(tempDate);
				newDate.setDate(newDate.getDate() + days);
				newDate.setHours(hours, minutes, second);
				//var Final_Result = Result.toFixed(0); 

				return newDate;
			}
		},
		date: function (dateValue) {
			if (dateValue) {
				var date = new Date(dateValue);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					style: "medium"
				});
				return oDateFormat.format(date);
			} else {
				return dateValue;
			}
		},
		calculateDateShiftTime: function (startDate, endDate, doesIncludeTime) {
			var tempStartDate = new Date(startDate);
			if (doesIncludeTime) {
				tempStartDate.setHours(0, 0, 0, 0);
			}
			var tempEndDate = new Date(endDate);
			if (doesIncludeTime) {
				tempEndDate.setHours(0, 0, 0, 0);
			}
			return tempEndDate.getTime() - tempStartDate.getTime();
		},
		findComingMonday: function (date) {
			var d = new Date(date);
			return d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
		},
		SRItemsStartDateValidationEditMode: function (context) {
			var doesValidationFail = false;
			var tableItems = context.byId("idProductsTable-edit").getItems();
			var reqDelDate = context.byId("reqdate-edit").getDateValue();
			context.byId("reqdate-edit").setValueState("None");
			var IsPreferredSuccessServiceSelected = context.getModel("buttonControlModel").getProperty("/IsPreferredSuccessServiceSelected");
			if (reqDelDate) {
				if (this.checkIfStartDateIsLessThanToday(context, reqDelDate.toString())) {
					doesValidationFail = true;
					if(IsPreferredSuccessServiceSelected){
						context.byId("reqdate-edit").setValueState("None");
					}else{
						context.byId("reqdate-edit").setValueState("Warning");
					}
					
				} else {
					context.byId("reqdate-edit").setValueState("None");
				}
			}

			for (var i = 0; i < tableItems.length; i++) {
				if (tableItems[i].getVisible() && tableItems[i].getCells()[5].getItems()[0].getDateValue()) {
					var startDate = tableItems[i].getCells()[5].getItems()[0].getDateValue().toString();
					var valueState = tableItems[i].getCells()[5].getItems()[0].getValueState();
					if (this.checkIfStartDateIsLessThanToday(context, startDate)) {
						doesValidationFail = true;
						if (valueState === "None" || !valueState) {
							if(!IsPreferredSuccessServiceSelected){
								tableItems[i].getCells()[5].getItems()[0].setValueState("Warning");
							}
						}
					} else {
						if (valueState === "None" || valueState === "Warning" || !valueState) {
							tableItems[i].getCells()[5].getItems()[0].setValueState("None");
						}
					}
				}

				var modelsContext = this;
				// enable substring search for:
				//Product
				tableItems[i].getCells()[2].getItems()[1].setFilterFunction(function (searchString, oItem) {
					return modelsContext.comboBoxContainsFilterFunction(oItem, searchString, false);
				});
				//Qualification
				tableItems[i].getCells()[3].getItems()[0].setFilterFunction(function (searchString, oItem) {
					return modelsContext.comboBoxContainsFilterFunction(oItem, searchString, false);
				});
				//Delivery Team
				tableItems[i].getCells()[7].getItems()[0].setFilterFunction(function (searchString, oItem) {
					return modelsContext.comboBoxContainsFilterFunction(oItem, searchString, false);
				});

			}

			var serviceRequestModel = context.getModel("servicerequestModel").getData();

			if (serviceRequestModel && serviceRequestModel.StatusCode === this.STATUS_SOCREATED) {
				doesValidationFail = false;
			}
			if (serviceRequestModel && serviceRequestModel.StatusCode === this.STATUS_CANCELED) {
				doesValidationFail = false;
			}
			if (doesValidationFail) {
				context.getModel("buttonControlModel").setProperty("/showMsgForDatesValidationAgainstCurrentDate", true);
			} else {
				context.getModel("buttonControlModel").setProperty("/showMsgForDatesValidationAgainstCurrentDate", false);
			}
		},
		checkIfStartDateIsLessThanToday: function (context, startDateString) {
			var startDate = new Date(startDateString);
			startDate.setHours(0, 0, 0, 0);
			var today = new Date();
			today.setHours(0, 0, 0, 0);
			if (startDate <= today) {
				return true;
			}
			return false;
		},
		toggleTextAreaGrowing: function (context, id, event) {
			if (context.byId(id).getGrowing() === false) {
				event.getSource().setText(context.getResourceBundle().getText("showLess"));
				event.getSource().setTooltip(context.getResourceBundle().getText("showLess"));
				context.byId(id).setGrowing(true);
				context.byId(id).setGrowingMaxLines(30);
			} else {
				event.getSource().setText(context.getResourceBundle().getText("showMore"));
				event.getSource().setTooltip(context.getResourceBundle().getText("showMore"));
				context.byId(id).setGrowing(false);
				context.byId(id).setRows(5);
			}
		},

		setServiceRequestInfoTemplate: function (userProfile, model,context) {
			if (userProfile.isTQM && (model.getProperty("/Text") === undefined) || (model.getProperty("/Text") !== undefined && model.getProperty(
					"/Text").trim() === "")) {
				var sTemplateValue =  context.getResourceBundle().getText("serviceRequestInfoPlaceholder");
					//"#High Level customer project / situation (in which project phase is the customer currently?):\n\n#SAP Solutions or Applications in Scope of Project / Service (e. g. Finance, OTC, P2P, …):\n\n#Customer expectations for the service / expected outcome or deliverables:\n\n#Scope of task per expert: please maintain on item level (Service Delivery Details per Item)\n\n#Has this been discussed with the COE? Who? Any resources committed?\n\n#Service days budget restrictions (Yes/No. If yes, maximum number of available days?):\n\n#Delivery timeline requirements:\n-- Specific Start Date / Week Required, and Why?\n-- Specific Start Time & Time Zone needed?\n-- Weekend included?\n\n#Citizenship / Security Clearance / Language Requirements:\n\n#Alternative Delivery Date (in case of late request):\n\n#Delivery location:";
				model.setProperty("/Text", sTemplateValue);
			}
		},

		setAgreedScopeTemplate: function (userProfile, model) {
			if (userProfile.isScoper && (model.getProperty("/Text") === undefined) || (model.getProperty("/Text") !== undefined && model.getProperty(
					"/Text").trim() === "")) {
				var sTemplateValue =
					"#Customer Situation / Customer Project / Project Phase:\n\n#SAP Solutions in Scope of Project / Service:\n\n#Customer expectations for the service / expected outcome or deliverables:\n\n#Scope of task per expert: please maintain on item level (Service Delivery Details per Item)\n\n#Citizenship / Security Clearance / Language Requirements:\n\n#Alternative Delivery Date (in case of late request):\n\n#Additional Information (Ex: Item 30 - FI resource needs to know Asset Accounting (FI-AA):";
				model.setProperty("/Text", sTemplateValue);
			}
		},

		checkServiceRequestInfoTemplateValidation: function (sFilledText,context) {
			if (sFilledText === null) {
				sFilledText = "";
			}
			var sTemplateValue = context.getResourceBundle().getText("serviceRequestInfoPlaceholder");
				//"#High Level customer project / situation (in which project phase is the customer currently?):\n\n#SAP Solutions or Applications in Scope of Project / Service (e. g. Finance, OTC, P2P, …):\n\n#Customer expectations for the service / expected outcome or deliverables:\n\n#Scope of task per expert: please maintain on item level (Service Delivery Details per Item)\n\n#Has this been discussed with the COE? Who? Any resources committed?\n\n#Service days budget restrictions (Yes/No. If yes, maximum number of available days?):\n\n#Delivery timeline requirements:\n-- Specific Start Date / Week Required, and Why?\n-- Specific Start Time & Time Zone needed?\n-- Weekend included?\n\n#Citizenship / Security Clearance / Language Requirements:\n\n#Alternative Delivery Date (in case of late request):\n\n#Delivery location:";
			if (sFilledText && (sTemplateValue.trim() === sFilledText.trim())) {
				return true;
			} else {
				return false;
			}
		},

		checkAgreedScopeTemplateValidation: function (sFilledText) {
			if (sFilledText === null) {
				sFilledText = "";
			}
			var sTemplateValue =
				"#Customer Situation / Customer Project / Project Phase:\n\n#SAP Solutions in Scope of Project / Service:\n\n#Customer expectations for the service / expected outcome or deliverables:\n\n#Scope of task per expert: please maintain on item level (Service Delivery Details per Item)\n\n#Citizenship / Security Clearance / Language Requirements:\n\n#Alternative Delivery Date (in case of late request):\n\n#Additional Information (Ex: Item 30 - FI resource needs to know Asset Accounting (FI-AA):";
			if (sFilledText && (sTemplateValue.trim() === sFilledText.trim())) {
				return true;
			} else {
				return false;
			}
		},

		applyBrowserAutoFillOff: function () {
			//Workaround to prevent autocomplete on Google Chrome
			if (sap.ui.Device.browser.name == "cr") {
				if ($("textarea")) {
					$("textarea").attr("autocomplete", "off");
				}

				if ($("input")) {
					$("input").attr("autocomplete", "off");
				}
			}
		},

		setFioriLaunchpadDirtyState: function () {
			if (sap.ushell) {
				sap.ushell.Container.setDirtyFlag(true);
			}
		},

		exitFioriLaunchpadDirtyState: function () {
			if (sap.ushell) {
				sap.ushell.Container.setDirtyFlag(false);
			}
		},

		setSessionHREF: function (componentID) {
			var url = "https://servicescatalog.cvdp3eof-dbsservic1-s1-public.model-t.cc.commerce.ondemand.com/";
			if(this.getSystemLandscapeInfo()===this.BACKND_SYS_ICP){
				url = "https://servicescatalog.cvdp3eof-dbsservic1-p1-public.model-t.cc.commerce.ondemand.com/";
			}
			return url + "Services-Catalog/p/" + componentID;
		},

		sortJSONArrayByKey: function (array, key) {
			return array.sort(function (a, b) {
				var x = a[key];
				var y = b[key];
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
		},
		getSessionForFilter: function (context, ServiceID) {
			context.byId("SessionName").setBusy(true);
			var models = this;
			context.getModel("SRS_Data").read("/ProductSet('" + ServiceID + "')/toProductComponents", {
				success: function (oData) {
					var existingSessions = context.getModel("SessionSetModel").getData();
					var existingMasterSessionsData = context.getModel("MasterSessionSetModel").getData();
					var results = models.filterSessionBasedOnSelectedService(ServiceID,oData.results);
					if (results.length > 0) {
						for (var i = 0; i < results.length; i++) {
							var sessionText = results[i].ComponentText;
							if (sessionText) {
								results[i].ComponentText = sessionText.trim();
							}
							delete results[i]["SystemRequired"];
							delete results[i]["SolmanRequired"];
							delete results[i]["Mandatory"];
							delete results[i]["Selected"];
							delete results[i]["__metadata"];
							existingSessions.push(results[i]);
							existingMasterSessionsData.push(results[i]);
						}
					}
					if (existingSessions && existingSessions.length > 0) {
						existingSessions = models.removeDuplicateSessions(existingSessions);
					}
					if (existingMasterSessionsData && existingMasterSessionsData.length > 0) {
						existingMasterSessionsData = models.removeDuplicateSessionsInMasterData(existingMasterSessionsData);
					}
					existingSessions = models.addBrandVoiceTextForSessionMainViewFilter(context,existingSessions);
					context.getModel("SessionSetModel").setData(existingSessions);
					existingMasterSessionsData = models.addBrandVoiceTextForSessionMainViewFilter(context,existingMasterSessionsData);
					context.getModel("MasterSessionSetModel").setData(existingMasterSessionsData);
					context.byId("SessionName").setBusy(false);
				}.bind(context),
				error: function (error) {
					context.byId("SessionName").setBusy(false);
					models.showErrorMessage(context, error);
				}.bind(context)
			});
		},
		compareStrings: function (a, b) {
			// Assuming you want case-insensitive comparison
			if (a) {
				a = a.toLowerCase();
			}
			if (b) {
				b = b.toLowerCase();
			}
			return (a < b) ? -1 : (a > b) ? 1 : 0;
		},

		setSystemVisibleRowCount: function (context) {
			var systems = context.getModel("systemModel").getData();
			if (systems.length <= 8) {
				context.byId("systemTable").setVisibleRowCount(systems.length);
			} else {
				context.byId("systemTable").setVisibleRowCount(8);
			}
		},

		setSubmitEntityDuringSaveSRModel: function (context, header, items, comments) {
			context.getModel("SubmitEntityDuringSaveSRModel").setProperty("/header", header);
			context.getModel("SubmitEntityDuringSaveSRModel").setProperty("/items", items);
			context.getModel("SubmitEntityDuringSaveSRModel").setProperty("/comments", comments);
		},

		SONavigationLink: function (isTQM, SONumber, standardURL, context) {

			var isScoper = context.getModel("SRS_Data_UserSet").getProperty("/isScoper");
			var isApprover = context.getModel("SRS_Data_UserSet").getProperty("/isApprover");
			var backendSystem = context.getModel("SRS_Data_UserSet").getProperty("/backendSystem");
			if (backendSystem) {
				backendSystem = backendSystem.toUpperCase();
			}

			if (isTQM && !isScoper && !isApprover) {
				var url = "";
				var urlSuffix = "ServiceOrder/display/" + SONumber;
				if (backendSystem.includes(this.BACKND_SYS_ICD)) {
					url = this.HEP_DEV_URL + urlSuffix;
				} else if (backendSystem.includes(this.BACKND_SYS_ICT)) {
					url = this.setHEPTestURL(this.HEP_TEST_URL) + urlSuffix;
				} else if (backendSystem.includes(this.BACKND_SYS_ICP)) {
					url = this.setHEPProdURL(this.HEP_PROD_URL) + urlSuffix;
				}
				return url;
			} else {
				return standardURL;
			}
		},
		setHEPTestURL: function (url) {
			if (window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0) {
				var parentWindowLocation = window.location.ancestorOrigins[0];
				if (parentWindowLocation.includes("sapit-home-test-004")) {
					return "https://sapit-home-test-004.launchpad.cfapps.eu10.hana.ondemand.com/site/Home?sap-language=en#holisticengagementplanner-Display&/";
				} else {
					return url;
				}
			} else {
				return url;
			}
		},
		setHEPProdURL: function (url) {
			if (window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0) {
				var parentWindowLocation = window.location.ancestorOrigins[0];
				if (parentWindowLocation.includes("sapit-home-prod-004")) {
					return "https://sapit-home-prod-004.launchpad.cfapps.eu10.hana.ondemand.com/site/Home#holisticengagementplanner-Display&/";
				} else {
					return url;
				}
			} else {
				return url;
			}
		},
		onDownloadAttachmentsSelectedButton: function (context, controlID) {
			var oUploadCollection = context.byId(controlID);
			var aSelectedItems = oUploadCollection.getSelectedItems();
			if (aSelectedItems && aSelectedItems.length > 0) {
				for (var i = 0; i < aSelectedItems.length; i++) {
					oUploadCollection.downloadItem(aSelectedItems[i], true);
				}
			} else {
				MessageToast.show("No Files are selected for download");
			}
		},
		getAttachments: function (context, serviceRequestID) {
			context.getModel("busyIndicatorModel").setProperty("/attachmentBusyIndicator", true);
			context.getModel("buttonControlModel").setProperty("/enableAttachDownloadAllBtn", false);
			var that = this;
			var oAttachmentsURL = "/ServiceRequestHeaderSet('" + serviceRequestID + "')/toAttachments";
			context.getModel("SRS_Data").read(oAttachmentsURL, {
				groupId: "Attachments",
				success: function (oData) {
					if (oData.results.length > 0) {
						context.getModel("buttonControlModel").setProperty("/enableAttachDownloadAllBtn", true);
						context.getModel("buttonControlModel").setProperty("/attachmentCount", "Uploaded (" + oData.results.length + ")");
					} else {
						context.getModel("buttonControlModel").setProperty("/attachmentCount", "Uploaded (0)");
					}
					context.setModel(new sap.ui.model.json.JSONModel(oData.results), "servicerequestAttachmentModel");
					context.getModel("busyIndicatorModel").setProperty("/attachmentBusyIndicator", false);
					that.applyBrowserAutoFillOff();
				}.bind(context),
				error: function () {
					context.setModel(new sap.ui.model.json.JSONModel(), "servicerequestAttachmentModel");
					context.getModel("busyIndicatorModel").setProperty("/attachmentBusyIndicator", false);
					that.applyBrowserAutoFillOff();
				}.bind(context)
			});
		},
		getAvatarForAttachmentUser: function (employeeID,oEvent) {
			if (employeeID) {
				var oPopover = new EmployeeDataInfoPopover({
					endpoint: sap.ui.require.toUrl("sap/com/servicerequest/servicerequest") + "/sapit-employee-data",
					userId: employeeID
 				});
				oPopover.openBy(oEvent.getSource());
			}
		},
		uploadOnChange: function (oEvent, context) {
			if (oEvent.getParameters() && oEvent.getParameters().files && oEvent.getParameters().files.length > 0 && oEvent.getParameters().files[
					0].name ) {
				var oUploadCollection = oEvent.getSource();
				var token = context.getModel("SRS_Data")._getHeaders()["x-csrf-token"];
				// Header Token
				var oCustomerHeaderToken = new UploadCollectionParameter({
					name: "x-csrf-token",
					value: token
				});
				oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			} else {
				var msg = context.getResourceBundle().getText("txtInvalidFileName");
				MessageBox.error(msg);
			}
		},
		fileNamevalidator: function (str) {
			return !/[^\u0000-\u00ff]/g.test(str);
		},
		uploadOnFileSizeExceeded: function (oEvent, context) {
			var msg = context.getResourceBundle().getText("txtFileSizeExceeded");
			MessageToast.show(msg);
		},
		uploadOnBeforeUploadStarts: function (oEvent, context) {
			// Header Slug
			var serviceRequestID = context.getModel("servicerequestModel").getProperty("/ServiceRequestID");
			var fileName = oEvent.getParameter("fileName");
			var isFileNameValid = this.fileNamevalidator(fileName);
			if(!isFileNameValid){
				fileName = encodeURI(fileName);
			}

			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name: "SLUG",
				value: serviceRequestID + "/" + fileName + "/description",
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},
		uploadOnUploadComplete: function (oEvent, context) {
			if (oEvent.getParameters() && oEvent.getParameters().files && oEvent.getParameters().files.length > 0 && oEvent.getParameters().files[
					0] && oEvent.getParameters().files[0].status === 201) {
				var serviceRequestID = context.getModel("servicerequestModel").getProperty("/ServiceRequestID");
				this.getAttachments(context, serviceRequestID);
				MessageToast.show(oEvent.getParameter("files")[0].fileName + " successfully Uploaded");
			} else {
				var msg = "Upload Failed";
				var fileName = oEvent.getParameter("files")[0].fileName;
				if (fileName) {
					msg += " for " + fileName;
					MessageToast.show(msg);
				} else {
					MessageToast.show(msg);
				}
			}
		},
		setTokenForCaseOwner: function (context, controlId, key, txt) {
			context.byId(controlId).setTokens([]);
			context.byId(controlId).addToken(new sap.m.Token({
				key: key,
				text: txt
			}));
		},
		onCaseOwnerChange: function (oEvent, context, controlId) {
			if (oEvent.getParameter('type') === sap.m.Tokenizer.TokenUpdateType.Removed) {
				context.getModel("caseSearchModel").setProperty("/ownerId", "");
				context.getModel("caseSearchModel").setProperty("/owner", "");
			} else {
				var value = oEvent.getSource().getValue();
				this.setTokenForCaseOwner(context, controlId, value, value);
				context.getModel("caseSearchModel").setProperty("/ownerId", value);
				context.getModel("caseSearchModel").setProperty("/owner", value);
			}
		},
		serviceRequestMandFieldsValidation: function (context, data, arr) {
			this.addEmptyFieldsToArray(data.CaseID, arr, "Case");
			this.addEmptyFieldsToArray(data.RegionID, arr, "Region");
			this.addEmptyFieldsToArray(data.RespDepID, arr, "Deployment Room");
			this.addEmptyFieldsToArray(data.CustomerID, arr, "Customer");
			this.addEmptyFieldsToArray(data.Description, arr, "SR Title");
			if(context.getModel("buttonControlModel").getProperty("/isSystemVisible")){
				this.addEmptyFieldsToArray(data.ReferenceSystemID, arr, "System");
			}
			this.addEmptyFieldsToArray(data.ContactID, arr, "Contact");
			if (data.FeedbackEnabled) {
				this.addEmptyFieldsToArray(data.SurveyRecID, arr, "Survey Recipient");
			}
			if (data.ServiceID) {
				var productSet = context.getModel("productSetModel").getData();
				if (productSet && productSet.length > 0) {
					for (var i = 0; i < productSet.length; i++) {
						if (data.ServiceID === productSet[i].ProductID && productSet[i].GoLiveDateMandatory) {
							this.addEmptyFieldsToArray(data.GoLiveDate, arr, "Go Live Date");
						}
					}
				}
			}
			/*if (data.ServiceID === this.EOD_PRODUCT) {
				this.addEmptyFieldsToArray(data.ServiceContactID, arr, "EoD Service Contact Person");
			}*/
		},
		serviceRequestItemsMandFieldsValidation: function (context, data, arr) {
			var SRHeaderModel = context.getModel("servicerequestModel").getData();
			if (jQuery.isEmptyObject(data)) {
				this.addEmptyFieldsToArray("", arr, "Service");
				this.addEmptyFieldsToArray("", arr, "Request Delivery Date");
				if (!(SRHeaderModel.StatusCode == this.STATUS_NEW || SRHeaderModel.StatusCode === this.STATUS_AUTHORACTION)) {
					if (context.getModel("buttonControlModel").getProperty("/showContractFieldsBasedOnSelectedService")) {
						this.addEmptyFieldsToArray("", arr, "Contract");
						this.addEmptyFieldsToArray("", arr, "Contract Item");
					}
				}
				this.addEmptyFieldsToArray("", arr, "Session");
			} else {
				for (var i = 0; i < data.length; i++) {
					if (data[i].ItemNo === this.SR_ITEM_10) {
						this.addEmptyFieldsToArray(data[i].ProductID, arr, "Service");
						this.addEmptyFieldsToArray(data[i].RequestedDeliveryDate, arr, "Request Delivery Date");
						if (!(SRHeaderModel.StatusCode == this.STATUS_NEW || SRHeaderModel.StatusCode === this.STATUS_AUTHORACTION)) {
							if (context.getModel("buttonControlModel").getProperty("/showContractFieldsBasedOnSelectedService")) {
								if (data[i].ContractID === this.SR_ITEM_0) {
									this.addEmptyFieldsToArray("", arr, "Contract");
								} else {
									this.addEmptyFieldsToArray(data[i].ContractID, arr, "Contract");
								}
								if (data[i].ContractItemID === this.SR_ITEM_0) {
									this.addEmptyFieldsToArray("", arr, "Contract Item");
								} else {
									this.addEmptyFieldsToArray(data[i].ContractItemID, arr, "Contract Item");
								}
							}
						}
					}
					if (data[i].ItemNo === this.SR_ITEM_20) {
						this.addEmptyFieldsToArray(data[i].QualifiactionID, arr, "Session");
					}
					if (data[i].DeliveryTeamID === "00000000" && data[i].ItemNo != this.SR_ITEM_10) {
						this.addEmptyFieldsToArray("", arr, "Item " + parseInt(data[i].ItemNo) + " Delivery Team");
					}
				}
			}
		},
		addEmptyFieldsToArray: function (value, arr, fieldName) {
			if (!value) {
				arr.push(fieldName);
			}
		},
		doesSessionDescExist: function (context, sessionID) {
			var scopeSessionModel;
			if (context.getModel("sessionModel")) {
				scopeSessionModel = context.getModel("sessionModel").getData();
			}
			if (scopeSessionModel) {
				for (var i = 0; i < scopeSessionModel.length; i++) {
					if (scopeSessionModel[i].ProductID === sessionID && !scopeSessionModel[i].ProductText) {
						return false;
					}
				}
			}
			return true;
		},
		setDeleteAllButtonEnabled: function (items) {
			var visibleItems = 0;
			for (var i = 0; i < items.length; i++) {
				visibleItems++;
			}
			if (visibleItems > 2) {
				return true;
			}
			return false;
		},
		SRProgressMatrix: function () {
			var defaultComment = "Do it now";
			return [{
				"ID": this.CaseID,
				"Title": "Select Case",
				"CP": "5",
				"Status": "P",
				"HeaderElement": false,
				"Comment": defaultComment,
				"press": "pressSRProgressCaseID",
				"valueExist": false
			}, {
				"ID": this.Description,
				"Title": "Maintain SR Title",
				"CP": "5",
				"Status": "P",
				"HeaderElement": false,
				"Comment": defaultComment,
				"press": "pressSRProgressDescription",
				"valueExist": false
			}, {
				"ID": this.STATUS_NEW,
				"Title": "Create SR",
				"CP": "5",
				"Status": "P",
				"HeaderElement": true,
				"Comment": defaultComment,
				"press": "pressSRProgressE0001",
				"valueExist": false
			}, {
				"ID": "ContactID",
				"Title": "Maintain Customer Contact",
				"CP": "5",
				"Status": "P",
				"HeaderElement": false,
				"Comment": defaultComment,
				"press": "pressSRProgressContactID",
				"valueExist": false
			}, {
				"ID": "ReferenceSystemID",
				"Title": "Maintain System",
				"CP": "5",
				"Status": "P",
				"HeaderElement": false,
				"Comment": defaultComment,
				"press": "pressSRProgressReferenceSystemID",
				"valueExist": false
			}, {
				"ID": "SRInfo",
				"Title": "Maintain SR Info",
				"CP": "5",
				"Status": "P",
				"HeaderElement": false,
				"Comment": defaultComment,
				"press": "pressSRProgressSRInfo",
				"valueExist": false
			}, {
				"ID": this.STATUS_INSCOPING,
				"Title": "Send for Scoping",
				"CP": "10",
				"Status": "P",
				"HeaderElement": true,
				"Comment": defaultComment,
				"press": "pressSRProgressE0003",
				"valueExist": false
			}, {
				"ID": "ServiceID",
				"Title": "Maintain Service",
				"CP": "5",
				"Status": "P",
				"HeaderElement": false,
				"Comment": defaultComment,
				"press": "pressSRProgressServiceID",
				"valueExist": false
			}, {
				"ID": this.SessionID,
				"Title": "Maintain Component",
				"CP": "5",
				"Status": "P",
				"HeaderElement": false,
				"Comment": defaultComment,
				"press": "pressSRProgressSessionID",
				"valueExist": false
			}, {
				"ID": "RequestedDeliveryDate",
				"Title": "Maintain Delivery Date",
				"CP": "5",
				"Status": "P",
				"HeaderElement": false,
				"Comment": defaultComment,
				"press": "pressSRProgressRequestedDeliveryDate",
				"valueExist": false
			}, {
				"ID": "ContractID",
				"Title": "Maintain Contract",
				"CP": "5",
				"Status": "P",
				"HeaderElement": false,
				"Comment": defaultComment,
				"press": "pressSRProgressContractID",
				"valueExist": false
			}, {
				"ID": "ContractItemID",
				"Title": "Maintain Contract Item",
				"CP": "5",
				"Status": "P",
				"HeaderElement": false,
				"Comment": defaultComment,
				"press": "pressSRProgressContractItemID",
				"valueExist": false
			}, {
				"ID": "AgreedScope",
				"Title": "Maintain Agreed Scope",
				"CP": "5",
				"Status": "P",
				"HeaderElement": false,
				"Comment": defaultComment + "(Scoper)",
				"press": "pressSRProgressAgreedScope",
				"valueExist": false
			}, {
				"ID": "AdjustVItems",
				"Title": "Adjust Violated Items",
				"CP": "3",
				"Status": "O",
				"HeaderElement": false,
				"Comment": "",
				"press": "pressSRProgressE0004",
				"valueExist": false
			}, {
				"ID": this.STATUS_VIOLATED,
				"Title": "Request Exception Approval",
				"CP": "2",
				"Status": "O",
				"HeaderElement": false,
				"Comment": defaultComment,
				"press": "pressSRProgressE0004",
				"valueExist": false
			}, {
				"ID": this.STATUS_INEXCEPTION,
				"Title": "Approve Violation Exception",
				"CP": "5",
				"Status": "O",
				"HeaderElement": false,
				"Comment": defaultComment,
				"press": "pressSRProgressE0004",
				"valueExist": false
			}, {
				"ID": this.STATUS_APPROVED,
				"Title": "Approve SR Scope",
				"CP": "10",
				"Status": "P",
				"HeaderElement": true,
				"Comment": defaultComment,
				"press": "pressSRProgressE0005",
				"valueExist": false
			}, {
				"ID": this.STATUS_SOCREATED,
				"Title": "Create SO",
				"CP": "10",
				"Status": "P",
				"HeaderElement": true,
				"Comment": defaultComment,
				"press": "pressSRProgressE0007",
				"valueExist": false
			}];
		},
		setElementScroll: function (context, controlID) {
			var sItemID = context.byId(controlID).getId();
			document.getElementById(sItemID).scrollIntoViewIfNeeded();
		},
		ContractTypeMatrix: function () {
			return [{
				"ContractMaterialId": "9504626",
				"ContractMaterialDescription": "SAP MaxAttention Baseline",
				"ValueShownOnUILong": "New MaxAttention Baseline",
				"ValueShownOnUIShort": "New MaxA Baseline"
			}, {
				"ContractMaterialId": "9504627",
				"ContractMaterialDescription": "SAP MaxAttention Optional Services",
				"ValueShownOnUILong": "New MaxAttention Services",
				"ValueShownOnUIShort": "New MaxA Services"
			}, {
				"ContractMaterialId": "9504880",
				"ContractMaterialDescription": "SAP ActiveAttention Baseline",
				"ValueShownOnUILong": "ActiveAttention Baseline",
				"ValueShownOnUIShort": "AA Baseline"
			}, {
				"ContractMaterialId": "9504881",
				"ContractMaterialDescription": "SAP ActiveAttention Optional Services",
				"ValueShownOnUILong": "ActiveAttention Services",
				"ValueShownOnUIShort": "AA Services"
			}, {
				"ContractMaterialId": "9504992",
				"ContractMaterialDescription": "SAP ActiveAttention Baseline",
				"ValueShownOnUILong": "ActiveAttention Baseline",
				"ValueShownOnUIShort": "AA Baseline"
			}, {
				"ContractMaterialId": "9505320",
				"ContractMaterialDescription": "SAP MaxAttention 2020",
				"ValueShownOnUILong": "MaxAttention 2020",
				"ValueShownOnUIShort": "MaxA 2020"
			}, {
				"ContractMaterialId": "9505322",
				"ContractMaterialDescription": "SAP ActiveAttention 2020",
				"ValueShownOnUILong": "ActiveAttention 2020",
				"ValueShownOnUIShort": "AA 2020"
			}, {
				"ContractMaterialId": "9503501",
				"ContractMaterialDescription": "ActiveEmbedded",
				"ValueShownOnUILong": "ActiveEmbedded",
				"ValueShownOnUIShort": "ActiveEmbedded"
			}, {
				"ContractMaterialId": "9503531",
				"ContractMaterialDescription": "ActiveEmbedded",
				"ValueShownOnUILong": "ActiveEmbedded",
				"ValueShownOnUIShort": "ActiveEmbedded"
			}, {
				"ContractMaterialId": "9504410",
				"ContractMaterialDescription": "ActiveEmbedded",
				"ValueShownOnUILong": "ActiveEmbedded",
				"ValueShownOnUIShort": "ActiveEmbedded"
			}, {
				"ContractMaterialId": "9503740",
				"ContractMaterialDescription": "SAP ActiveEmbedded S/4HANA Plan.&Safeg.",
				"ValueShownOnUILong": "ActiveEmbedded",
				"ValueShownOnUIShort": "ActiveEmbedded"
			}, {
				"ContractMaterialId": "9501982",
				"ContractMaterialDescription": "Do Not Use SAP ActiveEmbedded",
				"ValueShownOnUILong": "ActiveEmbedded",
				"ValueShownOnUIShort": "ActiveEmbedded"
			}, {
				"ContractMaterialId": "9504790",
				"ContractMaterialDescription": "SAP Value Assurance",
				"ValueShownOnUILong": "Value Assurance",
				"ValueShownOnUIShort": "VA"
			}, {
				"ContractMaterialId": "9500000",
				"ContractMaterialDescription": "Do Not Use SAP MaxAttention",
				"ValueShownOnUILong": "Classic MaxAttention",
				"ValueShownOnUIShort": "Classic MaxA"
			}, {
				"ContractMaterialId": "9503190",
				"ContractMaterialDescription": "DO NOT USE SAP MaxAttention",
				"ValueShownOnUILong": "Classic MaxAttention",
				"ValueShownOnUIShort": "Classic MaxA"
			}, {
				"ContractMaterialId": "9503500",
				"ContractMaterialDescription": "SAP MaxAttention",
				"ValueShownOnUILong": "Classic MaxAttention",
				"ValueShownOnUIShort": "Classic MaxA"
			}, {
				"ContractMaterialId": "9503530",
				"ContractMaterialDescription": "SAP MaxAttention",
				"ValueShownOnUILong": "Classic MaxAttention",
				"ValueShownOnUIShort": "Classic MaxA"
			}, {
				"ContractMaterialId": "9504381",
				"ContractMaterialDescription": "SAP MaxAttention",
				"ValueShownOnUILong": "Classic MaxAttention",
				"ValueShownOnUIShort": "Classic MaxA"
			}, {
				"ContractMaterialId": "9500421",
				"ContractMaterialDescription": "SAP Safeguarding",
				"ValueShownOnUILong": "Safeguarding",
				"ValueShownOnUIShort": "Safeguarding"
			}, {
				"ContractMaterialId": "9500150",
				"ContractMaterialDescription": "DO NOT USE SAP Safeguarding Engagement",
				"ValueShownOnUILong": "Safeguarding",
				"ValueShownOnUIShort": "Safeguarding"
			}];

		},

		formatContractType: function (id, desc) {
			var contractTypeData = this.ContractTypeMatrix();
			for (var i = 0; i < contractTypeData.length; i++) {
				if (id === contractTypeData[i].ContractMaterialId) {
					return "(" + id + ") " + contractTypeData[i].ValueShownOnUILong;
				}
			}
			if (id) {
				return "(" + id + ") " + desc;
			}
			return "";
		},

		formatDateTimeForExcel: function (date) {
			if (date) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "d MMM yyyy hh:mm a"
				});
				return oDateFormat.format(date);
			}
			return date;
		},
		resetBrowserURL: function () {
			if (window.location.href.includes("&paramsProduct")) {
				var urlAfterRemovingParamsProduct = window.location.href.split("&paramsProduct")[0] + "#" + window.location.href.split("#")[1];
				window.history.pushState({}, document.title, urlAfterRemovingParamsProduct);
			}
		},
		checkSurveyRecipientForCustomer: function (context, customerId) {
			context.getModel("buttonControlModel").setProperty("/busyIndicatorSurveyRecpt", true);
			var models = this;

			context.getModel("SRS_Data").read("/HasSurveyRecipients", {
				urlParameters: {
					"CustomerID": "'" + customerId + "'"
				},
				groupId: "SurveyRecipient",
				success: function (oData) {
					context.getModel("buttonControlModel").setProperty("/busyIndicatorSurveyRecpt", false);
					if (oData && oData.HasSurveyRecipients === "X") {
						context.getModel("buttonControlModel").setProperty("/visibleSurveyRecipientSwitch", true);
						context.getModel("buttonControlModel").setProperty("/visibleNoSurveyRecipientLink", false);
					} else {
						context.getModel("servicerequestModel").setProperty("/FeedbackEnabled", false);
						context.getModel("buttonControlModel").setProperty("/visibleSurveyRecipientSwitch", false);
						context.getModel("buttonControlModel").setProperty("/visibleNoSurveyRecipientLink", true);
					}
					models.onCreateValidate(context);
				}.bind(context),
				error: function (error) {
					context.getModel("buttonControlModel").setProperty("/busyIndicatorSurveyRecpt", false);
					models.showErrorMessage(context, error);
				}.bind(context)
			});
		},
		getUnassignedSRs: function (arFilters, context, controlId) {
			var models = this;
			context.byId(controlId).setBusy(true);
			if (arFilters.length === 0) {
				arFilters = [models.filterCondition_Equal("ProcessorUser", "")];
			}

			context.getModel("SRS_Data").read("/ServiceRequestHeaderSet/$count", {
				filters: arFilters,
				groupId: "batchUnassignedSR",
				success: function (count) {
					context.byId(controlId).setBusy(false);
					context.byId(controlId).setText("Unassigned Service Requests (" + count + ")");
				}.bind(this),
				error: function (err) {
					models.showErrorMessage(context, err);
					context.byId(controlId).setBusy(false);
				}.bind(this)
			});
		},
		showMandtFieldsTxtMsg: function (context, fieldName, count) {
			if (count === 1) {
				fieldName = "*" + fieldName + "*" + " is ";
			} else if (count > 1) {
				fieldName = "*" + fieldName + "*" + " and others are ";
			}
			var txt = context.getResourceBundle().getText("txtMissingMandatoryField", fieldName);
			context.getModel("buttonControlModel").setProperty("/visibleTxtMandatoryField", true);
			context.getModel("buttonControlModel").setProperty("/txtMandatoryField", txt);
		},
		calculateDateDifference: function (date1, date2) {
			var diff = 0;
			if (date1 && date2) {
				diff = Math.round((date2 - date1) / (24 * 3600 * 1000));
				//diff = Math.floor((date2 - date1)/(24*3600*1000));
			}
			return diff;
		},
		calculateOpenForTime: function (dateValue, statusCode) {
			var sOpenForText = "";
			var suffix = "open";
			var currentTimestamp = new Date();
			if (statusCode === this.STATUS_CANCELED || statusCode === this.STATUS_SOCREATED) {
				//suffix = "open";
				currentTimestamp = this.getModel("servicerequestModel").getProperty("/ChangedDate");
			}

			if (dateValue) {
				var creationTimestamp = new Date(dateValue);
				var timeDifference = currentTimestamp.getTime() - creationTimestamp.getTime();

				var daysDifference = Math.floor(timeDifference / 1000 / 60 / 60 / 24);
				timeDifference -= daysDifference * 1000 * 60 * 60 * 24;

				var hoursDifference = Math.floor(timeDifference / 1000 / 60 / 60);
				timeDifference -= hoursDifference * 1000 * 60 * 60;

				var minutesDifference = Math.floor(timeDifference / 1000 / 60);
				timeDifference -= minutesDifference * 1000 * 60;

				var secondsDifference = Math.floor(timeDifference / 1000);

				if (daysDifference !== 0) {
					if (daysDifference === 1) {
						sOpenForText = "(" + daysDifference + " day " + suffix + ")";
					} else {
						sOpenForText = "(" + daysDifference + " days " + suffix + ")";
					}
				} else {
					if (hoursDifference !== 0) {
						if (hoursDifference === 1) {
							sOpenForText = "(" + hoursDifference + " hour " + suffix + ")";
						} else {
							sOpenForText = "(" + hoursDifference + " hours " + suffix + ")";
						}
					} else {
						if (minutesDifference !== 0) {
							if (minutesDifference === 1) {
								sOpenForText = "(" + minutesDifference + " minute " + suffix + ")";
							} else {
								sOpenForText = "(" + minutesDifference + " minutes " + suffix + ")";
							}
						} else {
							if (secondsDifference !== 0) {
								sOpenForText = "(" + secondsDifference + " seconds " + suffix + ")";
							}
						}
					}
				}
			}
			return sOpenForText;
		},
		tempSolutionforDropDownIssue: function () {

			var mPopOver = $(".sapMPopoverCont");

			if (mPopOver) {
				for (var i = 0; i < mPopOver.length; i++) {

					if (mPopOver[i].id.includes("contractItemId-edit") || mPopOver[i].id.includes("contractId-edit") || mPopOver[i].id.includes(
							"SessionName-edit")) {
						if ($(".sapMPopoverCont")[i]) {
							$($(".sapMPopoverCont")[i]).css("display", "none");
						}
						if ($(".sapMPopover")[i]) {
							$($(".sapMPopover")[i]).css("visibility", "hidden");
						}
					}
				}
			}

		},
		addDaysToDate: function (date, days) {
			var result = new Date(date);
			result.setDate(result.getDate() + days);
			return this.setEndDateBasedOnStartDateValue(result);
		},
		showHideCloudRefObjSection: function (deployMod, context) {
			if (deployMod && deployMod.toUpperCase() === this.DeployModCloud) {
				context.getModel("buttonControlModel").setProperty("/showCloudRefObjSection", true);
			} else {
				context.getModel("buttonControlModel").setProperty("/showCloudRefObjSection", false);
			}
		},
		createTenantsAndModules: function (context) {
			var oModel = context.getModel("SRS_Data");
			var aDeferredGroup = oModel.getDeferredGroups();
			aDeferredGroup.push("batchCreateTenant");
			oModel.setDeferredGroups(aDeferredGroup);
			var modelContext = this;
			var countSuccessResp = 0;
			var countOdataExecution = 0;
			context.getModel("buttonControlModel").setProperty("/busyIndicatorCloudRefTable", true);
			var mParameters = {
				groupId: "batchCreateModules",
				success: function (data, resp) {
					countSuccessResp++;
					if (countSuccessResp - 1 === countOdataExecution) {
						modelContext.hasCreationOrDeletionTriggeredForCRO = false;
						modelContext.getCloudRefObj(context);
						context.getModel("buttonControlModel").setProperty("/busyIndicatorCloudRefTable", false);
						context.getModel("buttonControlModel").setProperty("/statusBtnEnabled", true);
					}

				},
				error: function (err) {
					modelContext.hasCreationOrDeletionTriggeredForCRO = false;
					modelContext.getCloudRefObj(context);
					modelContext.showErrorMessage(context, err);
					context.getModel("buttonControlModel").setProperty("/statusBtnEnabled", true);
				}
			};

			var executeBatch = false;
			var serviceRequestID = context.getModel("servicerequestModel").getProperty("/ServiceRequestID");
			if (context.getModel("TenantsCreationModel") && context.getModel("TenantsCreationModel").getData().length > 0) {
				var TenantsCreationModel = context.getModel("TenantsCreationModel").getData();
				for (var i = 0; i < TenantsCreationModel.length; i++) {
					executeBatch = true;
					if (!TenantsCreationModel[i].ObjectID) {
						TenantsCreationModel[i].ObjectID = serviceRequestID;
					}
					oModel.create("/CloudReferenceObjectSet", TenantsCreationModel[i], mParameters);
					countOdataExecution++;
				}
			}
			if (context.getModel("ModulesCreationModel") && context.getModel("ModulesCreationModel").getData().length > 0) {
				var ModulesCreationModel = context.getModel("ModulesCreationModel").getData();
				for (var i = 0; i < ModulesCreationModel.length; i++) {
					executeBatch = true;
					if (!ModulesCreationModel[i].ObjectID) {
						ModulesCreationModel[i].ObjectID = serviceRequestID;
					}
					oModel.create("/CloudReferenceObjectSet", ModulesCreationModel[i], mParameters);
					countOdataExecution++;
				}
			}

			if (context.getModel("ModulesDeletionModel") && context.getModel("ModulesDeletionModel").getData().length > 0) {
				var ModulesDeletionModel = context.getModel("ModulesDeletionModel").getData();
				for (var i = 0; i < ModulesDeletionModel.length; i++) {
					executeBatch = true;
					oModel.remove("/CloudReferenceObjectSet(ObjectID='" + serviceRequestID + "',GuidObject=guid'" + ModulesDeletionModel[i].GuidObject +
						"',ParentComponent='" + ModulesDeletionModel[i].ParentComponent + "')", mParameters);
					countOdataExecution++;
				}
			}

			if (context.getModel("TenantsDeletionModel") && context.getModel("TenantsDeletionModel").getData().length > 0) {
				var TenantDeletionModel = context.getModel("TenantsDeletionModel").getData();
				for (var i = 0; i < TenantDeletionModel.length; i++) {
					executeBatch = true;
					oModel.remove("/CloudReferenceObjectSet(ObjectID='" + serviceRequestID + "',GuidObject=guid'" + TenantDeletionModel[i].GuidObject +
						"',ParentComponent='" + TenantDeletionModel[i].ParentComponent + "')", mParameters);
					countOdataExecution++;
				}
			}

			if (executeBatch) {
				oModel.submitChanges(mParameters);
				modelContext.hasCreationOrDeletionTriggeredForCRO = true;
				context.setModel(new JSONModel(), "CloudReferenceObjectSetModel");
			}

		},
		intializeCloudRefObjModels: function (context) {
			context.setModel(new JSONModel(), "CloudReferenceObjectSetModel");
			context.setModel(new JSONModel([]), "RawCloudReferenceObjectSetModel");
			context.setModel(new JSONModel([]), "ModulesCreationModel");
			context.setModel(new JSONModel([]), "TenantsCreationModel");
			context.setModel(new JSONModel([]), "TenantsDeletionModel");
			context.setModel(new JSONModel([]), "ModulesDeletionModel");
		},
		getCloudRefObj: function (context, system) {

			if (this.hasCreationOrDeletionTriggeredForCRO) {
				return;
			}

			var modelContext = this;
			//modelContext.rowCountCloudRefObjectoData = 0;
			modelContext.intializeCloudRefObjModels(context);
			var servicerequestId = context.getModel("servicerequestModel").getProperty("/ServiceRequestID");
			if (!servicerequestId && system) {
				modelContext.createDefaultTenantonSystemSelection(system, context);
				return;
			}
			var DeployMod = context.getModel("servicerequestModel").getProperty("/DeployMod");
			if (DeployMod && DeployMod.toUpperCase() !== this.DeployModCloud) {
				return;
			}
			var arFilters = [modelContext.filterCondition_Equal("ObjectID", servicerequestId)];
			context.getModel("buttonControlModel").setProperty("/busyIndicatorCloudRefTable", true);
			context.getModel("SRS_Data").read("/CloudReferenceObjectSet", {
				filters: arFilters,
				groupId: "batchCloudRefObj",
				success: function (oData) {
					if (oData && oData.results && oData.results.length > 0) {

						var results = oData.results;
						context.getModel("RawCloudReferenceObjectSetModel").setData(results);
						/*if (results) {
							modelContext.rowCountCloudRefObjectoData = results.length;
						}*/
						var jsonArrCloudRefObjTree = {
							"objects": []
						};
						var countTenantRows = 0;
						for (var i = 0; i < results.length; i++) {
							if (results[i].ParentComponent === "0") {
								jsonArrCloudRefObjTree.objects.push(results[i]);
								countTenantRows++;
							}
						}
						var doesAnyModulExist = false;
						for (var j = 0; j < jsonArrCloudRefObjTree.objects.length; j++) {
							jsonArrCloudRefObjTree.objects[j].objects = [];
							for (var k = 0; k < results.length; k++) {
								if (jsonArrCloudRefObjTree.objects[j].IbComponent === results[k].ParentComponent) {
									jsonArrCloudRefObjTree.objects[j].objects.push(results[k]);
									doesAnyModulExist = true;
								}
							}
						}

						context.getModel("buttonControlModel").setProperty("/isShowMoreCloudRefObjVisible", doesAnyModulExist);

						jsonArrCloudRefObjTree.objects.sort(function (a, b) {
							if (a.MainObject === "X") {
								return -1;
							} else {
								return 0;
							}
						});

						context.getModel("CloudReferenceObjectSetModel").setData(jsonArrCloudRefObjTree);
						context.getModel("buttonControlModel").setProperty("/visibleRowCount", countTenantRows);

					} else {
						if (system) {
							modelContext.createDefaultTenantonSystemSelection(system, context);
						}
					}
					context.getModel("buttonControlModel").setProperty("/busyIndicatorCloudRefTable", false);
				}.bind(context),
				error: function (err) {
					modelContext.showErrorMessage(context, err);
				}.bind(context)
			});
		},
		createDefaultTenantonSystemSelection: function (system, context) {
			var ServiceRequestId = context.getModel("servicerequestModel").getProperty("/ServiceRequestID");

			var IbComponent = context.getModel("servicerequestModel").getProperty("/ReferenceSystemID");
			this.intializeCloudRefObjModels(context);
			context.setModel(new JSONModel({
				"objects": []
			}), "CloudReferenceObjectSetModel");
			var CloudReferenceObjectSetModel = context.getModel("CloudReferenceObjectSetModel").getData();
			var CloudRefObj = {
				"GuidObject": "",
				"ProductText": system.SysDescription,
				"ObjectID": ServiceRequestId,
				"RefGuid": "",
				"ComponentText": "",
				"IbaseText": "",
				"IbComponent": IbComponent,
				"CarSystemRole": system.CarSysRoleText,
				"Ibase": "",
				"CarSystemRoleT": system.CarSysRole,
				"ParentComponent": "0",
				"ZzsDescr1": "",
				"ProductID": system.SystemRefNum,
				"ZzsDescr2": "",
				"MainObject": "X",
				"ZzsDescr3": "",
				"ZzsDescr4": "",
				"ZzsDescr5": ""
			};
			CloudReferenceObjectSetModel.objects.push(CloudRefObj);
			context.getModel("CloudReferenceObjectSetModel").setData(CloudReferenceObjectSetModel);
			this.hideEmpltyRowsOnTenantAndModuleCreation(CloudReferenceObjectSetModel, context);
			context.getModel("buttonControlModel").setProperty("/busyIndicatorCloudRefTable", false);
		},
		showCloudRefObjInfo: function (oEvent, context) {
			var htmlString =
				"<div class='classDivPLT'>Create an SO for multiple linked tenants and modules (solutions). Certain tenants have different solutions. Some of these solutions can be in focus for the service, others not. In this section you are able to select the particular module(s)(solutions) to be covered in the service." +
				"<br/><br/><strong>Add Tenant</strong></br> To add an additional tenant, click on the “Add tenant” button. The system will then read the entitlement set of license materials available to the customer and propose all linked tenants. <br/></br/>" +
				"If needed, select any additional tenant(s) to be covered during the service.<br/><br/> " +
				"<strong>Add Module</strong></br> Click on the “Add module” icon and the list of possible modules (solutions) will be shown. Select the module(s) (solutions) to be included in thescope of the service. </div>";
			var popover = new sap.m.ResponsivePopover({
				title: context.getResourceBundle().getText("txtCloudRefObjTitle"),
				showHeader: true,
				content: [
					new sap.ui.core.HTML({
						content: htmlString
					})
				],
				placement: "Left",
				/*endButton: new sap.m.Button({
					text: "Close",
					press: function () {
						popover.close();
					}
				})*/

			}).addStyleClass("sapUiContentPadding");
			popover.openBy(oEvent.getSource());
		},
		showHideMaxRowsForCloudRefObjs: function (oTreeTable, btn, context) {
			var btntxt = btn.getText();
			var bindingLength = 1;
			if (btntxt.toUpperCase() === "SHOW MORE") {
				btn.setText("Show less");
				oTreeTable.expandToLevel(1);
			} else {
				btn.setText("Show more");
				oTreeTable.collapseAll();
			}
			if (oTreeTable && oTreeTable.getBinding()) {
				bindingLength = oTreeTable.getBinding().getLength();
			}
			context.getModel("buttonControlModel").setProperty("/visibleRowCount", bindingLength);
		},
		toggleOpenStateForCROTreeTable: function (oEvent, context) {
			var bindingLength = oEvent.getSource().getBinding().getLength();
			context.getModel("buttonControlModel").setProperty("/visibleRowCount", bindingLength);
		},
		hideEmpltyRowsOnTenantAndModuleCreation: function (CloudReferenceObjectSetModel, context) {
			var bindingLength = context.byId("idTreeTableCloudRefEdit").getBinding().getLength();
			context.getModel("buttonControlModel").setProperty("/visibleRowCount", bindingLength);
		},
		getReferenceObjects: function (context, caseId, selectedSystem, controlId, callSystemSelectionEvent,selectedSession) {
			context.setModel(new JSONModel([]), "ReferenceObjectsModel");
			var hostURL = context.getModel("SRS_Data").sServiceUrl;

			var ReferenceObjectsModel;
			if(selectedSession){
				ReferenceObjectsModel = new JSONModel(hostURL + "/CaseSet('" + caseId + "')/toReferenceObject?$filter=( SessionProductID eq '"+selectedSession+"' )");
			}else{
				ReferenceObjectsModel = new JSONModel(hostURL + "/CaseSet('" + caseId + "')/toReferenceObject");
			}

			var that = this;
			var selectedSystemExistInRefObjs = false;
			context.getModel("buttonControlModel").setProperty("/busyIndictorSystemDropdown", true);
			ReferenceObjectsModel.attachRequestCompleted(function (resp) {
				if (resp.getParameters("success").success) {
					var results = ReferenceObjectsModel.getData().d.results;
					results = results.filter(function (item) {
						return item.SysStatus.toUpperCase() !== "INACTIVE";
					});

					for (var i = 0; i < results.length; i++) {
						if (results[i].DeployMod !== that.DeployModCloud) {
							if (results[i].SolmanSID) {
								results[i].DeployModel = "On Premise System WITH Solman Assignment";
							} else {
								results[i].DeployModel = "On Premise System WITHOUT Solman Assignment";
							}
						} else {
							results[i].DeployModel = "Cloud Tenant";
						}

						if (results[i].IbComponent === selectedSystem) {
							selectedSystemExistInRefObjs = true;
						}
					}

					//remove OSP from reference Objects
					var filteredArray = [];
					for (var i = 0; i < results.length; i++) {
						filteredArray.push(results[i]);
					}

					var arrSearchSystem = [{
						IbComponent: that.SEARCH_SYSTEM_KEY,
						SysDescription: "-----Click here to search and add a System to the Value Help-----"
					}];
					filteredArray = arrSearchSystem.concat(filteredArray);
					context.setModel(new JSONModel(filteredArray), "ReferenceObjectsModel");
					if (selectedSystem && context.byId(controlId)) {
						if(!selectedSystemExistInRefObjs){
							var selectedSystemInstNo = context.getModel("servicerequestModel").getProperty("/InstNo");
							context.byId(controlId).setSelectedKey(null);
							that.clearSelectedSystem(context);
							MessageBox.information("Existing System is not valid any more based on selected Component. Please select the System again.");
						}else{
							context.byId(controlId).setSelectedKey(selectedSystem);
							if (callSystemSelectionEvent) {
								var oEventBus = sap.ui.getCore().getEventBus();
								oEventBus.publish("onSystemSelected", "onSystemSelectedSuccess");
							}
						}
					}
					context.getModel("buttonControlModel").setProperty("/busyIndictorSystemDropdown", false);
					//Apply Auto filter off for Google Chrome
					that.applyBrowserAutoFillOff();
				} else {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					that.showErrorMessage(context, resp.getParameters().errorobject);
					//Apply Auto filter off for Google Chrome
					that.applyBrowserAutoFillOff();
				}
			});
		},
		validateAndaddSystemToReferenceObjects: function (contxt) {

			var arrFilter = [];
			var servicerequestModel = contxt.getModel("servicerequestModel").getData();
			arrFilter.push(this.filterCondition_Equal("InstNo", servicerequestModel.InstNo));
			arrFilter.push(this.filterCondition_Equal("IbComponent", servicerequestModel.ReferenceSystemID));
			if(servicerequestModel.SessionID){
				arrFilter.push(this.filterCondition_Equal("SessionProductID", servicerequestModel.SessionID));
			}
			var requestFilter = this.filterComparison_AND(arrFilter);

			var that = this;
			contxt.getModel("SRS_Data").read("/IBaseComponentSet", {
				filters: [requestFilter],
				success: function (oData) {
					if (oData.results.length > 0) {
						that.addSingleSystemToRefObjInBackground(contxt, servicerequestModel);
					}
				}.bind(contxt),
				error: function (err) {
					that.showErrorMessage(contxt, err);
					that.applyBrowserAutoFillOff();
				}.bind(contxt)
			});

		},
		addSingleSystemToRefObjInBackground: function (contxt, servicerequestModel) {
			var oModel = contxt.getModel("SRS_Data");
			var aDeferredGroup = oModel.getDeferredGroups();
			aDeferredGroup.push("batchCreateRefObjects");
			oModel.setDeferredGroups(aDeferredGroup);
			var that = this;
			var payload = {
				"CaseId": servicerequestModel.CaseID,
				"IbComponent": servicerequestModel.ReferenceSystemID,
				"SolmanComponent": servicerequestModel.SolmanComponent
			};
			oModel.create("/ReferenceObjectSet", payload, {
				success: function (resp) {
					that.getReferenceObjects(contxt, servicerequestModel.CaseID, servicerequestModel.ReferenceSystemID, "idSystemCombo", false);
				},
				error: function (err) {
					that.showErrorMessage(contxt, err);
				}
			});
		},
		launchHEP: function (context) {
			var caseId = context.getModel("servicerequestModel").getData().CaseID;
			var host = context.getModel("SRS_Data_UserSet").getProperty("/backendSystem");
			if (host) {
				host = host.toUpperCase();
			}
			var uri = "ProjectDetails/" + caseId;
			if (host.includes(this.BACKND_SYS_ICP)) { // Prod
				uri = this.setHEPProdURL(this.HEP_PROD_URL) + uri;
			} else if (host.includes(this.BACKND_SYS_ICT)) { // Test
				uri = this.setHEPTestURL(this.HEP_TEST_URL) + uri;
			} else { // Dev
				uri = this.HEP_DEV_URL + uri;
			}
			return uri;
		},

		getServiceRequestByCaseID: function (context, CaseID) {
			var that = this;
			context.getModel("buttonControlModel").setProperty("/busyIndicatorFavQualList", true);
			context.getModel("buttonControlModel").setProperty("/noDataTextFUQual", "Please wait while Qualifications load ...");
			context.getModel("SRS_Data").read("/ServiceRequestHeaderSet", {
				filters: [that.filterCondition_Equal("CaseID", CaseID)],
				urlParameters: {
					"$select": "ServiceRequestID"
				},
				groupId: "groupFavQual",
				success: function (oData) {
					var results = oData.results;
					var totalSRCount = results.length;
					for (var i = 0; i < results.length; i++) {
						that.getItemsByServiceRequestId(context, results[i].ServiceRequestID, totalSRCount, i);
					}
					if (results.length === 0) {
						context.getModel("buttonControlModel").setProperty("/busyIndicatorFavQualList", false);
						context.getModel("buttonControlModel").setProperty("/noDataTextFUQual", "No Data");
					}
				}.bind(context),
				error: function (resp) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					that.showErrorMessage(context, resp.getParameters().errorobject);
				}.bind(context)
			});
		},

		getItemsByServiceRequestId: function (context, ServiceRequestID, totalSRCount, currentIndex) {
			var that = this;
			context.getModel("SRS_Data").read("/ServiceRequestHeaderSet('" + ServiceRequestID + "')/toItems", {
				urlParameters: {
					"$select": "QualifiactionID,QualificationName"
				},
				groupId: "groupFavQual",
				success: function (oData) {
					var results = oData.results;
					if (results.length > 0) {
						var existingData = context.getModel("favQualificationsModel").getData();
						context.getModel("favQualificationsModel").setData(existingData.concat(results));
					}
					if (currentIndex === (totalSRCount - 1)) {
						that.removeDuplicateQualifications(context);
						context.getModel("buttonControlModel").setProperty("/busyIndicatorFavQualList", false);
					}
				}.bind(context),
				error: function (resp) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					that.showErrorMessage(context, resp.getParameters().errorobject);
				}.bind(context)
			});
		},

		removeDuplicateQualifications: function (context) {
			var qual = context.getModel("favQualificationsModel").getData();
			var filteredQual = [];
			var doesQualExist = false;
			for (var i = 0; i < qual.length; i++) {
				doesQualExist = false;
				if (filteredQual.length === 0) {
					filteredQual.push(qual[i]);
				} else {
					for (var j = 0; j < filteredQual.length; j++) {
						if (filteredQual[j].QualifiactionID === qual[i].QualifiactionID) {
							doesQualExist = true;
							break;
						}
					}
					if (!doesQualExist) {
						filteredQual.push(qual[i]);
					}
				}
			}

			//remove qualification 00000000
			for (var i = 0; i < filteredQual.length; i++) {
				if (filteredQual[i].QualifiactionID == "00000000") {
					filteredQual.splice(i, 1);
					break;
				}
			}

			// found frequently used qualifications
			for (var i = 0; i < filteredQual.length; i++) {
				for (var j = 0; j < qual.length; j++) {
					if (filteredQual[i].QualifiactionID === qual[j].QualifiactionID) {
						if (filteredQual[i].FUCount) {
							filteredQual[i].FUCount++;
						} else {
							filteredQual[i]["FUCount"] = 1;
						}
					}
				}
			}

			//sorting qualifications by FUCount = Frequenctly Used Counts
			filteredQual = filteredQual.sort(this.sortByProperty("FUCount"));
			filteredQual = filteredQual.reverse();
			context.getModel("favQualificationsModel").setData(filteredQual);
			this.validateFUQual(context);
		},
		validateFUQual: function(context){
			var fuqualModel = null;
			if(context.getModel("favQualificationsModel")){
				fuqualModel = context.getModel("favQualificationsModel").getData();
			}
			var qualModel = null;
			if(context.getModel("qualificationModel")){
				qualModel = context.getModel("qualificationModel").getData();
			}
			var validatedfuQuaArray = [];
			if(fuqualModel && qualModel){
				var doesQualExist = false;
				for(var i=0;i<fuqualModel.length;i++){
					for(var j=0;j<qualModel.length;j++){
						if(fuqualModel[i].QualifiactionID === qualModel[j].DdlbKey){
							doesQualExist = true;
							break;
						}
					}
					if(doesQualExist){
						validatedfuQuaArray.push(fuqualModel[i]);
					}
				}
				context.getModel("favQualificationsModel").setData(validatedfuQuaArray);
			}
			
		},
		setDocumentTitle: function(context,SRID,SRStatus,SRTitle){
			/*
			try{
				var iframe = $("iframe");
				if(iframe && iframe[0] && iframe[0].id && iframe[0].id.includes("servicerequestscoping")){
					var sTitle;
					if(SRID){
						sTitle = "SR "+SRID+" ("+SRStatus+")"+ " - "+SRTitle;
					}else{
						sTitle = context.getResourceBundle().getText("appTitle");
					}
					iframe.context.title=sTitle;
				}
			}catch(ex){
				console.log("Exception accessing iframe"+ex);

			}*/
			
			context.getOwnerComponent().getService("ShellUIService").then( // promise is returned
				function (oService) {				
					if(SRID){
						var sTitle = "SR "+SRID+" ("+SRStatus+")"+ " - "+SRTitle;
						oService.setTitle(sTitle);
					}else{
						var sTitle = context.getResourceBundle().getText("appTitle");
						oService.setTitle(sTitle);
					}
				},
				function (oError) {
					jQuery.sap.log.error("Cannot get ShellUIService", oError);
				}
			);
		},
		setVisibleFeedbackForm: function(context,selectedSession){
			if(selectedSession && context.getModel("sessionModel")){
				var sessionModel = context.getModel("sessionModel").getData();
				if (sessionModel && sessionModel.length > 0) {
					for (var i = 0; i < sessionModel.length; i++) {
						if (selectedSession === sessionModel[i].ProductID) {
							if(sessionModel[i].PreferredSuccess){
								context.getModel("buttonControlModel").setProperty("/visibleFeedbackForm",sessionModel[i].SurveyRequired);
								context.getModel("editableFieldsModel").setProperty("/visibleFeedbackFormCheckboxEditable", false);
								
								if(context.getModel("servicerequestModel")){
									if(sessionModel[i].SurveyRequired){
										context.getModel("servicerequestModel").setProperty("/FeedbackEnabled",true);
									}else{
										context.getModel("servicerequestModel").setProperty("/FeedbackEnabled",false);
										context.getModel("servicerequestModel").setProperty("/SurveyRecID","");
									}
								}
							}else{
								if(sessionModel[i].PreventSurvey){
									context.getModel("buttonControlModel").setProperty("/visibleFeedbackForm",false);
									if(context.getModel("servicerequestModel")){
										context.getModel("servicerequestModel").setProperty("/FeedbackEnabled",false);
										context.getModel("servicerequestModel").setProperty("/SurveyRecID","");
									}
								}else{
									context.getModel("buttonControlModel").setProperty("/visibleFeedbackForm",true);
									context.getModel("editableFieldsModel").setProperty("/visibleFeedbackFormCheckboxEditable", context.getModel("editableFieldsModel").getProperty("/CustomerContact"));
								}
							}
							if(context.getModel("buttonControlModel").getProperty("/visibleFeedbackForm")){
								context.getModel("buttonControlModel").setProperty("/visibleSurveyRecipientSwitch",true);
								context.getModel("buttonControlModel").setProperty("/visibleNoSurveyRecipientLink",false);
							}else{
								context.getModel("buttonControlModel").setProperty("/visibleSurveyRecipientSwitch",false);
								context.getModel("buttonControlModel").setProperty("/visibleNoSurveyRecipientLink",true);
							}
							break;
						}
					}
				}
			}else{
				context.getModel("buttonControlModel").setProperty("/visibleFeedbackForm",true);
			}
		},
		clearSelectedSystem: function (context) {
			context.getModel("servicerequestModel").setProperty("/ReferenceSystemID", "");
			context.getModel("servicerequestModel").setProperty("/ReferenceSystemName", "");
			context.getModel("servicerequestModel").setProperty("/SolmanComponent", "");
			context.getModel("servicerequestModel").setProperty("/InstNo", "");
			context.getModel("servicerequestModel").setProperty("/ReferenceProductID", "");
			this.showHideCloudRefObjSection("", context);
			this.clearTenantModuleCreationModel(context);
		},
		clearTenantModuleCreationModel: function (context) {
			context.getModel("TenantsCreationModel").setData([]);
			context.getModel("ModulesCreationModel").setData([]);
			context.getModel("ModulesDeletionModel").setData([]);
			context.getModel("TenantsDeletionModel").setData([]);
		},
		showImmediateSOInfoPopover: function (context,oEvent) {
			var oButton = oEvent.getSource();
			if (!context._ImmediateSOInfoPopover) {
				context._ImmediateSOInfoPopover = Fragment.load({
					id: context.getView().getId(),
					name: "sap.com.servicerequest.servicerequest.fragment.ImmediateSOInfoPopover",
					controller: context
				}).then(function (oPopover) {
					context.getView().addDependent(oPopover);
					return oPopover;
				});
			}
			context._ImmediateSOInfoPopover.then(function (oPopover) {
				oPopover.openBy(oButton);
			});
		},
		closeServiceDelDetailsInfoPopover: function(context, controlId){
			context.byId(controlId).close();
		},
		showServiceDelDetailsPopover: function(oEvent, context){
			var oButton = oEvent.getSource();
			if (!context.ServiceDelDetailsInfoPopover) {
				context.ServiceDelDetailsInfoPopover = Fragment.load({
					id: context.getView().getId(),
					name: "sap.com.servicerequest.servicerequest.fragment.ServiceDelDetailsInfoPopover",
					controller: context
				}).then(function (oPopover) {
					context.getView().addDependent(oPopover);
					return oPopover;
				});
			}
			context.ServiceDelDetailsInfoPopover.then(function (oPopover) {
				oPopover.openBy(oButton);
			});
		},
		filterSessionBasedOnSelectedService: function(serviceId,results){
			var filteredArray = [];
			for(var i=0;i<results.length;i++){
				if(results[i].ParentProductID===serviceId){
					filteredArray.push(results[i]);
				}
			}
			return filteredArray;
		},
		filterMemberItemTemplateBySession: function(sessionId,context){
			var filteredTemplates = [];
			var itemTemplate = context.getModel("memberItemsTemplateModel").getData();
			for(var i=0;i<itemTemplate.length;i++){
				if(itemTemplate[i].ParentProductID===sessionId){
					filteredTemplates.push(itemTemplate[i]);
				}
			}
			return filteredTemplates;
		},
		findProductAndReloadScopingTeamForPreferredSuccessService: function(context,serviceID,region,SrID){
			context.getModel("buttonControlModel").setProperty("/isScopingTeamFieldVisible",true);
			var selectedScopingTeam = context.getModel("servicerequestModel").getProperty("/RespDepID");
			var productSetModel = context.getModel("productSetModel");
			if(serviceID && productSetModel && productSetModel.getData()){
				var productSetData = productSetModel.getData();
				for(var i=0;i<productSetData.length;i++){
					if(productSetData[i].ProductID ===serviceID){
						if(productSetData[i].PreferredSuccess){
							this.getDeploymentRooms(context, "/DeploymentRoomSet", region, "deplRoomModel", "001", "dr-edit", false, SrID,selectedScopingTeam);
						}
						this.wasPreviousServicePreferredSuccess = productSetData[i].PreferredSuccess;
						if(productSetData[i].PreferredSuccess){
							var SRS_Data_UserSet = context.getModel("SRS_Data_UserSet").getData();
							if(SRS_Data_UserSet.isTQM && !SRS_Data_UserSet.isScoper && !SRS_Data_UserSet.isApprover){
								context.getModel("buttonControlModel").setProperty("/isScopingTeamFieldVisible",false);
							}
						}
						break;
					}
				}
			}
		},
		setScopingTeamVisibility: function(context, isPreferredSuccess,previousServiceSelectedType){
			var bCompact = !!context.getView().$().closest(".sapUiSizeCompact").length;
			var txt,msgBoxActions = [MessageBox.Action.CLOSE], emphasizedAction="CLOSE";
			var region = context.getModel("servicerequestModel").getProperty("/RegionID");
			const SELECT_SCOPING_TEAM = "Select Scoping Team";
			if(isPreferredSuccess){
				txt = "Preferred Success Service is selected and therefore Scoping Team will be re-determined after creation or saving of Service Request."
				context.getModel("buttonControlModel").setProperty("/isScopingTeamFieldVisible",false);
				context.getModel("servicerequestModel").setProperty("/RespDepID","");
				context.getModel("servicerequestModel").setProperty("/RespDepID","0000000000");
			}else{
				context.getModel("buttonControlModel").setProperty("/isScopingTeamFieldVisible",true);
				txt = "Premium Engagement Service is selected and therefore Scoping Team is now available for selection. You may re-select the Scoping Team"
				msgBoxActions = [SELECT_SCOPING_TEAM, MessageBox.Action.CLOSE];
				emphasizedAction = SELECT_SCOPING_TEAM;
			}
			if(!(previousServiceSelectedType === isPreferredSuccess)){
				if(emphasizedAction===SELECT_SCOPING_TEAM){
					this.getDeploymentRooms(context, "/DeploymentRoomSet", region, "deplRoomModel", "001", "dr-edit", false, "");
				}
				MessageBox.information(txt,{
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					actions: msgBoxActions,
					emphasizedAction: emphasizedAction,
					onClose: function (sAction) {
						if(!(sAction==="CLOSE")){
							var oEventBus = sap.ui.getCore().getEventBus();
							oEventBus.publish("setFocusForScopingTeam", "setFocusForScopingTeam");
						}
					}
				});
			}
		},
		pressServiceReviewInfoBtn: function (context, oEvent) {
			var oButton = oEvent.getSource();
			if (!context._ServiceReviewResultsHintPopover) {
				context._ServiceReviewResultsHintPopover = Fragment.load({
					id: context.getView().getId(),
					name: "sap.com.servicerequest.servicerequest.fragment.ReviewServiceResultsInfoPopover",
					controller: context
				}).then(function (oPopover) {
					context.getView().addDependent(oPopover);
					return oPopover;
				});
			}
			context._ServiceReviewResultsHintPopover.then(function (oPopover) {
				oPopover.openBy(oButton);
			});
		},
		pressRDLInfoBtn: function (context, oEvent) {
			var oButton = oEvent.getSource();
			if (!context._RDLHintPopover) {
				context._RDLHintPopover = Fragment.load({
					id: context.getView().getId(),
					name: "sap.com.servicerequest.servicerequest.fragment.RDLInfoPopover",
					controller: context
				}).then(function (oPopover) {
					context.getView().addDependent(oPopover);
					return oPopover;
				});
			}
			context._RDLHintPopover.then(function (oPopover) {
				oPopover.openBy(oButton);
			});
		},
		getRequestedDeliveryLanguage: function(context,sessionId){
			var that = this;
			context.setModel(new JSONModel([]), "rdlModel");
			context.getModel("buttonControlModel").setProperty("/busyIndicatorRDLDropdown", true);
			context.getModel("SRS_Data").read("/DeliveryLanguageVHSet", {
				filters: [new sap.ui.model.Filter("ProductID", sap.ui.model.FilterOperator.EQ, sessionId)],
				groupId: "rdl" + sessionId,
				success: function (oData) {
					var results = oData.results;
					if(results.length>0){
					context.setModel(new JSONModel(results), "rdlModel");
					var existingSessionLanguage = context.getModel("servicerequestModel").getProperty("/RequestedDeliveryLanguage");
					var doesSessionExist = false;
					for(var i=0;i<results.length;i++){
						if(results[i].Language === existingSessionLanguage){
							doesSessionExist = true;
							break;
						}
					}

					if(doesSessionExist){
						context.getModel("servicerequestModel").setProperty("/RequestedDeliveryLanguage",existingSessionLanguage);
					}else{
						context.getModel("servicerequestModel").setProperty("/RequestedDeliveryLanguage","");
					}

					context.getModel("buttonControlModel").setProperty("/busyIndicatorRDLDropdown", false);
					context.getModel("buttonControlModel").setProperty("/showRDLfield", true);
					//Apply Auto filter off for Google Chrome
					}else{
						context.getModel("buttonControlModel").setProperty("/showRDLfield", false);	
						context.getModel("servicerequestModel").setProperty("/RequestedDeliveryLanguage","");
					}
					
					that.applyBrowserAutoFillOff();
				}.bind(context),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					context.getModel("buttonControlModel").setProperty("/busyIndicatorRDLDropdown", false);
					//Apply Auto filter off for Google Chrome
					that.applyBrowserAutoFillOff();
				}.bind(context)
			});
		},
		reFormatBrandVoiceTextForUnknownCharacters: function(brandVoicTxt){
			return brandVoicTxt?brandVoicTxt.replace(/&amp;/g,"&"):brandVoicTxt;
		},
		addBrandVoiceTextForService: function(context){
			var productSetModelDetailView = context.getModel("productSetModel");
			var productSetModelMainView = context.getModel("productSetModelMainView");
			var ext_commerce_ServiceModel = context.getModel("ext_commerce_ServiceModel");
			if(productSetModelDetailView && ext_commerce_ServiceModel){
				var productDataFromCRM =  productSetModelDetailView.getData();
				var productDataFromCommerce = ext_commerce_ServiceModel.getData()?ext_commerce_ServiceModel.getData().results:[];
				for(var i=0;i<productDataFromCRM.length;i++){
					for(var j=0;j<productDataFromCommerce.length;j++){
						if(productDataFromCRM[i].PreferredSuccess && productDataFromCRM[i].ProductID === this.removePrecedingZeros(productDataFromCommerce[j].code)){
							var brandVoiceText = this.trimBrandVoiceTxt(productDataFromCommerce[j].name);
							brandVoiceText = this.reFormatBrandVoiceTextForUnknownCharacters(brandVoiceText);
							productDataFromCRM[i].ProductText = brandVoiceText?brandVoiceText:productDataFromCRM[i].ProductText;
							break;
						}
					}
					
				}
				context.setModel(new sap.ui.model.json.JSONModel(productDataFromCRM),"productSetModel");
			}

			if(productSetModelMainView && ext_commerce_ServiceModel){
				var productDataFromCRM =  productSetModelMainView.getData();
				var productDataFromCommerce = ext_commerce_ServiceModel.getData()?ext_commerce_ServiceModel.getData().results:[];
				for(var i=0;i<productDataFromCRM.length;i++){
					for(var j=0;j<productDataFromCommerce.length;j++){
						if(productDataFromCRM[i].PreferredSuccess && productDataFromCRM[i].ProductID === this.removePrecedingZeros(productDataFromCommerce[j].code)){
							var brandVoiceText = this.trimBrandVoiceTxt(productDataFromCommerce[j].name);
							brandVoiceText = this.reFormatBrandVoiceTextForUnknownCharacters(brandVoiceText);
							productDataFromCRM[i].ProductText = brandVoiceText?brandVoiceText:productDataFromCRM[i].ProductText;
							break;
						}
					}
					
				}
				context.setModel(new sap.ui.model.json.JSONModel(productDataFromCRM),"productSetModelMainView");
			}
		},
		addBrandVoiceTextForSession: function(context,sessionDataFromCRM){
			var ext_commerce_SessionModel = context.getModel("ext_commerce_SessionModel");
			if(sessionDataFromCRM && ext_commerce_SessionModel){
				var sessionDataFromCommerce = ext_commerce_SessionModel.getData()?ext_commerce_SessionModel.getData().results:[];
				for(var i=0;i<sessionDataFromCRM.length;i++){
					for(var j=0;j<sessionDataFromCommerce.length;j++){
						if(sessionDataFromCRM[i].PreferredSuccess && sessionDataFromCRM[i].ProductID === this.removePrecedingZeros(sessionDataFromCommerce[j].code)){
							var brandVoiceText = this.trimBrandVoiceTxt(sessionDataFromCommerce[j].name);
							brandVoiceText = this.reFormatBrandVoiceTextForUnknownCharacters(brandVoiceText);
							sessionDataFromCRM[i].ProductText = brandVoiceText?brandVoiceText:sessionDataFromCRM[i].ProductText;
							break;
						}
					}
				}
			}
			return sessionDataFromCRM;
		},
		addBrandVoiceTextForSessionMainViewFilter: function(context,sessionDataFromCRM){
			var ext_commerce_SessionModel = context.getModel("ext_commerce_SessionModel");
			if(sessionDataFromCRM && ext_commerce_SessionModel){
				var sessionDataFromCommerce = ext_commerce_SessionModel.getData()?ext_commerce_SessionModel.getData().results:[];
				for(var i=0;i<sessionDataFromCRM.length;i++){
					for(var j=0;j<sessionDataFromCommerce.length;j++){
						if(sessionDataFromCRM[i].PreferredSuccess && sessionDataFromCRM[i].ComponentId === this.removePrecedingZeros(sessionDataFromCommerce[j].code)){
							var brandVoiceText = this.trimBrandVoiceTxt(sessionDataFromCommerce[j].name);
							brandVoiceText = this.reFormatBrandVoiceTextForUnknownCharacters(brandVoiceText);
							sessionDataFromCRM[i].ComponentText = brandVoiceText?brandVoiceText:sessionDataFromCRM[i].ComponentText;
							break;
						}
					}
				}
			}
			return sessionDataFromCRM;
		},
		getRealTimeBrandVoiceTxtById: function(context,id,productType){
			var ext_commerce_model = new sap.ui.model.json.JSONModel("ext_commerce/odata2webservices/SRSIntegrationObject/SCServices('Online|servicescatalogProductCatalog|"+id+"')");
			var modelContext = this;
			ext_commerce_model.attachRequestCompleted(function (resp) {
				if (resp.getParameters("success").success) {
					//success to do
					var result = resp.getSource().getData().d;
					if(result && result.name){
						var brandVoiceText = modelContext.trimBrandVoiceTxt(result.name);
						brandVoiceText = modelContext.reFormatBrandVoiceTextForUnknownCharacters(brandVoiceText);
						if(productType===modelContext.PRODUCT_TYPE_SERVICE){
							context.getModel("servicerequestModel").setProperty("/ServiceID",brandVoiceText.toUpperCase());
						}else if(productType===modelContext.PRODUCT_TYPE_SESSION){
							context.getModel("servicerequestModel").setProperty("/SessionID",brandVoiceText);
						}
						var SRItems = context.getModel("servicerequestItemsModel");
						if(SRItems){
							var SRItemsData = SRItems.getData();
							for(var i=0;i<SRItemsData.length;i++){
								if(SRItemsData.ItemNo===modelContext.SR_ITEM_10 && productType===modelContext.PRODUCT_TYPE_SERVICE){
									SRItemsData.ProductName = brandVoiceText;
								}
								if(SRItemsData.ItemNo===modelContext.SR_ITEM_20 && productType===modelContext.PRODUCT_TYPE_SESSION){
									SRItemsData.ProductName = brandVoiceText;
								}
							}
							context.getModel("servicerequestItemsModel").setData(SRItemsData);
						}
					}
				} else {
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					modelContext.showErrorMessage(context, resp.getParameters().errorobject);
				}
			});
		},
		getOfflineBrandVoiceTxtById: function(id,context,modelType){
			var catalogModel = context.getModel(modelType);
			var brandVoiceTxt = "";
			if(catalogModel){
				var catalogData = catalogModel.getData();
				for(var i=0;i<catalogData.length;i++){
					if(this.txtString(catalogData[i].code)===id){
						brandVoiceTxt = this.trimBrandVoiceTxt(catalogData[i].name);
						brandVoiceTxt = this.reFormatBrandVoiceTextForUnknownCharacters(brandVoiceTxt);
						if(modelType==="ext_commerce_ServiceModel"){
							brandVoiceTxt = brandVoiceTxt.toUpperCase();
						}else{
							brandVoiceTxt = brandVoiceTxt;
						}
						break;
					}
				}
			}
			return brandVoiceTxt;
		},
		trimBrandVoiceTxt: function(brandVoiceText){
			if(brandVoiceText && brandVoiceText.length>100){
				brandVoiceText = brandVoiceText.substr(0,100);
			}
			return brandVoiceText;
		},
		validateSelectedServiceInSR: function(context,customerId,serviceId,sessionId,statusCode){
			if(statusCode !== (this.STATUS_SOCREATED || this.STATUS_CANCELED)){
				var modelContext = this;
				var hostURL = context.getModel("SRS_Data").sServiceUrl;
				var bCompact = !!context.getView().$().closest(".sapUiSizeCompact").length;
				var productSetModel = new JSONModel(hostURL + "/CustomerSet('"+customerId+"')/toProducts?$filter=(ProductID eq '"+serviceId+"')");
				productSetModel.attachRequestCompleted(function (resp) {
					if (resp.getParameters("success").success) {
						var results = productSetModel.getData().d.results;
						var GO_TO_EDIT_BTN = "Go to Edit";
						var BACK_TO_MAIN_VIEW = "Back to Main View"
						if(results && results.length===0){
							var txtmsg = 'Service ' + serviceId + ' and Component ' + sessionId + " does not exist any more for Customer "+customerId+". Please switch to edit mode and select a new Service and Component.";
							if(!context.getModel("backNavModel").getProperty("/isMainViewVisible")){
								MessageBox.information(txtmsg,{
									actions: [BACK_TO_MAIN_VIEW, GO_TO_EDIT_BTN],
									emphasizedAction: GO_TO_EDIT_BTN,
									onClose: function (sAction) {
										var oEventBus = sap.ui.getCore().getEventBus();
										if(sAction===GO_TO_EDIT_BTN){
											if(!context.getModel("buttonControlModel").getProperty("/isEdit")){
												oEventBus.publish("editSR", "editSRSuccess");
											}
										}else{
											oEventBus.publish("onDetailClose", "onDetailCloseSuccess");
										}
									},
									styleClass: bCompact ? "sapUiSizeCompact" : ""
								});
							}
						}else{
							var sessionODataJSONModel = new JSONModel(hostURL + "/CustomerSet('"+customerId+"')/toProductStructure?$filter=(ParentProductID eq '"+serviceId+"')");
							sessionODataJSONModel.attachRequestCompleted(function (resp) {
								if (resp.getParameters("success").success) {
									var results = sessionODataJSONModel.getData().d.results;
									var doesSessionExist = false;
									for(var i=0;i<results.length;i++){
										if(results[i].ProductID === sessionId){
											doesSessionExist = true;
											break;
										}
									}
									if(!doesSessionExist){
										var txtmsg = 'Component ' + sessionId + " does not exist any more for Customer "+customerId+". Please switch to edit mode and select a new Component.";
										if(!context.getModel("backNavModel").getProperty("/isMainViewVisible")){
											MessageBox.information(txtmsg,{
												actions: [BACK_TO_MAIN_VIEW, GO_TO_EDIT_BTN],
												emphasizedAction: GO_TO_EDIT_BTN,
												onClose: function (sAction) {
													var oEventBus = sap.ui.getCore().getEventBus();
													if(sAction===GO_TO_EDIT_BTN){
														if(!context.getModel("buttonControlModel").getProperty("/isEdit")){
															oEventBus.publish("editSR", "editSRSuccess");
														}
													}else{
														oEventBus.publish("onDetailClose", "onDetailCloseSuccess");
													}
												},
												styleClass: bCompact ? "sapUiSizeCompact" : ""
											});
										}
									}
									
								} else {
									sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
									modelContext.showErrorMessage(context, resp.getParameters().errorobject);
								}

							});
						}
					} else {
						sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
						modelContext.showErrorMessage(context, resp.getParameters().errorobject);
					}

				});
			}
		},

		capitalizeString: function(stringTxt){
			return stringTxt.replace(/\b\w/g, l => l.toUpperCase())
		},

		removePrecedingZeros: function (txtString) {
			if (txtString === null || txtString === "" || txtString === undefined) {
				return txtString;
			} else {
				return txtString.replace(/\b0+/g, '');
			}
		},
		createBusyDialog: function(title){
			return new BusyDialog({
				title: title,
				busyIndicatorDelay: 0
			})
		},
		getCustomerDetailsForSignavio: function (context) {
			var customerId = context.getModel("servicerequestModel").getProperty("/CustomerID");
			var hostURL = context.getModel("SRS_Data").sServiceUrl;
			var customerDataModel = new JSONModel(hostURL + "/CustomerSet('" + customerId + "')");
			context.setModel(new JSONModel({
				InstructionTxt:""
			}),"SignavioInstructionModel");
			var modelContext = this;
			customerDataModel.attachRequestCompleted(function (resp) {
				if (resp.getParameters("success").success) {
					var oData = customerDataModel.getData().d;
					var prefixCRMActivityURL = modelContext.MCC_SOS_ACTIVITY_CREATION_TEST_URL_PREFIX;
					var category = "Z9E";
					var SRModel = context.getModel("servicerequestModel").getData();
					var serviceTeam = "";
					var region = "";
					var scopingTeams = [{
						"Region": "ANZ",
						"MCCActivityRegion":"ANZ",
						"PartnerNumnber": "29219507"
					}, {
						"Region": "ASIA",
						"MCCActivityRegion":"APJ",
						"PartnerNumnber": "29219507"
					}, {
						"Region": "EMEA",
						"MCCActivityRegion":"EMEA",
						"PartnerNumnber": "15035975"
					}, {
						"Region": "LA",
						"MCCActivityRegion":"LAC",
						"PartnerNumnber": "29219506"
					}, {
						"Region": "NA",
						"MCCActivityRegion":"NA",
						"PartnerNumnber": "29219505"
					}, {
						"Region": "NASIA",
						"MCCActivityRegion":"APJ",
						"PartnerNumnber": "29219507"
					}];
	
					for (var i = 0; i < scopingTeams.length; i++) {
						if (scopingTeams[i].Region === SRModel.RegionID) {
							serviceTeam = scopingTeams[i].PartnerNumnber;
							region = scopingTeams[i].MCCActivityRegion;
							break;
						}
					}
	
					if (modelContext.getSystemLandscapeInfo() === modelContext.BACKND_SYS_ICP) {
						prefixCRMActivityURL = modelContext.MCC_SOS_ACTIVITY_CREATION_PROD_URL_PREFIX;
					}
					var formattedCustomerName = SRModel.CustomerName;
					if(formattedCustomerName){
						if(SRModel.CustomerName.length>19){
							formattedCustomerName = formattedCustomerName.substring(0,19);
						}
						formattedCustomerName = encodeURIComponent(formattedCustomerName);
					}
					var formatteroOwnerName = SRModel.OwnerName?SRModel.OwnerName.replace(/ /g,"%20"):SRModel.OwnerName; 
					
					var suffixCRMActivityURL =
						"/createByDefault/OneColumn/erpcust=" + oData.ERPNo +
						"&caseid=" + SRModel.CaseID + "&title=Signavio%20support%20for%20" + formattedCustomerName +
						"&category=" + category + "&serviceteam=" +
						serviceTeam +
						"&desc=This%20Activity%20was%20created%20via%20SRS%20App.%0DSignavio%20support%20is%20requested.%0DTo%20onboard%20the%20customer%20please%20contact%20the%20Service%20Requestor:%20" +
						formatteroOwnerName + "%20(" + SRModel.OwnerUser + ").%0DMore%20details%20in%20SR%20" + SRModel.ServiceRequestID + ".%0DFurther%20instructions%20are%20on%20the%20Signavio%20Backoffice%20Homepage.";
	
					var CRMActivityURL = prefixCRMActivityURL + suffixCRMActivityURL;
					var mccActivitiesLink = "https://mccdashboardrepository.cfapps.eu10-004.hana.ondemand.com/index.html?hc_reset&filter=activity_process_type%20eq%20%27ZS46%27%20and%20Filter%20eq%20%27serviceteam%2800"+serviceTeam+"%29%27%20and%20%28activity_status%20eq%20%27E0010%27%20or%20activity_status%20eq%20%27E0011%27%20or%20activity_status%20eq%20%27E0012%27%29%20and%20activity_cat%20eq%20%27Z9E%27&title=Signavio%20Backoffice%20Support%20Requests%20/%20Region%20"+region+"&refreshInterval=5&hidePrio=Yes&sorter=activity_id/desc&ServiceTeamVisible=true&disp_MU=yes#/MDR2";					
					var SRS_Data_UserSet = context.getModel("SRS_Data_UserSet").getData();
					if(SRS_Data_UserSet.isTQM && !SRS_Data_UserSet.isScoper && !SRS_Data_UserSet.isApprover){
						context.getModel("SignavioInstructionModel").setProperty("/InstructionTxt",context.getResourceBundle().getText("txtMsgSignavioRequestor"))
					} else{
						var scoperInstructions = 'The selected service component should be delivered using SAP Signavio. A corresponding line item with Signavio qualification has been added. <br>VPR Required Action:<br/>&nbsp;&nbsp;1. Check SR Discussion section and verify if a Signavio Activity for Signavio PE Backoffice has been created.<br/>&nbsp;&nbsp;2. If there is no mentioning of Signavio Activity in the Discussion, review the <a href="'+mccActivitiesLink+'">existing Signavio Activities</a> to avoid creating duplicates.<br/>&nbsp;&nbsp;3. Create an Activity using <a href="'+CRMActivityURL+'">this link</a>. Once Activity is created, copy its link into the SR Discussion.<br/> For further information, visit the <a target="_blank" href="https://sap.sharepoint.com/teams/GlobalCoEBPI">Signavio Backoffice site</a>';
						context.getModel("SignavioInstructionModel").setProperty("/InstructionTxt",scoperInstructions);
					}
					context.getModel("buttonControlModel").setProperty("/showSignavioInstructionsMsgStrip",true);

				} else {
					sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
					modelContext.showErrorMessage(context, resp.getParameters().errorobject);
				}

			});

		},
		showApprovalRuleInfoPopover: function(context,oEvent){
			var oButton = oEvent.getSource();
			if (!context._ApprovalRuleInfoPopover) {
				context._ApprovalRuleInfoPopover = Fragment.load({
					id: context.getView().getId(),
					name: "sap.com.servicerequest.servicerequest.fragment.ApprovalRuleInfoPopover",
					controller: context
				}).then(function (oPopover) {
					context.getView().addDependent(oPopover);
					return oPopover;
				});
			}
			var ruleData = oButton.data("Rule");
			var ruleId = ruleData.RuleID;
			var infoTxt = "";
			switch (ruleId) {
				case "002":
					infoTxt = context.getResourceBundle().getText("txtLateOnsite");
					break;
				case "003":
					infoTxt = context.getResourceBundle().getText("txtOtherRegion");
					break;
				case "004":
					infoTxt = context.getResourceBundle().getText("txtAllOnsite");
					break;
				case "005":
					infoTxt = context.getResourceBundle().getText("txtRestrictedQual");
					break;
				default:
					break;
				}
			if(context.byId("idApprovalRuleInfoPopover")){
				context.byId("idApprovalRuleInfoPopover").close();
			}
			context.getModel("buttonControlModel").setProperty("/approvalRuleInfoTxt",infoTxt);
			context._ApprovalRuleInfoPopover.then(function (oPopover) {
				oPopover.setTitle(ruleData.RuleName);
				oPopover.openBy(oButton);
			
			});
		},
		getValueDriverBySessionId: function(context,sessionId){
			var hostURL = context.getModel("SRS_Data").sServiceUrl;
			var modelContext = this;
			var valueDriverModel = new JSONModel(hostURL + "/ValueHelpSet()?$filter=( Entity eq 'VALUE_DRIVER' and ProductID eq '"+sessionId+"' )");
			if(sessionId){
				valueDriverModel.attachRequestCompleted(function (resp) {
					if (resp.getParameters("success").success) {
						if(valueDriverModel.getData().d.results.length>0){
							var results = JSON.parse(valueDriverModel.getData().d.results[0].Results);
							context.setModel(new JSONModel(results),"valueDriverModel");
						}
					} else {
						sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
						modelContext.showErrorMessage(context, resp.getParameters().errorobject);
						//Apply Auto filter off for Google Chrome
						modelContext.applyBrowserAutoFillOff();
					}
					modelContext.onCreateValidate(context);
				});
			}
		},
		showSRInfoPopover: function(oEvent,context){
			var oButton = oEvent.getSource();
			if (!context._SRInfoPopover) {
				context._SRInfoPopover = Fragment.load({
					id: context.getView().getId(),
					name: "sap.com.servicerequest.servicerequest.fragment.SRInfoPopover",
					controller: context
				}).then(function (oPopover) {
					context.getView().addDependent(oPopover);
					return oPopover;
				});
			}
			context._SRInfoPopover.then(function (oPopover) {
				oPopover.openBy(oButton);
			});
		},
		showAgreedScopePopover: function(oEvent,context){
			var oButton = oEvent.getSource();
			if (!context._AgreedScopePopover) {
				context._AgreedScopePopover = Fragment.load({
					id: context.getView().getId(),
					name: "sap.com.servicerequest.servicerequest.fragment.AgreedScopeInfoPopover",
					controller: context
				}).then(function (oPopover) {
					context.getView().addDependent(oPopover);
					return oPopover;
				});
			}
			context._AgreedScopePopover.then(function (oPopover) {
				oPopover.openBy(oButton);
			});
		},
		setEndDateBasedOnStartDateValue: function(d){
			//setting end date by adding 8 hours to start date
			return new Date(d.setTime(d.getTime()+8*60*60*1000));
		}
	
	};
});