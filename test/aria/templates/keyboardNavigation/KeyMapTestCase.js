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
 * Test a complete table navigation
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.keyboardNavigation.KeyMapTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Function", "aria.utils.FireDomEvent"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            data : {
                key : ""
            }
        });
    },
    $prototype : {

        runTemplateTest : function () {

            // clean what was before
            this._disposeTestTemplate();

            // add globalKeyMap
            aria.templates.NavigationManager.addGlobalKeyMap({
                key : "F4",
                callback : {
                    fn : function () {
                        this.templateCtxt.data.key = "F4";
                    },
                    scope : this
                }
            });

            this._loadTestTemplate({
                fn : this.step0,
                scope : this
            });
        },

        // starting point
        step0 : function () {
            this.templateCtxt.$focus("tf1");
            setTimeout(aria.utils.Function.bind(this.step1, this), 200);
        },

        // tf1 has focus, F3, F4 and ctrl-A should work
        step1 : function () {
            var current = this.getInputField('tf1');
            aria.utils.FireDomEvent.fireEvent('keydown', current, {
                keyCode : aria.DomEvent.KC_F3
            });
            this.assertTrue(this.templateCtxt.data.key === "F3");
            aria.utils.FireDomEvent.fireEvent('keydown', current, {
                keyCode : aria.DomEvent.KC_F4
            });
            this.assertTrue(this.templateCtxt.data.key === "F4");
            aria.utils.FireDomEvent.fireEvent('keydown', current, {
                keyCode : aria.DomEvent.KC_A,
                ctrlKey : true
            });
            this.assertTrue(this.templateCtxt.data.key === "Ctrl-A");
            this.templateCtxt.$focus("tf2");
            this.templateCtxt.data.key = "";
            setTimeout(aria.utils.Function.bind(this.step2, this), 200);
        },

        // tf2 has focus, ctrl-A only should work
        step2 : function () {
            var current = this.getInputField('tf2');
            aria.utils.FireDomEvent.fireEvent('keydown', current, {
                keyCode : aria.DomEvent.KC_F3
            });
            this.assertTrue(this.templateCtxt.data.key === "");
            aria.utils.FireDomEvent.fireEvent('keydown', current, {
                keyCode : aria.DomEvent.KC_F4
            });
            this.assertTrue(this.templateCtxt.data.key === "");
            aria.utils.FireDomEvent.fireEvent('keydown', current, {
                keyCode : aria.DomEvent.KC_A,
                ctrlKey : true
            });
            this.assertTrue(this.templateCtxt.data.key === "Ctrl-A");
            this.templateCtxt.data.key = "";
            current.blur();
            setTimeout(aria.utils.Function.bind(this.step3, this), 200);
        },

        // no one has focus, only F4 should work
        step3 : function () {
            var body = Aria.$window.document.body;
            aria.utils.FireDomEvent.fireEvent('keydown', body, {
                keyCode : aria.DomEvent.KC_F3
            });
            this.assertTrue(this.templateCtxt.data.key === "");
            aria.utils.FireDomEvent.fireEvent('keydown', body, {
                keyCode : aria.DomEvent.KC_F4
            });
            this.assertTrue(this.templateCtxt.data.key === "F4");
            this.templateCtxt.data.key = "";
            aria.utils.FireDomEvent.fireEvent('keydown', body, {
                keyCode : aria.DomEvent.KC_A,
                ctrlKey : true
            });
            this.assertTrue(this.templateCtxt.data.key === "");
            // remove globalKeyMap
            aria.templates.NavigationManager.removeGlobalKeyMap({
                key : "F4"
            });
            aria.utils.FireDomEvent.fireEvent('keydown', body, {
                keyCode : aria.DomEvent.KC_F4
            });
            this.assertTrue(this.templateCtxt.data.key === "");
            // clean
            this._disposeTestTemplate();
            this.notifyTemplateTestEnd();
        }
    }
});
