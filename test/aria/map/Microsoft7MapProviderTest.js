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
 * Test for the Microsoft 7 map provider
 */
Aria.classDefinition({
    $classpath : "test.aria.map.Microsoft7MapProviderTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.map.providers.Microsoft7MapProvider"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.provider = aria.map.providers.Microsoft7MapProvider;
        this.defaultTestTimeout = 15000;
        this._syncFlag = false;
    },
    $prototype : {

        testAsyncAllMethods : function () {
            this.assertFalse(this.provider.isLoaded());
            var document = Aria.$window.document;
            this._testDomElement = document.createElement("DIV");
            var cfg = {
                domElement : this._testDomElement,
                initArgs : {}
            };

            this.assertTrue(this.provider.getMap(cfg) === null);

            this.provider.load({
                fn : this._testAsyncAllMethodsCbOne,
                scope : this,
                args : {
                    testArgs : "test"
                }
            });
        },

        _testAsyncAllMethodsCbOne : function (_, args) {
            this.assertTrue(this.provider.isLoaded());
            this.assertTrue(args.testArgs == "test");
            var cfg = {
                domElement : this._testDomElement,
                initArgs : {}
            };

            var map = this.provider.getMap(cfg);
            this.assertTrue(map !== null);
            this.provider.disposeMap(map);

            this._testDomElement = null;
            this.provider.load({
                fn : this._testAsyncAllMethodsCbTwo,
                scope : this,
                args : {
                    testArgs : "test"
                }
            });

            this._syncFlag = true;
        },

        _testAsyncAllMethodsCbTwo : function (_, args) {
            this.assertTrue(args.testArgs == "test");
            this.assertFalse(this._syncFlag);
            this.notifyTestEnd("testAsyncAllMethods");

        }

    }
});
