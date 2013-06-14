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
    $classpath : "test.aria.widgets.form.textinput.onchange.OnChangeTestCase",
    $extends : "aria.jsunit.TemplateUITestCase",
    $constructor : function () {
        this.$TemplateUITestCase.constructor.call(this);

        /**
         * Has onchange been called ?
         * @type Boolean
         */
        this._onChangeCalled = false;
    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("textid1"), {
                fn : this.typeSomeText,
                scope : this
            });
        },

        /**
         * Then type in some text, in order to change the field value
         */
        typeSomeText : function () {
            this.synEvent.type(this.getInputField("textid1"), "this is a test", {
                fn : this.blurField,
                scope : this
            });
        },

        /**
         * Focus out of the first field so that the binding is applied
         */
        blurField : function () {
            // doing so will trigger the onchange
            this.getInputField("textid1").blur();
            this.assertTrue(this.env.data.onChange, "onChanged not called");
            this.notifyTemplateTestEnd();
        }
    }
});