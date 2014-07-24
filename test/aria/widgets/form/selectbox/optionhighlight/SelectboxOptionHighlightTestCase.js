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
    $classpath : "test.aria.widgets.form.selectbox.optionhighlight.SelectboxOptionHighlightTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.String"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.inputField = null;
        this.expandButton = null;
        this.dropdown = null;
        this.options = null;
        this.data = {
            countries : [{
                        value : "FR",
                        label : "France"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "UK",
                        label : "United Kingdom"
                    }, {
                        value : "US",
                        label : "United States"
                    }, {
                        value : "ES",
                        label : "Spain"
                    }, {
                        value : "PL",
                        label : "Poland"
                    }, {
                        value : "SE",
                        label : "Sweden"
                    }, {
                        value : "USA",
                        label : "United States of America"
                    }],
            selection : "CH"
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.selectbox.optionhighlight.SelectboxOptionHighlightTpl",
            data : this.data
        });
    },
    $destructor : function () {
        this.inputField = null;
        this.expandButton = null;
        this.dropdown = null;
        this.options = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            this.inputField = this.getInputField("myId");
            this.expandButton = this.getExpandButton("myId");
            aria.utils.SynEvents.click(this.expandButton, {
                fn : this._afterClick,
                scope : this
            });
        },
        _afterClick : function () {
            aria.core.Timer.addCallback({
                fn : this._afterTimer,
                scope : this,
                delay : 500
            });
        },
        _afterTimer : function () {
            this.dropdown = this.getWidgetDropDownPopup("myId");
            this.options = this.getElementsByClassName(this.dropdown, "xListSelectedItem_dropdown");
            var selectedOption = aria.utils.String.trim(this.options[0].textContent || this.options[0].innerText);
            this.assertEquals("Switzerland", selectedOption, "Expected %1, got %2");
            this.inputField.value = "";
            aria.utils.SynEvents.click(this.inputField, {
                fn : this._typeOption,
                scope : this
            });
        },
        _typeOption : function () {
            aria.utils.SynEvents.type(this.inputField, "pol[enter]", {
                fn : this._clickDropdown,
                scope : this
            });

        },
        _clickDropdown : function () {
            aria.utils.SynEvents.click(this.expandButton, {
                fn : this._checkHighlight,
                scope : this
            });
        },
        _checkHighlight : function () {
            this.dropdown = this.getWidgetDropDownPopup("myId");
            this.options = this.getElementsByClassName(this.dropdown, "xListSelectedItem_dropdown");
            var selectedOption = aria.utils.String.trim(this.options[0].textContent || this.options[0].innerText);
            this.assertEquals("Poland", selectedOption, "Expected %1, got %2");
            this.end();
        }
    }
});
