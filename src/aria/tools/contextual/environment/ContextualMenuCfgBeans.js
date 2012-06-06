/**
 * Bean definition containing default settings for the ContextualMenu environment.
 */
Aria.beanDefinitions({
	$package : "aria.tools.contextual.environment.ContextualMenuCfgBeans",
	$description : "A definition of the JSON beans used to set the environment settings.",
	$namespaces : {
		"json" : "aria.core.JsonTypes",
		"environmentBase" : "aria.core.environment.EnvironmentBaseCfgBeans"
	},
	$beans : {
		"AppCfg" : {
			$type : "json:Object",
			$description : "Application environment variables",
			$restricted : false,
			$properties : {
				"contextualMenu" : {
					$type : "ContextualMenuCfg",
					$default : {}
				}
			}
		},

		"ContextualMenuCfg" : {
			$type : "json:Object",
			$description : "Settings related to the contextual menu.",
			$properties : {
				"enabled" : {
					$type : "json:Boolean",
					$description : "Control whether the contextual menu is enabled or disabled.",
					$default : Aria.debug
				},
				"template" : {
					$type : "json:PackageName",
					$description : "Classpath of the template used inside the contextual menu.",
					$default : "aria.tools.contextual.ContextualDisplay"
				},
				"moduleCtrl" : {
					$type : "json:PackageName",
					$description : "Classpath of the module controller used inside the contextual menu.",
					$default : "aria.tools.contextual.ContextualModule"
				}
			}
		}
	}
});