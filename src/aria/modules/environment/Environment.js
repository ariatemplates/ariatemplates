/**
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Public API for retrieving, applying application variables relative to the RequestMgr.
 * @class aria.modules.environment.Environment
 * @extends aria.core.environment.EnvironmentBase
 * @singleton
 */
Aria.classDefinition({
	$classpath : "aria.modules.environment.Environment",
	$dependencies : ["aria.modules.requestHandler.environment.RequestHandler", "aria.modules.environment.EnvironmentCfgBeans"],
	$singleton : true,
	$extends : "aria.core.environment.EnvironmentBase",
	$prototype : {
		/**
		 * Classpath of the bean which allows to validate the part of the environment managed by this class.
		 * @type String
		 */
		_cfgPackage : "aria.modules.environment.EnvironmentCfgBeans.AppCfg",

		/**
		 * Get the requestJsonSerializer configuration. It is the current configuration
		 * @public
		 * @return {aria.modules.environment.EnvironmentCfgBeans.RequestJsonSerializerCfg} The JSON serializer
		 * configuration
		 */
		getRequestJsonSerializerCfg : function () {
			this.$logWarn("The getRequestJsonSerializerCfg on this object is deprecated. Please use aria.modules.requestHandler.environment.RequestHandler.getRequestJsonSerializerCfg instead.");
			return aria.modules.requestHandler.environment.RequestHandler.getRequestJsonSerializerCfg();
		}
	}
});
//BACKWARD COMPATIBILITY ONLY: PLEASE REMOVE FILE