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
    $classpath : "test.aria.widgets.form.selectbox.SelectboxTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.cont = 0;
        this.selectbox = null;
        this.inputField = null;
        this.expandButton = null;
        this.dropdown = null;
        this.options = null;

        this.data = {
            selection : ''
        };

        this.setTestEnv({
            template : "test.aria.widgets.form.selectbox.SelectboxTestCaseTpl",
            data : this.data
        });
    },
    $destructor : function () {
        this.cont = null;
        this.selectbox = null;
        this.inputField = null;
        this.expandButton = null;
        this.dropdown = null;
        this.options = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            this.selectbox = this.getWidgetInstance("myId");
            this.inputField = this.getInputField("myId");
            this.expandButton = this.getExpandButton("myId");

            this.synEvent.click(this.expandButton, {
                fn : function () {
                    this.waitFor({
                        condition : function () {
                            return this.getWidgetDropDownPopup("myId");
                        },
                        callback : {
                            fn : this._afterClick,
                            scope : this
                        }
                    });
                },
                scope : this
            });
        },

        _afterClick : function () {
            this.cont += 1;
            this.dropdown = this.getWidgetDropDownPopup("myId");
            this.options = this.getElementsByClassName(this.dropdown, "xListEnabledItem_dropdown");

            var opts = {};
            opts.to = this.cont == 1 ? this.options[0] : this.options[1];

            this.synEvent.move(opts, this.inputField, {
                fn : this._afterMouseMoveDown,
                scope : this
            });
        },

        _afterMouseMoveDown : function () {
            if (this.cont == 1) {
                this.synEvent.click(this.options[0], {
                    fn : this._afterItemClick,
                    scope : this
                });
            } else {
                this.synEvent.click(this.options[1], {
                    fn : this._afterItemClick,
                    scope : this
                });
            }
        },

        _afterItemClick : function () {
            this.waitFor({
                condition : function () {
                    return !this.getWidgetDropDownPopup("myId");
                },
                callback : {
                    fn : function () {
                        if (this.cont === 1) {
                            this.assertTrue(this.inputField.value === "option 0");
                            aria.core.Timer.addCallback({
                                fn : this._afterSecondTimer,
                                scope : this,
                                delay : 500
                            });
                        } else {
                            this.inputField = this.getInputField("myId");
                            this.assertTrue(this.inputField.value === "option 1");
                            this.end();
                        }
                    },
                    scope : this
                }
            });
        },

        _afterSecondTimer : function () {
            this.expandButton = this.getExpandButton("myId");
            this.synEvent.click(this.expandButton, {
                fn : this._afterClick,
                scope : this
            });
        }
    }
});
