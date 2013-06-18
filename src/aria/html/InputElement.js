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
     * Common base class for input elements. Bindable widget providing bi-directional bind of value
     */
    Aria.classDefinition({
        $classpath : "aria.html.InputElement",
        $extends : "aria.html.Element",
        $statics : {
            INVALID_USAGE : "Widget %1 can only be used as a %2.",
            BINDING_NEEDED : "The property '%2' from Widget %1 should be bound to a data model"
        },
        $constructor : function (cfg, context, line, type) {
            cfg.tagName = "input";
            cfg.attributes = cfg.attributes || {};
            cfg.attributes.type = type;

            this.$Element.constructor.call(this, cfg, context, line);
        },
        $prototype : {
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
            writeMarkupEnd : Aria.empty

        }
    });
})();
