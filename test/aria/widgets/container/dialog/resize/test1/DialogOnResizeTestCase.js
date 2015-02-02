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
    $dependencies : ["aria.utils.Json", "aria.utils.Dom", "aria.core.Browser", "aria.templates.Layout"],
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
            this._checkOffsets(divDialog, {
                offsetTop : 0,
                offsetLeft : 100,
                offsetWidth : 800,
                offsetHeight : 700
            });

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
            // Only for this case, the scrollbar is taken into account because the maximum width is not reached
            var scrollbarSize = aria.templates.Layout.getScrollbarsMeasuredWidth() + 1;
            // Check position
            this._checkOffsets(this.divDialog, {
                offsetTop : 0,
                offsetLeft : 50 - (scrollbarSize / 2),
                offsetWidth : 300 + scrollbarSize,
                offsetHeight : 400
            });

            this.testIframe.style.width = "1000px";
            this.testIframe.style.height = "700px";
            aria.core.Timer.addCallback({
                fn : this._checkSizeBack,
                scope : this,
                delay : 200
            });
        },

        _checkSizeBack : function () {
            // Check position
            this._checkOffsets(this.divDialog, {
                offsetTop : 0,
                offsetLeft : 100,
                offsetWidth : 800,
                offsetHeight : 700
            });

            this.end();
        },

        _checkOffsets : function (element, values) {
            for (var i in values) {
                if (values.hasOwnProperty(i)) {
                    this.assertEqualsWithTolerance(element[i], values[i], 5, i + " should be around %2 instead of %1");
                }
            }
        }

    }
});
