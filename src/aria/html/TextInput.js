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
    /**
     * Call a normalized callback with the correct arguments.
     * @param {aria.core.CfgBeans:Callback} callback Function to be called
     * @param {Object} arg first argument of the callback
     * @private
     */
    function callNormalizedCallback (callback, arg) {
        callback.fn.call(callback.scope, arg, callback.args);
    }

    /**
     * Callback for the type event timer.
     * @private
     * @param {Array} callbackArray Array whose entries are of type aria.core.CfgBeans:Callback. They are the handlers
     * for the type event.
     */
    function typeCallback (callbackArray) {
        this._typeCallback = null;
        var callback;
        for (var i = 0, count = callbackArray.length; i < count; i++) {
            callback = this.$normCallback.call(this._context._tpl, callbackArray[i]);
            callNormalizedCallback(callback, this._domElt.value);
        }
    }

    /**
     * Convert a keydown event into a type event. This is achieved adding a very short callback on keydown. The reason
     * being the fact that on keydown the input has still the previous value. In the callback we'll see the correct text
     * input value. This function should have the same scope as the widget instance.
     * @param {aria.DomEvent} event keydown event
     * @param {Array} callbackArray Array of callbacks for the type event
     * @private
     */
    function keyDownToType (event, callbackArray) {
        this._typeCallback = aria.core.Timer.addCallback({
            fn : typeCallback,
            scope : this,
            delay : 12,
            args : callbackArray
        });
    }

    /**
     * Contains the codes for keys that do not correspond to a change of the value of the input field
     * @type Array
     * @private
     */
    var specialKeys = null;

    /**
     * Internal callback for placeholder handling on keydown.
     * @param {aria.DomEvent} event keydown event
     * @private
     */
    function keyDownCallback (event) {
        if (this._hasPlaceholder) {
            if (!aria.utils.Array.contains(specialKeys, event.keyCode)) {
                this._removePlaceholder();
            } else {
                event.preventDefault();
            }
        }
    }

    /**
     * Being a BindableWidget we already have one direction binding of value (from the datamodel to the widget). This
     * function is the callback for implementing the other bind, from the widget to the datamodel. The value is set in
     * the datamodel on blur. It also takes care of calling the 'on blur' callback if it was defined.
     * @param {aria.DomEvent} event blur event
     * @private
     */
    function bidirectionalBlurBinding (event) {
        var bind = this._bindingListeners.value;
        var newValue = this._transform(bind.transform, event.target.getValue(), "fromWidget");

        this._hasFocus = false;

        if (this._hasPlaceholder) {
            // We're handling the placeholder. Set an empty string in the datamodel instead of the placeholder value
            // Note that the placeholder is set by the type function, so we know the field must be empty
            aria.utils.Json.setValue(bind.inside, bind.to, "", bind.cb);
        } else {
            aria.utils.Json.setValue(bind.inside, bind.to, newValue, bind.cb);
        }
        this._firstFocus = true;

    }

    /**
     * This is to put the caret at position (0, 0) in browsers that do not support the placeholder attribute.
     * @param {aria.DomEvent} event focus event
     * @private
     */
    function focusBinding (event) {
        this._hasFocus = true;
        if (this._hasPlaceholder) {
            aria.core.Timer.addCallback({
                fn : this._setCaretForPlaceholder,
                scope : this,
                delay : 4
            });
        }
    }

    /**
     * This is to implement the autoselect.
     * @param {aria.DomEvent} event focus event
     * @private
     */
    function clickBinding (event) {
        if (this._hasPlaceholder) {
            aria.utils.Caret.setPosition(this._domElt, 0, 0);
        } else if (this._cfg.autoselect) {
            this._autoselect();
        }
    }

    /**
     * This is to check if the browser supports placeholder attribute.
     * @private
     * @type Boolean
     */
    var _placeholderSupported = null;

    /**
     * TextInput widget. Bindable widget providing bi-directional bind of 'value' and on 'type' event callback.
     */
    Aria.classDefinition({
        $classpath : "aria.html.TextInput",
        $extends : "aria.html.InputElement",
        $dependencies : ["aria.html.beans.TextInputCfg", "aria.utils.Caret", "aria.DomEvent"],
        $statics : {
            /* BACKWARD-COMPATIBILITY-BEGIN GH-551*/
            /**
             * Deprecation warning
             * @type String
             */
            DEPRECATED_PASSWORD : "The Password property is deprecated. Add the input type as an attribute"
            /* BACKWARD-COMPATIBILITY-END GH-551*/
        },
        $onload : function () {
            var domevent = aria.DomEvent;
            specialKeys = [domevent.KC_END, domevent.KC_RIGHT, domevent.KC_ARROW_RIGHT, domevent.KC_DOWN,
                    domevent.KC_ARROW_DOWN, domevent.KC_DELETE, domevent.KC_BACKSPACE];

        },
        /**
         * Create an instance of the widget.
         * @param {aria.html.beans.TextInputCfg:Properties} cfg widget configuration, which is the parameter given in
         * the template
         * @param {aria.templates.TemplateCtxt} context template context
         * @param {Number} lineNumber line number in the template
         */
        $constructor : function (cfg, context, line) {
            cfg.attributes = cfg.attributes || {};
            var type = cfg.attributes.type;

            /* BACKWARD-COMPATIBILITY-BEGIN GH-551*/

            // leave that check for backward compatibility
            if (cfg.password) {
                type = "password";
                this.$logWarn(this.DEPRECATED_PASSWORD, [this.tplClasspath, line]);
            } else if (!type) {
                type = "text";
            }

            /* BACKWARD-COMPATIBILITY-END GH-551*/

            cfg.on = cfg.on || {};

            _placeholderSupported = ("placeholder" in Aria.$window.document.createElement("input"));
            if (cfg.placeholder && _placeholderSupported) {
                cfg.attributes.placeholder = cfg.placeholder;
            }

            this._registerListeners(cfg);

            /**
             * Wheter or not this widget has a 'on type' callback
             * @protected
             * @type Boolean
             */
            this._reactOnType = this._registerType(cfg.on, context);

            /**
             * Flag set to false after first focus, and set back to true after a blur. Used for the autoselect
             * behaviour. This value is true when the field receives focus for the first time (user action) and false
             * when the focus is given programmatically by the controller
             * @protected
             * @type Boolean
             */
            this._firstFocus = true;

            /**
             * Flag used to indicate if the element has focus
             * @protected
             * @type Boolean
             */
            this._hasFocus = false;

            /**
             * Flag used to indicate if the element has the placeholder
             * @protected
             * @type Boolean
             */
            this._hasPlaceholder = false;

            this.$InputElement.constructor.call(this, cfg, context, line, type);
        },
        $destructor : function () {
            if (this._typeCallback) {
                aria.core.Timer.cancelCallback(this._typeCallback);
            }
            this.$InputElement.$destructor.call(this);
        },
        $prototype : {
            /**
             * Tagname to use to generate the markup of the widget
             */
            tagName : "input",

            /**
             * Classpath of the configuration bean for this widget.
             */
            $cfgBean : "aria.html.beans.TextInputCfg.Properties",

            /**
             * Initialization method called after the markup of the widget has been inserted in the DOM.
             */
            initWidget : function () {
                this.$InputElement.initWidget.call(this);

                var bindings = this._cfg.bind;
                if (bindings.value) {
                    var newValue = this._transform(bindings.value.transform, bindings.value.inside[bindings.value.to], "toWidget");
                    if (newValue != null) {
                        this._domElt.value = newValue;
                    }
                } else {
                    this.$logWarn(this.BINDING_NEEDED, [this.$class, "value"]);
                }
                this._setPlaceholder();
            },

            /**
             * Function called when a value inside 'bind' has changed.
             * @param {String} name Name of the property
             * @param {Object} value Value of the changed property
             * @param {Object} oldValue Value of the property before the change happened
             */
            onbind : function (name, value, oldValue) {
                this.$InputElement.onbind.apply(this, arguments);
                if (name === "value") {
                    value = (value != null) ? value + "" : "";
                    if (value) {
                        this._removePlaceholder();
                    }
                    this._domElt.value = value;
                    this._setPlaceholder();
                }
            },

            /**
             * Function to return the id
             * @return {String} Element id.
             */
            getId : function () {
                return this._cfg.id;
            },

            /**
             * Function to assign the focus to input field.
             */
            focus : function () {
                this._domElt.focus();
            },

            /**
             * Convert the special event type into a keydown event listener.
             * @param {Object} listeners On listeners taken from the widget configuration.
             * @param {aria.templates.TemplateCtxt} context Reference of the template context.
             * @return {Boolean} Whether the keydown events should be converted back to type events.
             * @protected
             */
            _registerType : function (listeners, context) {
                if (listeners.type) {
                    this._chainListener(listeners, "keydown", {
                        fn : keyDownToType,
                        scope : this,
                        args : aria.utils.Type.isArray(listeners.type) ? listeners.type : [listeners.type]
                    });
                    delete listeners.type;
                }
            },

            /**
             * If enabled, autoselect the widget text setting the caret position to the whole input value.
             * @protected
             */
            _autoselect : function () {
                if (this._firstFocus) {
                    this._firstFocus = false;
                    aria.utils.Caret.select(this._domElt);
                }
            },

            /**
             * Set the css class and value for placeholder if needed by browsers that don't support it natively. Used
             * only in IE 6/7/8/9 and FF 3.6.
             * @protected
             */
            _setPlaceholder : function () {
                if (!_placeholderSupported && this._cfg.placeholder) {
                    var element = this._domElt;
                    if (element.value === "") {
                        element.value = this._cfg.placeholder;
                        var cssClass = new aria.utils.ClassList(element);
                        cssClass.add('placeholder');
                        cssClass.$dispose();
                        if (this._hasFocus) {
                            aria.utils.Caret.setPosition(element, 0, 0);
                        }
                        this._hasPlaceholder = true;
                        this._domElt.unselectable = "on";
                    }
                }
            },

            /**
             * Remove the css class and value for placeholder if needed by browsers that don't support it natively.
             * @protected
             */
            _removePlaceholder : function () {
                if (this._hasPlaceholder) {
                    var element = this._domElt;
                    var cssClass = new aria.utils.ClassList(element);
                    element.value = "";
                    this._hasPlaceholder = false;
                    cssClass.remove('placeholder');
                    cssClass.$dispose();
                    this._domElt.unselectable = "off";
                }
            },

            /**
             * Add special listeners on top of the ones specified in configuration.
             * @param {aria.html.beans.TextInputCfg:Properties} cfg Widget configuration.
             * @protected
             */
            _registerListeners : function (cfg) {
                var listeners = cfg.on;

                this._chainListener(listeners, "blur", {
                    fn : bidirectionalBlurBinding,
                    scope : this
                });

                if ((!_placeholderSupported && cfg.placeholder) || cfg.autoselect) {
                    this._chainListener(listeners, "focus", {
                        fn : focusBinding,
                        scope : this
                    });

                    this._chainListener(listeners, "click", {
                        fn : clickBinding,
                        scope : this
                    });

                    this._chainListener(listeners, "keydown", {
                        fn : keyDownCallback,
                        scope : this
                    });

                    this._chainListener(listeners, "type", {
                        fn : this._setPlaceholder,
                        scope : this
                    });
                }
            },

            /**
             * Set the carrect at the beginning of the input field
             * @protected
             */
            _setCaretForPlaceholder : function () {
                if (this._hasPlaceholder) {
                    aria.utils.Caret.setPosition(this._domElt, 0, 0);
                }
            }

        }
    });
})();
