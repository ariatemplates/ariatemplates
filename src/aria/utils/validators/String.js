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
 * Validates the entry if it is formatted as a simple string without numbers but with special characters.
 * @class aria.utils.validators.String
 * @extends aria.utils.validators.RegExp
 */
Aria.classDefinition({
    $classpath : "aria.utils.validators.String",
    $extends : "aria.utils.validators.RegExp",
    $constructor : function (message) {
        this.$RegExp.constructor.call(this, this.STRING_REGEXP, message);
    },
    $statics : {
        STRING_REGEXP : /^[A-Za-z \-\,\.\'\?\!\:\%\+\=\_\@\;\#\*\(\)\<\>\[\]\/\"]*$/,
        DEFAULT_LOCALIZED_MESSAGE : "Invalid string."
    },
    $prototype : {}
});
