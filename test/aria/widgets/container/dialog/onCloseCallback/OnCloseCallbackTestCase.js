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
    $classpath : "test.aria.widgets.container.dialog.onCloseCallback.OnCloseCallbackTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            dialogVisible : true,
            onOpen : 0,
            onClose : 0,
            sectionRefresh : false
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.onCloseCallback.OnCloseCallback",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            aria.core.Timer.addCallback({
                fn : this._refreshSection,
                scope : this,
                delay : 100
            });
        },

        _refreshSection : function () {
            aria.utils.Json.setValue(this.data, "sectionRefresh", true);
            aria.core.Timer.addCallback({
                fn : this._checkCallbacks,
                scope : this,
                delay : 100
            });
        },

        _checkCallbacks : function () {
            var dm = this.data;
            this.assertTrue(dm.dialogVisible, "The 'visible' data should be true");
            this.assertEquals(dm.onOpen, 2, "The callback 'onOpen' should have been called %2 time, but it was called %1 time");
            this.assertEquals(dm.onClose, 1, "The callback 'onClose' should have been called %2 time, but it was called %1 time");
            this.assertTrue(dm.sectionRefresh, "The 'sectionRefresh' data should be true");

            aria.utils.Json.setValue(this.data, "dialogVisible", false);

            this.assertEquals(this.templateCtxt.data.onClose, 2, "The callback 'onClose' should have been called %2 time, but it was called %1 time");
            this.end();
        }
    }
});
