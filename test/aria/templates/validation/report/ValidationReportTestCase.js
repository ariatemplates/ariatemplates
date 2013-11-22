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
 * Check that framework validation errors are reported when validating the data model
 * @class test.aria.templates.validation.report.ValidationReportTestCase
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.validation.report.ValidationReportTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Data"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.validation.report.ValidationReport"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var input = this.getInputField("myDateField");
            input.focus();
            this.synEvent.type(this.getInputField("myDateField"), "09APR09", {
                fn : this.onUserDateTyped,
                scope : this
            });
        },

        onUserDateTyped : function () {
            this.templateCtxt.$focus('focusHelper2');
            // add some delay after blur
            aria.core.Timer.addCallback({
                fn : this.afterBlur,
                scope : this,
                delay : 200
            });
        },

        afterBlur : function () {
            var messages = {};
            var res = aria.utils.Data.validateValue(this.templateCtxt.data, "myDate", messages);
            this.assertTrue(res && res.length > 0, "Missing error");
            this.assertTrue(!!res[0].errorMessage, "Missing error message");

            // For some reasons IE7 leave the focus on focusHelper even after the template is disposed,
            // this causes a failure on any following test that focuses on an input, it's enough to give
            // the focus to any other element
            var input = this.getInputField("myDateField");
            input.focus();

            aria.core.Timer.addCallback({
                fn : this.scroll,
                scope : this,
                delay : 200
            });
        },

        scroll : function () {

            // Check javascript error on scroll
            var div = Aria.$window.document.getElementById("container");
            div.scrollTop += 10;

            this.notifyTemplateTestEnd();
        }
    }
});
