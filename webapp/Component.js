sap.ui.getCore().loadLibrary("sapit", { url: sap.ui.require.toUrl("sap/com/servicerequest/servicerequest") + "/resources/sapit", async: true });
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/com/servicerequest/servicerequest/model/models",
	"sapit/util/cFLPAdapter"
], function (UIComponent, Device, models, cFLPAdapter) {
	"use strict";

	return UIComponent.extend("sap/com/servicerequest/servicerequest/Component", {
		metadata: {
			manifest: "json"
		},
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
				//enable deep navigation https://github.tools.sap/sapit-cloud-technologies/url-tile-eval/blob/main/url-tile-setup-readme.md#enable-deep-nagivation
				cFLPAdapter.init();
				var DEBUG_MODE_ON = true;
				if (!DEBUG_MODE_ON) {
					console = console || {};
					console.log = function () {};
					console.error = function () {};
					console.warn = function () {};
					console.debug = function () {};
					console.assert = function () {};
					jQuery.sap.log.setLevel(jQuery.sap.log.Level.NONE);

				}
				// set the device model
				this.setModel(models.createDeviceModel(), "device");
				// set the FLP model
				this.setModel(models.createFLPModel(), "FLP");

				// call the base component's init function
				UIComponent.prototype.init.apply(this, arguments);

				// enable routing
				this.getRouter().initialize();

				// set the device model
				this.setModel(models.createDeviceModel(), "device");

				/* Mobile Usage Reporting */
				/* Version v3 */
				sap.git = sap.git || {}, sap.git.usage = sap.git.usage || {}, sap.git.usage.Reporting = {
					_lp: null,
					_load: function (a) {
						this._lp = this._lp || sap.ui.getCore().loadLibrary("sap.git.usage", {
							url: "https://sapitusage.int.sap/web-client/v3",
							async: !0
						}), this._lp.then(function () {
							a(sap.git.usage.MobileUsageReporting)
						}, this._loadFailed)
					},
					_loadFailed: function (a) {
						jQuery.sap.log.warning("[sap.git.usage.MobileUsageReporting]", "Loading failed: " + a)
					},
					setup: function (a) {
						this._load(function (b) {
							b.setup(a)
						})
					},
					addEvent: function (a, b) {
						this._load(function (c) {
							c.addEvent(a, b)
						})
					},
					setUser: function (a, b) {
						this._load(function (c) {
							c.setUser(a, b)
						})
					}
				};

				sap.git.usage.Reporting.setup(this);
				//sap.ui.getCore().getConfiguration().setLanguage("en-gb");
				
				
				var oRootPath = jQuery.sap.getModulePath("sap.com.servicerequest.servicerequest"); // your resource root
		
				var oImageModel = new sap.ui.model.json.JSONModel({
					path : oRootPath,
				});
						
				this.setModel(oImageModel, "imageModel");
				
				var backNavModel = {
					isMainViewVisible: true
				};
				this.setModel(new sap.ui.model.json.JSONModel(backNavModel), "backNavModel");
				
				var serviceUrl = "ext_commerce/odata2webservices/SRSIntegrationObject/SCServices?$filter=catalogVersion/version eq 'Online' and approvalStatus/code eq 'approved' and crmSupported eq 1 and serviceStatus/code eq 'ZSPM_SERVICE_STATUS_05' and  serviceObject/code eq 'ZSPM_SERVICE_OBJECT_1020' &$expand=serviceObject&$inlinecount=allpages&$top=1000";
				var ext_commerce_ServiceModel = new sap.ui.model.json.JSONModel(serviceUrl);
				var context = this;
				ext_commerce_ServiceModel.attachRequestCompleted(function (resp) {
					if (resp.getParameters("success").success) {
						//success to do
						var results = resp.getSource().getData().d;
						context.setModel(new sap.ui.model.json.JSONModel(results),"ext_commerce_ServiceModel");
						models.addBrandVoiceTextForService(context);
					} else {
						//error to do
						//sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
						models.showErrorMessage(context, resp.getParameters().errorobject);
					}
				});
				var ext_commerce_SessionModel = new sap.ui.model.json.JSONModel("ext_commerce/odata2webservices/SRSIntegrationObject/SCServices?$filter=catalogVersion/version eq 'Online' and approvalStatus/code eq 'approved' and crmSupported eq 1 and serviceStatus/code eq 'ZSPM_SERVICE_STATUS_05' and serviceObject/code eq 'ZSPM_SERVICE_OBJECT_1040'&$expand=serviceObject&$inlinecount=allpages&$top=1000");
				ext_commerce_SessionModel.attachRequestCompleted(function (resp) {
					if (resp.getParameters("success").success) {
						var results = resp.getSource().getData().d;
						context.setModel(new sap.ui.model.json.JSONModel(results),"ext_commerce_SessionModel");
					} else {
						//error to do
						//sap.m.MessageToast.show(context.getResourceBundle().getText("errorText"));
						models.showErrorMessage(context, resp.getParameters().errorobject);
					}
				});
				
			},

			getContentDensityClass: function() {
				if (this._sContentDensityClass === undefined) {
					// check whether FLP has already set the content density class; do nothing in this case
					if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
						  this._sContentDensityClass = "";
					} else {
						   // Store "sapUiSizeCompact" or "sapUiSizeCozy" in this._sContentDensityClass, depending on which modes are supported by the app.
						   // E.g. the “cozy” class in case sap.ui.Device.support.touch is “true” and “compact” otherwise.
						   this._sContentDensityClass = Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact";
					}
			 	}
			 	return this._sContentDensityClass;
			}
	});
});