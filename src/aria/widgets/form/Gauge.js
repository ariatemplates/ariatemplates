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
var ariaWidgetsFormGaugeStyle = require("./GaugeStyle.tpl.css");
var ariaUtilsString = require("../../utils/String");
var ariaWidgetsWidget = require("../Widget");


/**
 * @class aria.widgets.form.Gauge Gauge widget
 * @extends aria.widgets.Widget
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.form.Gauge",
    $extends : ariaWidgetsWidget,
    $css : [ariaWidgetsFormGaugeStyle],
    /**
     * Gauge constructor
     * @param {aria.widgets.CfgBeans:GaugeCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        this.$Widget.constructor.apply(this, arguments);
        this.__setSkinObj(this._skinnableClass);
        // Show the label either if it has fixed width (for alignment) or if there's something to show
        this.showLabel = this._cfg.labelWidth > -1 || !!this._cfg.label;
    },
    $destructor : function () {
        this.$Widget.$destructor.call(this);
    },
    $statics : {
        WIDGET_GAUGE_CFG_MIN_EQUAL_GREATER_MAX : "%1Gauge configuration error: minValue must be lower than maxValue."
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "Gauge",

        /**
         * Internal function to generate the internal widget markup
         * @param {aria.templates.MarkupWriter} out
         * @protected
         */
        _widgetMarkup : function (out) {

            this._checkCfgConsistency();

            if (!this._cfgOk) {
                return;
            }

            if (this.showLabel) {
                this._labelMarkup(out);
            }
            this._widgetMarkupBegin(out);

            var barWidth = this.__calculateBarWidth(this._cfg.currentValue);

            out.write(['<div class="x', this._skinnableClass, '_progress_', this._cfg.sclass, '" style="width:',
                    (barWidth >= 0 ? barWidth : "0"), '%;height:100%"></div>'].join(""));

            this._widgetMarkupEnd(out);

            barWidth = 0;

        },
        /**
         * Internal function to generate the internal widget begin markup
         * @param {aria.templates.MarkupWriter} out
         * @protected
         */
        _widgetMarkupBegin : function (out) {
            var skinObj = this._skinObj, cfg = this._cfg;
            out.write(['<div class="x', this._skinnableClass, '_', cfg.sclass, '" style="float:left;position:relative',
                    skinObj.border ? ';border:' + skinObj.border : '',
                    skinObj.borderPadding ? ';padding:' + skinObj.borderPadding + 'px' : '', ';height:',
                    skinObj.sprHeight, 'px;width:', cfg.gaugeWidth, 'px;">'].join(""));
        },

        /**
         * Internal function to generate the laebl markup
         * @param {aria.templates.MarkupWriter} out
         * @protected
         */
        _labelMarkup : function (out) {
            var skinObj = this._skinObj, cfg = this._cfg;
            out.write(['<span style="float:left;text-align:', cfg.labelAlign,
                    skinObj.labelMargins ? ';margin:' + skinObj.labelMargins : '',
                    skinObj.labelFontSize ? ';font-size:' + skinObj.labelFontSize + 'px' : '',
                    cfg.labelWidth > -1 ? ';width:' + cfg.labelWidth + 'px' : '', '">',
                    ariaUtilsString.escapeHTML(cfg.label), '</span>'].join(""));
        },

        /**
         * Internal function to generate the internal widget end markup
         * @param {aria.templates.MarkupWriter} out
         * @protected
         */
        _widgetMarkupEnd : function (out) {
            out.write('</div>');
        },
        /**
         * Internal function to verify consistency of cfg
         * @protected
         */
        _checkCfgConsistency : function () {
            if (!this._cfgOk) {
                return;
            }

            var cfg = this._cfg;
            if (cfg !== null) {
                if (cfg.minValue >= cfg.maxValue) {
                    this.$logError(this.WIDGET_GAUGE_CFG_MIN_EQUAL_GREATER_MAX, []);
                    this._cfgOk = false;
                    return;
                }
            }
        },
        /**
         * Returns the gauge dom element
         * @return {HTMLElement} The gauge dom element
         * @private
         */
        __getGauge : function () {
            return this.getDom();
        },

        /**
         * Internal method called when one of the model property that the widget is bound to has changed Must be
         * overridden by sub-classes defining bindable properties
         * @param {String} propertyName The property name
         * @param {Object} newValue The new value
         * @param {Object} oldValue The old property value
         * @protected
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            if (propertyName === 'currentValue') {
                this.__setCurrentValue(newValue);
            } else if (propertyName === 'label' && this.showLabel) {
                this.__setLabel(newValue);
            } else if (propertyName === 'maxValue') {
                this._cfg.maxValue = newValue;
                this._checkCfgConsistency();
            } else {
                this.$Widget._onBoundPropertyChange.call(this, propertyName, newValue, oldValue);
            }

        },
        /**
         * A private method to set the current value of the gauge
         * @param {Integer} newValue The new value of the gauge
         * @private
         */
        __setCurrentValue : function (newValue) {
            var gaugeSpanIndex = this.showLabel ? 1 : 0;
            var barEl = this.getDom().childNodes[gaugeSpanIndex].firstChild;
            var calcValue = this.__calculateBarWidth(newValue);
            if (barEl !== null && calcValue !== null && calcValue != -1) {
                barEl.style.width = calcValue + "%";
            }
            barEl = null;
        },
        /**
         * A private method to set the label text
         * @param {String} newValue Label text
         * @private
         */
        __setLabel : function (newValue) {
            var barEl = this.getDom().childNodes[0];
            if (barEl !== null) {
                barEl.innerHTML = newValue;
            }
            barEl = null;
        },
        /**
         * A private method to calculate the progress bar width
         * @param {Integer} newValue The new value of the gauge
         * @return {Integer} The new bar width in percentage. If -1 the new width could not be calculated
         * @private
         */
        __calculateBarWidth : function (newValue) {
            if (!this._cfgOk) {
                return -1;
            }

            var cfg = this._cfg;
            var res = null;
            if (cfg !== null) {
                if (newValue !== null && newValue !== "" && newValue >= cfg.minValue && newValue <= cfg.maxValue) {
                    res = ((newValue - cfg.minValue) / Math.abs(this._cfg.maxValue - this._cfg.minValue)) * 100;
                } else {
                    res = -1;
                }
            }
            cfg = null;
            return res;
        },
        /**
         * A private method to set this objects skin object
         * @param {String} widgetName
         * @private
         */
        __setSkinObj : function (widgetName) {
            this._skinObj = aria.widgets.AriaSkinInterface.getSkinObject(widgetName, this._cfg.sclass);
        }
    }
});
