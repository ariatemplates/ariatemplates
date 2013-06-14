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
    $classpath : "test.aria.widgets.form.textinput.quotes.QuotesTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.env = {
            template : "test.aria.widgets.form.textinput.quotes.QuotesTestCaseTpl",
            data : {
                // value : 'som"eth"ing',
                helptext : 'help"this"text'
            }
        };
    },
    $destructor : function () {
        this.$TemplateTestCase.constructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            var tf = this.getInputField("tf");

            this.assertEquals(tf.value, this.templateCtxt.data.helptext, "Helptext different from expected, got "
                    + tf.value);

            // Set a value
            this.templateCtxt._tpl.$json.setValue(this.templateCtxt.data, "value", 'som"eth"ing');

            this.assertEquals(tf.value, this.templateCtxt.data.value, "Value different from expected, got " + tf.value);

            this.notifyTemplateTestEnd();
        }
    }
});