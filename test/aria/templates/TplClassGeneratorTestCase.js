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
var Aria = require("ariatemplates/Aria");
require("ariatemplates/templates/Template");
require("ariatemplates/tools/contextual/ContextualMenu");
require("ariatemplates/templates/TextTemplate");
var ariaCoreJsonValidator = require("ariatemplates/core/JsonValidator");
var currentContext = require("noder-js/currentContext");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.templates.TplClassGeneratorTestCase",
    $extends : require("ariatemplates/jsunit/TestCase"),
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
    $statics : {
        TPL : {
            UNIX : "{Template {$classpath:'a.b.C'}}\n{macro main()}\nHello\n{/macro}\n{/Template}",
            WIN : "{Template {$classpath:'a.b.C'}}\r\n{macro main()}\r\nHello\r\n{/macro}\r\n{/Template}",
            MAC : "{Template {$classpath:'a.b.C'}}\r{macro main()}\rHello\r{/macro}\r{/Template}"
        },
        CSS : {
            UNIX : "{CSSTemplate {$classpath:'a.b.C'}}\n{macro main()}\nHello\n{/macro}\n{/CSSTemplate}",
            WIN : "{CSSTemplate {$classpath:'a.b.C'}}\r\n{macro main()}\r\nHello\r\n{/macro}\r\n{/CSSTemplate}",
            MAC : "{CSSTemplate {$classpath:'a.b.C'}}\r{macro main()}\rHello\r{/macro}\r{/CSSTemplate}"
        },
        TXT : {
            UNIX : "{TextTemplate {$classpath:'a.b.C'}}\n{macro main()}\nHello\n{/macro}\n{/TextTemplate}",
            WIN : "{TextTemplate {$classpath:'a.b.C'}}\r\n{macro main()}\r\nHello\r\n{/macro}\r\n{/TextTemplate}",
            MAC : "{TextTemplate {$classpath:'a.b.C'}}\r{macro main()}\rHello\r{/macro}\r{/TextTemplate}"
        },
        TML : {
            UNIX : "{Library {$classpath:'a.b.C'}}\n{macro main()}\nHello\n{/macro}\n{/Library}",
            WIN : "{Library {$classpath:'a.b.C'}}\r\n{macro main()}\r\nHello\r\n{/macro}\r\n{/Library}",
            MAC : "{Library {$classpath:'a.b.C'}}\r{macro main()}\rHello\r{/macro}\r{/Library}"
        }
    },
    $prototype : {
        /* Utility methods */

        /**
         * Get a Class generator depending on the category
         * @param {String} category
         * @return {aria.templates.ClassGenerator}
         */
        _getGenerator : function (category) {
            var generators = {
                "TPL" : require("ariatemplates/templates/TplClassGenerator"),
                "CSS" : require("ariatemplates/templates/CSSClassGenerator"),
                "TXT" : require("ariatemplates/templates/TxtClassGenerator"),
                "TML" : require("ariatemplates/templates/TmlClassGenerator")
            };

            return generators[category];
        },

        /**
         * Parse a template
         * @param {String} category (TPL, CSS, ...)
         * @param {String} environment (WIN, MAC, UNIX)
         * @param {String} testName
         */
        _parse : function (category, environment, testName) {
            this._getGenerator(category).parseTemplate(this[category][environment], false, {
                fn : this.isABC,
                scope : this,
                args : testName
            }, {
                "template_classpath" : "a.b.C"
            });
        },

        /**
         * Assert that the template is generated correctly
         * @param {aria.templates.TreeBeans.Root} def Tree definition
         * @param {String} args testName
         */
        isABC : function (def, args) {
            var validTemplateNames = {
                Template : true,
                CSSTemplate : true,
                TextTemplate : true,
                Library : true
            };
            var self = this;

            try {
                var tree = def.tree;
                ariaCoreJsonValidator.check(tree, 'aria.templates.TreeBeans.Root');

                this.assertEquals(tree.content.length, 1);
                var tpl = tree.content[0];
                this.assertTrue(validTemplateNames[tpl.name], "Generated tree has invalid name");
                this.assertEquals(tpl.paramBlock, "{$classpath:'a.b.C'}", "Generated tree has invalid classpath");

                this.assertEquals(tpl.content.length, 1);
                var macro = tpl.content[0];
                this.assertEquals(macro.name, "macro", "Generated tree does not contain a macro");
                this.assertEquals(macro.paramBlock, "main()", "Generated tree does not contain main() macro");

                this.assertEquals(macro.content.length, 1);
                var text = macro.content[0];
                this.assertEquals(text.name, "#TEXT#");
                this.assertTrue(text.paramBlock.indexOf("Hello") != -1);

                var logicalPath = require.resolve(def.logicalPath);
                // remove any already loaded class for this logical path:
                delete currentContext.cache[logicalPath];
                currentContext.jsModuleExecute(def.classDef, logicalPath).thenSync(function (templateClass) {
                    // no error! it is ok
                    self.notifyTestEnd(args);
                }, function (ex) {
                    // we should never reach this place
                    self.handleAsyncTestError(ex);
                }).done();
            } catch (ex) {
                this.handleAsyncTestError(ex);
            }
        },

        /* Actual tests */
        // TPL
        testAsyncLineFeedWindows : function () {
            this._parse("TPL", "WIN", "testAsyncLineFeedWindows");
        },

        testAsyncLineFeedUnix : function () {
            this._parse("TPL", "UNIX", "testAsyncLineFeedUnix");
        },

        testAsyncLineFeedMac : function () {
            this._parse("TPL", "MAC", "testAsyncLineFeedMac");
        },

        // CSS
        testAsyncLineFeedWindowsCSS : function () {
            this._parse("CSS", "WIN", "testAsyncLineFeedWindowsCSS");
        },

        testAsyncLineFeedUnixCSS : function () {
            this._parse("CSS", "UNIX", "testAsyncLineFeedUnixCSS");
        },

        testAsyncLineFeedMacCSS : function () {
            this._parse("CSS", "MAC", "testAsyncLineFeedMacCSS");
        },

        // TXT
        testAsyncLineFeedWindowsTXT : function () {
            this._parse("TXT", "WIN", "testAsyncLineFeedWindowsTXT");
        },

        testAsyncLineFeedUnixTXT : function () {
            this._parse("TXT", "UNIX", "testAsyncLineFeedUnixTXT");
        },

        testAsyncLineFeedMacTXT : function () {
            this._parse("TXT", "MAC", "testAsyncLineFeedMacTXT");
        },

        // TML
        testAsyncLineFeedWindowsTML : function () {
            this._parse("TML", "WIN", "testAsyncLineFeedWindowsTML");
        },

        testAsyncLineFeedUnixTML : function () {
            this._parse("TML", "UNIX", "testAsyncLineFeedUnixTML");
        },

        testAsyncLineFeedMacTML : function () {
            this._parse("TML", "MAC", "testAsyncLineFeedMacTML");
        }
    }
});
