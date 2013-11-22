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
 * Unit tests for the FireDomEvent utils.
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.FireDomEvent",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.FireDomEvent", "aria.utils.Function", "aria.DomEvent"],
    $prototype : {
        testFireEvent : function () {
            var document = Aria.$window.document;
            var domElt = document.createElement("div");
            var otherElt = document.createElement("div");
            document.body.appendChild(otherElt);
            otherElt.appendChild(domElt);
            domElt.onclick = aria.utils.Function.bind(this._onClickDomElt, this);
            otherElt.onclick = aria.utils.Function.bind(this._onClickOtherElt, this);
            domElt.onkeydown = aria.utils.Function.bind(this._onKeyDownElt, this);
            otherElt.onkeydown = aria.utils.Function.bind(this._onKeyDownOtherElt, this);
            var fireDomEvent = aria.utils.FireDomEvent;
            this._fireEventState = "beforeClick";
            fireDomEvent.fireEvent("click", domElt);
            this.assertTrue(this._fireEventState == "afterOnClickOtherElt");
            this._fireEventState = "beforeOnKeyDown";
            fireDomEvent.fireEvent("keydown", domElt, {
                keyCode : aria.DomEvent.KC_SPACE
            });
            this.assertTrue(this._fireEventState == "afterOnKeyDownOtherElt");
            fireDomEvent.fireEvent("keyup", domElt, {
                keyCode : aria.DomEvent.KC_SPACE
            });
            domElt.onclick = null;
            otherElt.onclick = null;
            document.body.removeChild(otherElt);
        },

        _onClickDomElt : function () {
            try {
                this.assertTrue(this._fireEventState == "beforeClick");
                this._fireEventState = "afterOnClickDomElt";
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
        },

        _onClickOtherElt : function () {
            try {
                this.assertTrue(this._fireEventState == "afterOnClickDomElt");
                this._fireEventState = "afterOnClickOtherElt";
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
        },

        _onKeyDownElt : function (evt) {
            try {
                this.assertTrue(this._fireEventState == "beforeOnKeyDown");
                this._fireEventState = "afterOnKeyDownElt";
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
        },

        _onKeyDownOtherElt : function (evt) {
            try {
                this.assertTrue(this._fireEventState == "afterOnKeyDownElt");
                this._fireEventState = "afterOnKeyDownOtherElt";
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
        }
    }
});
