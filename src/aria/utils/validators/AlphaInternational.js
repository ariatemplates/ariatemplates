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
var ariaUtilsValidatorsRegExp = require("./RegExp");


/**
 * Validates alphnumeric characters including accents
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.validators.AlphaInternational",
    $extends : ariaUtilsValidatorsRegExp,
    $constructor : function (message) {
        this.$RegExp.constructor.call(this, this.ALPHAINTERNATIONAL_REGEXP, message);
    },
    $statics : {
        ALPHAINTERNATIONAL_REGEXP : /^[A-Za-z \'\.\-\u00E0\u00C0\u00E1\u00C1\u00E2\u00C2\u00E3\u00C3\u00E4\u00C4\u00E5\u00C5\u00E6\u00C6\u00E7\u00C7\u00E8\u00C8\u00E9\u00C9\u00EA\u00CA\u00EB\u00CB\u00EC\u00CC\u00ED\u00CD\u00EE\u00CE\u00EF\u00CF\u00F0\u00D0\u00F1\u00D1\u00F2\u00D2\u00F3\u00D3\u00F4\u00D4\u00F5\u00D5\u00F6\u00D6\u00F8\u00D8\u00F9\u00D9\u00FA\u00DA\u00FB\u00DB\u00FC\u00DC\u00FD\u00DD\u00FE\u00DE\u00FF\u00DF]+$/,
        DEFAULT_LOCALIZED_MESSAGE : "Invalid ALPHAINTERNATIONAL string."
    },
    $prototype : {}
});
