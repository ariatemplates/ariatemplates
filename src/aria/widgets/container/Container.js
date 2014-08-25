/*
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
var Aria = require("../../Aria");
var ariaUtilsSize = require("../../utils/Size");
var ariaUtilsMath = require("../../utils/Math");
var ariaWidgetsWidget = require("../Widget");
var ariaCoreTplClassLoader = require("../../core/TplClassLoader");


/**
 * Class definition for the Container widget. Handles min and max sizes
 * @class aria.widgets.container.Container
 * @extends aria.widgets.Widget
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.container.Container",
    $extends : ariaWidgetsWidget,
    /**
     * Container constructor
     * @param {aria.widgets.CfgBeans:ContainerCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        this.$Widget.constructor.apply(this, arguments);

        this._cssClassNames = ariaCoreTplClassLoader.addPrintOptions(this._cssClassNames, cfg.printOptions);

        // might be set by subclasses
        this._frame = null;

        /**
         * Specifies if size constraints are specified in the config (and so if it is useful to call
         * aria.utils.Size.setContrains for this container).
         * @type Boolean
         * @protected
         */
        this._sizeConstraints = (!!cfg.minWidth || !!cfg.maxWidth || !!cfg.minHeight || !!cfg.maxHeight);

        // if size contrains -> adjust size after init. Do not set directInit to false if already to true.
        this._directInit = this._directInit || this._sizeConstraints;
    },
    $statics : {
        INVALID_USAGE_AS_CONTAINER : "%1%2 widget cannot be used as a container ({@aria:%2}{/@aria:%2}); use the {@aria:%2 /} syntax instead."
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
         * Internal method called when one of the model property that the widget is bound to has changed Must be
         * overridden by sub-classes defining bindable properties
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value
         * @param {Object} oldValue the old property value
         * @protected
         * @override
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            if (propertyName === "height" || propertyName === "width") {
                this._updateSize();
            } else {
                // delegate to parent class
                this.$Widget._onBoundPropertyChange.apply(this, arguments);
            }
        },

        /**
         * Update the size of the DOM object accordingly to the new values of this._cfg.
         */
        _updateSize : function () {
            this._changedContainerSize = true;
            this._updateContainerSize();
        },

        /**
         * Update the size of the container according to its width, height, minWidth, maxWidth, minHeight, maxHeight
         * properties.
         * @param {Boolean} propagate propagate change to parent
         */
        _updateContainerSize : function (propagate) {
            // PROFILING // this.$logTimestamp("updateContainerSize");
            var cfg = this._cfg, domElt = this.getDom();

            if (!domElt) {
                return;
            }

            var widthConf = this._getWidthConf();
            var heightConf = this._getHeightConf();

            if (this._changedContainerSize || this._sizeConstraints) { // if we are bound to min and max size
                if (this._changedContainerSize) {
                    // when maximized from start, widthMaximized will be empty initially, but it'll be adjusted later
                    var width = cfg.widthMaximized || cfg.width;
                    var height = cfg.heightMaximized || cfg.height;
                    var constrainedWidth = ariaUtilsMath.normalize(width, widthConf.min, widthConf.max);
                    var constrainedHeight = ariaUtilsMath.normalize(height, heightConf.min, heightConf.max);

                    domElt.style.width = width > -1 ? constrainedWidth + "px" : "";
                    domElt.style.height = height > -1 ? constrainedHeight + "px" : "";
                    if (this._frame) { // this is required if the frame is being shrinked
                        var frameWidth = width > -1 ? constrainedWidth : -1;
                        var frameHeight = height > -1 ? constrainedHeight : -1;
                        this._frame.resize(frameWidth, frameHeight);
                    }
                }

                var changed = ariaUtilsSize.setContrains(domElt, widthConf, heightConf);
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
         * Obtain width constraints configuration object of the current container, compatible with
         * aria.utils.Math.normalize().
         * @return {Object} {min: {Number}, max: {Number}}
         * @protected
         */
        _getWidthConf : function () {
            return {
                min : this._cfg.minWidth || 0,
                max : this._cfg.maxWidth || Infinity
            };
        },

        /**
         * Obtain height constraints configuration object of the current container, compatible with
         * aria.utils.Math.normalize().
         * @return {Object} {min: {Number}, max: {Number}}
         * @protected
         */
        _getHeightConf : function () {
            return {
                min : this._cfg.minHeight || 0,
                max : this._cfg.maxHeight || Infinity
            };
        },

        /**
         * The main entry point into the Div begin markup. Here we check whether it is a Div, defined in the AriaSkin
         * object, that has an image that is repeated as a background.
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _widgetMarkupBegin : Aria.empty,

        /**
         * The main entry point into the Div end markup. Here we check whether it is a Div, defined in the AriaSkin
         * object, that has an image that is repeated as a background.
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         * @protected
         */
        _widgetMarkupEnd : Aria.empty

    }
});
