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
    $classpath : "test.aria.widgets.form.autocomplete.paste.PasteTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            var field = this.getInputField("ac");

            this.templateCtxt.$focus("ac");

            var evt = new Syn("paste", field, {
                ctrlKey : true,
                keyCode : 86
                // v
            }, function () {
                field.value = "japan";
            });

            aria.core.Timer.addCallback({
                fn : this.onPaste,
                scope : this,
                delay : 1000
            });
        },

        /**
         * After pasting, check that the dropdown is opened. The datamodel is updated on blur
         */
        onPaste : function () {
            var dropdown = this.getWidgetDropDownPopup("ac");
            this.assertTrue(!!dropdown, "Dropdown should be open");

            this.getInputField("ac").blur();
            var collector = aria.utils.Dom.getElementById("clickCollector");
            Syn.click(collector);

            aria.core.Timer.addCallback({
                fn : this.onBlur,
                scope : this,
                delay : 500
            });
        },

        /**
         * After blur check that the dropdown is closed and the datamodel is updated correctly
         */
        onBlur : function () {
            var dropdown = this.getWidgetDropDownPopup("ac");
            this.assertFalse(!!dropdown, "Dropdown should be closed");

            var data = this.templateCtxt.data;

            this.assertEquals(data.value.label, "Japan", "Datamodel is wrong");
            this.assertEquals(data.value.code, "JPN", "Datamodel is wrong");
            this.assertTrue(data.onchange, "onchange not called");

            // Now try to cut
            data.onchange = false;
            this.tryCut();
        },

        /**
         * Try to cut the text from the autocomplete
         */
        tryCut : function () {
            var field = this.getInputField("ac");

            this.templateCtxt.$focus("ac");

            var evt = new Syn("cut", field, {
                ctrlKey : true,
                keyCode : 88
                // x
            }, function () {
                field.value = "";
            });

            aria.core.Timer.addCallback({
                fn : this.onCut,
                scope : this,
                delay : 1000
            });
        },

        /**
         * After cutting, check that the dropdown is closed. The datamodel is updated on blur
         */
        onCut : function () {
            var dropdown = this.getWidgetDropDownPopup("ac");
            this.assertFalse(!!dropdown, "Dropdown should be closed");

            var collector = aria.utils.Dom.getElementById("clickCollector");
            Syn.click(collector); // click listeners are not added when DropDown is closed
            this.getInputField("ac").blur();

            aria.core.Timer.addCallback({
                fn : this.onBlurCut,
                scope : this,
                delay : 500
            });
        },

        /**
         * After blur check that the dropdown is closed and the datamodel is updated correctly
         */
        onBlurCut : function () {
            var dropdown = this.getWidgetDropDownPopup("ac");
            this.assertFalse(!!dropdown, "Dropdown should be closed");

            var data = this.templateCtxt.data;

            this.assertFalse(!!data.value, "Datamodel is wrong");
            this.assertTrue(data.onchange, "onchange not called");

            this.notifyTemplateTestEnd();
        }
    }
});
