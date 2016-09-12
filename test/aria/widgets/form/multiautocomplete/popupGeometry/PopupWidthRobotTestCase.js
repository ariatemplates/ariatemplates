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
    $classpath : "test.aria.widgets.form.multiautocomplete.popupGeometry.PopupWidthTest",
    $extends : "test.aria.widgets.form.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $constructor : function () {
        this.$BaseMultiAutoCompleteTestCase.constructor.call(this);
        this.data.popupWidth = 600;

    },
    $prototype : {

        runTemplateTest : function () {
            // popupWidth greater than the field width
            this._testDropDownWidth(600, {
                fn : this._afterFirstOpen,
                scope : this
            });
        },

        _afterFirstOpen : function () {
            // popupWidth lower than the field width
            this.data.popupWidth = 300;
            this._refreshTestTemplate();
            aria.core.Timer.addCallback({
                fn : this._performSecondCheck,
                scope : this
            });
        },

        _performSecondCheck : function () {
            this._testDropDownWidth(300, {
                fn : this.end,
                scope : this
            });
        },

        _testDropDownWidth : function (width, cb) {
            this.clickAndType("a", {
                fn : this._waitForDropdown,
                scope : this,
                args : {
                    width : width,
                    cb : cb
                }
            });
        },

        _waitForDropdown : function (args) {
            this.waitFor({
                condition : function () {
                    return this.isMultiAutoCompleteOpen("MultiAutoId");
                },
                callback : {
                    fn : this._checkWidth,
                    scope : this,
                    args : args
                }
            });
        },

        _checkWidth : function (evt, args) {
            var dropdown = this.getWidgetDropDownPopup("MultiAutoId");
            var geometry = aria.utils.Dom.getGeometry(dropdown);
            this.assertEquals(geometry.width, args.width, "Wrong width for the popup. Expected: " + args.width
                    + ". Got: " + geometry.width);
            this.$callback(args.cb);
        }

    }
});
