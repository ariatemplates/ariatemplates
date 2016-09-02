/*
 * Copyright 2012-present Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.textinput.eventWrapperPropagation.EventWrapperPropagationTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies: ["aria.utils.Type"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.textinput.eventWrapperPropagation.EventWrapperPropagation",
            data : {
                textFieldClickEW: null,
                textFieldBlurEW: null,
                textFieldFocusEW: null,
                selectBoxClickEW: null
            }
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("tf"), {
                fn : this.onTextFieldClicked,
                scope : this
            });
        },

        onTextFieldClicked: function() {
            this.assertNotNull(this.templateCtxt.data.textFieldClickEW, "Click callback on TextField 'tf' did not get any eventWrapper");
            this.assertTrue(
                aria.utils.Type.isInstanceOf(
                    this.templateCtxt.data.textFieldClickEW,
                    "aria.templates.DomEventWrapper"
                ),
                "EventWrapper injected in TextField click callback is not an DOMEventWrapper"
            );

            this.synEvent.click(this.getInputField("sb"), {
                fn : this.onSelectBoxClicked,
                scope : this
            });
        },

        onSelectBoxClicked: function() {
            // Checking TextField blur
            this.assertNotNull(this.templateCtxt.data.textFieldBlurEW, "Blur callback on TextField 'tf' did not get any eventWrapper");
            this.assertTrue(
                aria.utils.Type.isInstanceOf(
                    this.templateCtxt.data.textFieldBlurEW,
                    "aria.templates.DomEventWrapper"
                ),
                "EventWrapper injected in TextField blur callback is not an DOMEventWrapper"
            );

            // Checking SelectBox Focus
            this.assertNotNull(this.templateCtxt.data.selectBoxFocusEW, "Focus callback on SelectBox 'sb' did not get any eventWrapper");
            this.assertTrue(
                aria.utils.Type.isInstanceOf(
                    this.templateCtxt.data.selectBoxFocusEW,
                    "aria.templates.DomEventWrapper"
                ),
                "EventWrapper injected in SelectBox focus callback is not an DOMEventWrapper"
            );

            // Checking SelectBox Click
            this.assertNotNull(this.templateCtxt.data.selectBoxClickEW, "Click callback on SelectBox 'sb' did not get any eventWrapper");
            this.assertTrue(
                aria.utils.Type.isInstanceOf(
                    this.templateCtxt.data.selectBoxClickEW,
                    "aria.templates.DomEventWrapper"
                ),
                "EventWrapper injected in SelectBox click callback is not an DOMEventWrapper"
            );
            this.notifyTemplateTestEnd();
        }
    }
});
