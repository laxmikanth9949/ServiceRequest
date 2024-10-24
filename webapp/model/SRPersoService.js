sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";

		// Very simple page-context personalization
		// persistence service, not for productive use!
		var SRPersoService = {

			SRData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "demoApp-servicerequestTable-ColCustomerName",
					order: 0,
					text: "Customer Name",
					visible: true
				}, {
					id: "demoApp-servicerequestTable-ColCaseID",
					order: 1,
					text: "CaseID",
					visible: true
				}, {
					id: "demoApp-servicerequestTable-ColServicerequestID",
					order: 2,
					text: "Service Request ID",
					visible: true
				}, {
					id: "demoApp-servicerequestTable-ColServicerequestTitle",
					order: 3,
					text: "Service Request Title",
					visible: true
				}, {
					id: "demoApp-servicerequestTable-ColServiceRequestOwner",
					order: 4,
					text: "Service Request Owner",
					visible: true
				}, {
					id: "demoApp-servicerequestTable-ColCreationDate",
					order: 5,
					text: "Creation Date",
					visible: true
				}, {
					id: "demoApp-servicerequestTable-ColRequestedDeliveryDate",
					order: 6,
					text: "Request Delivery Date",
					visible: true
				}, {
					id: "demoApp-servicerequestTable-ColService",
					order: 7,
					text: "Service",
					visible: true
				}, {
					id: "demoApp-servicerequestTable-ColSession",
					order: 8,
					text: "Session",
					visible: true
				}, {
					id: "demoApp-servicerequestTable-ColStatus",
					order: 9,
					text: "Status",
					visible: true
				}, {
					id: "demoApp-servicerequestTable-ColDeploymentroom",
					order: 10,
					text: "Deployment Room",
					visible: true
				}, {
					id: "demoApp-servicerequestTable-ColServiceRequestProcessor",
					order: 11,
					text: "Service Request Processor",
					visible: true
				}, {
					id: "demoApp-servicerequestTable-ColRegion",
					order: 12,
					text: "Region",
					visible: true
				},
				{
					id: "demoApp-servicerequestTable-ColCountry",
					order: 13,
					text: "Country",
					visible: true
				},
				{
					id: "demoApp-servicerequestTable-ColLastChangedDate",
					order: 14,
					text: "Last Changed",
					visible: true
				},
				{
					id: "demoApp-servicerequestTable-ColExtRef",
					order: 15,
					text: "External Reference",
					visible: false
				},
				{
					id: "demoApp-servicerequestTable-ColLastScoper",
					order: 16,
					text: "Last Scoper",
					visible: false
				}]
			},

			getPersData: function () {
				var oDeferred = new jQuery.Deferred();
				if (!this._oBundle) {
					this._oBundle = this.SRData;
				}
				var oBundle = this._oBundle;
				oDeferred.resolve(oBundle);
				return oDeferred.promise();
			},

			setPersData: function (oBundle) {
				var oDeferred = new jQuery.Deferred();
				this._oBundle = oBundle;
				oDeferred.resolve();
				return oDeferred.promise();
			},

			resetPersData: function () {
				var oDeferred = new jQuery.Deferred();
				var oInitialData = {
					_persoSchemaVersion: "1.0",
					aColumns: [{
						id: "demoApp-servicerequestTable-ColCustomerName",
						order: 0,
						text: "Customer Name",
						visible: true
					}, {
						id: "demoApp-servicerequestTable-ColCaseID",
						order: 1,
						text: "CaseID",
						visible: true
					}, {
						id: "demoApp-servicerequestTable-ColServicerequestID",
						order: 2,
						text: "Service Request ID",
						visible: true
					}, {
						id: "demoApp-servicerequestTable-ColServicerequestTitle",
						order: 3,
						text: "Service Request Title",
						visible: true
					}, {
						id: "demoApp-servicerequestTable-ColServiceRequestOwner",
						order: 4,
						text: "Service Request Owner",
						visible: true
					}, {
						id: "demoApp-servicerequestTable-ColCreationDate",
						order: 5,
						text: "Creation Date",
						visible: true
					}, {
						id: "demoApp-servicerequestTable-ColRequestedDeliveryDate",
						order: 6,
						text: "Request Delivery Date",
						visible: true
					}, {
						id: "demoApp-servicerequestTable-ColService",
						order: 7,
						text: "Service",
						visible: true
					}, {
						id: "demoApp-servicerequestTable-ColSession",
						order: 8,
						text: "Session",
						visible: true
					}, {
						id: "demoApp-servicerequestTable-ColStatus",
						order: 9,
						text: "Status",
						visible: true
					}, {
						id: "demoApp-servicerequestTable-ColDeploymentroom",
						order: 10,
						text: "Deployment Room",
						visible: true
					}, {
						id: "demoApp-servicerequestTable-ColServiceRequestProcessor",
						order: 11,
						text: "Service Request Processor",
						visible: true
					}, {
						id: "demoApp-servicerequestTable-ColRegion",
						order: 12,
						text: "Region",
						visible: true
					},
					{
						id: "demoApp-servicerequestTable-ColCountry",
						order: 13,
						text: "Country",
						visible: true
					},
					{
						id: "demoApp-servicerequestTable-ColLastChangedDate",
						order: 14,
						text: "Last Changed",
						visible: true
					},
					{
						id: "demoApp-servicerequestTable-ColExtRef",
						order: 15,
						text: "External Reference",
						visible: false
					},
					{
						id: "demoApp-servicerequestTable-ColLastScoper",
						order: 16,
						text: "Last Scoper",
						visible: false
					}]
				};

				//set personalization
				this._oBundle = oInitialData;

				//reset personalization, i.e. display table as defined
				//		this._oBundle = null;

				oDeferred.resolve();
				return oDeferred.promise();
			},

		};

		return SRPersoService;

	}, /* bExport= */ true);