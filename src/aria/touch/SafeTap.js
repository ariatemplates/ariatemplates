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
require("./ClickBuster");
var ariaTouchBaseTap = require("./BaseTap");


/**
 * Contains delegated handler for a safetap event
 */
module.exports = Aria.classDefinition({
    $singleton : true,
    $classpath : "aria.touch.SafeTap",
    $extends : ariaTouchBaseTap,
    $prototype : {
        /**
         * The fake events raised during the safetap lifecycle.
         * @protected
         */
        _getFakeEventsMap : function () {
            return {
                start : "safetapstart",
                end : "safetap",
                cancel : "safetapcancel"
            };
        }
    }
});
