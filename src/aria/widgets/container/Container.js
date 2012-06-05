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
 * Class definition for the Container widget. Handles min and max sizes
 * @class aria.widgets.container.Container
 * @extends aria.widgets.Widget
 */
Aria.classDefinition({
	$classpath : "aria.widgets.container.Container",
	$extends : "aria.widgets.Widget",
	$dependencies : ["aria.utils.Size"],
	/**
	 * Container constructor
	 * @param {aria.widgets.CfgBeans.ActionWidgetCfg} cfg the widget configuration
	 * @param {aria.templates.TemplateCtxt} ctxt template context
	 */
	$constructor : function (cfg, ctxt) {
		this.$Widget.constructor.apply(this, arguments);

		this._cssClassNames = aria.core.TplClassLoader.addPrintOptions(this._cssClassNames, cfg.printOptions);

		/**
		 * Specifies if size constraints are specified in the config (and so if it is useful to call
		 * aria.utils.Size.setContrains for this container).
		 * @type Boolean
		 * @protected
		 */
		this._sizeConstraints = (cfg.width == -1 && (!!cfg.minWidth || !!cfg.maxWidth))
				|| (cfg.height == -1 && (!!cfg.minHeight || !!cfg.maxHeight));

		// if size contrains -> adjust size after init. Do not set directInit to false if already to true.
		this._directInit = this._directInit || this._sizeConstraints;
	},
	$prototype : {

		/**
		 * Initialize link between widget and DOM. Called when an access to dom is first required.
		 * @param {HTMLElement} dom
		 */
		initWidgetDom : function (dom) {
			this.$Widget.initWidgetDom.call(this, dom);
			if (this._sizeConstraints) {
				this._updateContainerSize(true);
			}
		},

		/**
		 * Raised when the content of the container has changed (through partial refresh)
		 * @protected
		 */
		_dom_oncontentchange : function (domEvent) {
			// does not propagate, event delegation already does this
			if (this.__initWhileContentChange !== true) {
				this._updateContainerSize();
			} // else there's no need to update the container size because we are still in the init
			this.__initWhileContentChange = false;
		},

		/**
		 * Update the size of the container according to its width, height, minWidth, maxWidth, minHeight, maxHeight
		 * properties.
		 * @param {Boolean} propagate propagate change to parent
		 */
		_updateContainerSize : function (propagate) {
			// PROFILING // this.$logTimestamp("updateContainerSize");
			var cfg = this._cfg, domElt = this.getDom(), widthConf, heightConf, changed;

			if (domElt && this._sizeConstraints) {

				if (cfg.width == -1) {
					widthConf = {
						min : cfg.minWidth,
						max : cfg.maxWidth
					};
				}

				if (cfg.height == -1) {
					heightConf = {
						min : cfg.minHeight,
						max : cfg.maxHeight
					};
				}

				if (this._changedContainerSize) {
					domElt.style.width = cfg.width > -1 ? cfg.width + "px" : "";
					domElt.style.height = cfg.height > -1 ? cfg.height + "px" : "";
					if (this._frame) {
						this._frame.resize(cfg.width, cfg.height);
					}
				}

				changed = aria.utils.Size.setContrains(domElt, widthConf, heightConf);
				if (changed && this._frame) {
					this._frame.resize(changed.width, changed.height);
					// throws a onchange event on parent
					if (domElt.parentNode && propagate) {
						aria.utils.Delegate.delegate(aria.DomEvent.getFakeEvent('contentchange', domElt.parentNode));
					}
				}
				this._changedContainerSize = changed;

			}
		},

		/**
		 * The main entry point into the Div begin markup. Here we check whether it is a Div, defined in the AriaSkin
		 * object, that has an image that is repeated as a background.
		 * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
		 * @protected
		 */
		_widgetMarkupBegin : function (out) {},

		/**
		 * The main entry point into the Div end markup. Here we check whether it is a Div, defined in the AriaSkin
		 * object, that has an image that is repeated as a background.
		 * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
		 * @protected
		 */
		_widgetMarkupEnd : function (out) {}

	}
});