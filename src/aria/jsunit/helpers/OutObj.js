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
 * Helper to simulate a writer used in template context
 */
Aria.classDefinition({
    $classpath : "aria.jsunit.helpers.OutObj",
    $dependencies : ["aria.utils.Dom"],
    $singleton : true,
    $constructor : function () {
        /**
         * DOM element in which to inject the stored markup
         * @type HTMLElement
         */
        this.testArea = null;

        /**
         * HTML markup to be injected in the test area
         * @type String
         */
        this.store = "";
    },
    $destructor : function () {
        this.clean();
    },
    $prototype : {
        /**
         * Create a playground area for the widget in the DOM
         * @return {HTMLElement}
         */
        createPlayground : function (id) {
            var document = Aria.$window.document;
            var testArea = document.createElement("div");
            testArea.id = "playground_" + (id || "unknown_test");

            document.body.appendChild(testArea);

            this.testArea = testArea;
        },

        /**
         * Clean the playground area so that it can be reused
         */
        clean : function () {
            if (this.testArea) {
                this.testArea.parentNode.removeChild(this.testArea);
                this.testArea = null;
            }
            this.store = "";
        },

        /**
         * Mock of a template context
         * @type Object
         */
        tplCtxt : {
            $getId : function (id) {
                return ["testOutput", id].join("_");
            },
            evalCallback : function () {
                return aria.jsunit.helpers.OutObj.$callback.apply(this, arguments);
            }
        },

        /**
         * Write something in the store. This implements the TemplateCtxt interface
         * @param  {String} str Markup
         */
        write : function (str) {
            this.store += str;
        },

        /**
         * Put the stored markup in the test area
         */
        putInDOM : function () {
            this.testArea.innerHTML = this.store;
        },

        /**
         * Clear the test area and the store
         */
        clearAll : function () {
            this.testArea.innerHTML = "";
            this.store = "";
        },

        /* Mock methods */
        callMacro : Aria.empty,
        beginSection : Aria.empty,
        endSection : Aria.empty
    }
});
