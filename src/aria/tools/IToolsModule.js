/**
 * Interface for the tools module
 */
Aria.interfaceDefinition({
	$classpath : "aria.tools.IToolsModule",
	$extends : "aria.templates.IModuleCtrl",
	$interface : {
		/**
		 * Sub modules, one for each tool available. Each will load a sub module and appropriate display.
		 * @type Array 
		 */
		subModulesList : []
	},
	$events : {
		bridgeReady : {
			description : "Raised when the bridge to the main window is available"
		},
		modulesReady : {
			description : "Raised when the debug submodules are ready"
		}
	}

});