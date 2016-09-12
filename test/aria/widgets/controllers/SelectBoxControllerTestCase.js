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
    $classpath : "test.aria.widgets.controllers.SelectBoxControllerTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.widgets.controllers.SelectBoxController", "aria.DomEvent"],
    $prototype : {
        setUp : function () {
            this.lc = new aria.widgets.controllers.SelectBoxController();
            this.lc.setListOptions([{
                        value : "en",
                        label : "English"
                    }, {
                        value : "en-us",
                        label : "English (US)"
                    }, {
                        value : "fi",
                        label : "Finnish"
                    }, {
                        value : "fr",
                        label : "French"
                    }, {
                        value : "fr-ca",
                        label : "French (Canadian)"
                    }, {
                        value : "de",
                        label : "German"
                    }]);
        },

        tearDown : function () {
            this.lc.$dispose();
        },

        testGetTypedValue : function () {
            var lc = this.lc;
            var typed = {};

            // 65 == 'A'
            typed = lc._getTypedValue(65, "", 0);
            this.assertEquals(typed.nextValue, 'A');
            typed = lc._getTypedValue(0, "", 0);
            this.assertEquals(typed.nextValue, "");
            typed = lc._getTypedValue(0, "abc", 0, 0);
            this.assertEquals(typed.nextValue, "abc");
            this.assertEquals(typed.caretPosStart, 0);
            this.assertEquals(typed.caretPosEnd, 0);
            typed = lc._getTypedValue(65, "abcd", 4, 4);
            this.assertEquals(typed.nextValue, 'abcdA');
            this.assertEquals(typed.caretPosStart, 5);
            this.assertEquals(typed.caretPosEnd, 5);
            typed = lc._getTypedValue(65, "abcd", 0, 0);
            this.assertEquals(typed.nextValue, 'Aabcd');
            this.assertEquals(typed.caretPosStart, 1);
            this.assertEquals(typed.caretPosEnd, 1);
            typed = lc._getTypedValue(65, "abcd", 2, 2);
            this.assertEquals(typed.nextValue, 'abAcd');
            this.assertEquals(typed.caretPosStart, 3);
            this.assertEquals(typed.caretPosEnd, 3);
            typed = lc._getTypedValue(65, "abcd", 1, 3);
            this.assertEquals(typed.nextValue, 'aAd');
            this.assertEquals(typed.caretPosStart, 2);
            this.assertEquals(typed.caretPosEnd, 2);
        },

        testGetTypedValueOnDelete : function () {
            var lc = this.lc;
            var de = aria.DomEvent;
            var typed = {};

            // params: (keyCode,curVal,caretPosStart,caretPosEnd)
            typed = lc._getTypedValueOnDelete(de.KC_DELETE, "", 0, 0);
            this.assertEquals(typed.nextValue, "");
            this.assertEquals(typed.caretPosStart, 0);
            this.assertEquals(typed.caretPosEnd, 0);
            typed = lc._getTypedValueOnDelete(de.KC_DELETE, "", 1, 1);
            this.assertEquals(typed.nextValue, "");
            this.assertEquals(typed.caretPosStart, 0);
            this.assertEquals(typed.caretPosEnd, 0);
            typed = lc._getTypedValueOnDelete(de.KC_DELETE, "abc", 1, 1);
            this.assertEquals(typed.nextValue, "ac");
            this.assertEquals(typed.caretPosStart, 1);
            this.assertEquals(typed.caretPosEnd, 1);
            typed = lc._getTypedValueOnDelete(de.KC_BACKSPACE, "abc", 1, 1);
            this.assertEquals(typed.nextValue, "bc");
            this.assertEquals(typed.caretPosStart, 0);
            this.assertEquals(typed.caretPosEnd, 0);
            typed = lc._getTypedValueOnDelete(de.KC_DELETE, "abcd", 1, 3);
            this.assertEquals(typed.nextValue, "ad");
            this.assertEquals(typed.caretPosStart, 1);
            this.assertEquals(typed.caretPosEnd, 1);
            typed = lc._getTypedValueOnDelete(de.KC_BACKSPACE, "abcd", 1, 3);
            this.assertEquals(typed.nextValue, "ad");
            this.assertEquals(typed.caretPosStart, 1);
            this.assertEquals(typed.caretPosEnd, 1);
            typed = lc._getTypedValueOnDelete(de.KC_DELETE, "abcd", 4, 4);
            this.assertEquals(typed.nextValue, "abcd");
            this.assertEquals(typed.caretPosStart, 4);
            this.assertEquals(typed.caretPosEnd, 4);
            typed = lc._getTypedValueOnDelete(de.KC_BACKSPACE, "abcd", 4, 4);
            this.assertEquals(typed.nextValue, "abc");
            this.assertEquals(typed.caretPosStart, 3);
            this.assertEquals(typed.caretPosEnd, 3);
        },

        testCheckKeyStroke : function () {
            var lc = this.lc;

            var report;
            // args: charCode,keyCode,currentValue,caretPosStart,caretPosEnd
            report = lc.checkKeyStroke(65, 0, "", 0, 0);
            this.assertTrue(report.cancelKeyStroke); // no 'a' in the list
            this.assertEquals(lc.getDataModel().listContent.length, 0);
            report.$dispose();

            report = lc.checkKeyStroke(70, 0, "", 0, 0); // 70='F'
            this.assertTrue(report.cancelKeyStroke);
            this.assertEquals(report.text, 'F');
            this.assertEquals(lc.getDataModel().listContent.length, 3);
            this.assertEquals(lc.getDataModel().listContent[1].label, 'French');
            report.$dispose();

            report = lc.checkKeyStroke(110, 0, "FRE", 3, 3); // 110='n'
            this.assertTrue(report.cancelKeyStroke);
            this.assertEquals(report.text, 'Fren');
            this.assertEquals(lc.getDataModel().listContent.length, 2);
            this.assertEquals(lc.getDataModel().listContent[1].label, 'French (Canadian)');
            report.$dispose();

            report = lc.checkKeyStroke(110, 0, "FR", 3, 3); // 110='n'
            this.assertTrue(report.cancelKeyStroke);
            this.assertTrue(report.text == null);
            report.$dispose();

        }
    }
});
