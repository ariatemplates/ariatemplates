/**
 * Script for highlight display
 * @class aria.tools.logger.LoggerDisplayScript
 */
Aria.tplScriptDefinition({
	$classpath : 'aria.tools.logger.LoggerDisplayScript',
	$prototype : {

		/**
		 * Act on module event
		 * @param {Object} event
		 */
		onModuleEvent : function (event) {
			this.$refresh();
		}
	}
});