/**
 * Script associated to the contextual menu for debugging
 * @class aria.tools.contextual.ContextualDisplayScript
 */
Aria.tplScriptDefinition({
	$classpath : 'aria.tools.contextual.ContextualDisplayScript',
	$prototype : {
		/**
		 * Call the bridge to notify that this template context has to be inspected, and start it if not opened yet
		 * @param {aria.DomEvent} event
		 */
		openDebug : function (event) {
			var driver = this.data.driver;
			driver.openTools();
		},

		/**
		 * Reload associated template context
		 * @param {aria.DomEvent} event
		 */
		reloadTemplate : function (event) {
			this.data.templateCtxt.$reload();
			this.data.driver.close();
		},

		/**
		 * Reload associated module
		 * @param {aria.DomEvent} event
		 */
		reloadModule : function () {
			aria.templates.ModuleCtrlFactory.reloadModuleCtrl(this.data.templateCtxt.moduleCtrlPrivate);
			this.data.driver.close();
		}
	}
});