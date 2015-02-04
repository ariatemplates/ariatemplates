/*
 * Copyright 2013 Amadeus s.a.s.
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
    $classpath : "test.aria.templates.templateSyntaxError.TemplateSyntaxErrorTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.core.MultiLoader"],
    $prototype : {

        _checkTemplateError : function (classpath, expectedInfoInError) {
            var document = Aria.$window.document;
            var domElt = this.domElt = document.createElement("div");
            document.body.appendChild(domElt);
            Aria.loadTemplate({
                div : domElt,
                classpath : classpath
            }, {
                fn : this._checkError,
                args : expectedInfoInError,
                scope : this
            });
        },

        _checkError : function (result, expectedInfoInError) {
            var errorObj = this.assertErrorInLogs(aria.core.MultiLoader.LOAD_ERROR).objOrErr;
            if (errorObj.logDetails) {
                errorObj.logDetails();
            }
            var error = errorObj + "";
            this.assertFalse(result.success);
            this.domElt.parentNode.removeChild(this.domElt);
            this.domElt = null;
            for (var i = 0, l = expectedInfoInError.length; i < l; i++) {
                this.assertStringContains(error, expectedInfoInError[i]);
            }
            var self = this;
            setTimeout(function () {
                // setTimeout needed to dispose undisposed FileLoaders
                self.notifyTestEnd();
            }, 200);
        },

        assertStringContains : function (mainString, subString) {
            this.assertTrue(mainString.indexOf(subString) > -1, "The error message '" + mainString
                    + "' does not contain the expected sub-string: '" + subString + "'");
        },

        testAsyncGeneratorError1 : function () {
            this._checkTemplateError("test.aria.templates.templateSyntaxError.TemplateSyntaxErrorGeneratorError1", [
                    "Template 'test/aria/templates/templateSyntaxError/TemplateSyntaxErrorGeneratorError1.tpl' could not be compiled to javascript",
                    "line 23: Template error: statement 'macro' cannot be used in a macro.",
                    "line 26: Template error: statement 'macro' cannot be used in a macro."]);
        },

        testAsyncParserError1 : function () {
            this._checkTemplateError("test.aria.templates.templateSyntaxError.TemplateSyntaxErrorParserError1", [
                    "Template 'test/aria/templates/templateSyntaxError/TemplateSyntaxErrorParserError1.tpl' could not be compiled to javascript",
                    "line 22: Template parsing error: could not find corresponding open statement for closing statement 'macro'."]);
        },

        testAsyncParserError2 : function () {
            this._checkTemplateError("test.aria.templates.templateSyntaxError.TemplateSyntaxErrorParserError2", [
                    "Template 'test/aria/templates/templateSyntaxError/TemplateSyntaxErrorParserError2.tpl' could not be compiled to javascript",
                    " line 22: Template parsing error: could not find corresponding '}'."]);
        },

        testAsyncEvalError : function () {
            this._checkTemplateError("test.aria.templates.templateSyntaxError.TemplateSyntaxErrorEvalError", ["SyntaxError"]);
        },

        testAsyncClasspathError : function () {
            this._checkTemplateError("test.aria.templates.templateSyntaxError.TemplateSyntaxErrorClasspathError", ["Module 'test/aria/templates/templateSyntaxError/TemplateSyntaxErrorClasspathError.tpl' does not contain the expected Aria Templates class. Please check the classpath inside the file."]);
        }

    }
});
