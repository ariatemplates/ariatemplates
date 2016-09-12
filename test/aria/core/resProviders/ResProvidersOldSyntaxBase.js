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
var ariaJsunitTestCase = require("ariatemplates/jsunit/TestCase");
var asyncRequire = require("noder-js/asyncRequire").create(module);
var eventBus = require("./EventBus");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.core.resProviders.ResProvidersOldSyntaxTest",
    $extends : ariaJsunitTestCase,
    $constructor : function () {
        this.$TestCase.$constructor.apply(this, arguments);
        this._classWithProvidersName = "./ClassWithProviders";
    },
    $prototype : {
        testAsyncLoadClassWithResProviders : function () {
            var self = this;
            eventBus.$on({
                "resTwoReady" : this._afterResTwoReady,
                scope : this
            });

            asyncRequire(this._classWithProvidersName).spread(function (classWithProviders) {
                self._afterClassLoading.call(self, classWithProviders);
            });

        },

        _afterClassLoading : function (classWithProviders) {
            var classTestInstance = this._testClassInstance = new classWithProviders();
            this.assertJsonEquals(classTestInstance.resOne.getData(), {
                handler : "/handlerOne",
                resources : ["resA", "resB"],
                data : "resProviderOne"
            });
            this.assertJsonEquals(classTestInstance.resThree.getData(), {
                data : "resProviderThree"
            });

            this.assertUndefined(classTestInstance.resTwo.getData().data);
            this.assertEquals(classTestInstance.resFour.getData().data, "resProviderFour");

        },

        _afterResTwoReady : function () {
            this._counter++;
            if (this._counter == 2) {
                this.assertJsonEquals(this._testClassInstance.resTwo.getData(), {
                    handler : "",
                    resources : ["resC", "resD"],
                    data : "resProviderTwo"
                });
                this.assertJsonEquals(this._testClassInstance.resFour.getData(), {
                    data : "resProviderFour"
                });

                eventBus.$unregisterListeners(this);
                this._testClassInstance.$dispose();
                this.notifyTestEnd("testAsyncLoadClassWithResProviders");
            }
        },

        _counter : 0
    }
});
