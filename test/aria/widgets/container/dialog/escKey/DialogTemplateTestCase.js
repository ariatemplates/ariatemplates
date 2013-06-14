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
    $classpath : "test.aria.widgets.container.dialog.escKey.DialogTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Function", "aria.utils.FireDomEvent", "aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        // override the template for this test case
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.escKey.DialogTemplate",
            data : {
                visible : true
            }
        });
    },
    $prototype : {
        runTemplateTest : function () {
            aria.utils.Dom.getElementById("dummy").focus();
            // set a timeout for IE
            aria.core.Timer.addCallback({
                fn : this.firstFocus,
                scope : this,
                delay : 200
            });
        },

        /**
         * Focus again after a small delay for IE
         */
        firstFocus : function () {
            this.textfield = this.getInputField("textfield");
            this.textfield.focus();
            // set a timeout for IE
            aria.core.Timer.addCallback({
                fn : this.escapeInField,
                scope : this,
                delay : 200
            });
        },

        /**
         * Test escape keymap with focus in a field
         */
        escapeInField : function () {
            aria.utils.FireDomEvent.fireEvent('keydown', this.textfield, {
                keyCode : aria.DomEvent['KC_ESCAPE']
            });

            aria.core.Timer.addCallback({
                fn : this.withoutFocus,
                scope : this,
                delay : 200
            });
        },

        /**
         * Test escape keymap anywhere in the page > if not in dialog, should not close dialog
         */
        withoutFocus : function () {
            this.assertTrue(this.templateCtxt.data.visible === false, "Modal dialog should have been closed.");
            aria.utils.Json.setValue(this.templateCtxt.data, 'visible', true);
            aria.utils.FireDomEvent.fireEvent('keydown', Aria.$window.document.body, {
                keyCode : aria.DomEvent['KC_ESCAPE']
            });
            aria.core.Timer.addCallback({
                fn : this.finishTest,
                scope : this,
                delay : 200
            });
        },

        finishTest : function () {
            this.assertTrue(this.templateCtxt.data.visible === true, "Modal dialog should be visible.");
            this.notifyTemplateTestEnd();
        }
    }
});
