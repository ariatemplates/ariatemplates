/**
 * Script for main tools display
 * @class aria.tools.ToolsDisplayScript
 */
Aria.tplScriptDefinition({
	$classpath : 'aria.tools.ToolsDisplayScript',
	$prototype : {

		$dataReady : function () {
			if (this.moduleCtrl.subModulesList.length > 0) {
				this.moduleCtrl.subModulesList[0]["view:selected"] = true;
			}
		},

		/**
		 * Act on module event
		 * @param {Object} event
		 */
		onModuleEvent : function (event) {
			this.$refresh();
		},

		/**
		 * Select targeted tool tab
		 * @param {aria.DomEvent} event
		 * @param {String} refPath
		 */
		selectTab : function (event, refPath) {
			var list = this.moduleCtrl.subModulesList;
			for (var index = 0, l = list.length; index < l; index++) {
				if (list[index].refpath == refPath) {
					list[index]["view:selected"] = true;
				} else {
					list[index]["view:selected"] = false;
				}
			}
			this.$refresh();
		}

	}
});