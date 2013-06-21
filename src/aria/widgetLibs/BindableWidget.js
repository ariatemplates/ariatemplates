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

/**
 * Base class to be extended by any widget that allows bindings.<br />
 * This class will add a listener on the datamodel for any property specified in cfg.bind. Whenever this value changes
 * in the data model the function '_notifyDataChange' is called. It also provides a method to transform bound values
 * to/from the widget.
 */
Aria.classDefinition({
    $classpath : "aria.widgetLibs.BindableWidget",
    $extends : "aria.widgetLibs.BaseWidget",
    $statics : {
        INVALID_BEAN : "Invalid propety '%1' in widget's '%2' configuration."
    },
    $dependencies : ["aria.utils.Json", "aria.utils.Type"],
    /**
     * Create an instance of the widget.
     * @param {Object} cfg widget configuration, which is the parameter given in the template
     * @param {aria.templates.TemplateCtxt} context template context
     * @param {Number} lineNumber line number in the template
     */
    $constructor : function (cfg, context, lineNumber) {
        this.$BaseWidget.constructor.call(this, cfg, context, lineNumber);

        /**
         * List of bind listener used by this class. It is needed for disposal so that callbacks are not called after
         * the widget has been destroyed and for avoiding loop in aria.utils.Json.setValue.
         *
         * <pre>
         * {
         *    'property' : {
         *       inside : 'data holder',
         *       to : 'value name',
         *       transform : 'bind transform'
         *       cb : 'listener callback'
         *    }
         * }
         * </pre>
         *
         * @tpye Object map a bindable property to the bound value and callback
         * @protected
         */
        this._bindingListeners = {};
    },
    $destructor : function () {
        var listeners = this._bindingListeners, jsonUtils = aria.utils.Json;
        for (var property in listeners) {
            if (listeners.hasOwnProperty(property)) {
                var bind = listeners[property];
                jsonUtils.removeListener(bind.inside, bind.to, bind.cb);
            }
        }
        this._bindingListeners = null;

        this.$BaseWidget.$destructor.call(this);
    },
    $prototype : {
        /**
         * Register listeners for the bindings associated to this widget
         * @protected
         */
        _registerBindings : function () {
            var bindings = this._cfg.bind, jsonUtils = aria.utils.Json;
            if (bindings) {
                for (var property in bindings) {
                    if (!bindings.hasOwnProperty(property)) {
                        continue;
                    }

                    var bind = bindings[property];
                    if (bind) {
                        var callback = {
                            fn : this._notifyDataChange,
                            scope : this,
                            args : property
                        };

                        try {
                            jsonUtils.addListener(bind.inside, bind.to, callback, true);

                            this._bindingListeners[property] = {
                                inside : bind.inside,
                                to : bind.to,
                                transform : bind.transform,
                                cb : callback
                            };

                            var newValue = this._transform(bind.transform, bind.inside[bind.to], "toWidget");
                            this.setWidgetProperty(property, newValue);
                        } catch (ex) {
                            this.$logError(this.INVALID_BEAN, [property, "bind"]);
                        }
                    }
                }
            }
        },

        /**
         * Called when a change occurs for a value with binding.
         * @protected
         * @param {Object} args details about what changed
         * @param {String} propertyName key of the binding configuration that registered this callback
         */
        _notifyDataChange : Aria.empty,

        /**
         * Set property for this widget. This is called by BindableWidget after a bind has been registered because
         * between the moment the widget constructor is called, and the moment _registerBindings is called, some time
         * may have elapsed and bound values may have changed.
         * @param {String} propertyName in the configuration
         * @param {Object} newValue to set
         */
        setWidgetProperty : Aria.empty,

        /**
         * Transforms a value from the widget value to the corresponding datamodel value using the specified transform.
         * @protected
         * @param {aria.widgetLibs.CommonBeans:TransformRef} transform Transformation function. Can be undefined if no
         * transformation is to be used or a classpath.
         * @param {Object|Boolean|String|Number} value The widget value to be transformed.
         * @param {String} direction Whether the transform is 'fromWidget' or 'toWidget
         * @return {Object|Boolean|String|Number} The transformed value. If no transformation is specified, returns the
         * same value as passed in the value parameter.
         */
        _transform : function (transform, value, direction) {
            var retVal = value;
            if (transform) {
                var created = false;
                var typeUtils = aria.utils.Type;

                // Instantiate the class if we refer to a class path
                if (typeUtils.isString(transform) && transform.indexOf('.') != -1) {
                    transform = Aria.getClassInstance(transform);
                    created = true;
                }

                if (transform[direction]) {
                    retVal = this.evalCallback(transform[direction], retVal);
                } else if (typeUtils.isFunction(transform)) {
                    retVal = this.evalCallback(transform, retVal);
                }
                if (created) {
                    transform.$dispose();
                }
            }
            return retVal;
        },

        /**
         * Call a callback function of the widget on the template context. First parameter to callback function will be
         * the arg parameter and the second parameter will be the callback.args if specified.
         * @param {aria.widgetLibs.CommonBeans:Callback} callback Function to be called
         * @param {Object} arg Any parameter which will be passed as first parameter to callback function.
         */
        evalCallback : function (callback, args) {
            return this._context.evalCallback(callback, args);
        }

    }
});