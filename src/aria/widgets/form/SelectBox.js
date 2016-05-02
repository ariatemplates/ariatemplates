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
var ariaWidgetsFormDropDownListTrait = require("./DropDownListTrait");
var ariaWidgetsControllersSelectBoxController = require("../controllers/SelectBoxController");
var ariaWidgetsFormSelectBoxStyle = require("./SelectBoxStyle.tpl.css");
var ariaWidgetsFormListListStyle = require("./list/ListStyle.tpl.css");
var ariaWidgetsContainerDivStyle = require("../container/DivStyle.tpl.css");
var ariaWidgetsFormDropDownTextInput = require("./DropDownTextInput");

/**
 * SelectBox widget allows to select a value in an array of predefined values
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.form.SelectBox",
    $extends : ariaWidgetsFormDropDownTextInput,
    $css : [ariaWidgetsFormSelectBoxStyle, ariaWidgetsFormListListStyle, ariaWidgetsContainerDivStyle],
    $statics : {
        /* overrides TextInput.WIDGET_VALUE_IS_WRONG_TYPE */
        WIDGET_VALUE_IS_WRONG_TYPE : "%1Value '%2' is invalid. Note that SelectBox's value must be present in its options array. When changing both `value` and `options` via aria.utils.Json.setValue, change the options array first.",
        DUPLICATE_VALUE : "%1 - Duplicate values %2 found in options"
    },
    /**
     * RadioButton constructor
     * @param {aria.widgets.CfgBeans:SelectBoxCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber Line number corresponding in the .tpl file where the widget is created
     */
    $constructor : function (cfg, ctxt, lineNumber) {
        var controller = new ariaWidgetsControllersSelectBoxController();
        this.$DropDownTextInput.constructor.call(this, cfg, ctxt, lineNumber, controller);
        this.controller.setListOptions(this._cfg.options);

        /**
         * Whether the width of the popup can be smaller than the field, when configured to be so. If false, the
         * popupWidth property will be overridden when it is smaller than the field width
         * @type Boolean
         * @protected
         */
        this._freePopupWidth = false;
        this._waiSuggestionsChangedListener = null;

    },
    $destructor : function () {
        this._removeWaiSuggestionsChangedListener();
        this.$DropDownTextInput.$destructor.call(this);
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "SelectBox",

        $init : function (p) {
            var src = ariaWidgetsFormDropDownListTrait.prototype;
            for (var key in src) {
                if (src.hasOwnProperty(key) && !p.hasOwnProperty(key)) {
                    // copy methods which are not already on this object (this avoids copying $classpath and
                    // $destructor)
                    p[key] = src[key];
                }
            }
        },
        /**
         * This method checks the consistancy of the values provided in the attributes of SelectBox and logs and error
         * if there are any descripancies
         */
        _checkCfgConsistency : function () {
            this.$DropDownTextInput._checkCfgConsistency.call(this);
            var opt = this._cfg.options;
            var values = [];
            var dupValues = [];
            var map = {};

            for (var count = 0; count < opt.length; count++) {
                if (map[opt[count].value]) {
                    dupValues.push(opt[count].value);
                } else {
                    map[opt[count].value] = true;
                    values.push(opt[count]);
                }
            }
            if (dupValues.length > 0) {
                this.controller.setListOptions(values);
                this.$logError(this.DUPLICATE_VALUE, [dupValues]);
            }

        },
        /**
         * Internal method called when one of the model property that the widget is bound to has changed Must be
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value
         * @param {Object} oldValue the old property value
         * @protected
         */

        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {

            if (propertyName === "options") {
                this.controller.setListOptions(newValue);
                var report = this.controller.checkValue(null);
                this._reactToControllerReport(report, {
                    stopValueProp : true
                });
            } else {
                aria.widgets.form.SelectBox.superclass._onBoundPropertyChange.call(this, propertyName, newValue, oldValue);
            }
        }
    }
});
