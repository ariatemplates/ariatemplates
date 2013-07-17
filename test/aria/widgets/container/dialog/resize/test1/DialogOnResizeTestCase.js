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
    $classpath : "test.aria.widgets.container.dialog.resize.test1.DialogOnResizeTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json", "aria.utils.Dom", "aria.core.Browser"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            dialogVisible : true
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.resize.test1.DialogOnResize",
            data : this.data,
            iframe : true
        });
    },
    $prototype : {

        runTemplateTest : function () {
            var doc = this.testDocument;
            var dialogContent = doc.getElementById("dialogContent");
            var divDialog = dialogContent.parentNode;
            while (divDialog.tagName.toLowerCase() != "div" && divDialog.parentNode.tagName.toLowerCase() != "body") {
                divDialog = divDialog.parentNode;
            }
            this.divDialog = divDialog;

            // Check position
            var value;
            value = divDialog.offsetTop;
            this.assertTrue(value === 0, "offsetTop should be around 0 instead of " + value);
            value = divDialog.offsetLeft;
            this.assertTrue(value >= 95 && value <= 105, "offsetLeft should be around 100 instead of " + value);
            value = divDialog.offsetWidth;
            this.assertTrue(value >= 795 && value <= 805, "offsetWidth should be around 800 instead of " + value);
            value = divDialog.offsetHeight;
            this.assertTrue(value >= 695 && value <= 705, "offsetHeight should be around 700 instead of " + value);

            if (aria.core.Browser.isPhantomJS) {
                this.end();
            } else {
                this.testIframe.style.width = "400px";
                this.testIframe.style.height = "400px";
                aria.core.Timer.addCallback({
                    fn : this._checkResize,
                    scope : this,
                    delay : 200
                });
            }

        },

        _checkResize : function () {
            var divDialog = this.divDialog;

            // Check position
            var value;
            value = divDialog.offsetTop;
            this.assertTrue(value === 0, "offsetTop should be around 0 instead of " + value);
            value = divDialog.offsetLeft;
            this.assertTrue(value >= 45 && value <= 55, "offsetLeft should be around 50 instead of " + value);
            value = divDialog.offsetWidth;
            this.assertTrue(value >= 25 && value <= 305, "offsetWidth should be around 300 instead of " + value);
            value = divDialog.offsetHeight;
            this.assertTrue(value >= 395 && value <= 405, "offsetHeight should be around 400 instead of " + value);

            this.testIframe.style.width = "1000px";
            this.testIframe.style.height = "700px";
            aria.core.Timer.addCallback({
                fn : this._checkSizeBack,
                scope : this,
                delay : 200
            });
        },

        _checkSizeBack : function () {
            var divDialog = this.divDialog;

            // Check position
            var value;
            value = divDialog.offsetTop;
            this.assertTrue(value === 0, "offsetTop should be around 0 instead of " + value);
            value = divDialog.offsetLeft;
            this.assertTrue(value >= 95 && value <= 105, "offsetLeft should be around 100 instead of " + value);
            value = divDialog.offsetWidth;
            this.assertTrue(value >= 795 && value <= 805, "offsetWidth should be around 800 instead of " + value);
            value = divDialog.offsetHeight;
            this.assertTrue(value >= 695 && value <= 705, "offsetHeight should be around 700 instead of " + value);

            this.end();
        }

    }
});
