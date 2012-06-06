/**
 * Interface for the logger module
 */
Aria.interfaceDefinition({
	$classpath : "aria.tools.logger.ILoggerModule",
	$extends : "aria.templates.IModuleCtrl",
	$interface : {
		/**
		 * Clean the logs
		 */
		clean : function () {}
	},
	$events : {
		newLog : {
			description : "Raised when a new log is to be displayed"
		}
	}
});