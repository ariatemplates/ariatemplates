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

/**
 * Test case for aria.widgets.form.TextInput
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.AriaSkinInterfaceTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.widgets.AriaSkinInterface", "aria.widgets.AriaSkinNormalization"],
    $prototype : {
        testGetSkinObject : function () {
            var asi = aria.widgets.AriaSkinInterface;
            var asn = aria.widgets.AriaSkinNormalization;

            // wrong widget name:
            var res = asi.getSkinObject("XXX", "XXX");
            this.assertTrue(res == null);
            this.assertErrorInLogs(asn.INVALID_SKINNABLE_CLASS);

            // missing std skin class, should use a default configuration
            var skinnableClasses = asn.skinnableClasses;
            for (var widgetName in skinnableClasses) {
                if (skinnableClasses.hasOwnProperty(widgetName)) {
                    this.checkWidget(widgetName);
                }
            }
        },

        checkWidget : function (widgetName) {
            var ariaSkin = aria.widgets.AriaSkin.skinObject;
            var asi = aria.widgets.AriaSkinInterface;
            var asn = aria.widgets.AriaSkinNormalization;

            // missing skin class:
            var res = asi.getSkinObject(widgetName, "XXX");
            this.assertErrorInLogs(asi.WIDGET_SKIN_CLASS_OBJECT_NOT_FOUND);
            this.assertTrue(res != null); // result should not be null:
            var std = asi.getSkinObject(widgetName, "std");
            this.assertTrue(res === std); // should default to the std skin class
            this.assertLogsEmpty();

            var backup = ariaSkin[widgetName];
            ariaSkin[widgetName] = null;
            std = asi.getSkinObject(widgetName, "std");
            this.assertErrorInLogs(asn.MISSING_STD_SKINCLASS);
            this.assertTrue(std != null);
            ariaSkin[widgetName] = backup;
            this.assertLogsEmpty();
        }
    }
});
