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
var Aria = require("../Aria");
var ariaWidgetsFormInputValidationHandler = require("./form/InputValidationHandler");


/**
 * WidgetTrait is a class to share code between input widgets and action widgets, although this can be extended to
 * include other widget types in the future. The purpose of this class is not to be created directly, but to allow its
 * prototype to be imported.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.WidgetTrait",
    $constructor : function () {
        // The purpose of this class is to provide a prototype to be imported, not to be created directly.
        this.$assert(11, false);
    },
    $prototype : {
        /**
         * Method used when a validation popup is needed for an input field
         * @protected
         */
        _validationPopupShow : function () {
            // check validation popup isn't already displayed
            if (!this._onValidatePopup) {
                this._onValidatePopup = new ariaWidgetsFormInputValidationHandler(this);
            }
            this._onValidatePopup.show();
        },

        /**
         * Method used to close the validation popup of an input field
         * @protected
         */
        _validationPopupHide : function () {
            if (this._onValidatePopup) {
                this._onValidatePopup.hide();
            }
        },

        /**
         * Method used to get a dom reference for positioning the popup
         */
        getValidationPopupReference : function () {
            return this.getDom();
        }
    }
});
