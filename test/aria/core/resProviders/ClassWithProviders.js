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

Aria.classDefinition({
    $classpath : "test.aria.core.resProviders.ClassWithProviders",
    $dependencies : ["test.aria.core.resProviders.EventBus"],
    $resources : {
        resOne : {
            provider : "test.aria.core.resProviders.providers.ResProviderOne",
            handler : "/handlerOne",
            resources : ["resA", "resB"]
        },
        resTwo : {
            provider : "test.aria.core.resProviders.providers.ResProviderTwo",
            onLoad : "afterResTwoReady",
            resources : ["resC", "resD"]
        },
        resThree : {
            provider : "test.aria.core.resProviders.providers.ResProviderThree"
        },
        resFour : {
            provider : "test.aria.core.resProviders.providers.ResProviderFour",
            onLoad : "afterResTwoReady"
        }
    },
    $prototype : {

        afterResTwoReady : function () {
            this.someData.someKey = "someProperty";
            test.aria.core.resProviders.EventBus.raiseResTwoReady();
        },

        someData : {}
    }
});
