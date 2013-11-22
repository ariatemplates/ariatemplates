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
 * Test case for aria.widgets.form.PasswordField
 */

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.PasswordFieldTest",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.widgets.form.PasswordField"],
    $prototype : {
        testInitialValueFalse : function () {
            var model = {};
            var cfg = {
                label : "Password",
                bind : {
                    value : {
                        inside : model,
                        to : "password"
                    }
                },
                mandatory : true
            };

            var widget = this.createAndInit("aria.widgets.form.PasswordField", cfg);
            var passwordElement = widget.getDom();

            if (aria.core.Browser.isIE7) {
                passwordElement = passwordElement.firstChild;
            }

            // test top level dom span
            this.assertTrue(passwordElement.tagName === "SPAN");
            this.assertTrue(passwordElement.childNodes.length === 2);

            // test label
            var label = passwordElement.childNodes[0];
            this.assertTrue(label.tagName === "LABEL");
            this.assertTrue(label.className.indexOf("xTextInput") != -1);
            if (aria.core.Browser.isIE7 || aria.core.Browser.isIE8) {
                this.assertTrue(label.innerText === "Password");
            } else {
                this.assertTrue(label.textContent === "Password");
            }

            // test input field
            var input = passwordElement.childNodes[1].childNodes[1].childNodes[0].childNodes[0];
            this.assertTrue(input.tagName === "INPUT");
            this.assertTrue(input.value === "");
            this.assertTrue(input.type === "password");

            widget.$dispose();
        }
     }
});
