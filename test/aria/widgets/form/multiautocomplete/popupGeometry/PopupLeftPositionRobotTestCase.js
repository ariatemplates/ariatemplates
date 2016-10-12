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
    $classpath : "test.aria.widgets.form.multiautocomplete.popupGeometry.PopupLeftPositionRobotTestCase",
    $extends : "test.aria.widgets.form.multiautocomplete.MultiAutoCompleteRobotBase",
    $constructor : function () {
        this.$MultiAutoCompleteRobotBase.$constructor.call(this);
        this.data.expandButton = true;
    },
    $prototype : {

        runTemplateTest : function () {

            this._selectOption({
                fn : this._afterFirstSelection,
                scope : this
            });
        },

        _afterFirstSelection : function () {

            this._selectOption({
                fn : this._afterSecondSelection,
                scope : this
            });
        },

        _afterSecondSelection : function () {
            this.clickAndType("[BACKSPACE]", {
                fn : this._afterDeletion,
                scope : this
            });
        },

        _afterDeletion : function () {
            this._selectOption({
                fn : this._afterThirdSelection,
                scope : this
            });
        },

        _afterThirdSelection : function () {

            this._selectOption({
                fn : this._expandDropdown,
                scope : this
            });
        },

        _expandDropdown : function () {
            this.clickonExpandoButton(this._checkExpandoButtonPosition);
        },

        _checkExpandoButtonPosition : function () {
            var dropdown = this.getWidgetDropDownPopup("MultiAutoId");
            var dropdownGeometry = aria.utils.Dom.getGeometry(dropdown);
            var macGeometry = aria.utils.Dom.getGeometry(this.getWidgetDomElement("MultiAutoId", "table"));
            this.assertEqualsWithTolerance(dropdownGeometry.x, macGeometry.x, 5, "Wrong left position for the popup. Expected: "
                    + macGeometry.x + ". Got: " + dropdownGeometry.x);

            this.end();
        },

        _selectOption : function (cb) {
            this.clickAndType("a", {
                fn : this._waitForDropdown,
                scope : this,
                args : {
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
                    fn : this._checkLeft,
                    scope : this,
                    args : {
                        fn : this._downEnter,
                        scope : this,
                        args : args
                    }
                }
            });
        },

        _downEnter : function (res, args) {
            this.type({
                text : ["[DOWN][ENTER]", this.dropdownCloseCondition],
                cb : args.cb,
                delay : 1
            });
        },

        _checkLeft : function (evt, cb) {
            var dropdown = this.getWidgetDropDownPopup("MultiAutoId");
            var dropdownGeometry = aria.utils.Dom.getGeometry(dropdown);
            var textInputGeometry = aria.utils.Dom.getGeometry(this._getField());
            this.assertEqualsWithTolerance(dropdownGeometry.x, textInputGeometry.x, 5, "Wrong left position for the popup. Expected: "
                    + textInputGeometry.x + ". Got: " + dropdownGeometry.x);
            this.$callback(cb);
        }

    }
});
