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
    $classpath : "test.aria.touch.widgets.dialog.closeOnClick.DialogTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json", "aria.core.Browser"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            dialogVisible : true
        };
        var olderThanIe10 = aria.core.Browser.isIE && parseInt(aria.core.Browser.version, 10) < 10;
        if (!olderThanIe10) {
            this.setTestEnv({
                template : "test.aria.touch.widgets.dialog.closeOnClick.DialogTestCaseTpl",
                data : this.data
            });
        }
    },
    $prototype : {
        runTemplateTest : function () {
            var olderThanIe10 = aria.core.Browser.isIE && parseInt(aria.core.Browser.version, 10) < 10;
            if (olderThanIe10) {
                this.end();
            } else {
                this.synEvent.click(Aria.$window.document.body, {
                    fn : this.delayedCheckBindings,
                    scope : this
                });
            }
        },

        checkBindings : function () {
            this.assertFalse(this.templateCtxt.data.dialogVisible, "The 'visible' binded data should be false");

            this.notifyTemplateTestEnd();
        },

        delayedCheckBindings : function () {
            aria.core.Timer.addCallback({
                fn : this.checkBindings,
                scope : this,
                delay : 5000
            });
        }

    }
});
