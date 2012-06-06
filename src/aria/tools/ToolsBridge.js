/**
 * Entry point for the tools
 * @singleton
 * @class aria.tools.ToolsBridge
 */
Aria.classDefinition({
	$classpath : 'aria.tools.ToolsBridge',
	$extends : 'aria.utils.Bridge',
	$singleton : true,
	$constructor : function () {
		this.$Bridge.constructor.call(this);
	},
	$prototype : {

		/**
		 * Open the tools bridge
		 */
		open : function () {
			return this.$Bridge.open.call(this, {
				moduleCtrlClasspath : "aria.tools.ToolsModule",
				displayClasspath : "aria.tools.ToolsDisplay",
				title : "Tools"
			});
		}
	}
});