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
require("./CalendarController");
var ariaWidgetsCalendarCalendarStyle = require("./CalendarStyle.tpl.css");
require("./CalendarTemplate.tpl");
var ariaWidgetsTemplateBasedWidget = require("../TemplateBasedWidget");
var ariaCoreBrowser = require("../../core/Browser");

/**
 * Calendar widget, which is a template-based widget. Most of the logic of the calendar is implemented in the
 * CalendarController class. This class only does the link between the properties of the calendar widget and the
 * calendar controller.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.calendar.Calendar",
    $extends : ariaWidgetsTemplateBasedWidget,
    $css : [ariaWidgetsCalendarCalendarStyle],
    $constructor : function (cfg, ctxt) {
        this.$TemplateBasedWidget.constructor.apply(this, arguments);
        var sclass = this._cfg.sclass;
        var skinObj = aria.widgets.AriaSkinInterface.getSkinObject(this._skinnableClass, sclass);
        this._hasFocus = false;
        this._initTemplate({
            defaultTemplate : skinObj.defaultTemplate,
            moduleCtrl : {
                classpath : "aria.widgets.calendar.CalendarController",
                initArgs : {
                    skin : {
                        sclass : sclass,
                        skinObject : skinObj,
                        baseCSS : "xCalendar_" + sclass + "_",
                        selectedClass : "xCalendar_" + sclass + "_selected"
                    },
                    settings : {
                        ranges : cfg.ranges,
                        value : cfg.value,
                        minValue : cfg.minValue,
                        maxValue : cfg.maxValue,
                        startDate : cfg.startDate,
                        displayUnit : cfg.displayUnit,
                        numberOfUnits : cfg.numberOfUnits,
                        firstDayOfWeek : cfg.firstDayOfWeek,
                        dateLabelFormat : cfg.dateLabelFormat,
                        monthLabelFormat : cfg.monthLabelFormat,
                        dayOfWeekLabelFormat : cfg.dayOfWeekLabelFormat,
                        completeDateLabelFormat : cfg.completeDateLabelFormat,
                        showWeekNumbers : cfg.showWeekNumbers,
                        showShortcuts : cfg.showShortcuts,
                        restrainedNavigation : cfg.restrainedNavigation,
                        label : cfg.label,
                        focus : this._hasFocus
                    }
                }
            }
        });
    },

    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "Calendar",

        /**
         * React to the events coming from the module controller.
         * @param {Object} evt Module event
         */
        _onModuleEvent : function (evt) {
            if (this._inOnBoundPropertyChange) {
                return;
            }
            if (evt.name == "update") {
                if (evt.properties["startDate"]) {
                    this.setProperty("startDate", this._subTplData.settings.startDate);
                }
                if (evt.properties["value"]) {
                    this.setProperty("value", this._subTplData.settings.value);
                    this.evalCallback(this._cfg.onchange);
                }
            } else if (evt.name == "dateClick") {
                this.evalCallback(this._cfg.onclick, evt);
            } else if (evt.name == "dateMouseOver") {
                this.evalCallback(this._cfg.onmouseover, evt);
            } else if (evt.name == "dateMouseOut") {
                this.evalCallback(this._cfg.onmouseout, evt);
            }
        },

        /**
         * Internal method called when one of the model property that the widget is bound to has changed.
         * @protected
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value. If transformation is used, refers to widget value and not data model
         * value.
         * @param {Object} oldValue the old property value. If transformation is used, refers to widget value and not
         * data model value.
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            this._inOnBoundPropertyChange = true;
            try {
                if (propertyName == "startDate") {
                    this._subTplModuleCtrl.navigate({}, {
                        date : newValue
                    });
                } else if (propertyName == "value") {
                    this._subTplModuleCtrl.selectDay({
                        date : newValue
                    });
                } else if (propertyName == "ranges") {
                    this._subTplModuleCtrl.setRanges(newValue);
                }
            } finally {
                this._inOnBoundPropertyChange = false;
            }
        },

        /**
         * Keyboard support for the calendar.
         * @protected
         * @param {aria.DomEvent} domEvt Key down event
         */
        _dom_onkeydown : function (domEvt) {
            var domElt = this.getDom();
            if (this.sendKey(domEvt.charCode, domEvt.keyCode)) {
                domEvt.preventDefault(true);
                domElt.focus();
            }
        },

        /**
         * Called when the calendar gets the focus.
         * @protected
         */
        _dom_onfocus : function () {
            this._hasFocus = true;
            this._focusUpdate();
        },

        /**
         * Called when the calendar looses the focus.
         * @protected
         */
        _dom_onblur : function () {
            this._hasFocus = false;
            this._focusUpdate();
        },

        /**
         * Callback executed after the template is loaded and initialized. It will also notify the module controller of
         * a change of focus.
         * @param {Object} args Contains information about the load and instance of the template context
         * @protected
         * @override
         */
        _tplLoadCallback : function (args) {
            this.$TemplateBasedWidget._tplLoadCallback.call(this, args);
            if (args.success) {
                this._focusUpdate();
            }
        },

        /**
         * Notify the calendar module controller of a change of focus.
         * @protected
         */
        _focusUpdate : function () {
            var moduleCtrl = this._subTplModuleCtrl, dom = this.getDom();
            if (moduleCtrl && dom && this._cfg.tabIndex != null && this._cfg.tabIndex >= 0) {
                var preventDefaultVisualAspect = moduleCtrl.notifyFocusChanged(this._hasFocus);
                if (!preventDefaultVisualAspect) {
                    var domEltStyle = dom.style;
                    var visualFocusStyle = (aria.utils.VisualFocus) ? aria.utils.VisualFocus.getStyle() : null;
                    if (this._hasFocus) {
                        if (ariaCoreBrowser.isIE7) {
                            domEltStyle.border = "1px dotted black";
                            domEltStyle.padding = "0px";
                        } else {
                            if (visualFocusStyle == null) {
                                domEltStyle.outline = "1px dotted black";
                            }
                        }
                    } else {
                        if (ariaCoreBrowser.isIE7) {
                            domEltStyle.border = "0px";
                            domEltStyle.padding = "1px";
                        } else {
                            if (visualFocusStyle == null) {
                                domEltStyle.outline = "none";
                            }
                        }
                    }
                }
            }
        },

        /**
         * Send a key to the calendar module controller
         * @param {String} charCode Character code
         * @param {String} keyCode Key code
         * @return {Boolean} true if default action and key propagation should be canceled.
         */
        sendKey : function (charCode, keyCode) {
            var moduleCtrl = this._subTplModuleCtrl;
            if (moduleCtrl) {
                return moduleCtrl.keyevent({
                    charCode : charCode,
                    keyCode : keyCode
                });
            } else {
                return false;
            }
        }
    }
});
