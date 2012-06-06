/**
 * Interface for the inspector module
 */
Aria.interfaceDefinition({
	$classpath : "aria.tools.inspector.IInspectorModule",
	$extends : "aria.templates.IModuleCtrl",
	$interface : {
		// The $interface section contains empty functions and empty object or array properties
		displayHighlight : function () {},
		reloadTemplate : function () {},
		refreshTemplate : function () {},
		reloadModule : function () {},
		getSource : function () {}
	},
	$events : {
		contentChanged : {
			description : "Raised when application content has changed"
		}
	}
});