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
require("./CalendarTemplate.tpl");
var functionUtils = require("../../utils/Function");
var ariaWidgetsTemplateBasedWidget = require("../TemplateBasedWidget");
var ariaCoreBrowser = require("../../core/Browser");

/**
 * Calendar widget, which is a template-based widget. Most of the logic of the calendar is implemented in the
 * CalendarController class. This class only does the link between the properties of the calendar widget and the
 * calendar controller.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.calendar.RangeCalendar",
    $extends : ariaWidgetsTemplateBasedWidget,
    $css : [require("./CalendarStyle.tpl.css")],
    $constructor : function (cfg, ctxt) {
        this.$TemplateBasedWidget.constructor.apply(this, arguments);
        var sclass = this._cfg.sclass;
        var skinObj = aria.widgets.AriaSkinInterface.getSkinObject(this._skinnableClass, sclass);
        this._hasFocus = false; // real focus
        this._focusStyle = false; // focus style
        this._dateToChange = "fromDate";
        this._dateToKeep = "toDate";
        this._initTemplate({
            defaultTemplate : skinObj.defaultTemplate,
            moduleCtrl : {
                classpath : "aria.widgets.calendar.CalendarController",
                initArgs : {
                    skin : {
                        sclass : sclass,
                        skinObject : skinObj,
                        baseCSS : "xCalendar_" + sclass + "_",
                        selectedClass : "xCalendar_" + sclass + "_focused"
                    },
                    settings : {
                        ranges : this._getRanges(),
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
                        showShortcuts : false,
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
            } else if (evt.name == "dateClick") {
                this.evalCallback(this._cfg.onclick, evt);
                if (!evt.cancelDefault) {
                    this.dateSelect(evt.date);
                }
            } else if (evt.name == "dateMouseOver") {
                this.evalCallback(this._cfg.onmouseover, evt);
            } else if (evt.name == "dateMouseOut") {
                this.evalCallback(this._cfg.onmouseout, evt);
            }
        },

        /**
         * Returns the array of ranges to be passed to the calendar controller.
         * @return {Array}
         */
        _getRanges : function () {
            var res = [];
            var cfg = this._cfg;
            if (cfg.fromDate || cfg.toDate) {
                var cssPrefix = "x" + this._skinnableClass + "_" + this._cfg.sclass;
                res.push({
                    fromDate : cfg.fromDate || cfg.toDate,
                    toDate : cfg.toDate || cfg.fromDate,
                    classes : {
                        from : cssPrefix + "_selected_from",
                        to : cssPrefix + "_selected_to",
                        fromTo : cssPrefix + "_selected_from_to",
                        sameFromTo : cssPrefix + "_selected_same_from_to"
                    }
                });
            }
            var cfgRanges = cfg.ranges;
            if (cfgRanges) {
                res = res.concat(cfgRanges);
            }
            return res;
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
                } else if (propertyName == "fromDate" || propertyName == "toDate" || propertyName == "ranges") {
                    this._subTplModuleCtrl.setRanges(this._getRanges());
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
         * Plan a focus style update with setTimeout, but only if it is needed. This avoids multiple calls to
         * _focusStyleUpdate in case a blur is immediately followed by a focus event (which can happen on IE), causing
         * the reset of the currently focused date.
         */
        _focusUpdate : function () {
            if (this._focusStyle != this._hasFocus && !this._plannedFocusUpdate) {
                this._plannedFocusUpdate = setTimeout(functionUtils.bind(this._focusStyleUpdate, this), 1);
            }
        },

        /**
         * Notify the calendar module controller of a change of focus.
         * @protected
         */
        _focusStyleUpdate : function () {
            this._plannedFocusUpdate = null;
            if (this._focusStyle == this._hasFocus) {
                // nothing to do!
                return;
            }
            var moduleCtrl = this._subTplModuleCtrl, dom = this.getDom();
            if (moduleCtrl && dom && this._cfg.tabIndex != null && this._cfg.tabIndex >= 0) {
                var preventDefaultVisualAspect = moduleCtrl.notifyFocusChanged(this._hasFocus);
                if (!preventDefaultVisualAspect) {
                    var domEltStyle = dom.style;
                    var visualFocusStyle = (aria.utils.VisualFocus) ? aria.utils.VisualFocus.getStyle() : null;
                    if (this._hasFocus) {
                        if (ariaCoreBrowser.isIE6 || ariaCoreBrowser.isIE7) {
                            domEltStyle.border = "1px dotted black";
                            domEltStyle.padding = "0px";
                        } else {
                            if (visualFocusStyle == null) {
                                domEltStyle.outline = "1px dotted black";
                            }
                        }
                    } else {
                        if (ariaCoreBrowser.isIE6 || ariaCoreBrowser.isIE7) {
                            domEltStyle.border = "0px";
                            domEltStyle.padding = "1px";
                        } else {
                            if (visualFocusStyle == null) {
                                domEltStyle.outline = "none";
                            }
                        }
                    }
                }
                if (this._hasFocus) {
                    moduleCtrl.selectDay({
                        date : this._cfg.fromDate || this._cfg.toDate,
                        ensureVisible : false
                    });
                } else {
                    moduleCtrl.selectDay({
                        date : null
                    });
                }
                this._focusStyle = this._hasFocus;
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
                var value = this._subTplData.settings.value;
                if ((keyCode == 13 || keyCode == 32) && value) {
                    // SPACE or ENTER -> call dateSelect
                    this.dateSelect(value);
                    return true;
                } else {
                    return moduleCtrl.keyevent({
                        charCode : charCode,
                        keyCode : keyCode
                    });
                }
            } else {
                return false;
            }
        },

        /**
         * Calls the onDateSelect callback for the given date and implements the default behavior (which is to
         * alternatively set the fromDate and toDate properties), if the default behavior is not cancelled in the
         * callback.
         * @param {Date} date
         */
        dateSelect : function (date) {
            var evt = {
                date : date,
                cancelDefault : false
            };
            this.evalCallback(this._cfg.onDateSelect, evt);
            if (evt.cancelDefault !== true) {
                var cfg = this._cfg;
                var dateToChange = this._dateToChange;
                var dateToKeep = this._dateToKeep;
                var properties = {};
                var tmp;
                properties[dateToChange] = date;
                properties[dateToKeep] = cfg[dateToKeep];
                if (properties.fromDate > properties.toDate) {
                    tmp = properties.fromDate;
                    properties.fromDate = properties.toDate;
                    properties.toDate = tmp;
                } else {
                    tmp = dateToKeep;
                    dateToKeep = dateToChange;
                    dateToChange = tmp;
                }
                this.setProperty("fromDate", properties.fromDate);
                this.setProperty("toDate", properties.toDate);
                this._dateToChange = dateToChange;
                this._dateToKeep = dateToKeep;
                this._subTplModuleCtrl.setRanges(this._getRanges());
                this.evalCallback(cfg.onchange);
            }
        }
    }
});
