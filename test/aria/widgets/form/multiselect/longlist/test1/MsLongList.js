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
    $classpath : "test.aria.widgets.form.multiselect.longlist.test1.MsLongList",
    $extends : "aria.jsunit.MultiSelectTemplateTestCase",
    $dependencies : ["aria.utils.FireDomEvent", "aria.DomEvent"],
    $constructor : function () {
        this.$MultiSelectTemplateTestCase.constructor.call(this);
        this.inputField = null;
    },
    $prototype : {

        /**
         * This method is always the first entry point to a template test Start the test by opening the MultiSelect
         * popup.
         */
        runTemplateTest : function () {

            this.ms = this.getWidgetInstance("ms1");
            this.inputField = this.getInputField("ms1");

            this._MSClick(this.inputField, this.arrowDown, this);
        },

        arrowDown : function () {
            this._MSType(this.inputField, "[down]", this.initElements, this);
        },

        initElements : function () {
            var that = this;
            setTimeout(function () {
                that.list = that.getWidgetDropDownPopup("ms1");
                that.tbody = that.list.getElementsByTagName('tbody')[0];
                that.tr = that.tbody.getElementsByTagName('tr')[1];
                that.span = that.tr.getElementsByTagName('span')[0];

                that.arrowDown2();
            }, 1000);
        },

        arrowDown2 : function () {
            var cbs = this.tr.getElementsByTagName('input');
            var domForAction = cbs[0].parentNode;
            aria.utils.FireDomEvent.fireEvent('keydown', domForAction, {
                keyCode : 40
            });
            var that = this;
            setTimeout(function () {
                that.checkFocus();
            }, 200);
            // Doesn't work for multiselect navigation
            // this._MSType(domForAction, "[down]", this.checkFocus, this);
        },

        checkFocus : function () {
            var that = this;
            setTimeout(function () {
                // Check if the first checkbox is focused
                var secondCb = that.tr.getElementsByTagName('input')[1];
                var span = secondCb.parentNode.getElementsByTagName('span')[0];

                var backgroundStart = span.style.backgroundPosition.substr(0, 2);
                that.assertFalse(backgroundStart == "-0", "The first checkbox should be focused");

                that.scrollDown();
            }, 1000);
        },

        scrollDown : function () {
            var that = this;
            setTimeout(function () {
                that.span.scrollTop = 500;
                that.focusLast();
            }, 200);
        },

        focusLast : function () {
            // The focus is fired before the click, which cause the issue.
            // That's why the event is tested instead of the click.

            var cbs = this.tr.getElementsByTagName('input');
            var domForClick = cbs[cbs.length - 1].parentNode;
            domForClick.focus();

            var that = this;
            setTimeout(function () {
                that.assertTrue(that.span.scrollTop > 100, "The scrollbar should be scrolled down");
                that.endTest();
            }, 100);
        },

        endTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});
