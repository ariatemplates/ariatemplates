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
 * Check that error text persistancy works with autocomplete
 * @class test.aria.templates.validation.errortext.ErrorTextTestCase
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.validation.errortext.ErrorTextTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.resources.handlers.LCResourcesHandler"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.handler = new aria.resources.handlers.LCResourcesHandler();
        this.setTestEnv({
            template : "test.aria.templates.validation.errortext.ErrorText",
            data : {
                "handler" : this.handler
            }
        });
    },
    $destructor : function () {
        this.handler.$dispose();
        this.$RobotTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            var input = this.getInputField("ac1");
            input.focus();

            this.synEvent.click(input, {
                fn : this.onUserClick,
                scope : this
            });
        },

        onUserClick : function () {
            var input = this.getInputField("ac1");

            this.synEvent.type(input, "blah", {
                fn : this.onUserTyped,
                scope : this
            });
        },

        onUserTyped : function () {
            var input = this.getInputField("ac1");
            this.templateCtxt.$focus('focusHelper');
            aria.core.Timer.addCallback({
                fn : this.afterBlur,
                scope : this,
                delay : 500
            });

        },

        afterBlur : function () {
            this.templateCtxt.$onOnce({
                "SectionRefreshed" : this.afterRefresh,
                scope : this
            });
            this.templateCtxt.$refresh();
        },

        afterRefresh : function () {
            var input = this.getInputField("ac1");
            this.assertTrue(input && input.value == "blah", "Error text was not kept");

            // For some reasons IE7 leave the focus on focusHelper even after the template is disposed,
            // this causes a failure on any following test that focuses on an input, it's enough to give
            // the focus to any other element
            input.focus();
            this.notifyTemplateTestEnd();
        }
    }
});
