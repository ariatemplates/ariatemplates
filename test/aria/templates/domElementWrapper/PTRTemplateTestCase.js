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
    $classpath : "test.aria.templates.domElementWrapper.PTRTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.domElementWrapper.PTRTemplate"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var textInput = aria.utils.Dom.getElementById("textInput");
            var wrapper = new aria.templates.DomElementWrapper(textInput);
            wrapper.setValue("input data");
            this.assertEquals(wrapper.getValue(), "input data", "TextInput assert failed...");
            wrapper.$dispose();
            var textarea = aria.utils.Dom.getElementById("textArea");
            wrapper = new aria.templates.DomElementWrapper(textarea);
            wrapper.setValue("text area data");
            this.assertEquals(wrapper.getValue(), "text area data", "TextArea assert failed...");
            wrapper.$dispose();
            var selectBox = aria.utils.Dom.getElementById("selectBox");
            wrapper = new aria.templates.DomElementWrapper(selectBox);
            wrapper.setValue("yui");
            this.assertEquals(wrapper.getValue(), "yui", "selectBox assert failed...");
            wrapper.$dispose();
            this.notifyTemplateTestEnd();
        }
    }
});