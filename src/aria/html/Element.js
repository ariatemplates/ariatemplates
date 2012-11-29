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
    Aria.classDefinition({
        $classpath : "aria.html.Element",
        $extends : "aria.widgetLibs.BindableWidget",
        $dependencies : ["aria.html.beans.ElementCfg", "aria.core.JsonValidator", "aria.utils.Html", "aria.utils.Json",
                "aria.utils.Delegate", "aria.templates.DomEventWrapper", "aria.utils.Dom"],
        $statics : {
            INVALID_BEAN : "Invalid propety '%1' in widget's '%2' configuration."
        },
        $constructor : function (cfg, ctxt, lineNumber) {
            /**
             * Classpath of the configuration bean for this widget. Widgets extending this class can optionally provide
             * a bean for nomalizing widget's properties. If null the widget will be normalized against
             * aria.html.beans.ElementCfg.Properties.
             * @type String
             */
            this.$cfgBean = this.$cfgBean || "aria.html.beans.ElementCfg.Properties";

            var validCfg = aria.core.JsonValidator.normalize({
                json : cfg,
                beanName : this.$cfgBean
            });

            // it's always a good idea to call the parent contructor as soon as possible
            this.$BindableWidget.constructor.apply(this, arguments);

            if (!validCfg) {
                return makeUseless(this);
            }

            /**
             * Id of the DOM element of this widget.
             * @type String
             * @protected
             */
            this._id = this._createDynamicId();

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

            this._registerBindings();
            this._normalizeCallbacks();
        },
        $destructor : function () {
            if (this.__delegateId) {
                aria.utils.Delegate.remove(this.__delegateId);
                this.__delegateId = null;
            }

            this.$BindableWidget.$destructor.call(this);

            this._domElt = null;
        },
        $prototype : {
            /**
             * Since event's callbacks can be have several signatures as specified in
             * aria.widgetLibs.CommonBeans.Callback this function normalizes the callbacks for later use. It'll also ask
             * Delegate to generate a delegateId if needed.
             * @protected
             */
            _normalizeCallbacks : function () {
                var eventListeners = this._cfg.on, hasListeners = false;

                for (var listener in eventListeners) {
                    if (eventListeners.hasOwnProperty(listener)) {
                        hasListeners = true;

                        eventListeners[listener] = this.$normCallback.call(this._context, eventListeners[listener]);
                    }
                }

                if (hasListeners) {
                    var delegateManager = aria.utils.Delegate;
                    this.__delegateId = delegateManager.add({
                        fn : this._delegate,
                        scope : this
                    });
                }
            },

            /**
             * Callback for delegated events. If an 'on' callback was registered it calls the appropriate callback
             * passing a aria.templates.DomEventWrapper to the callback function
             * @param {aria.DomEvent} event Wrapped event
             * @protected
             */
            _delegate : function (event) {
                var type = event.type, callback = this._cfg.on[type];

                if (callback) {
                    var wrapped = new aria.templates.DomEventWrapper(event);
                    var returnValue = callback.fn.call(callback.scope, wrapped, callback.args);
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
                this._domElt = aria.utils.Dom.getElementById(this._id);
            },

            /**
             * Write the opening tag without adding the ending '>'. This part is common to both opening and self closing
             * tag.
             * @param {aria.templates.MarkupWriter} out
             * @protected
             */
            _openTag : function (out) {
                var cfg = this._cfg;
                var attributes = aria.utils.Html.buildAttributeList(cfg.attributes);
                var markup = ["<", cfg.tagName, " id='", this._id, "' "];

                if (attributes) {
                    markup.push(attributes, " ");
                }

                if (this.__delegateId) {
                    markup.push(aria.utils.Delegate.getMarkup(this.__delegateId), " ");
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
            }
        }
    });
})();
