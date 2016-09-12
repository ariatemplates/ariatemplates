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
    $classpath : "test.aria.widgets.container.dialog.escKey.multipleDialogs.EscapeOnModalAndNonModalTestCase",
    $extends : "test.aria.widgets.container.dialog.escKey.multipleDialogs.EscapeOnModalBase",
    $constructor : function () {
        this.$EscapeOnModalBase.constructor.call(this);
        this._data.modal = [true, false, true];
    },
    $prototype : {

        _afterFirstEscape : function () {
            this._assertDialogVisibility("one");
            this._assertDialogVisibility("two");
            this._assertDialogVisibility("three", false);

            aria.utils.FireDomEvent.fireEvent("keydown", this.getInputField("two"), {
                keyCode : aria.DomEvent['KC_ESCAPE']
            });

            aria.core.Timer.addCallback({
                fn : this._afterSecondEscape,
                scope : this,
                delay : 50
            });
        }

    }
});
