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
 * Validator for the object type.
 */
Aria.classDefinition({
    $classpath : "aria.utils.validators.Object",
    $dependencies : ['aria.utils.Type'],
    $extends : "aria.utils.validators.Validator",
    $constructor : function (message) {
        this.$Validator.constructor.call(this, message);
    },
    $destructor : function () {
        this.$Validator.$destructor.call(this);
    },
    $prototype : {

        /**
         * validate will always fail by default.
         * @param {String} value
         * @return {Object}
         */
        validate : function (value) {
            if (value === null || aria.utils.Type.isObject(value)) {
                return this._validationSucceeded();
            }
            return this._validationFailed();
        }
    }
});