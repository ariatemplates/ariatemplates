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
 * Base class from which all text templates inherit.
 * @class aria.templates.TextTemplate
 * @extends aria.core.BaseTemplate
 */
Aria.classDefinition({
    $classpath : 'aria.templates.TextTemplate',
    $extends : "aria.templates.BaseTemplate",
    $dependencies : ["aria.templates.TxtCtxt"],
    $constructor : function () {
        this.$BaseTemplate.constructor.call(this);
    },
    $destructor : function () {
        this.$BaseTemplate.$destructor.call(this);
    },

    $prototype : {
        /**
         * Data model available to the text template. It can be overridden by the text template context.
         * @type {Object}
         */
        data : {},
        /**
         * Prototype init method called at prototype creation time. Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         * @param {Object} def the class definition
         */
        $init : function (p, def) {
            // The prototype should be an instance of Template, that inheriths from BaseTemplate
            p.$BaseTemplate.constructor.classDefinition.$prototype.$init(p, def);

            /**
             * This method can be called to process the Text Template: it receives data that the text template has
             * access to, it creates the text template context, and it calls the macro_main of the text template to
             * which the context is associated and it returns a string. It is a property of the constructor because it
             * is not desirable that it ends up in the prototype of the TextTemplate and all of its descendants.
             * @param {Object} data model available to the text template.
             * @return {String}
             */
            aria.templates.TextTemplate.processTextTemplate = function (data) {
                var textContext = new aria.templates.TxtCtxt();
                textContext.initTemplate({
                    "classpath" : this.prototype.$classpath,
                    "data" : data
                });
                var stringToReturn = textContext.getTextTemplateContent();
                textContext.$dispose();
                return stringToReturn;
            };

        }
    }
});
