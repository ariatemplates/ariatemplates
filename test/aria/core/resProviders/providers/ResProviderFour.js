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

var resProviderOne = require("./ResProviderOne");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.core.resProviders.providers.ResProviderFour",
    $extends : resProviderOne,
    $constructor : function () {
        this.$ResProviderOne.$constructor.call(this);
        this._specificDataToSetLater = "resProviderFour";
    },

    $prototype : {

        // In this case the fetchData method is synchronous. We want to make sure that the "onLoad" method of the class
        // prototype is called
        fetchData : function (cb, caller) {
            this._afterFetchData({
                cb : cb,
                caller : caller
            });
        }
    }
});
