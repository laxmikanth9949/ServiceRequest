sap.ui.define(["sap/com/servicerequest/servicerequest/model/models"], function (models) {
	"use strict";

	var Formatter = {
		statusState: function (sSRStatusStateValue) {
			var colorScheme = 9;
			switch (sSRStatusStateValue) {
			case models.STATUS_NEW: // New
				colorScheme = 9;
				break;
			case models.STATUS_VIOLATED: // Violated
				colorScheme = 3;
				break;
			case models.STATUS_INSCOPING: // In Scoping
				colorScheme = 1;
				break;
			case models.STATUS_INEXCEPTION: // In Exception
				colorScheme = 1;
				break;
			case models.STATUS_APPROVED: // Approved
				colorScheme = 5;
				break;
			case models.STATUS_CANCELED: // Canceled
				colorScheme = 2;
				break;
			case models.STATUS_SOCREATED: // SO Created
				colorScheme = 8;
				break;
			case models.STATUS_AUTHORACTION: // Author Action
				colorScheme = 9;
				break;
			}
			return colorScheme;
		},
		approvalStatusState: function (sApprovalStateValue) {
			var colorScheme = 9;
			switch (sApprovalStateValue) {
			case models.RULE_VIOLATED: // Violated 
				colorScheme = 3;
				break;
			case models.RULE_NO_VIOLATION: // No Violation
				colorScheme = 8;
				break;
			case models.RULE_EXCEPTION_APPROVED: // Exception Approved
				colorScheme = 8;
				break;
			case models.RULE_EXCEPTION_REJECTED: // Exception Rejected
				colorScheme = 3;
				break;
			}
			return colorScheme;
		},
		violationAlertDisplay: function (sServiceRequestStatusCode, aApprovalRules) {
			var isShowViolationAlert = false;
			if (sServiceRequestStatusCode !== undefined && sServiceRequestStatusCode !== models.STATUS_CANCELED && sServiceRequestStatusCode !==
				models.STATUS_SOCREATED) {
				if (!jQuery.isEmptyObject(aApprovalRules)) {
					for (var i = 0; i < aApprovalRules.length; i++) {
						if (aApprovalRules[i].StatusID === "VIO") {
							isShowViolationAlert = true;
							break;
						}
					}
				}
			}

			return isShowViolationAlert;
		},
		removePrecedingZerosInItemNo: function (sItemNo) {
			if (sItemNo === null || sItemNo === "" || sItemNo === undefined) {
				return sItemNo;
			} else {
				return sItemNo.replace(/\b0+/g, '');
			}
		},

		ruleApprovalActionVisibility: function (sStateValue) {
			if (sStateValue !== models.RULE_NO_VIOLATION) {
				return true;
			} else {
				return false;
			}
		},
		ruleApprovalActionEnable: function (isApprover, sSRStatus, sSRRuleStatus) {
			if (isApprover && sSRStatus === models.STATUS_INEXCEPTION && sSRRuleStatus !== models.RULE_NO_VIOLATION) {
				return true;
			} else {
				return false;
			}
		},
		ruleApprovePressState: function (sSRRuleStatus) {
			if (sSRRuleStatus === models.RULE_EXCEPTION_APPROVED) {
				return true;
			} else {
				return false;
			}
		},
		ruleRejectPressState: function (sSRRuleStatus) {
			if (sSRRuleStatus === models.RULE_EXCEPTION_REJECTED) {
				return true;
			} else {
				return false;
			}
		},
		/*
		formatRDDInputField: function(dateValue){
			if (dateValue) {
				var date = new Date(dateValue);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					style: "medium",
				});
				return oDateFormat.format(date);
			} else {
				return dateValue;
			}
		},*/
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
		dateTime: function (dateValue) {
			if (dateValue) {
				// var date = new Date(dateValue);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					style: "medium"
				});
				return oDateFormat.format(dateValue);
			} else {
				return dateValue;
			}
		},
		/*
		dateTimeDisplayScope: function (dateValue) {
			if (dateValue) {
				// var date = new Date(dateValue);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					style: "medium"
				});
				return oDateFormat.format(dateValue);
			} else {
				return dateValue;
			}
		},
		dateTimeSRList: function (dateValue) {
			if (dateValue) {
				// var date = new Date(dateValue);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					style: "medium"
				});
				return oDateFormat.format(dateValue);
			} else {
				return dateValue;
			}
		},*/
		openfor: function (dateValue, statusCode) {
			return models.calculateOpenForTime(dateValue, statusCode);		
		},
		formatNoteLastChanged: function (firstName, lastName, creationDate) {
			var formattedHTML = "";
			if (creationDate) {
				formattedHTML = "<em>" + this.getResourceBundle().getText("lastChangedBy") + " " +
					firstName + " " +
					lastName + " " + this.getResourceBundle().getText("at") + " ";
				var dateTime = this.formatter.dateTime(creationDate);
				formattedHTML = formattedHTML + dateTime + "</em>";
			}
			return formattedHTML;
		},
		formatEmphasized: function (sText) {
			var formattedHTML = "";
			formattedHTML = "<em>" + "(" + sText + ")" + "</em>";
			return formattedHTML;
		},
		formatTimelineDateAndTime: function (creationDate) {
			return this.formatter.dateTime(creationDate);
		},
		setDetailPageHeaderTitle: function (sSRDescription, sServiceRequestId, sCustomerId, sCustomerName) {
			var sSRDetailPageTitle = "";
			if (sSRDescription) {
				if (sServiceRequestId) {
					sSRDetailPageTitle = "SR " + sServiceRequestId + ", " + sSRDescription;
				} else {
					sSRDetailPageTitle = "SR " + sSRDescription;
				}
				if (sCustomerId && sCustomerName) {
					sSRDetailPageTitle = sSRDetailPageTitle + ", " + sCustomerName + "(" + sCustomerId + ")";
				}
			}
			return sSRDetailPageTitle;
		},
		idAndNameFormatter: function (id, value) {
			if (id === models.SR_ITEM_0) {
				return "";
			} else if (id) {
				return "(" + id + ") " + value;
			}
			return value;
		},
		idAndNameFormatterForCustomer : function (id, value) {
			if (id === models.SR_ITEM_0) {
				return "";
			} else if (id) {
				return value + " (" + id +")";
			}
			return value;
		},
		idAndNameFormatterWithBrandVoice: function(id, ServiceName,brandVoiceTxt){
			if (id === models.SR_ITEM_0) {
				return "";
			} else if (id) {
				if(brandVoiceTxt){
					return "(" + id + ") " + brandVoiceTxt;
				}else if(ServiceName){
					return "(" + id + ") " + ServiceName;
				}
			}
			return ServiceName;
		},
		availableCalloffDaysFormatter: function (contractId, days) {
			if (!days && contractId) {
				return "0";
			}
			return days;
		},
		totalCallOffDaysFormatter: function (days) {
			if (days) {
				return parseFloat(days);
			}
			return days;
		},
		isTextControlEnabled: function (itemNo) {
			if (itemNo === models.SR_ITEM_20 || itemNo === models.SR_ITEM_10 || itemNo === models.SR_ITEM_15) {
				return true;
			}
			return false;
		},
		isInputControlEnabled: function (itemNo) {
			if (itemNo === models.SR_ITEM_20 || itemNo === models.SR_ITEM_10 || itemNo === models.SR_ITEM_15) {
				return false;
			}
			return true;
		},
		showIconForItems: function (itemNo, itemEditable, IsPreferredSuccessServiceSelected) {
			if(IsPreferredSuccessServiceSelected){
				return false;
			}
			if (itemEditable) {
				if (itemNo === models.SR_ITEM_10) {
					return false;
				}
				return true;
			} else {
				return false;
			}
		},
		enableDeliveryTeam: function (itemEditable, IsPreferredSuccessServiceSelected) {
			if(IsPreferredSuccessServiceSelected){
				return false;
			}
			if (this.getModel("servicerequestModel").getData().ServiceRequestID) {
				if (itemEditable) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}

		},
		showIconForItemsDelete: function (itemNo, itemEditable) {
			if (itemEditable) {
				if (itemNo === models.SR_ITEM_10 || itemNo === models.SR_ITEM_20 || itemNo === models.SR_ITEM_15) {
					return false;
				}
				return true;
			} else {
				return false;
			}
		},
		changeFontStyle: function (itemNo, value) {
			if (itemNo === models.SR_ITEM_10) {
				return "bold";
			}
			return "";
		},
		isTextControlEnabledForCallOffDays: function (itemNo) {
			if (itemNo === models.SR_ITEM_10) {
				return true;
			}
			return false;
		},
		isInputControlEnabledForCallOffDays: function (itemNo) {
			if (itemNo === models.SR_ITEM_10) {
				return false;
			}
			return true;
		},
		isDREnabled: function (isEditable, region) {
			var doesRegionExist = false;
			if (region) {
				doesRegionExist = true;
			}
			if (doesRegionExist && isEditable) {
				return true;
			} else {
				return false;
			}
		},
		formatSRItemsDateHeader: function (text) {
			var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (timezone) {
				return text + " (" + timezone + ") ";
			} else {
				return text + " () ";
			}
		},
		removeWhiteSpace: function (text) {
			return text === undefined ? text : text.trim();
		},
		showSOLink: function (soNumber) {
			if (soNumber) {
				return true;
			}
			return false;
		},
		showNoTimeZoneInfo: function (NoUserTzMaintained) {
			return NoUserTzMaintained;
		},
		formatTimeZoneMessageStrip: function (timezone) {
			return this.getResourceBundle().getText("txtMissingTimezone", timezone);
		},
		formatDateLimitMinDate: function (date) {
			let isPrSServiceSelected = this.getModel("buttonControlModel").getProperty("/IsPreferredSuccessServiceSelected");
			if(isPrSServiceSelected){
				return new Date();
			}
			if (date) {
				//date.setMinutes(date.getTimezoneOffset() - date.getMinutes());
				//date.setHours(0, 0, 0, 0);
				return date;
			}
		},
		formatDateLimit: function (date) {
			if (date) {
				//date.setMinutes(date.getTimezoneOffset() - date.getMinutes());
				//date.setHours(0, 0, 0, 0);
				return date;
			}
		},
		formatDateLimitForRDD: function(date,IsPreferredSuccessServiceSelected){
			if(IsPreferredSuccessServiceSelected){
				return  new Date();
			}
		},
		SRItemsControlVisibility: function (itemNo,IsPreferredSuccessServiceSelected) {
			if(IsPreferredSuccessServiceSelected){
				return false;
			}
			if (itemNo === models.SR_ITEM_10) {
				return false;
			}
			return true;
		},
		formatProcessorName: function (userId, userName) {
			if (userId) {
				return userName;
			} else {
				return "";
			}
		},
		formatCreationDateFrom: function (date) {
			if (date) {
				date.setHours(0, 0, 0, 0);
				return date;
			}
			return date;
		},
		formatCreationDateTo: function (date) {
			if (date) {
				date.setHours(23, 59, 0, 0);
				return date;
			}
			return date;
		},
		isTextControlEnabledForStartDate: function (itemNo) {
			if (itemNo === models.SR_ITEM_20) {
				return true;
			}
			return false;
		},
		enableStartDate: function (itemNo, defaultValue) {
			//if (itemNo === models.SR_ITEM_20) {
			//	return false;
			//}
			return defaultValue;
		},
		showSessionTotalCallOffDays: function (sSessionName, totalCallOffDays, brandVoiceTxt) {
			var sformattedSessionTotalCallOffDays = "";
			if (sSessionName || brandVoiceTxt) {
				totalCallOffDays = totalCallOffDays * 1;
				if(brandVoiceTxt){
					sformattedSessionTotalCallOffDays = brandVoiceTxt + " (" + totalCallOffDays + (totalCallOffDays > 1 ? " days" : " day") + ")";
				}else{
					sformattedSessionTotalCallOffDays = sSessionName + " (" + totalCallOffDays + (totalCallOffDays > 1 ? " days" : " day") + ")";
				}
			}
			return sformattedSessionTotalCallOffDays;
		},
		showResponsiblePerson: function (sStatusId) {
			if ((sStatusId === models.RULE_EXCEPTION_REJECTED || sStatusId === models.RULE_EXCEPTION_APPROVED)) {
				return true;
			} else {
				return false;
			}
		},
		setSessionHREF: function (componentID) {
			return models.setSessionHREF(componentID);
		},
		formatSystemIcon: function (solmanID, DeployModT, ShallAppendSolmanAtBotton) {
			if (!ShallAppendSolmanAtBotton) {
				return false;
			}
			if (DeployModT && DeployModT.toUpperCase() !== "CLOUD" && !solmanID) {
				return true;
			}
			return false;
		},
		formatSOURL: function (SONumber, SOURL) {
			var isUserTQM = this.getModel("SRS_Data_UserSet").getProperty("/isTQM");
			return models.SONavigationLink(isUserTQM, SONumber, SOURL, this);
		},
		formatAttachmentURLs: function (objectGuid, FileGuid) {
			return "zs_app_srs_srv/AttachmentSet(ObjectID='" + objectGuid + "',FileGuid='" + FileGuid + "')/$value";
		},
		formatDocuemntID: function (objectGuid, FileGuid) {
			return objectGuid + "|" + FileGuid;
		},
		formatAttachmentThumbnailURLs: function (objectGuid, FileGuid, FileType) {
			var url = "";
			if (FileType) {
				FileType = FileType.toUpperCase();
			}
			if (FileType && FileType.includes("IMAGE")) {
				url = "zs_app_srs_srv/AttachmentSet(ObjectID='" + objectGuid + "',FileGuid='" + FileGuid + "')/$value";
			}
			return url;
		},
		convertBytesToSize: function (bytes) {
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			if (bytes == 0) return '0 Byte';
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		},
		showHistoryBtn: function (editMode) {
			if (editMode) {
				return false;
			}
			return true;
		},
		changeHistoryTimeConversion: function (time) {
			var duration = time.ms;
			var minutes = Math.floor((duration / (1000 * 60)) % 60),
				hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

			hours = (hours < 10) ? "0" + hours : hours;
			minutes = (minutes < 10) ? "0" + minutes : minutes;
			return hours + ":" + minutes;
		},
		setStatusColorForUserRoles: function (value) {
			if (value) {
				return "Good";
			}
			return "Error";
		},
		ShowCreateRequestLink: function (value) {
			if (value) {
				return false;
			}
			return true;
		},
		setRolesRequestHREF: function (value) {
			var sSystem = models.getSystemLandscapeInfo();
			var link = models.ARM_Link;
			if (value === "TQM") {
				link += sSystem + models.TQM_PROFILE;
			} else if (value === "SCOPER") {
				link += sSystem + models.SCOPER_PROFILE;
			} else if (value === "APPROVER") {
				link += sSystem + models.SCOPER_PROFILE;
			} else if (value === "GUEST") {
				link += sSystem + models.GUEST_PROFILE;
			}
			return link;
		},
		isGuestRoleVisibe: function (isTQM, isScoper, isApprover, isGuest) {
			if (isTQM || isScoper || isApprover) {
				return false;
			}
			return true;
		},
		setRoleStatusIndicatorTooltip: function (value) {
			if (value) {
				return "Granted";
			}
			return "Not Granted";
		},
		systemIdAndNameFormatter: function (id, value) {
			/*if (id !== models.OSP_SYSTEM_REFERENCESYSTEMID) {
				if (id) {
					return "(" + id + ") " + value;
				}
				return value;
			} else {
				return "";
			}
			*/
			if (id) {
				return "(" + id + ") " + value;
			}
			return value;

		},
		SRItemsDeliveryTeamLabelVisibility: function (value) {
			if (value === models.SR_ITEM_10) {
				return true;
			}
			return false;
		},
		shipToCountryVisibility: function (systemReferenceID) {
			/*if(systemReferenceID === models.OSP_SYSTEM_REFERENCESYSTEMID){
				return false;
			}*/
			return true;
		},
		setSRProgressStatusText: function (status) {
			if (status === "C") {
				return "Completed";
			} else if (status === "O") {
				return "Not Applicable";
			}
			return "Pending";
		},
		setSRProgressStatusColor: function (status) {
			if (status === "C") {
				return 8;
			} else if (status === "O") {
				return 6;
			}
			return 1;
		},
		showDoItNowLink: function (status, comment) {
			if (status === "C" || comment === "NotReady") {
				return false;
			}
			return true;
		},
		showDoItNowText: function (status, comment) {
			if (status === "C") {
				return false;
			}
			if (comment === "NotReady") {
				return true;
			}
			return false;
		},
		changeFontStyleForProgressTableStatusCol: function (headerTitle) {
			if (headerTitle) {
				return "bold";
			}
			return "";
		},
		setSRProgressHboxVisibility: function (SR_ID, status, editModeEnabled) {
			if (editModeEnabled) {
				return false;
			}
			if (!SR_ID && status === models.STATUS_NEW) {
				return false;
			}

			if (status === models.STATUS_CANCELED) {
				return false;
			}
			return true;
		},
		showDoItNowLinkComment: function (text) {
			var tempText, textSplit_2;
			if (text && text.includes("+")) {
				tempText = text.split("+");
				text = tempText[0];
				textSplit_2 = tempText[1];
			}
			if (text === "NotReady") {
				return "Not Ready";
			} else if (text === "Ready") {
				var txt = "Do it now";
				if (textSplit_2) {
					txt = txt + " (" + textSplit_2 + ")";
				}
				return txt;
			} else {
				return text;
			}
		},
		calculateCharLength: function (title) {
			if (title) {
				var remLength = 40 - title.length;
				return "(" + remLength + " Characters remaining)";
			}
			return "(40 Characters remaining)";
		},
		extRefVisibility: function (userModel) {
			if (userModel.isScoper || userModel.isApprover) {
				return true;
			}
			return false;

		},
		formatContractType: function (id, desc) {
			return models.formatContractType(id, desc);
		},
		setMandatoryTitleAgreedScope: function (statusCode) {
			if (statusCode === models.STATUS_INSCOPING) {
				return true;
			}
			return false;
		},
		showServiceContactField: function (showEODServiceControl, serviceContactID) {
			if (!serviceContactID) {
				return false;
			}
			return showEODServiceControl;
		},
		/*
		showOSPSystemHBox: function (ReferenceSystemID, SolmanComponent, InstNo) {
			if (ReferenceSystemID === models.OSP_SYSTEM_REFERENCESYSTEMID && SolmanComponent === models.OSP_SYSTEM_SOLMAN && InstNo === models.OSP_SYSTEM_INSTNO) {
				return true;
			}
			return false;
		},*/
		showUnassignedSRField: function (isScoper) {
			return isScoper;
		},
		visibleSurveyRcpt: function (feedbackEnabled) {
			return feedbackEnabled;
		},
		isSessionRequired: function (serviceId) {
			if (serviceId) {
				return true;
			}
			return false;
		},
		showProcessorAvatar: function (processorId) {
			if (processorId) {
				return true;
			}
			return false;
		},
		calcPotntlLeadTime: function (creationDate, RDD) {
			if(creationDate && RDD){
				var date1 = new Date(creationDate.getFullYear(),creationDate.getMonth(),creationDate.getDate());
				var date2 = new Date(RDD.getFullYear(),RDD.getMonth(),RDD.getDate());
				var ptl = models.calculateDateDifference(date1, date2);
				if(ptl === 1 || ptl === -1){
					return models.prefixPTL+ptl+" day"+models.suffixPTL;
				}
				return models.prefixPTL+ptl+" days"+models.suffixPTL;
			}
		},
		showPotntLeadTIme: function (creationDate, RDD) {
			if (creationDate && RDD) {
				return true;
			}
			return false;
		},
		fontStylePLT: function (creationDate, RDD) {
			if(creationDate && RDD){
				var date1 = new Date(creationDate.getFullYear(),creationDate.getMonth(),creationDate.getDate());
				var date2 = new Date(RDD.getFullYear(),RDD.getMonth(),RDD.getDate());
				var days = models.calculateDateDifference(date1, date2);
				if (days < 14) {
					return "boldRed";
				}
				return "";
			}
		},
		showLastChanged: function(lastChangedDate){
			if(lastChangedDate){
				return true;
			}
			return false;
		},
		calcLastChanged: function(lastChangedDate){
			if(lastChangedDate){
				var date = new Date();
				var timeDifference = date.getTime() - lastChangedDate.getTime();
				var hoursDifference = Math.floor(timeDifference / 1000 / 60 / 60);
				var dateDiff = models.calculateDateDifference(lastChangedDate,date);
				
				if(hoursDifference<1){
					var minutesDifference = Math.floor(timeDifference / 1000 / 60);
					if(minutesDifference<=1){
						minutesDifference = minutesDifference + " minute ago";
					}else{
						minutesDifference = minutesDifference + " minutes ago";
					}
					return minutesDifference;
				}else if(dateDiff<1){
					if(lastChangedDate.getDate() === date.getDate() && lastChangedDate.getMonth() === date.getMonth() && lastChangedDate.getFullYear() === date.getFullYear()){
						return "Today";
					}else{
						return "Yesterday";
					}
				}else{
					if(dateDiff === 1){
						return dateDiff+" day ago";
					}
					return dateDiff+" days ago";
				}
			}
		},
		handleSRInfoValueState: function(srInfo, srStatusCode) {
		var srInfoValueState = sap.ui.core.ValueState.None;
			if(((srInfo === this.getResourceBundle().getText("serviceRequestInfoPlaceholder") || srInfo ==="" || srInfo === null) && 
					(srStatusCode === models.STATUS_NEW ||  srStatusCode === models.STATUS_INSCOPING || srStatusCode ===  models.STATUS_AUTHORACTION)) || (srInfo && srInfo.length >= 10000)) {
				srInfoValueState = sap.ui.core.ValueState.Warning;
			}
			return srInfoValueState;
		},
		srInfoValueStateText: function(srInfo, srStatusCode) {
		var srInfoValueStateText = "";
			if((srInfo === this.getResourceBundle().getText("serviceRequestInfoPlaceholder") || srInfo ==="" || srInfo === null) && (srStatusCode === models.STATUS_NEW ||  srStatusCode === models.STATUS_INSCOPING || srStatusCode ===  models.STATUS_AUTHORACTION)) {
				srInfoValueStateText = this.getResourceBundle().getText("txtRequiredforScoping");
			} else {
				if(srInfo && srInfo.length >= 10000) {
					srInfoValueStateText = this.getResourceBundle().getText("maxCharLimitReached");
				}
			}
			return srInfoValueStateText;
		},		
		requiredForScopingIndicator: function(fieldValue, srStatusCode) { // Relevant for Customer Contact and System fields
			if((fieldValue ==="0" || fieldValue ==="" || fieldValue === null) && (srStatusCode === models.STATUS_NEW ||  srStatusCode === models.STATUS_INSCOPING || srStatusCode ===  models.STATUS_AUTHORACTION)) {
				return sap.ui.core.ValueState.Warning;
			} 
		},
		requiredForScopingValueStateText: function(fieldValue, srStatusCode) { // Relevant for Customer Contact fields
			if((fieldValue ==="0" || fieldValue ==="" || fieldValue === null) && (srStatusCode === models.STATUS_NEW ||  srStatusCode === models.STATUS_INSCOPING || srStatusCode ===  models.STATUS_AUTHORACTION)) {
				return this.getResourceBundle().getText("txtRequiredforScoping");
			} 
		},
		requiredForScopingValueStateTextForSystem: function(fieldValue, srStatusCode) { // Relevant for System fields
			if((fieldValue ==="0" || fieldValue ==="" || fieldValue === null) && (srStatusCode === models.STATUS_NEW ||  srStatusCode === models.STATUS_INSCOPING || srStatusCode ===  models.STATUS_AUTHORACTION)) {
				return this.getResourceBundle().getText("txtRequiredforScopingSystem");
			} 
		},
		fontStyleLastChanged: function(lastChangedDate){
			var days = models.calculateDateDifference(lastChangedDate, new Date());
			var status = this.getModel("servicerequestModel").getProperty("/StatusCode");
		
			if (days >= 7){
				if(!(status === models.STATUS_NEW ||  status === models.STATUS_CANCELED || status ===  models.STATUS_SOCREATED)){
					return "boldRed";	
				}
			}
			return "";
		},
		visibleCustomer: function(customerId){
			if(customerId){
				return true;
			}
			return false;
		},
		enableSystemDependentFields: function(referenceSystemId,controlData,defaultEnabled){
			/*if(defaultEnabled ){
				if(controlData){
					return true;
				} else if(referenceSystemId && referenceSystemId !== "0"){
					return true;
				}
			}
			return false;*/
			return defaultEnabled;
		},
		formatWbsEnabled: function(WBSFlag){
			if(WBSFlag){
				return "Yes";
			}
			return "No";
		},
		formatTextForAvailableCallOffDays: function(serviceID){
			var txt = "Days";
			if(serviceID === models.SERVICE_ON_CALL_DUTY){
				txt = "PC";
			}
			return this.getResourceBundle().getText("availableContractDays",txt);
		},
		formatTextForTotalCallOffDays: function(serviceID){
			var txt = "Days";
			if(serviceID === models.SERVICE_ON_CALL_DUTY){
				txt = "PC";
			}
			return this.getResourceBundle().getText("totalCallOffDays",txt);
		},
		formatTextForCallOffDaysHeader: function(serviceID){
			var txt = "Days";
			if(serviceID === models.SERVICE_ON_CALL_DUTY){
				txt = "PC";
			}
			return this.getResourceBundle().getText("callOffDays",txt);
		},
		formatTextForCallOffDaysMsg: function(serviceID){
			var txt = "value";
			/*if(serviceID === models.SERVICE_ON_CALL_DUTY){
				txt = "PC";
			}*/
			return this.getResourceBundle().getText("txtContractValidationMsg");
		},
		formatCallOffDaysforCODService: function(callOffDays,service){
			if(service === models.SERVICE_ON_CALL_DUTY){
				return (parseInt(callOffDays)).toString();
			}
			return callOffDays;
		},
		showMsgIfOCDPreSelected: function(service){
			if(service === models.SERVICE_ON_CALL_DUTY){
				return true;
			}
			return false;
		},
		showSortButton: function(){
			if (sap.ui.Device.system.phone) {
 				return true;	
 			}
 			return false;
		},
		setShareBtnVisibility: function(isNEWSR){
			if(isNEWSR){
				return false;
			}
			return true;
		},
		setSessionLinkVisibility: function(sessionId){
			if(sessionId){
				return true;
			}
			return false;
		},
		showContractAndRelatedFields: function(selectedKey){
			if(selectedKey){
				this.byId("ServiceName-edit").setSelectedKey(selectedKey);
				var isContractMandatory = this.byId("ServiceName-edit").getSelectedItem();
				//var isContractMandatory = this.byId("ServiceName-edit").getSelectedItem().data("selectedProductSet").ContractMandatory;
				//this.byId("idFormContract").setVisible(isContractMandatory);
				//this.byId("idFormContractItem").setVisible(isContractMandatory);
			}
		},
		formatCloudRefObjProductID: function(productID){
			if(productID && productID.includes("S_0")){
				return productID.split("S_0")[1];
			}
			return productID;
		},
		cloudRefObjectIcon: function (sProductID, sMainObject) {
			if(!sProductID){
				return null;
			}
			if (sProductID.startsWith("S_")) {
				if (sMainObject === "X") {
					return "sap-icon://home";
				} else {
					return "sap-icon://cloud";
				}
			} else if (sProductID.startsWith("PV_")) {
				return "sap-icon://document";
			} 
			return null;
		},
		showHideDeleteIconCloudRefObj: function(mainObject){
			if(mainObject){
				return false;
			}
			return true;
		},
		showHideAddIconCloudRefObj: function(parentComponet){
			if(parentComponet==="0"){
					return true;
			}
			return false;
		},
		showHideActionColumn: function(isVisible){
			if(!isVisible){
				return false;
			}
		},
		formatRefObjectsFirsColumn: function(IbComponent, SystemRefNum, DeployMod, SID, SysDescription){
			if(IbComponent=== models.SEARCH_SYSTEM_KEY){
				return SysDescription;
			}
			if(DeployMod===models.DeployModCloud){
				return SystemRefNum + " / "+SysDescription;
			}else{
				return IbComponent+""+ " / "+SysDescription;
			}
		},
		formatRowHighlight: function(status){
			if(status){
			 return "Success";
			}
			return "None";
		},
		getPictureURL: function(userId){
			if(userId){
				return ("./sapit-employee-data/Employees/" + userId + "/profilePicture");
			}
		},
		showAddDescriptionBtn: function(serviceDelText,itemNo, statusCode){

			if(statusCode === models.STATUS_APPROVED){
				return false;
			}

			if(itemNo === models.SR_ITEM_10){
				return false;
			}
			if(serviceDelText){
				return false;
			}
			return true;
		},
		showEditDescriptionFields: function(serviceDelText,itemNo){
			if(itemNo === models.SR_ITEM_10){
				return false;
			}
			if(serviceDelText){
				return true;
			}
			return false;
		},
		enableImmediateSOCheckbox: function(editMode,enableImmediateSO, enableSession, statusCode){
			if (!editMode) {
				return false;
			}

			if(statusCode === models.STATUS_APPROVED)
			{
				return false;
			}

			return enableImmediateSO;
		},
		showEditDescriptionBtn: function(statusCode){
			if(statusCode === models.STATUS_APPROVED){
				return false;
			}
			return true;
		},
		formatDeletionFlagText: function(deletionFlag){
			if(deletionFlag==="Y"){
				return "Yes";
			}
			return "No";
		},
		showCancellationFields: function(statusCode){
			if(statusCode===models.STATUS_CANCELED){
				return true;
			}
			return false;
		},
		showRDLInDisplayMode: function(rdlCode){
			if(rdlCode){
				return true;
			}
			return false;
		},
		formatTPTText: function(type,txt){
			if(type){
				return type + " - " + txt;
			}
			 
		},
		showMsgBasedOnUserRole: function(isScoper, isTQM, isApprover){
			if(isTQM && !isScoper && !isApprover){
				return this.getResourceBundle().getText("txtMsgSignavioRequestor");
			} else{
				return this.getResourceBundle().getText("txtMsgSignavioScoper");
			}
		},
		formatValueDriverDisplayText: function(valueDrivers){
			var txt = "";
			if(valueDrivers && valueDrivers.length>0){
				for(var vd of valueDrivers){
					txt += vd["ValueDriverText"] +"\n";
				}
			}
			return txt;
		},
		showValueDriverForm: function(valueDriverModel){
			if(valueDriverModel && valueDriverModel.length>0){
				return true;
			}
			return false;
		},
		showEnableFeedbackEmailTxt: function(SurveyRecName,txtSurveyRecipient,isFeedbackEnabled){
			if(isFeedbackEnabled && SurveyRecName){
				return SurveyRecName + " ("+txtSurveyRecipient+")";
			}
			return "";
		},
		getServiceCatalogueURL: function(){
			var url = "https://servicescatalog.cvdp3eof-dbsservic1-s1-public.model-t.cc.commerce.ondemand.com/";
			if (models.getSystemLandscapeInfo()===models.BACKND_SYS_ICP) {
				url = "https://go.sap.corp/services-catalog";
			}
			return url;
		},
		showAssignBackProcessorBtn: function(lastScoperUser,StatusCode,LoggedInUser,OwnerUser,ProcessorUser){
			if(LoggedInUser === OwnerUser){
				return false;
			}else if(lastScoperUser === ProcessorUser){
				return false;
			}else if(lastScoperUser && StatusCode === models.STATUS_INSCOPING){
				return true;
			}
			return false;
		},
		showLastScoperField: function(SRID){
			if(!SRID){
				return false;
			}
			return true;
		}
		
	};
	return Formatter;

}, /* bExport= */ true);