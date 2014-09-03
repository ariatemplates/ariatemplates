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
    $classpath : "test.aria.widgets.form.textarea.maxlength.MaxLengthTestCase",
    $extends : "aria.jsunit.RobotTestCase",

    $destructor : function () {
        this.textarea = null;
        this.$RobotTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            var isMac = aria.core.Browser.isMac;
            this.ctrlKey = isMac ? "META" : "CTRL";

            var textareas = Aria.$window.document.getElementsByTagName("textarea");
            this.textarea = textareas[0];
            this.textareaForCopy = textareas[1];

            this.synEvent.click(this.textarea, {
                fn : this.afterFirstClick,
                scope : this
            });

        },

        afterFirstClick : function () {
            this.synEvent.type(this.textarea, "eeer", {
                fn : function () {
                    this.assertEquals(this.textarea.value, "eee", "The current value should be 'eee'");
                    this.copy();
                },
                scope : this
            });
        },

        copy : function () {
            this.synEvent.click(this.textareaForCopy, {
                fn : function () {
                    aria.utils.Caret.setPosition(this.textareaForCopy, 0, 3);
                    this.synEvent.type(this.textareaForCopy, "[<" + this.ctrlKey + ">]c[>" + this.ctrlKey + "<]", {
                        fn : this.paste,
                        scope : this
                    });
                },
                scope : this
            });
        },

        paste : function () {
            this.synEvent.click(this.textarea, {
                fn : function () {
                    aria.utils.Caret.setPosition(this.textarea, 0, 2);
                    this.synEvent.type(this.textarea, "[<" + this.ctrlKey + ">]v[>" + this.ctrlKey + "<]", {
                        fn : function () {
                            /*
                            this.waitFor({
                                condition : function () {
                                    this.textarea.value, "yue"
                                },
                                callback : {
                                    fn : this.end,
                                    scope : this
                                }
                            });
                            */

                            this.assertEquals(this.textarea.value, "yue", "The value should be equals to 'yue' instead of "
                                    + this.textarea.value);
                            this.end();
                        },
                        scope : this
                    });
                },
                scope : this
            });
        }
    }
});
