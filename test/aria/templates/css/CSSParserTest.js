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
    $classpath : "test.aria.templates.css.CSSParserTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.CSSClassGenerator", "aria.templates.CSSParser"],
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
        testPreprocessing : function () {
            var parser = aria.templates.CSSParser;
            this.assertTrue(!!parser.$CSSParser);

            var statements = aria.templates.CSSClassGenerator.getStatements();
            this.assertTrue(!!statements);

            // Test edge cases
            parser.template = "";
            parser.__preprocess(statements);
            this.assertEquals(parser.template, "");

            parser.template = "{}"; // no statement, should be prefixed
            parser.__preprocess(statements);
            this.assertEquals(parser.template, "\\{\\}");

            parser.template = "{Template}"; // valid, but not for the CSS
            parser.__preprocess(statements);
            this.assertEquals(parser.template, "\\{Template\\}");

            parser.template = "{/Template}"; // valid, but not for the CSS
            parser.__preprocess(statements);
            this.assertEquals(parser.template, "\\{/Template\\}");

            parser.template = "{CSSTemplate}"; // valid statement
            parser.__preprocess(statements);
            this.assertEquals(parser.template, "{CSSTemplate}");

            parser.template = "{/CSSTemplate}"; // closing valid statement
            parser.__preprocess(statements);
            this.assertEquals(parser.template, "{/CSSTemplate}");

            // nested braces in a statement
            parser.template = "{CSSTemplate {myProperty: {myNestedProperty: {}}, myOtherProperty: {}}}";
            parser.__preprocess(statements);
            this.assertEquals(parser.template, "{CSSTemplate {myProperty: {myNestedProperty: {}}, myOtherProperty: {}}}");

            // nested braces in a ${...} expression
            parser.template = "something: { ${myFunction({myParam1: param1, myParam2:{}})} }";
            parser.__preprocess(statements);
            this.assertEquals(parser.template, "something: \\{ ${myFunction({myParam1: param1, myParam2:{}})} \\}");

            // nested braces outside of any statement
            // what especially matters here is to be able to use CSS rules inside a @media print rule
            parser.template = "{if firstCondition}@media print { {if myCondition} myCSSClass {myProperty:${myValue};}{/if}}{/if}";
            parser.__preprocess(statements);
            this.assertEquals(parser.template, "{if firstCondition}@media print \\{ {if myCondition} myCSSClass \\{myProperty:${myValue};\\}{/if}\\}{/if}");

            parser.template = "${myValue}"; // ${...} should never be prefixed
            parser.__preprocess(statements);
            this.assertEquals(parser.template, "${myValue}");

            parser.template = "{CSSTemplate}a\\{\\}"; // what's already escaped shouldn't be escaped again
            parser.__preprocess(statements);
            this.assertEquals(parser.template, "{CSSTemplate}a\\{\\}");

            // testing errors:
            this.assertLogsEmpty();
            parser.template = "{";
            parser.__preprocess(statements);
            this.assertErrorInLogs(parser.MISSING_CLOSINGBRACES);

            this.assertLogsEmpty();
            parser.template = "{{}";
            parser.__preprocess(statements);
            this.assertErrorInLogs(parser.MISSING_CLOSINGBRACES);

            this.assertLogsEmpty();
            parser.template = "}";
            parser.__preprocess(statements);
            this.assertErrorInLogs(parser.MISSING_OPENINGBRACES);

            this.assertLogsEmpty();
            parser.template = "{}}";
            parser.__preprocess(statements);
            this.assertErrorInLogs(parser.MISSING_OPENINGBRACES);
        },

        testAsyncPreprocessing : function () {
            // Get the non prefixed file
            aria.core.IO.asyncRequest({
                url : Aria.rootFolderPath + "test/aria/templates/mock/CSSTemplate.tpl",
                callback : {
                    fn : this._testAsyncPreprocessingResponseNoPrefix,
                    scope : this
                }
            });
        },

        _testAsyncPreprocessingResponseNoPrefix : function (cb, args) {
            try {
                this.assertTrue(!!cb && !!cb.responseText);

                // Get the comparision file
                aria.core.IO.asyncRequest({
                    url : Aria.rootFolderPath + "test/aria/templates/mock/CSSTemplatePrefixed.tpl",
                    callback : {
                        fn : this._testAsyncPreprocessingFinal,
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

        _testAsyncPreprocessingFinal : function (cb, args) {
            try {
                this.assertTrue(!!cb && !!cb.responseText);

                var parser = aria.templates.CSSParser;
                this.assertTrue(!!parser.$CSSParser);

                var statements = aria.templates.CSSClassGenerator.getStatements();
                this.assertTrue(!!statements);

                parser._prepare(args.original);
                parser.__preprocess(statements);

                // Compare line by line
                this.__compareLines(parser.template, cb.responseText);
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
            this.notifyTestEnd("testAsyncPreprocessing");
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
        },

        testAsyncCommentRemovalIssue721 : function() {
            aria.core.IO.asyncRequest({
                //Get the template file
                url : Aria.rootFolderPath + "test/aria/templates/mock/CSSTemplateIssue721.tpl",
                callback : {
                    fn : this._testCommentRemoval,
                    scope : this
                }
            });
        },

        _testCommentRemoval : function (cb, args) {
            var parser = aria.templates.CSSParser;
            this.assertTrue(!!parser.$CSSParser);

            var template = cb.responseText;
            var pattern = /background-image:url(.*)\;/;
            //Get the background-image line before parsing
            var matchedDataUriBefore = template.match(pattern);
            //Ensure that the background-image statement exists
            this.assertEquals(2, matchedDataUriBefore.length);

            //prepare the template in order to remove comments
            parser._prepare(template);

            //Get the background-image line after parsing
            var matchedDataUriAfter = parser.template.match(pattern);
            this.assertEquals(2, matchedDataUriAfter.length);

            //check that both background-image urls found are the same
            this.assertEquals(matchedDataUriBefore[1], matchedDataUriAfter[1], "Mismatch between unmodified and modified template regarding data uri");
            this.notifyTestEnd("testAsyncCommentRemovalIssue721");
        }
    }
});
