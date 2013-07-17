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
 * Check that the navigation manager gives the focus to right element when calling the focusFirst method after a modal
 * dialog is opened. This is the most significant case because there is a subtemplate where there is nothing to focus,
 * and two other templates with a textfield.
 * @class test.aria.templates.popup.focus.FocusOnDialogTestCase
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.popup.focus.FocusOnDialogTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Delegate"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.popup.focus.DialogTemplate"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            aria.utils.Json.addListener(this.templateCtxt._tpl.data, "tplCounter", {
                fn : this._afterDialogOpen,
                scope : this
            }, false, false);
        },

        _afterDialogOpen : function (change) {
            if (change.newValue == 3) {
                aria.core.Timer.addCallback({
                    fn : this._waitAndSee,
                    scope : this,
                    delay : 1
                });
            }
        },

        _waitAndSee : function () {
            var tf = this.getInputField("tf1");
            if (!aria.core.Browser.isIE) {
                this.assertEquals(tf, aria.utils.Delegate.getFocus());
            }
            // TODO add a test for IE. The problem is that the Delegate has not done any focus tracking yet, so that it
            // is not possible to know where the focus is
            this.notifyTemplateTestEnd();
        }
    }
});