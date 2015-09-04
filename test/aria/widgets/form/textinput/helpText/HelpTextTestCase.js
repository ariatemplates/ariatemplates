/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.textinput.helpText.HelpTextTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.widgets.AriaSkinNormalization"],
    $prototype : {
        setHelpTextPropertiesInSkin : function (widget) {
            var widgetSkin = aria.widgets.AriaSkin.skinObject[widget];
            delete widgetSkin["aria:skinNormalized"];
            widgetSkin.std.innerPaddingTop = 0;
            widgetSkin.std.innerPaddingLeft = 0;
            widgetSkin.std.innerPaddingBottom = 0;
            widgetSkin.std.innerPaddingRight = 0;
            widgetSkin.std.helpText = {
                color: "gray",
                font: {
                    fontSize: 12
                }
            };
            widgetSkin.alt = {};
            widgetSkin.alt.helpText = {
                color: "green",
                innerPaddingTop: 1,
                innerPaddingLeft: 10,
                innerPaddingRight: 10,
                innerPaddingBottom: 1,
                font: {
                    fontFamily: "cursive",
                    fontVariant: "small-caps",
                    fontStyle: "italic",
                    fontWeight: "bold",
                    fontSize: 10
                }
            };
            aria.widgets.AriaSkinNormalization.normalizeWidget(widget, widgetSkin);
        },

        setUp : function () {
            this.setHelpTextPropertiesInSkin("TextInput");
            this.setHelpTextPropertiesInSkin("Textarea");
            this.setHelpTextPropertiesInSkin("DatePicker");
            this.setHelpTextPropertiesInSkin("AutoComplete");
            this.setHelpTextPropertiesInSkin("MultiSelect");
            this.setHelpTextPropertiesInSkin("SelectBox");
            this.setHelpTextPropertiesInSkin("MultiAutoComplete");
        },

        baseIds: ["tf", "ta", "nf", "df", "time", "dp", "ac", "ms", "sb", "mac"],

        runTemplateTest : function () {
            var baseIds = this.baseIds;
            var altFields = this.altFields = [];
            var stdFields = this.stdFields = [];
            for (var i = 0, l = baseIds.length ; i < l; i++) {
                var curId = baseIds[i];
                altFields.push(curId + "alt");
                stdFields.push(curId + "std");
            }
            this.fields = stdFields.concat(altFields);

            var self = this;
            function step1() {
                self.checkHelpTextStyles();
                // now focuses each field and check again
                self.focusAllFields("focusAndCheck", step2);
            }

            function step2() {
                self.checkHelpTextStyles();
                // now focuses each field, type something and check again
                self.focusAllFields("focusTypeAndCheck", step3);
            }

            function step3() {
                self.checkNoHelpTextStyles();
                self.end();
            }

            step1();
        },

        focusAllFields : function (fnName, cb) {
            var fields = this.fields.slice(0);
            var self = this;

            function nextStep() {
                if (fields.length === 0) {
                    var endField = self.getInputField("end");
                    endField.focus();
                    self.waitForDomEltFocus(endField, cb);
                } else {
                    var nextField = self.getInputField(fields.shift());
                    self[fnName](nextField, nextStep);
                }
            }

            nextStep();
        },

        focusAndCheck : function (field, cb) {
            var self = this;
            function step1() {
                field.focus();
                self.waitForDomEltFocus(field, step2);
            }

            function step2() {
                // checks that the help text was removed
                self.assertFalse(/helpText/.test(field.className));
                cb();
            }

            step1();
        },

        focusTypeAndCheck : function (field, cb) {
            var self = this;
            function step1() {
                field.focus();
                self.waitForDomEltFocus(field, step2);
            }

            function step2() {
                // checks that the help text was removed
                self.assertFalse(/helpText/.test(field.className));
                self.synEvent.type(field, "a", cb);
            }

            step1();
        },

        checkHelpTextStyles : function () {
            var stdFields = this.stdFields;
            for (var i1 = 0, l1 = stdFields.length; i1 < l1; i1++) {
                this.checkStdStyle(this.getInputField(stdFields[i1]));
            }
            var altFields = this.altFields;
            for (var i2 = 0, l2 = altFields.length; i2 < l2; i2++) {
                this.checkAltStyle(this.getInputField(altFields[i2]));
            }
        },

        checkNoHelpTextStyles : function () {
            var fields = this.fields;
            for (var i = 0, l = fields.length ; i < l; i++) {
                var curField = this.getInputField(fields[i]);
                this.assertFalse(/helpText/.test(curField.className));
            }
        },

        checkStdStyle : function (field) {
            this.assertTrue(/helpText/.test(field.className));
            this.checkFontWeight(field, "normal");
            this.assertEquals(aria.utils.Dom.getStyle(field, "fontVariant"), "normal");
            this.assertEquals(aria.utils.Dom.getStyle(field, "fontStyle"), "normal");
            this.assertEquals(aria.utils.Dom.getStyle(field, "fontSize"), "12px");
            this.assertEquals(aria.utils.Dom.getStyle(field, "paddingTop"), "0px");
            this.assertEquals(aria.utils.Dom.getStyle(field, "paddingLeft"), "0px");
            this.assertEquals(aria.utils.Dom.getStyle(field, "paddingRight"), "0px");
            this.assertEquals(aria.utils.Dom.getStyle(field, "paddingBottom"), "0px");
        },

        checkAltStyle : function (field) {
            this.assertTrue(/helpText/.test(field.className));
            this.assertEquals(aria.utils.Dom.getStyle(field, "fontFamily"), "cursive");
            this.checkFontWeight(field, "bold");
            this.assertEquals(aria.utils.Dom.getStyle(field, "fontVariant"), "small-caps");
            this.assertEquals(aria.utils.Dom.getStyle(field, "fontStyle"), "italic");
            this.assertEquals(aria.utils.Dom.getStyle(field, "fontSize"), "10px");
            this.assertEquals(aria.utils.Dom.getStyle(field, "paddingTop"), "1px");
            this.assertEquals(aria.utils.Dom.getStyle(field, "paddingLeft"), "10px");
            this.assertEquals(aria.utils.Dom.getStyle(field, "paddingRight"), "10px");
            this.assertEquals(aria.utils.Dom.getStyle(field, "paddingBottom"), "1px");
        },

        checkFontWeight : function (field, expected) {
            var map = {
                "400": "normal",
                "700": "bold"
            };
            var value = aria.utils.Dom.getStyle(field, "fontWeight");
            if (map.hasOwnProperty(value)) {
                value = map[value];
            }
            this.assertEquals(value, expected);
        }
    }
});
