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
var ariaTemplatesModifiers = require("./Modifiers");
var ariaTemplatesIBaseTemplate = require("./IBaseTemplate");
var ariaUtilsJson = require("../utils/Json");


/**
 * Base class from which all templates inherit. This is extended by aria.templates.Template for HTML templates or
 * aria.templates.CSSTemplate for CSS Templates
 * @class aria.templates.BaseTemplate
 * @extends aria.core.JsObject
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.templates.BaseTemplate',
    $destructor : function () {
        /* this is important for $destructor not to be overridden by the one of ITemplate interface */
    },
    $statics : {
        // ERROR MESSAGES:
        EXCEPTION_IN_MACRO : "Uncaught exception in macro '%1', line %2",
        EXCEPTION_IN_VARINIT : "Uncaught exception when initializing global variables in template '%0'.",
        ITERABLE_UNDEFINED : "line %2: Template error: cannot iterate over a null or undefined variable.",
        EXCEPTION_IN_EXPRESSION : "line %2: Uncaught runtime exception in expression '%1'",
        EXCEPTION_IN_VAR_EXPRESSION : "line %2: Uncaught runtime exception in var expression '%1'",
        EXCEPTION_IN_SET_EXPRESSION : "line %2: Uncaught runtime exception in set expression '%1'",
        EXCEPTION_IN_CHECKDEFAULT_EXPRESSION : "line %2: Uncaught runtime exception in checkdefault expression '%1'",
        MACRO_NOT_FOUND : "line %1: Template error: macro '%2' is not defined."
    },
    $prototype : {
        $json : ariaUtilsJson,

        /**
         * Prototype init method called at prototype creation time Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         * @param {Object} def the class definition
         */
        $init : function (p, def) {
            // copy the prototype of IBaseTemplate:
            var itf = ariaTemplatesIBaseTemplate.prototype;
            for (var k in itf) {
                if (itf.hasOwnProperty(k) && !p.hasOwnProperty(k)) {
                    // copy methods which are not already on this object (this avoids copying $classpath and
                    // $destructor)
                    p[k] = itf[k];
                }
            }

            // get shortcuts to necessary functions in other classes,
            // so that templates work even in a sandbox
            p.$modifier = ariaTemplatesModifiers.callModifier;
        }
    }
});
