/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/com/servicerequest/servicerequest/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});