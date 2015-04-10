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
    $classpath : "test.aria.html.textinput.autoselectapi.AutoselectTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.html.TextInput", "aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.html.textinput.autoselectapi.AutoselectTestCaseTpl",
            data : {
                location : "Paris"
            }
        });
    },
    $prototype : {
        runTemplateTest : function () {

            var document = Aria.$window.document;
            var input = this.input = document.getElementsByTagName("input")[0];
            var button = this.button = document.getElementsByTagName("button")[0];

            this.synEvent.click(button, {
                fn :function() {
                    this.waitFor({
                        condition : function () {
                            return input === document.activeElement;
                        },
                        callback : this.check
                    });
                },
                scope : this
            });
        },

        check : function() {
            var caretPos = aria.utils.Caret.getPosition(this.input);

            this.assertEquals(caretPos.start, 0, "The start pos of caret is not at the start of the word typed");
            this.assertEquals(caretPos.end, this.input.value.length, "The end pos of caret is not at the end of the word typed");

            this.end();
        }
    }
});
