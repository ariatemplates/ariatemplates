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
 * Validator for a mandatory value
 * @class aria.utils.validators.MinMaxLength
 * @extends aria.utils.validators.Validator
 */
Aria.classDefinition({
    $classpath : "aria.utils.validators.MinMaxLength",
    $extends : "aria.utils.validators.Validator",
    $constructor : function (min, max, message) {
        this.$Validator.constructor.call(this, message);
        this.minLength = min;
        this.maxLength = max;
        if (isNaN(parseInt(this.minLength, 10)) || isNaN(parseInt(this.maxLength, 10))) {
            this.$logError(this.MISSING_MIN_MAX_VALUES);
        }
    },
    $destructor : function () {
        this.minLength = null;
        this.maxLength = null;
        this.$Validator.$destructor.call(this);
    },
    $statics : {
        DEFAULT_LOCALIZED_MESSAGE : "The value must be more than the minimum length and less than the maximum length of characters long.",

        // ERROR MESSAGES:
        MISSING_MIN_MAX_VALUES : "There was a problem loading the MinMaxLength validator, MIN and MAX values must be passed into the validators constructor."
    },
    $prototype : {
        validate : function (string) {
            if (string == null || string === "") {
                // the MinMaxLength validator always accepts empty values (it is not a mandatory validator)
                return this._validationSucceeded();
            }
            if (string.length < this.minLength || string.length > this.maxLength) {
                return this._validationFailed();
            }

            return this._validationSucceeded();
        }
    }
});