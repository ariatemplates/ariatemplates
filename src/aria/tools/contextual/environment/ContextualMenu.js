/**
 * Contains getters for the ContextualMenu environment.
 * @class aria.tools.contextual.environment.ContextualMenu
 * @extends aria.core.environment.EnvironmentBase
 * @singleton
 */
Aria.classDefinition({
	$classpath : "aria.tools.contextual.environment.ContextualMenu",
	$dependencies : ["aria.tools.contextual.environment.ContextualMenuCfgBeans"],
	$extends : "aria.core.environment.EnvironmentBase",
	$singleton : true,
	$prototype : {
		/**
		 * Classpath of the bean which allows to validate the part of the environment managed by this class.
		 * @type String
		 */
		_cfgPackage : "aria.tools.contextual.environment.ContextualMenuCfgBeans.AppCfg",

		/**
		 * Returns the contextual menu settings
		 * @public
		 * @return {aria.core.environment.Environment.EnvironmentBaseCfgBeans.AppCfg}
		 */
		getContextualMenu : function () {
			return this.checkApplicationSettings("contextualMenu");
		}
	}
});