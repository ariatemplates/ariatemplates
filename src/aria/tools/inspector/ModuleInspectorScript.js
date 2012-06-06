/**
 * Script for module display interactions
 * @class aria.tools.inspector.ModuleInspectorScript
 */
Aria.tplScriptDefinition({
	$classpath : 'aria.tools.inspector.ModuleInspectorScript',
	$prototype : {

		$dataReady : function () {
			if (!this.data["view:dataDepth"]) {
				this.data["view:dataDepth"] = 3;
			}
		},

		/**
		 * Call the module controller to reload a given module instance
		 * @param {Object} event
		 */
		reloadModule : function () {
			this.moduleCtrl.reloadModule(this.data.moduleCtrl);
		},

		/**
		 * Act on module event
		 * @param {Object} event
		 */
		onModuleEvent : function (event) {

		}

	}
});