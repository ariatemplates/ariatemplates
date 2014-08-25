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
var Aria = require("../../Aria");
var ariaUtilsValidatorsValidator = require("./Validator");


/**
 * A Base RegExp utility extended by all regex type utilities.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.validators.RegExp",
    $extends : ariaUtilsValidatorsValidator,
    $constructor : function (regexp, message) {
        this.$Validator.constructor.call(this, message);

        /**
         * Regular expression used to validate values.
         * @private
         * @type RegExp
         */
        this._regexp = regexp;
    },
    $destructor : function () {
        this._regexp = null;
        this.$Validator.$destructor.call(this);
    },
    $prototype : {

        /**
         * Validates that a string matches the regular expression.
         * @param {String} value The string you want to validate
         * @return {Object}
         */
        validate : function (value) {
            if (value == null || value === "") {
                // the regexp validator always accepts empty values (it is not a mandatory validator)
                return this._validationSucceeded();
            }
            if (!this._regexp.test(value)) {
                return this._validationFailed();
            }
            return this._validationSucceeded();
        }
    }
});
