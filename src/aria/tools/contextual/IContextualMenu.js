/**
 * Interface for aria.tools.ContextualMenu to be accessible from outside the framework, when developping tools to debug
 * or customize Aria Templates applications.
 * @class aria.tools.contextual.IContextualMenu
 */
Aria.interfaceDefinition({
	$classpath : 'aria.tools.contextual.IContextualMenu',
	$interface : {
		/**
		 * Close the contextual menu
		 */
		close : "Function",
		
		/**
		 * open the contextual menu
		 */
		open : "Function",

		/**
		 * Start the tools module with a template context to inspect
		 */
		openTools : "Function"
	}
});
