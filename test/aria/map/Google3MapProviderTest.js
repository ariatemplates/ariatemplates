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
    $classpath : "test.aria.map.Google3MapProviderTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.map.providers.Google3MapProvider"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.provider = aria.map.providers.Google3MapProvider;
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
                initArgs : {
                    lat : 43,
                    lng : 6
                }
            };

            this.assertTrue(this.provider.getMap(cfg) == null);

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
                initArgs : {
                    lat : 43,
                    lng : 6
                }
            };

            var map = this.provider.getMap(cfg);
            this.assertTrue(map !== null);
            this.provider.disposeMap(map);

            this.assertTrue(this._testDomElement.parentNode == null, "The dom element containing the map shouldn't have a parent");

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

            this._testUrlBuilder();

        },

        _testUrlBuilder : function () {
            var url;

            url = this.provider._getFullUrl();
            this.assertEquals(url, "http://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=__googleMapLoaded", "The url is not the expected one (case 1)");

            this.provider.credentials = "AAA";
            url = this.provider._getFullUrl();
            this.assertEquals(url, "http://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=__googleMapLoaded&key=AAA", "The url is not the expected one (case 2)");

            this.provider.credentials = "gme-AAA";
            url = this.provider._getFullUrl();
            this.assertEquals(url, "http://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=__googleMapLoaded&client=gme-AAA", "The url is not the expected one (case 2)");

            this.notifyTestEnd("testAsyncAllMethods");
        }

    }
});
