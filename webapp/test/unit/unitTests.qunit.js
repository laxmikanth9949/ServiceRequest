/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/com/servicerequest/servicerequest/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});