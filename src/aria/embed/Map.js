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
 * Map widget for the Embed Lib
 */
Aria.classDefinition({
	$classpath : "aria.embed.Map",
	$extends : "aria.embed.Element",
	$dependencies : ["aria.embed.controllers.MapController"],
	$constructor : function (cfg, context, lineNumber) {
		this.$Element.constructor.apply(this, arguments);
		cfg.controller = aria.embed.controllers.MapController;
		this._cfg.args = {
			id : cfg.id,
			provider : cfg.provider,
			initArgs : cfg.initArgs,
			loadingIndicator : cfg.loadingIndicator
		};

	},
	$prototype : {

		_cfgBeanName : "aria.embed.CfgBeans.MapCfg"

	}
});