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

Aria.classDefinition({
    $classpath : "test.aria.html.textinput.autoselect.AutoselectTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.html.TextInput", "aria.utils.Dom"],
    $destructor : function () {
        this.element = null;
        this.$RobotTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            var document = Aria.$window.document;
            var inputs = document.getElementsByTagName("input");
            this.element = inputs[0];
            this.secondElement = inputs[1];

            this.synEvent.click(this.element, {
                fn : this.afterFirstClick,
                scope : this
            });
        },

        afterFirstClick : function () {
            var caretPos = aria.utils.Caret.getPosition(this.element);

            this.assertEquals(caretPos.start, 0, "The start pos of caret is not zero");
            this.assertEquals(caretPos.end, 0, "The end pos of caret is not zero");

            this.synEvent.type(this.element, "brazil", {
                fn : this.afterType,
                scope : this
            });
        },

        afterType : function () {
            var caretPos = aria.utils.Caret.getPosition(this.element);

            this.assertEquals(caretPos.start, this.element.value.length, "The start pos of caret is not at the end of the word typed");
            this.assertEquals(caretPos.end, this.element.value.length, "The end pos of caret is not at the end of the word typed");

            this.assertEquals(this.element.value, "brazil", "The value of input text is not brazil");

            var outside = aria.utils.Dom.getElementById("outsideDiv");

            this.synEvent.click(outside, {
                fn : this.afterSecondClick,
                scope : this
            });
        },

        afterSecondClick : function () {
            this.synEvent.click(this.element, {
                fn : this.afterThirdClick,
                scope : this
            });
        },

        afterThirdClick : function () {
            this.assertEquals(this.templateCtxt._tpl.data.click, 2, "Click callback set in the widget configuration has not been called");

            var caretPos = aria.utils.Caret.getPosition(this.element);
            this.assertEquals(caretPos.start, 0, "The start pos of caret is not zero");
            this.assertEquals(caretPos.end, this.element.value.length, "The end pos of caret is not at the end of the word typed");
            this.assertEquals(this.element.value, "brazil", "The value of input text is not brazil");

            this.synEvent.execute([["pause", 500],["click", this.element]],{
                fn : this.afterFourthClick,
                scope : this
            } );
        },

        afterFourthClick : function () {

            this.assertEquals(this.templateCtxt._tpl.data.click, 3, "Click callback set in the widget configuration has not been called");

            var caretPos = aria.utils.Caret.getPosition(this.element);
            this.assertEquals(caretPos.start - caretPos.end, 0, " After the second click the field is still completely selected");

            this.synEvent.click(this.secondElement, {
                fn : this.afterFirstClickTwo,
                scope : this
            });
        },

        afterFirstClickTwo : function () {
            var caretPos = aria.utils.Caret.getPosition(this.secondElement);

            this.assertEquals(caretPos.start, 0, "The start pos of caret is not zero");
            this.assertEquals(caretPos.end, 0, "The end pos of caret is not zero");

            this.synEvent.type(this.secondElement, "argentina", {
                fn : this.afterTypeTwo,
                scope : this
            });
        },

        afterTypeTwo : function () {
            var caretPos = aria.utils.Caret.getPosition(this.secondElement);

            this.assertEquals(caretPos.start, this.secondElement.value.length, "The start pos of caret is not at the end of the word typed");
            this.assertEquals(caretPos.end, this.secondElement.value.length, "The end pos of caret is not at the end of the word typed");

            this.assertEquals(this.secondElement.value, "argentina", "The value of input text is not argentina");

            var outside = aria.utils.Dom.getElementById("outsideDiv");

            this.synEvent.click(outside, {
                fn : this.afterSecondClickTwo,
                scope : this
            });
        },

        afterSecondClickTwo : function () {
            this.synEvent.click(this.secondElement, {
                fn : this.afterThirdClickTwo,
                scope : this
            });
        },

        afterThirdClickTwo : function () {
            // check that click callback declared in the widget configuration is called
            this.assertEquals(this.templateCtxt._tpl.data.clickNoAutoselect, 2, "Click callback set in the widget configuration has not been called");

            var caretPos = aria.utils.Caret.getPosition(this.secondElement);
            this.assertEquals(caretPos.start - caretPos.end, 0, "Autoselect false has not been taken into account");
            this.assertEquals(this.secondElement.value, "argentina", "The value of input text is not argentina");

            this.end();
        }
    }
});