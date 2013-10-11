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
    $classpath : "test.aria.widgets.container.dialog.escKey.multipleDialogs.EscapeOnModalTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.FireDomEvent", "aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this._data = {
            one : false,
            two : false,
            three : false,
            modal : [true, true, true]
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.escKey.multipleDialogs.EscapeOnModalTemplate",
            data : this._data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var json = aria.utils.Json;

            json.setValue(this._data, "one", true);
            json.setValue(this._data, "two", true);
            json.setValue(this._data, "three", true);
            aria.core.Timer.addCallback({
                fn : this._afterOpen,
                scope : this,
                delay : 50
            });
        },

        _afterOpen : function () {
            this._assertDialogVisibility("one");
            this._assertDialogVisibility("two");
            this._assertDialogVisibility("three");

            aria.utils.FireDomEvent.fireEvent('click', Aria.$window.document.body, {
                keyCode : aria.DomEvent['KC_ESCAPE']
            });
            aria.utils.FireDomEvent.fireEvent('keydown', Aria.$window.document.body, {
                keyCode : aria.DomEvent['KC_ESCAPE']
            });

            aria.core.Timer.addCallback({
                fn : this._afterFirstEscape,
                scope : this,
                delay : 50
            });
        },

        _afterFirstEscape : function () {
            this._assertDialogVisibility("one");
            this._assertDialogVisibility("two");
            this._assertDialogVisibility("three", false);
            this._assertFocus("two");

            aria.utils.FireDomEvent.fireEvent('keydown', Aria.$window.document.body, {
                keyCode : aria.DomEvent['KC_ESCAPE']
            });

            aria.core.Timer.addCallback({
                fn : this._afterSecondEscape,
                scope : this,
                delay : 50
            });
        },

        _afterSecondEscape : function () {
            this._assertDialogVisibility("one");
            this._assertDialogVisibility("two", false);
            this._assertDialogVisibility("three", false);
            this._assertFocus("one");

            aria.utils.FireDomEvent.fireEvent('keydown', Aria.$window.document.body, {
                keyCode : aria.DomEvent['KC_ESCAPE']
            });

            aria.core.Timer.addCallback({
                fn : this._afterThirdEscape,
                scope : this,
                delay : 50
            });
        },

        _afterThirdEscape : function () {
            this._assertDialogVisibility("one", false);
            this._assertDialogVisibility("two", false);
            this._assertDialogVisibility("three", false);

            this.notifyTemplateTestEnd();
        },

        _assertDialogVisibility : function (id, open) {
            open = open === false ? false : true;
            this.assertEquals(this._data[id], open, "Dialog " + id + " should " + (open ? "" : "not ") + "be open");
            var realId = this.templateCtxt.$getId(id);
            var field = aria.utils.Dom.getElementById(realId);
            this.assertEquals(!!field, open, "Dialog " + id + " should " + (open ? "" : "not ") + "be open");
        },

        _assertFocus : function (id) {
            var field = this.getInputField(id);
            var focused = Aria.$window.document.activeElement;
            this.assertEquals(field, focused, "Element with id " + id + " should be focused.");
        }
    }
});
