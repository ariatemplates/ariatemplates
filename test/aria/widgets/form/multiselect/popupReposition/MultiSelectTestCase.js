/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.multiselect.popupReposition.MultiSelectTestCase",
    $dependencies : ["aria.utils.Dom"],
    $extends : "aria.jsunit.MultiSelectTemplateTestCase",
    $prototype : {
        /**
         * This method is always the first entry point to a template test.
         */
        runTemplateTest : function () {
            this.toggleMultiSelectOn("ms1", this._step1);
        },

        _step1 : function () {
            this.initialPosition = this.checkPopupAligned();
            this.toggleMultiSelectOption("ms1", 100, this._step2);
        },

        _step2 : function () {
            var position = this.checkPopupAligned();
            this.assertJsonEquals(this.initialPosition, position);
            this.toggleMultiSelectOption("ms1", 101, this._step3);
        },

        _step3 : function () {
            var emptyPosition = this.emptyPosition = this.checkPopupAligned();
            var initialPosition = this.initialPosition;

            this.assertEquals(initialPosition.popup.width, emptyPosition.popup.width);
            this.assertEquals(initialPosition.popup.height, emptyPosition.popup.height);
            this.assertEquals(initialPosition.field.width, emptyPosition.field.width);
            this.assertEquals(initialPosition.field.height, emptyPosition.field.height);

            this.assertEquals(initialPosition.popup.y, emptyPosition.popup.y);
            this.assertEquals(initialPosition.field.y, emptyPosition.field.y);

            this.assertTrue(initialPosition.popup.x <= emptyPosition.popup.x);
            this.assertTrue(initialPosition.field.x <= emptyPosition.field.x);

            this.toggleMultiSelectOption("ms1", 101, this._step4);
        },

        _step4 : function () {
            var position = this.checkPopupAligned();
            this.assertJsonEquals(this.initialPosition, position);
            this.toggleMultiSelectOption("ms1", 101, this._step5);
        },

        _step5 : function () {
            var position = this.checkPopupAligned();
            this.assertJsonEquals(this.emptyPosition, position);
            this.checkPopupAligned();
            this.end();
        },

        checkPopupAligned : function () {
            var ms = this.getWidgetInstance("ms1");
            var popup = ms._dropdownPopup.domElement;
            var field = ms._frame._frame._domElt;
            var popupGeometry = aria.utils.Dom.getGeometry(popup);
            var fieldGeometry = aria.utils.Dom.getGeometry(field);
            this.assertEquals(popupGeometry.x, fieldGeometry.x);
            return {
                popup: popupGeometry,
                field: fieldGeometry
            };
        }
    }
});
