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
var ariaUtilsIdManager = require("../../utils/IdMgr");
var ariaUtilsArray = require("../../utils/Array");
var ariaWidgetsFormRadioButtonStyle = require("./RadioButtonStyle.tpl.css");
var ariaWidgetsFormCheckBox = require("./CheckBox");


(function () {

    var idManager = null;

    /**
     * Radio Button widget
     * @class aria.widgets.form.RadioButton
     */
    module.exports = Aria.classDefinition({
        $classpath : 'aria.widgets.form.RadioButton',
        $extends : ariaWidgetsFormCheckBox,
        $css : [ariaWidgetsFormRadioButtonStyle],
        /**
         * RadioButton constructor
         * @param {aria.widgets.CfgBeans:RadioButtonCfg} cfg the widget configuration
         * @param {aria.templates.TemplateCtxt} ctxt template context
         * @param {Number} lineNumber Line number corresponding in the .tpl file where the widget is created
         */
        $constructor : function (cfg, ctxt) {
            this.$CheckBox.constructor.apply(this, arguments);
            if (!idManager) {
                idManager = new ariaUtilsIdManager("radio");
            }
            this._inputName = idManager.getId();

            // use array and not store as index is important
            this._instances.push(this);
        },

        $destructor : function () {
            ariaUtilsArray.remove(this._instances, this);

            if (this._inputName) {
                idManager.releaseId(this._inputName);
                this._inputName = null;
            }
            this.$CheckBox.$destructor.call(this);
        },

        $onunload : function () {
            if (idManager) {
                idManager.$dispose();
                idManager = null;
            }
            this._instances = null;
        },

        $prototype : {
            /**
             * Skinnable class to use for this widget.
             * @protected
             * @type String
             */
            _skinnableClass : "RadioButton",

            /**
             * List of radio button instances for keyboard nav
             * @protected
             * @type Array
             */
            _instances : [],

            /**
             * Internal method to set the _inputType property from the _cfg description
             */
            _setInputType : function () {
                this._cfg._inputType = "radio";
            },

            /**
             * Return whether the radio button is currently checked.
             * @return {Boolean}
             * @protected
             */
            _isChecked : function () {
                return (this.getProperty("value") === this._cfg.keyValue);
            },

            /**
             * Internal method called when one of the model property that the widget is bound to has changed Must be
             * overridden by sub-classes defining bindable properties
             * @param {String} propertyName the property name
             * @param {Object} newValue the new value
             * @param {Object} oldValue the old property value
             */
            _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
                this.$CheckBox._onBoundPropertyChange.apply(this, arguments);
            },

            /**
             * Internal method to handle the click event
             * @param {aria.DomEvent} event Click
             * @protected
             */
            _dom_onclick : function (event) {
                this._setRadioValue();
                this._focus();
                if (event.target.tagName.toLowerCase() != "input") {
                    event.preventDefault(false);
                }
            },

            /**
             * Toggle value on SPACE key down
             * @param {aria.DomEvent} event
             */
            _dom_onkeydown : function (event) {
                if (event.keyCode == aria.DomEvent.KC_SPACE) {
                    this._setRadioValue();
                    event.preventDefault(true);
                } else if (event.keyCode == aria.DomEvent.KC_LEFT) {
                    this._navigate(-1);
                    event.preventDefault(true);
                } else if (event.keyCode == aria.DomEvent.KC_RIGHT) {
                    this._navigate(+1);
                    event.preventDefault(true);
                } else if (event.keyCode == aria.DomEvent.KC_DOWN) {
                    this._navigate(+1);
                    event.preventDefault(true);
                } else if (event.keyCode == aria.DomEvent.KC_UP) {
                    this._navigate(-1);
                    event.preventDefault(true);
                }
            },

            /**
             * Internal method to handle the focus event
             * @param {aria.DomEvent} event Focus
             * @protected
             */
            _dom_onfocus : function (event) {
                if (!this.getProperty("value")) {
                    this._setRadioValue();
                    // _setRadioValue might destroy the widget
                    if (!this._cfg) {
                        return;
                    }
                }
                this.$CheckBox._dom_onfocus.call(this, event);
            },

            /**
             * Find next valid radio button to activate
             * @protected
             * @param {Number} direction, 1 or -1
             */
            _navigate : function (direction) {
                if (!this._cfg || !this._cfg.bind || !this._cfg.bind.value) {
                    // no binding for the value : return
                    return;
                }
                var currentBinding = this._cfg.bind.value;
                var index = ariaUtilsArray.indexOf(this._instances, this), radioButtonNb = this._instances.length;
                var bindings, next, nextBinding;
                var waiAria = this._cfg.waiAria;
                while (index >= 0 && index < radioButtonNb) {
                    index = index + direction;
                    if (waiAria) {
                        if (index < 0) {
                            index = radioButtonNb - 1;
                        } else if (index >= radioButtonNb) {
                            index = 0;
                        }

                    } else if (index < 0 || index >= radioButtonNb) {
                        break;
                    }
                    next = this._instances[index];
                    bindings = next._cfg.bind;
                    if (!next.getProperty("disabled") && bindings) {
                        nextBinding = bindings.value;
                        if (nextBinding) {
                            // next radio button needs to be bound to the same data. Otherwise, continue.
                            if (currentBinding.inside === nextBinding.inside && currentBinding.to === nextBinding.to) {
                                next._setRadioValue();
                                next._focus();
                                break;
                            }
                        }
                    }
                }
            },

            /**
             * Internal method to change the state of the checkbox
             * @protected
             */
            _updateDomForState : function () {
                this.$CheckBox._updateDomForState.call(this);
                if (this._cfg.waiAria) {
                    // update the attributes for WAI
                    var element = this._getFocusableElement();
                    element.setAttribute('tabindex', this._calculateTabIndex());
                }
            },

            /**
             * Calculates the real tab index from configuration parameters given to the widget. Only valid to call if
             * baseTabIndex and tabIndex are correctly set, otherwise method will return -1.
             * @protected
             * @return {Number}
             */
            _calculateTabIndex : function () {
                return (this._isChecked() || !this.getProperty("value")) ?
                        this.$CheckBox._calculateTabIndex.call(this) :
                        -1;
            },

            /**
             * Sets the value property to the key value of this radio button and updates state, dom etc. Typically
             * called when user "selects" the radio button
             */
            _setRadioValue : function () {
                var newValue = this._cfg.keyValue;
                this._cfg.value = newValue;
                this.setProperty("value", newValue);
                // setProperty on value might destroy the widget
                if (this._cfg) {
                    this._setState();
                    this._updateDomForState();
                    if (this._cfg.onchange) {
                        this.evalCallback(this._cfg.onchange);
                    }
                }
            }

        }
    });
})();
