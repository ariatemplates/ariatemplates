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

/**
 * Test keymap navigation (the specific case of ESCAPE handled by a user defined callback and a Dialog)
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.keyboardNavigation.DialogNavTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            escapeEvts : 0
        };

        this.setTestEnv({
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this._typeEsc({
                fn : this._openDialog,
                scope : this
            });
        },

        _openDialog : function () {
            // key shortcut callback should have been called once (dialog is not visible)
            this.assertEquals(this.data.escapeEvts, 1, "key shortcut callback has been called %1 times while it should be called once.");
            aria.utils.Json.setValue(this.data, "dialogOpen", true);
            this._typeEsc({
                fn : this._retryEscape,
                scope : this
            });
        },

        _retryEscape : function () {
            // key shortcut callback should have been called once (dialog has been shown and escape keypress hid it: no
            // callback is triggered)
            this.assertEquals(this.data.escapeEvts, 1, "key shortcut callback has been called %1 times while it should be called once.");
            this._typeEsc({
                fn : this._end,
                scope : this
            });
        },

        _end : function () {
            // key shortcut callback should have been called for the second time (the escape keypress has been handled
            // by the callback)
            this.assertEquals(this.data.escapeEvts, 2, "key shortcut callback has been called %1 times while it should be called twice.");
            this.notifyTemplateTestEnd();
        },

        _typeEsc : function (callback) {
            this.synEvent.type(this.getElementById("toBeFocused"), "[escape]", callback);
        }
    }
});
