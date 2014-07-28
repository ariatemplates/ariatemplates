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

    /**
     * Calendar widget, which is a template-based widget. Most of the logic of the calendar is implemented in the
     * CalendarController class. This class only does the link between the properties of the calendar widget and the
     * calendar controller.
     */
    Aria.classDefinition({
        $classpath : "atplugins.lightWidgets.calendar.Calendar",
        $extends : "aria.html.Element",
        $dependencies : ["atplugins.lightWidgets.calendar.CalendarController", "atplugins.lightWidgets.calendar.CalendarCfgBeans",
                "aria.html.Template", "aria.utils.Object", "aria.utils.Array"],
        $constructor : function (cfg, context, lineNumber) {

            this.$cfgBean = "atplugins.lightWidgets.calendar.CalendarCfgBeans.Properties";
            this._registerListeners(cfg);
            cfg.attributes = cfg.attributes || {};
            cfg.attributes.tabindex = cfg.attributes.tabindex || 0;

            this.$Element.constructor.apply(this, arguments);

            var sclass = this._cfg.sclass || "std";

            /**
             * Whether the calendar has focus or not
             * @type Boolean
             * @private
             */
            this._hasFocus = false;

            var keysToCopy = aria.utils.Object.keys(cfg);
            var keysToRemove = ["on", "attributes", "id", "bind", "tagName", "sclass"];
            var arrayUtil = aria.utils.Array;
            keysToCopy = arrayUtil.filter(keysToCopy, function (element) {
                return !arrayUtil.contains(keysToRemove, element);
            });

            var settings = aria.utils.Json.copy(cfg, true, keysToCopy);
            settings.focus = this._hasFocus;

            /**
             * Shared data model between template and module
             * @type aria.widgets.calendar.CfgBeans.CalendarModel
             * @private
             */
            this._data = {
                skin : {
                    sclass : sclass,
                    baseCSS : "xCalendar_" + sclass + "_"
                },
                settings : settings
            };

            /**
             * Controller for the calendar template
             * @type atplugins.lightWidgets.calendar.CalendarController
             */
            this._controller = new nspace.calendar.CalendarController(this._data);

            this._controllerListener = {
                fn : this._onControllerEvent,
                scope : this
            };

            this._controller.$addListeners({
                "update" : this._controllerListener,
                "dateClick" : this._controllerListener
            });

            this._templateCfg = {
                // TODO allow calendar template customization
                classpath : this._cfg.template,
                data : {
                    dataModel : this._data,
                    controller : this._controller
                }
            };
        },
        $destructor : function () {

            this._controller.$removeListeners({
                "update" : this._controllerListener,
                "dateClick" : this._controllerListener
            });
            this._controllerListener = null;

            this._controller.$dispose();
            this.$Element.$destructor.call(this);

        },

        $prototype : {

            /**
             * Write the markup, corresponding to the self closing tag of this element.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkup : function (out) {
                this.$Element.writeMarkupBegin.call(this, out);
                var template = new aria.html.Template(this._templateCfg, this._context, this._lineNumber);
                out.registerBehavior(template);
                template.writeMarkup(out);
                this.$Element.writeMarkupEnd.call(this, out);
                // this._focusUpdate();
            },

            /**
             * DatePicker can only be used as self closing tags. Calling this function raises an error.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupBegin : function (out) {
                this.$logError(this.INVALID_USAGE, [this.$class, "container"]);
            },

            /**
             * DatePicker can only be used as self closing tags. Calling this function does not rais an error though
             * because it was already logged by writeMarkupBegin.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupEnd : Aria.empty,

            _transferToDataModel : function (property, value) {
                var bind = this._bindingListeners[property];
                if (bind) {
                    var newValue = this._transform(bind.transform, value, "fromWidget");
                    aria.utils.Json.setValue(bind.inside, bind.to, newValue, bind.cb);
                }
            },
            /**
             * React to the events coming from the controller.
             * @param {Object} evt Controller event
             */
            _onControllerEvent : function (evt) {
                if (this._inOnBoundPropertyChange) {
                    return;
                }
                if (evt.name == "update") {
                    if (evt.properties.startDate) {
                        this._transferToDataModel("startDate", this._data.settings.startDate);
                    }
                    if (evt.properties.value) {
                        this._transferToDataModel("value", this._data.settings.value);
                        this.evalCallback(this._cfg.onchange);
                    }
                } else if (evt.name == "dateClick") {
                    var onClick = this._cfg.on.click;
                    if (onClick) {
                        for (var i = 0, length = onClick.length; i < length; i++) {
                            this.evalCallback(onClick[i], evt);
                        }
                    }
                }
            },

            /**
             * Internal method called when one of the model property that the widget is bound to has changed.
             * @protected
             * @param {String} propertyName the property name
             * @param {Object} newValue the new value. If transformation is used, refers to widget value and not data
             * model value.
             * @param {Object} oldValue the old property value. If transformation is used, refers to widget value and
             * not data model value.
             */
            onbind : function (propertyName, newValue, oldValue) {
                this._inOnBoundPropertyChange = true;
                try {
                    if (propertyName == "startDate") {
                        this._controller.navigate({}, {
                            date : newValue
                        });
                    } else if (propertyName == "value") {
                        this._controller.selectDay({
                            date : newValue
                        });
                    }
                } finally {
                    this._inOnBoundPropertyChange = false;
                }
            },

            /**
             * Add special listeners on top of the ones specified in configuration.
             * @param {aria.html.beans.TextInputCfg.Properties} listeners On listeners taken from the widget
             * configuration.
             * @protected
             */
            _registerListeners : function (cfg) {
                cfg.on = cfg.on || {};
                var listeners = cfg.on;
                var override = ["blur", "keydown", "focus"], evtType;
                for (var i = 0, length = override.length; i < length; i++) {
                    evtType = override[i];
                    this._chainListener(listeners, evtType, {
                        fn : this["_dom_on" + evtType],
                        scope : this
                    });
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
            },

            /**
             * Called when the calendar loses the focus.
             * @protected
             */
            _dom_onblur : function () {
                this._hasFocus = false;
            },

            /**
             * Send a key to the calendar module controller
             * @param {String} charCode Character code
             * @param {String} keyCode Key code
             * @return {Boolean} true if default action and key propagation should be canceled.
             */
            sendKey : function (charCode, keyCode) {
                var moduleCtrl = this._controller;
                if (moduleCtrl) {
                    return moduleCtrl.keyevent({
                        charCode : charCode,
                        keyCode : keyCode
                    });
                } else {
                    return false;
                }
            },

            getDom : function () {
                return this._domElt;
            },

            /**
             * Set property for this widget. This is called by BindableWidget after a bind has been registered because
             * between the moment the widget constructor is called, and the moment _registerBindings is called, some
             * time may have elapsed and bound values may have changed.
             * @param {String} propertyName in the configuration
             * @param {Object} newValue to set
             */
            setWidgetProperty : function (propertyName, newValue) {
                this._cfg[propertyName] = newValue;
            }
        }
    });
})();