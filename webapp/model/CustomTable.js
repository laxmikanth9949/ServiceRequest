sap.ui.define([

], function () {
	"use strict";

	return sap.m.Table.extend("sap/com/servicerequest/servicerequest/model/CustomTable", {
		renderer: function (oRm, oControl) {
			sap.m.TableRenderer.render(oRm, oControl);
		},

		onAfterRendering: function () {
			sap.m.Table.prototype.onAfterRendering.apply(this, arguments);
		},

		onColumnPress: function (oColumn) {
			if (sap.m.Table.prototype.onColumnPress) {
				sap.m.Table.prototype.onColumnPress(oColumn);
			}
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("onSRColumnPress", "onSRColumnPressSuccess", oColumn);

		}

	});
});