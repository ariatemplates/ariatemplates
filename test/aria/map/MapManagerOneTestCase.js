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
 * This test focuses on errors logged by the MapManager class and on standard behaviour of methods requesting map
 * information on a map that is not available
 */
Aria.classDefinition({
    $classpath : "test.aria.map.MapManagerTestOne",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.map.MapManager", "aria.core.JsonValidator"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.mapMgr = aria.map.MapManager;
        this.defaultTestTimeout = 5000;
        this.mapMgr.addProvider("testProvider", "test.aria.map.FakeMapProvider");
    },
    $destructor : function () {
        this.$TestCase.$destructor.call(this);
        this.mapMgr.removeProvider("testProvider");
    },
    $prototype : {

        testInvalidCreateMapCfg : function () {
            var invalidCfg = {
                ind : "wrongId"
            };

            this.mapMgr.createMap(invalidCfg);
            this.assertErrorInLogs(aria.core.JsonValidator.INVALID_CONFIGURATION);
        },

        testAsyncInexistentProvider : function () {
            var domElement = Aria.$window.document.createElement("DIV");
            var invalidCfg = {
                id : "myMapId",
                provider : "doesNotExist",
                domElement : domElement,
                afterCreate : {
                    fn : this._testAsyncInexistentProviderCb,
                    scope : this
                }
            };

            this.mapMgr.createMap(invalidCfg);
            domElement = null;
        },

        _testAsyncInexistentProviderCb : function () {
            this.assertErrorInLogs(aria.core.MultiLoader.LOAD_ERROR);
            this.assertErrorInLogs(this.mapMgr.INEXISTENT_PROVIDER);
            this.notifyTestEnd("testAsyncInexistentProvider");
        },

        testAsyncInvalidProvider : function () {
            var domElement = Aria.$window.document.createElement("DIV");
            var invalidCfg = {
                id : "myMapId",
                provider : "test.aria.map.InvalidMapProvider",
                domElement : domElement,
                afterCreate : {
                    fn : this._testAsyncInvalidProviderCb,
                    scope : this
                }
            };

            this.mapMgr.createMap(invalidCfg);
            domElement = null;
        },

        _testAsyncInvalidProviderCb : function () {
            this.assertErrorInLogs(this.mapMgr.INVALID_PROVIDER);
            this.notifyTestEnd("testAsyncInvalidProvider");
        },

        testHasProvider : function () {
            this.assertTrue(this.mapMgr.hasProvider("microsoft7"));
            this.assertTrue(this.mapMgr.hasProvider("testProvider"));
            this.assertFalse(this.mapMgr.hasProvider("inexistentProvider"));

        },

        testAsyncDuplicateMapId : function () {
            var document = Aria.$window.document;
            this._testDomElement = document.createElement("DIV");
            var validCfg = {
                id : "fakeMap",
                provider : "testProvider",
                domElement : this._testDomElement,
                afterCreate : {
                    fn : this._createCallbackOne,
                    scope : this,
                    args : {
                        testArgs : "test"
                    }
                }
            };

            this.mapMgr.createMap(validCfg);

            this.mapMgr.createMap(validCfg);
            // Error while the map is loading
            this.assertErrorInLogs(this.mapMgr.DUPLICATED_MAP_ID);

        },

        _createCallbackOne : function (map, args) {
            var validCfg = {
                id : "fakeMap",
                provider : "testProvider",
                domElement : this._testDomElement,
                afterCreate : {
                    fn : this._createCallbackOne,
                    scope : this,
                    args : {
                        testArgs : "test"
                    }
                }
            };

            this.mapMgr.createMap(validCfg);
            // Error when the map is ready
            this.assertErrorInLogs(this.mapMgr.DUPLICATED_MAP_ID);

            this.mapMgr.destroyMap("fakeMap");
            this._testDomElement = null;
            this.notifyTestEnd("testAsyncDuplicateMapId");
        },

        testMethodsOnInexistentMap : function () {
            this.assertTrue(this.mapMgr.getMap("fakeId") === null);
            this.mapMgr.destroyMap("fakeId");
            this.assertTrue(this.mapMgr.getMapStatus("fakeId") === null);
            this.assertTrue(this.mapMgr.getMapDom("fakeId") == null);
        },

        testAddInvalidProviderAsObject : function () {
            this.mapMgr.addProvider("anotherProvider", {
                load : function () {}
            });
            this.assertErrorInLogs(this.mapMgr.INVALID_PROVIDER);

        }

    }
});
