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
 * Element widget for the Embed Lib
 * @class aria.embed.Element
 * @extends aria.widgetLibs.BaseWidget
 */
Aria.classDefinition({
	$classpath : "aria.embed.Element",
	$extends : "aria.widgetLibs.BaseWidget",
	$dependencies : ['aria.embed.CfgBeans', 'aria.utils.Html', 'aria.core.JsonValidator', 'aria.core.Log',
			'aria.utils.Dom'],
	$statics : {
		INVALID_CONFIGURATION : "%1Configuration for widget is not valid."
	},
	$constructor : function (cfg, context, lineNumber) {
		// The parent constructor takes care of storing the config in this._cfg, the template context in this._context
		// and the line number in this._lineNumber
		this.$BaseWidget.constructor.apply(this, arguments);

		try {
			this._cfgOk = aria.core.JsonValidator.normalize({
				json : cfg,
				beanName : this._cfgBeanName
			}, true);
		} catch (e) {
			var logs = aria.core.Log;
			if (logs) {
				var error;
				for (var index = 0, l = e.errors.length; index < l; index++) {
					error = e.errors[index];
					error.message = logs.prepareLoggedMessage(error.msgId, error.msgArgs);
				}
				this.$logError(this.INVALID_CONFIGURATION, null, e);
			}
		}

	},
	$destructor : function () {
		if (this._domId) {
			this._cfg.controller.onEmbededElementDispose(aria.utils.Dom.getElementById(this._domId), this._cfg.args);
		}
		this.$BaseWidget.$destructor.apply(this, arguments);
	},
	$prototype : {

    _cfgBeanName : "aria.embed.CfgBeans.ElementCfg",

		/**
		 * Main widget entry-point. Write the widget markup for a non-container widget.
		 * @param {aria.templates.MarkupWriter} out
		 */
		writeMarkup : function (out) {
			if (this._cfgOk) {
				this._domId = this._createDynamicId();
				var tagName = this._cfg.type;
				var markup = ['<', tagName, ' id="', this._domId, '"'];
				if (this._cfg.attributes) {
					markup.push(' ' + aria.utils.Html.buildAttributeList(this._cfg.attributes));
				}
				markup.push('></' + tagName + '>');
				out.write(markup.join(''));
			}
		},

		/**
		 * Initialization method called after the markup of the widget has been inserted in the DOM.
		 */
		initWidget : function () {
			if (this._cfgOk) {
				this._cfg.controller.onEmbededElementCreate(aria.utils.Dom.getElementById(this._domId), this._cfg.args);
			}
		}
	}
});