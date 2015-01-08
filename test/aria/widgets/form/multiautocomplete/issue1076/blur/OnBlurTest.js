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
    $classpath : "test.aria.widgets.form.multiautocomplete.issue1076.blur.OnBlurTest",
    $extends : "test.aria.widgets.form.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $constructor : function () {
        this.$BaseMultiAutoCompleteTestCase.constructor.call(this);

        this.data.expandButton = true;

    },
    $prototype : {

        _waitAndExecute : function (fn, scope) {
            aria.core.Timer.addCallback({
                fn : fn,
                scope : scope,
                delay : 50
            });
        },

        runTemplateTest : function () {
            this.clickAndType(["[down]", this.dropdownOpenCondition], {
                fn : this._wait1,
                scope : this
            }, 1);
        },

        _wait1 : function () {
            this.waitFor({
                condition : function () {
                    return this.getElementsByClassName(Aria.$window.document.body, "xWidget xICNcheckBoxes").length !== 0;
                },
                callback : this._checkNoBlurOnOpenPopup
            });
        },

        _checkNoBlurOnOpenPopup : function () {
            this.assertEquals(this.data.onBlurCalls, 0, "The number of blur events %2. It is %1 instead.");
            this.synEvent.type(null, "[down]", {
                fn : this._wait2,
                scope : this
            });
        },

        _wait2 : function () {
            this._waitAndExecute(this._checkNoBlurOnFocusPopup, this);
        },

        _checkNoBlurOnFocusPopup : function () {
            this.assertEquals(this.data.onBlurCalls, 0, "The number of blur events %2. It is %1 instead.");
            this.synEvent.type(null, "[space]", {
                fn : this._wait3,
                scope : this
            });
        },

        _wait3 : function () {
            this._waitAndExecute(this._checkNoBlurOnNavigatingPopup, this);
        },

        _checkNoBlurOnNavigatingPopup : function () {
            this.assertEquals(this.data.onBlurCalls, 0, "The number of blur events %2. It is %1 instead.");
            this.focusOut({
                fn : this._checkFirstBlur,
                scope : this
            });
        },

        _checkFirstBlur : function () {
            this.assertEquals(this.data.onBlurCalls, 1, "The number of blur events should be %2. It is %1 instead");

            this.removeByCrossClick(0, {
                fn : this._wait5,
                scope : this
            });
        },

        _wait5 : function () {
            this._waitAndExecute(this._checkNoBlurOnCrossClick, this);
        },

        _checkNoBlurOnCrossClick : function () {
            this.assertEquals(this.data.onBlurCalls, 1, "The number of blur events should be %2. It is %1 instead.");
            this.end();
        }

    }
});
