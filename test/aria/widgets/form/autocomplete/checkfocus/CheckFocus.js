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

/**
 * Scenario : autocomplete with asyn resource handler that takes some time. Type
 * something, focus something else, check that autocomplete did not "stole" focus
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.checkfocus.CheckFocus",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Function", "aria.core.Timer"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        // async handler with long delay
        var handler = {
            getSuggestions : function (entry, callback) {
                aria.core.Timer.addCallback({
                    fn : function () {
                        this.$callback(callback, [{
                                    label : 'label',
                                    code : 'code'
                                }]);
                    },
                    scope : aria.core.JsObject.prototype,
                    delay : 1000
                });
            },
            getDefaultTemplate : function () {
                return 'aria.widgets.form.list.templates.ListTemplate';
            },
            suggestionToLabel : function () {
                return "label";
            }
        };

        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.checkfocus.CheckFocusTpl",
            data : {
                handler : handler
            }
        });
    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("at"), {
                fn : this.onAcFocused,
                scope : this
            });
        },

        onAcFocused : function () {
            this.synEvent.type(this.getInputField("at"), "M", {
                fn : this.onAcOpened,
                scope : this
            });
        },

        onAcOpened : function () {
            this.getInputField('tf').focus();
            aria.core.Timer.addCallback({
                fn : this.finishTest,
                scope : this,
                delay : 2000
            });
        },

        finishTest : function () {
            this.assertTrue(!this.templateCtxt.data.blur, "Textfield has lost focus");
            this.notifyTemplateTestEnd();
        }
    }
});
