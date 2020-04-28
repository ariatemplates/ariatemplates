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
 * Test the creation of a microsoft7 map
 */
Aria.classDefinition({
    $classpath : "test.aria.map.MapManagerTwoTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.map.MapManager"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.mapMgr = aria.map.MapManager;
        this.mapMgr.addProvider("anotherAnotherProvider", "test.aria.map.AnotherAnotherFakeMapProvider");

        this.defaultTestTimeout = 50000;
    },
    $prototype : {

        setUp : function() {
            var document = Aria.$window.document;
            this._testDomElement = document.createElement("DIV");
            document.body.appendChild(this._testDomElement);
        },

        tearDown : function() {
            var document = Aria.$window.document;
            if (this._testDomElement.parentNode) {
                document.body.removeChild(this._testDomElement);
            }
            this._testDomElement = null;
        },

        testAsyncValidCreateMap : function () {
             var validCfg = {
                id : "ms7MapId",
                provider : "microsoft7",
                domElement : this._testDomElement,
                afterCreate : {
                    fn : this._timeout,
                    scope : this,
                    args : {
                        testArgs : "test"
                    }
                }
            };

            this.assertTrue(this.mapMgr.getMapStatus("ms7MapId") === null);
            this.mapMgr.createMap(validCfg);
            if (!aria.map.providers || !aria.map.providers.Microsoft7MapProvider ||
                    !aria.map.providers.Microsoft7MapProvider.isLoaded()) {
                this.assertTrue(this.mapMgr.getMapStatus("ms7MapId") == this.mapMgr.LOADING);
            }

        },

        _timeout : function(map, args) {
            var that = this;
            setTimeout(function() {
                that._createCallbackOne(map, args);
            }, 1000);
        },

        _createCallbackOne : function (map, args) {
            this.assertTrue(map !== null, "The map was not created.");
            this.assertTrue(args.testArgs === "test");
            this.assertTrue(this.mapMgr.getMapStatus("ms7MapId") == this.mapMgr.READY);

            this.assertTrue(this.mapMgr.getMap("ms7MapId") == map);

            this._testGetMapDom();
        },

        _testGetMapDom : function () {

            var mapDomWrapper = this.mapMgr.getMapDom("ms7MapId");
            this.assertTrue(!!(mapDomWrapper.$DomElementWrapper));
            this.assertTrue(this.mapMgr.getMapDom("fakeId") == null);

            this._testDestroyMap();

        },

        _testDestroyMap : function () {
            this.mapMgr.destroyMap("ms7MapId");
            this.assertTrue(this.mapMgr.getMap("ms7MapId") === null);
            this.assertTrue(this.mapMgr.getMapStatus("ms7MapId") === null);
            this.assertTrue(this.mapMgr.getMapDom("ms7MapId") == null);
            this.mapMgr.destroyMap("ms7MapId");

            this.tearDown();
            this.setUp();

            var validCfg = {
                id : "anotherMs7MapId",
                provider : "microsoft7",
                domElement : this._testDomElement
            };

            // this time it should be synchronous
            this.mapMgr.createMap(validCfg);
            this.assertTrue(this.mapMgr.getMap("anotherMs7MapId") !== null);
            var that = this;
            setTimeout(function() {
                that.mapMgr.destroyMap("anotherMs7MapId");
                that.assertTrue(that.mapMgr.getMap("anotherMs7MapId") === null);

                that.notifyTestEnd("testAsyncValidCreateMap");
            }, 1000);
        }
    }
});
