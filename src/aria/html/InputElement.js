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
var ariaHtmlDisabledTrait = require("./DisabledTrait");
var ariaHtmlElement = require("./Element");


(function () {

    /**
     * Common base class for input elements. Bindable widget providing bi-directional bind of value
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.html.InputElement",
        $extends : ariaHtmlElement,
        $statics : {
            INVALID_USAGE : "Widget %1 can only be used as a %2.",
            BINDING_NEEDED : "The property '%2' from Widget %1 should be bound to a data model"
        },
        $constructor : function (cfg, context, line, type) {
            cfg.attributes = cfg.attributes || {};
            cfg.attributes.type = type;

            this.$Element.constructor.call(this, cfg, context, line);
        },
        $prototype : {
            /**
             * Tagname to use to generate the markup of the widget
             */
            tagName : "input",

            /**
             * Classpath of the configuration bean for this widget.
             */
            $cfgBean : "aria.html.beans.InputElementCfg.Properties",

            /**
             * Prototype init method called at prototype creation. It copies all methods from the prototype of
             * aria.html.DisabledTrait
             * @param {Object} p the prototype object being built
             */
            $init : function (p) {
                var src = ariaHtmlDisabledTrait.prototype;
                for (var key in src) {
                    if (src.hasOwnProperty(key) && !p.hasOwnProperty(key)) {
                        p[key] = src[key];
                    }
                }
            },

            /**
             * Input elements can only be used as self closing tags. Calling this function raises an error.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupBegin : function (out) {
                this.$logError(this.INVALID_USAGE, [this.$class, "container"]);
            },

            /**
             * Input elements can only be used as self closing tags. Calling this function does not rais an error though
             * because it was already logged by writeMarkupBegin.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupEnd : Aria.empty,

            /**
             * Initialization method called after the markup of the widget has been inserted in the DOM.
             */
            initWidget : function () {
                this.$Element.initWidget.call(this);
                this.initDisabledWidgetAttribute();
            },

            /**
             * Function called when a value inside 'bind' has changed.
             * @param {String} name Name of the property
             * @param {Object} value Value of the changed property
             * @param {Object} oldValue Value of the property before the change happened
             */
            onbind : function (name, value, oldValue) {
                this.$Element.onbind.apply(this, arguments);
                this.onDisabledBind(name, value, oldValue);
            }

        }
    });
})();
