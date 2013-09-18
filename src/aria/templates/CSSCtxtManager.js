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

/**
 * List of active CSS templates loaded by Aria.loadTemplate
 * @class aria.templates.CSSCtxtManager
 * @extends aria.core.JsObject
 * @singleton
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.templates.CSSCtxtManager",
    $singleton : true,
    $constructor : function () {
        /**
         * List of active CSS context, It's an object where the key is the CSS template classpath and the value is an
         * instance of aria.templates.CSSCtxt
         * @private
         * @type Object
         */
        this._contexts = {};
    },
    $destructor : function () {
        this.reset();
    },
    $prototype : {
        /**
         * Retrieve the CSSContext from the classpath. It creates a new context if it's not already available
         * @param {String} classpath CSS template classpath
         * @return {aria.templates.CSSCtxt}
         */
        getContext : function (classpath, initArgs) {
            var ctxt = this._contexts[classpath];

            // Create a context if missing
            if (!ctxt) {
                ctxt = new (require("./CSSCtxt"))();

                // Override the classpath
                if (!initArgs) {
                    initArgs = {};
                }
                initArgs.classpath = classpath;
                ctxt.initTemplate(initArgs);

                this._contexts[classpath] = ctxt;
            }

            return ctxt;
        },

        /**
         * Dispose the Context of a CSS Template. This means that when the CSS Template is loaded again, it's main macro
         * will be executed again because it might have changed, for instance during a template reload.
         * @param {String} classpath CSS Template classpath
         */
        disposeContext : function (classpath) {
            var ctxt = this._contexts[classpath];

            if (ctxt) {
                ctxt.$dispose();
                delete this._contexts[classpath];
            }
        },

        /**
         * Dispose all contexts registered on the Manager
         * @return {Array} List of context classpaths that have been removed
         */
        reset : function () {
            var ctxts = [], all = this._contexts;

            for (var path in all) {
                if (all.hasOwnProperty(path)) {
                    ctxts.push(path);
                    all[path].$dispose();
                }
            }

            this._contexts = {};
            return ctxts;
        }
    }
});
