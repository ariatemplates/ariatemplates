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
     * @param {aria.core.CfgBeans.Callback} callback Function to be called
     * @param {Object} arg first argument of the callback
     * @private
     */
    function callNormalizedCallback (callback, arg) {
        callback.fn.call(callback.scope, arg, callback.args);
    }

    /**
     * Callback for the type event timer.
     * @private
     * @param {aria.core.CfgBeans.Callback} callback User defined type callback
     */
    function typeCallback (callback) {
        this._typeCallback = null;

        callNormalizedCallback(callback, this._domElt.value);
    }

    /**
     * Convert a keydown event into a type event. This is achieved adding a very short callback on keydown. The reason
     * being the fact that on keydown the input has still the previous value. In the callback we'll see the correct text
     * input value. This function should have the same scope as the widget instance.
     * @param {aria.DomEvent} event keydown event
     * @param {Object} callbacks Original, normalized callbacks for type and keydown events
     * @private
     */
    function keyDownToType (event, callbacks) {
        this._typeCallback = aria.core.Timer.addCallback({
            fn : typeCallback,
            scope : this,
            delay : 12,
            args : callbacks.type
        });

        // callbacks.keydown should be called last because it might trigger refreshes/disposal
        if (callbacks.keydown) {
            return callNormalizedCallback(callbacks.keydown, event);
        }
    }

    /**
     * Being a BindableWidget we already have one direction binding of value (from the datamodel to teh widget). This
     * function is the callback for implementing the other bind, from the widget to the datamodel. The value is set in
     * the datamodel on blur. It also takes care of calling the 'on blur' callback if it was defined.
     * @param {aria.DomEvent} event blur event
     * @param {aria.core.CfgBeans.Callback} blurCallback On blur callback
     * @private
     */
    function bidirectionalBlurBinding (event, blurCallback) {
        var bind = this._bindingListeners.value;
        var newValue = this._transform(bind.transform, event.target.getValue(), "fromWidget");
        aria.utils.Json.setValue(bind.inside, bind.to, newValue, bind.cb);

        this._firstFocus = true;

        if (blurCallback) {
            blurCallback.fn.call(blurCallback.scope, event, blurCallback.args);
        }
    }

    /**
     * This is to implement the autoselect.
     * @param {aria.DomEvent} event focus event
     * @param {aria.core.CfgBeans.Callback} clickCallback On click callback
     * @private
     */
    function clickBinding (event, clickCallback) {
        if (this._cfg.autoselect) {
            this._autoselect();
        }

        if (clickCallback) {
            clickCallback.fn.call(clickCallback.scope, event, clickCallback.args);
        }
    }

    /**
     * TextInput widget. Bindable widget providing bi-directional bind of 'value' and on 'type' event callback.
     */
    Aria.classDefinition({
        $classpath : "aria.html.TextInput",
        $extends : "aria.html.Element",
        $dependencies : ["aria.html.beans.TextInputCfg", "aria.utils.Caret"],
        $statics : {
            INVALID_USAGE : "Widget %1 can only be used as a %2."
        },
        $constructor : function (cfg, context, line) {
            this.$cfgBean = "aria.html.beans.TextInputCfg.Properties";

            cfg.tagName = "input";
            cfg.attributes = cfg.attributes || {};
            cfg.attributes.type = (cfg.password) ? "password" : "text";
            cfg.on = cfg.on || {};

            /**
             * Wheter or not this widget has a 'on type' callback
             * @protected
             * @type Boolean
             */
            this._reactOnType = this._registerType(cfg.on, context);

            this._registerListeners(cfg, context);

            /**
             * Flag set to false after first focus, and set back to true after a blur. Used for the autoselect
             * behaviour. This value is true when the field receives focus for the first time (user action) and false
             * when the focus is given programmatically by the controller
             * @type Boolean
             */
            this._firstFocus = true;

            this.$Element.constructor.call(this, cfg, context, line);
        },
        $destructor : function () {
            if (this._typeCallback) {
                aria.core.Timer.cancelCallback(this._typeCallback);
            }
            this.$Element.$destructor.call(this);
        },
        $prototype : {
            /**
             * TextInput can only be used as self closing tags. Calling this function raises an error.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupBegin : function (out) {
                this.$logError(this.INVALID_USAGE, [this.$class, "container"]);
            },

            /**
             * TextInput can only be used as self closing tags. Calling this function does not rais an error though
             * because it was already logged by writeMarkupBegin.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupEnd : Aria.empty,

            /**
             * Initialization method called after the markup of the widget has been inserted in the DOM.
             */
            initWidget : function () {
                this.$Element.initWidget.call(this);

                var bindings = this._cfg.bind;
                if (bindings.value) {
                    var newValue = this._transform(bindings.value.transform, bindings.value.inside[bindings.value.to], "toWidget");
                    if (newValue != null) {
                        this._domElt.value = newValue;
                    }
                }
            },

            /**
             * Function called when a value inside 'bind' has changed.
             * @param {String} name Name of the property
             * @param {Object} value Value of the changed property
             * @param {Object} oldValue Value of the property before the change happened
             */
            onbind : function (name, value, oldValue) {
                if (name === "value") {
                    this._domElt.value = value;
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
                    if (listeners.keydown) {
                        var normalizedKeydown = this.$normCallback.call(context._tpl, listeners.keydown);
                    }

                    var normalizedType = this.$normCallback.call(context._tpl, listeners.type);
                    listeners.keydown = {
                        fn : keyDownToType,
                        scope : this,
                        args : {
                            type : normalizedType,
                            keydown : normalizedKeydown
                        }
                    };

                    delete listeners.type;

                    return true;
                }

                return false;
            },

            /**
             * If enabled, autoselect the widget text setting the caret position to the whole input value.
             * @protected
             */
            _autoselect : function () {
                if (this._firstFocus) {
                    // this allow to click again and put the cursor at a given
                    // position
                    this._firstFocus = false;
                    var field = this._domElt;
                    var start = 0;
                    var end = (field.value.length) ? field.value.length : 0;
                    if (end) {
                        aria.utils.Caret.setCaretPosition(field, start, end);
                    }
                }
            },

            /**
             * Add special listeners on top of the ones specified in configuration.
             * @param {aria.html.beans.TextInputCfg.Properties} cfg Widget configuration.
             * @param {aria.templates.TemplateCtxt} context Reference of the template context.
             * @protected
             */
            _registerListeners : function (cfg, context) {
                var listeners = cfg.on;
                var normalized;

                if (listeners.blur) {
                    normalized = this.$normCallback.call(context._tpl, listeners.blur);
                }

                listeners.blur = {
                    fn : bidirectionalBlurBinding,
                    scope : this,
                    args : normalized
                };

                if (cfg.autoselect) {
                    if (listeners.click) {
                        normalized = this.$normCallback.call(context._tpl, listeners.click);
                    }

                    listeners.click = {
                        fn : clickBinding,
                        scope : this,
                        args : normalized
                    };
                }
            }

        }
    });
})();