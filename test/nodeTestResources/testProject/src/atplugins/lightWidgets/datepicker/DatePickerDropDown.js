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

(function () {
    var basePackage = "atplugins.lightWidgets";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    Aria.classDefinition({
        $classpath : "atplugins.lightWidgets.datepicker.DatePickerDropDown",
        $extends : "atplugins.lightWidgets.DropDown",
        $dependencies : ["atplugins.lightWidgets.calendar.Calendar", "aria.DomEvent", "aria.utils.Type", "aria.core.Browser"],
        $constructor : function () {
            this.$DropDown.constructor.apply(this, arguments);

            /**
             * Current instance of calendar
             * @type atplugins.lightWidgets.calendar.Calendar
             * @protected
             */
            this._calendar = null;

            /**
             * Key code that has triggered the closure of the dialog or event happened inside the calendar
             * @type Integer
             */
            this.closeEvent = null;

            this._offset = aria.core.Browser.isIE7 ? {
                top : 5,
                bottom : -10,
                left : 0,
                right : 0
            } : {
                top : 5,
                bottom : 5,
                left : 0,
                right : 0
            };
        },
        $destructor : function () {

            this._calendar = null;
            this.$DropDown.$destructor.apply(this, arguments);

        },
        $prototype : {

            /**
             * Method that fills the section shown in the popup
             * @param {aria.templates.MarkupWriter} out
             * @protected
             */
            _contentWriter : function (out) {
                var calendarCfg = this._cfg.calendar;

                this._addCalendarListeners(calendarCfg);
                var sclass = calendarCfg.sclass;
                out.write('<span style="display: inline-block; overflow: visible" class="' + sclass
                        + 'dpCalendarContainer">');

                var calendar = new nspace.calendar.Calendar(calendarCfg, this._cfg.context, this._cfg.lineNumber);
                out.registerBehavior(calendar);
                calendar.writeMarkup(out);
                out.write('</span>');

                this._calendar = calendar;
            },

            /**
             * Add listeners to click in order to close the popup when a date is selected
             * @param {atplugins.lightWidgets.calendar.CalendarCfgBeans.Properties} cfg
             * @protected
             */
            _addCalendarListeners : function (cfg) {
                cfg.on = cfg.on || {};

                cfg.on.keydown = cfg.on.keydown ? (aria.utils.Type.isArray(cfg.on.keydown)
                        ? cfg.on.keydown
                        : [cfg.on.keydown]) : [];
                cfg.on.keydown.push({
                    fn : this._onCalendarKeydown,
                    scope : this
                });

                cfg.on.click = cfg.on.click
                        ? (aria.utils.Type.isArray(cfg.on.click) ? cfg.on.click : [cfg.on.click])
                        : [];

                cfg.on.click.push({
                    fn : this._onCalendarClick,
                    scope : this
                });

            },

            /**
             * Close the popup after ENTER, SPACE, TAB or ESCAPE
             * @param {Object} event
             * @protected
             */
            _onCalendarKeydown : function (event) {
                var keyCode = event.keyCode;
                var domEvent = aria.DomEvent;
                var cancel = true;
                if (keyCode == domEvent.KC_ENTER || keyCode == domEvent.KC_SPACE || keyCode == domEvent.KC_TAB
                        || keyCode == domEvent.KC_ESCAPE) {
                    this.closeEvent = keyCode;
                    this.close();
                    this.closeEvent = null;
                    if (keyCode == domEvent.KC_TAB) {
                        cancel = false;
                    }
                }
                if (cancel) {
                    event.preventDefault(true);
                }
            },

            /**
             * Close the popup after a date has been selected through a click
             * @param {Object} event
             * @protected
             */
            _onCalendarClick : function (event) {
                if (event.date) {
                    this.closeEvent = "click";
                    this.close();
                    this.closeEvent = null;
                }
            },

            /**
             * Send the key event to the calendar and decides whether to close it or not
             * @param {Object} event
             */
            processKeyEvent : function (event) {
                this._calendar.sendKey(event.charCode, event.keyCode);
                this._onCalendarKeydown(event);

            }

        }
    });
})();