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

Aria.classDefinition({
    $classpath : 'test.aria.templates.CSSCtxtTest',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ['aria.templates.CSSCtxt'],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
    $prototype : {

        setUp : function () {
            this.debug = aria.core.environment.Environment.isDebug();
            aria.core.environment.Environment.setDebug(true);
        },

        tearDown : function () {
            aria.core.environment.Environment.setDebug(this.debug);
        },

        /**
         * Testing the CSS preprocessing
         */
        testEdges : function () {
            var context = Aria.getClassInstance("aria.templates.CSSCtxt");
            this.assertTrue(!!context && !!context.$CSSCtxt);
            var prefix = "P ";
            var result = "";
            var utilTrim = aria.utils.String.trim;

            // Test edge cases
            result = context.__prefixingAlgorithm("", prefix);
            this.assertEquals(utilTrim(result.text), "");
            this.assertEquals(result.selectors, 0);

            result = context.__prefixingAlgorithm("nothing", prefix); // not a css rules
            this.assertEquals(utilTrim(result.text), "nothing");
            this.assertEquals(result.selectors, 0);

            result = context.__prefixingAlgorithm("a{}", prefix);
            this.assertEquals(utilTrim(result.text), "P a {}");
            this.assertEquals(result.selectors, 1);

            result = context.__prefixingAlgorithm(" a{}", prefix);
            this.assertEquals(utilTrim(result.text), "P a {}");
            this.assertEquals(result.selectors, 1);

            result = context.__prefixingAlgorithm("a {}", prefix);
            this.assertEquals(utilTrim(result.text), "P a {}");
            this.assertEquals(result.selectors, 1);

            result = context.__prefixingAlgorithm("\na{}", prefix);
            this.assertEquals(utilTrim(result.text), "P a {}");
            this.assertEquals(result.selectors, 1);

            result = context.__prefixingAlgorithm("\n a {}", prefix);
            this.assertEquals(utilTrim(result.text), "P a {}");
            this.assertEquals(result.selectors, 1);

            result = context.__prefixingAlgorithm("a,b {}", prefix);
            this.assertEquals(utilTrim(result.text), "P a, P b {}");
            this.assertEquals(result.selectors, 2);

            result = context.__prefixingAlgorithm("a, b {}", prefix);
            this.assertEquals(utilTrim(result.text), "P a, P b {}");
            this.assertEquals(result.selectors, 2);

            result = context.__prefixingAlgorithm("a, \n b{}", prefix);
            this.assertEquals(utilTrim(result.text), "P a, P b {}");
            this.assertEquals(result.selectors, 2);

            result = context.__prefixingAlgorithm("@media print,screen { a, \n b {}}", prefix);
            this.assertEquals(utilTrim(result.text), "@media print,screen {\nP a, P b {}\n}");
            this.assertEquals(result.selectors, 2);

            result = context.__prefixingAlgorithm("@media print { a, \n b {}\n a {}}", prefix);
            this.assertEquals(utilTrim(result.text), "@media print {\nP a, P b {}\nP a {}\n}");
            this.assertEquals(result.selectors, 3);

            context.$dispose();
        },

        testAsyncPrefixing : function () {
            // Get the non prefixed file
            aria.core.IO.asyncRequest({
                url : Aria.rootFolderPath + "test/aria/templates/mock/CSSCtxtOriginal.css",
                callback : {
                    fn : this._testAsyncPrefixingResponseNoPrefix,
                    scope : this
                }
            });
        },

        _testAsyncPrefixingResponseNoPrefix : function (cb, args) {
            try {
                this.assertTrue(!!cb && !!cb.responseText);

                // Get the comparision file
                aria.core.IO.asyncRequest({
                    url : Aria.rootFolderPath + "test/aria/templates/mock/CSSCtxtDestination.css",
                    callback : {
                        fn : this._testAsyncPrefixingFinal,
                        scope : this,
                        args : {
                            original : cb.responseText
                        }
                    }
                });
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
        },

        _testAsyncPrefixingFinal : function (cb, args) {
            try {
                this.assertTrue(!!cb && !!cb.responseText);

                var context = Aria.getClassInstance("aria.templates.CSSCtxt");
                this.assertTrue(!!context && !!context.$CSSCtxt);
                var prefix = "P ";
                var result = "";

                result = context.__prefixingAlgorithm(args.original, prefix);

                // Compare line by line
                this.__compareLines(result.text, cb.responseText);
                this.assertEquals(result.selectors, 16);

                context.$dispose();
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
            this.notifyTestEnd("testAsyncPrefixing");
        },

        __compareLines : function (processed, comparison) {
            var splittedProcessed = processed.split("\n");
            var splittedComparison = comparison.split("\n");
            var utilTrim = aria.utils.String.trim;

            var lineP, lineC;
            for (var i = 0, len = splittedProcessed.length; i < len; i += 1) {
                lineP = utilTrim(splittedProcessed[i]);
                lineC = utilTrim(splittedComparison[i]);

                this.assertEquals(lineP, lineC, "Line " + i + " mismatch");
            }
        }
    }
});