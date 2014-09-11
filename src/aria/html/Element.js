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
var Aria = require("../Aria");
require("./beans/ElementCfg");
var ariaCoreJsonValidator = require("../core/JsonValidator");
var ariaUtilsHtml = require("../utils/Html");
var ariaUtilsDelegate = require("../utils/Delegate");
var ariaTemplatesDomEventWrapper = require("../templates/DomEventWrapper");
var ariaUtilsDom = require("../utils/Dom");
var ariaUtilsType = require("../utils/Type");
var ariaWidgetLibsBindableWidget = require("../widgetLibs/BindableWidget");


(function () {
    /**
     * This function is called when the widget validation fails. It sets every public function to Aria.empty so that we
     * can safely assume that the configuration is valid inside the methods defined in the prototype.
     * @param {aria.html.Element) instance Instance of Element widget that should be made useless
     * @private
     */
    function makeUseless (instance) {
        instance.writeMarkup = Aria.empty;
        instance.writeMarkupBegin = Aria.empty;
        instance.writeMarkupEnd = Aria.empty;
        instance.initWidget = Aria.empty;
    }

    /**
     * Base class for html Element widget. This widget is only responsible of creating the markup for a normal html
     * element (like div, img, input ...). It's a simple markup generator for both container and non container widgets
     * and does not provide any binding mechanism.
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.html.Element",
        $extends : ariaWidgetLibsBindableWidget,
        /**
         * Create an instance of the widget.
         * @param {aria.html.beans.ElementCfg:Properties} cfg widget configuration, which is the parameter given in the
         * template
         * @param {aria.templates.TemplateCtxt} context template context
         * @param {Number} lineNumber line number in the template
         */
        $constructor : function (cfg, ctxt, lineNumber) {
            if (this.tagName) {
                cfg.tagName = this.tagName;
            }

            var validCfg = ariaCoreJsonValidator.normalize({
                json : cfg,
                beanName : this.$cfgBean
            });

            // it's always a good idea to call the parent contructor as soon as possible
            this.$BindableWidget.constructor.apply(this, arguments);

            if (!validCfg) {
                return makeUseless(this);
            }

            var id = cfg.id;

            /**
             * Id of the DOM element of this widget.
             * @type String
             * @protected
             */
            this._id = id ? this._context.$getId(id) : this._createDynamicId();

            /**
             * Reference of the DOM element with id this._id.
             * @type HTMLElement
             * @protected
             */
            this._domElt = null;

            /**
             * Delegate id used returned by aria.utils.Delegate
             * @type String
             * @private
             */
            this.__delegateId = null;

            /**
             * Array of event names which are not delegated and can only be handled through the fallback markup.
             * @type Array
             * @private
             */
            this.__delegateFallbackEvents = null;

            this._registerBindings();
            this._normalizeCallbacks();
        },
        $destructor : function () {
            if (this.__delegateId) {
                ariaUtilsDelegate.remove(this.__delegateId);
                this.__delegateId = null;
                this.__delegateFallbackEvents = null;
            }

            this.$BindableWidget.$destructor.call(this);

            this._domElt = null;
        },
        $prototype : {
            /**
             * Tagname to use to generate the markup of the widget
             */
            tagName : null,

            /**
             * Classpath of the configuration bean for this widget. Widgets extending this class can optionally provide
             * a bean for nomalizing widget's properties. If null the widget will be normalized against
             * aria.html.beans.ElementCfg.Properties.
             * @type String
             */
            $cfgBean : "aria.html.beans.ElementCfg.Properties",

            /**
             * Since event's callbacks can be have several signatures as specified in
             * aria.widgetLibs.CommonBeans.Callback this function normalizes the callbacks for later use. It'll also ask
             * Delegate to generate a delegateId if needed.
             * @protected
             */
            _normalizeCallbacks : function () {
                var eventListeners = this._cfg.on, hasListeners = false, listArray;
                var delegateManager = ariaUtilsDelegate;
                var delegateFallbackEvents = [];

                for (var listener in eventListeners) {
                    if (eventListeners.hasOwnProperty(listener)) {
                        hasListeners = true;
                        if (!delegateManager.isDelegated(listener)) {
                            delegateFallbackEvents.push(listener);
                        }
                        listArray = eventListeners[listener];
                        if (!ariaUtilsType.isArray(listArray)) {
                            listArray = [listArray];
                        }
                        for (var i = 0, listCount = listArray.length; i < listCount; i++) {
                            listArray[i] = this.$normCallback.call(this._context._tpl, listArray[i]);
                        }
                        eventListeners[listener] = listArray;
                    }
                }

                if (hasListeners) {
                    this.__delegateId = delegateManager.add({
                        fn : this._delegate,
                        scope : this
                    });
                    this.__delegateFallbackEvents = delegateFallbackEvents;
                }
            },

            /**
             * Callback for delegated events. If an 'on' callback was registered it calls the appropriate callback
             * passing a aria.templates.DomEventWrapper to the callback function
             * @param {aria.DomEvent} event Wrapped event
             * @protected
             */
            _delegate : function (event) {
                var type = event.type, callbackArray = this._cfg.on[type], callback, returnValue;
                if (callbackArray) {
                    var wrapped = new ariaTemplatesDomEventWrapper(event);
                    for (var i = 0, listCount = callbackArray.length; i < listCount; i++) {
                        callback = callbackArray[i];
                        returnValue = callback.fn.call(callback.scope, wrapped, callback.args);
                        if (returnValue === false) {
                            break;
                        }
                    }
                    wrapped.$dispose();
                    return returnValue;
                }
            },

            /**
             * Write the markup, corresponding to the self closing tag of this element.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkup : function (out) {
                this._openTag(out);

                out.write("/>");
            },

            /**
             * Write the beginning of its markup, corresponding to the opening tag of this element.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupBegin : function (out) {
                this._openTag(out);

                out.write(">");
            },

            /**
             * Write the end of its markup, corresponding to the closing tag of this emelent.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupEnd : function (out) {
                out.write("</" + this._cfg.tagName + ">");
            },

            /**
             * Function called when a value inside 'bind' has changed.
             * @param {String} name Name of the property
             * @param {Object} value Value of the changed property
             * @param {Object} oldValue Value of the property before the change happened
             */
            onbind : Aria.empty,

            /**
             * Initialization method called after the markup of the widget has been inserted in the DOM.
             */
            initWidget : function () {
                this._domElt = ariaUtilsDom.getElementById(this._id);
            },

            /**
             * Get the widget's DOM element
             * @return {HTMLElement}
             */
            getDom : function () {
                return this._domElt;
            },

            /**
             * Write the opening tag without adding the ending '>'. This part is common to both opening and self closing
             * tag.
             * @param {aria.templates.MarkupWriter} out
             * @protected
             */
            _openTag : function (out) {
                var cfg = this._cfg;
                var attributes = ariaUtilsHtml.buildAttributeList(cfg.attributes);
                var markup = ["<", cfg.tagName, " id='", this._id, "' "];

                if (attributes) {
                    markup.push(attributes, " ");
                }

                var delegateId = this.__delegateId;
                if (delegateId) {
                    var delegateManager = ariaUtilsDelegate;
                    markup.push(delegateManager.getMarkup(delegateId), " ");
                    var delegateFallbackEvents = this.__delegateFallbackEvents;
                    for (var i = 0, l = delegateFallbackEvents.length; i < l; i++) {
                        markup.push(delegateManager.getFallbackMarkup(delegateFallbackEvents[i], delegateId, false), " ");
                    }
                }

                out.write(markup.join(""));
            },

            /**
             * Called when a change occurs for a value with binding.
             * @protected
             * @param {Object} args details about what changed
             * @param {String} propertyName key of the binding configuration that registered this callback
             * @override
             */
            _notifyDataChange : function (args, propertyName) {
                this.onbind(propertyName, this._transform(this._cfg.bind[propertyName].transform, args.newValue, "toWidget"), args.oldValue);
            },

            /**
             * Add a listener for an event. It will be called before an already registered event, if any.
             * @protected
             * @param {aria.html.beans.ElementCfg:Properties.on} listeners Map of listeners
             * @param {String} eventType Type of the event
             * @param {aria.core.CfgBeans:Callback} callback listener to chain
             * @param {Boolean} after True if the listener has to be executed after all the other listeners. Otherwise,
             * it will be executed before
             */
            _chainListener : function (listeners, eventType, callback, after) {
                var listArray = listeners[eventType] || [];
                if (!ariaUtilsType.isArray(listArray)) {
                    listArray = [listArray];
                }

                if (after) {
                    listArray.push(callback);
                } else {
                    listArray.splice(0, 0, callback);
                }
                listeners[eventType] = listArray;
            },

            /**
             * Function to return the id
             * @return {String} Element id.
             */
            getId : function () {
                return this._cfg.id;
            }
        }
    });
})();
