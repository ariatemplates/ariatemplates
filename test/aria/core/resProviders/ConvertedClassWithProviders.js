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

var Aria = require("ariatemplates/Aria");
var eventBus = require("./EventBus");
var resOne = require("ariatemplates/$resourcesProviders").fetch(__dirname, "./providers/ResProviderOne", "test.aria.core.resProviders.ConvertedClassWithProviders", "", "/handlerOne", "resA", "resB");
var resTwo = require("ariatemplates/$resourcesProviders").fetch(__dirname, "./providers/ResProviderTwo", "test.aria.core.resProviders.ConvertedClassWithProviders", "afterResTwoReady", "", "resC", "resD");
var resThree = require("ariatemplates/$resourcesProviders").fetch(__dirname, "./providers/ResProviderThree", "test.aria.core.resProviders.ConvertedClassWithProviders");
var resFour = require("ariatemplates/$resourcesProviders").fetch(__dirname, "./providers/ResProviderFour", "test.aria.core.resProviders.ConvertedClassWithProviders", "afterResTwoReady");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.core.resProviders.ConvertedClassWithProviders",
    $resources : {
        resOne : resOne,
        resTwo : resTwo,
        resThree : resThree,
        resFour : resFour
    },
    $prototype : {

        afterResTwoReady : function () {
            this.someData.someKey = "someProperty";
            test.aria.core.resProviders.EventBus.raiseResTwoReady();
        },

        someData : {}
    }
});
