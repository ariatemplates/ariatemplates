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
 * Test the methods related to the creation of a custom provider and to the creation of maps with different providers
 */
Aria.classDefinition({
    $classpath : "test.aria.map.MapManagerTestThree",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.map.MapManager"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.mapMgr = aria.map.MapManager;
        this.defaultTestTimeout = 50000;
        this.mapMgr.$addListeners({
            "mapReady" : {
                fn : this._mapReadyHandler,
                scope : this
            }
        });
        this.maps = [];
    },
    $destructor : function () {
        this.mapMgr.$removeListeners({
            "mapReady" : {
                fn : this._mapReadyHandler,
                scope : this
            }
        });
        this.maps = null;
        this.mapMgr = null;
        this.$TestCase.$destructor.call(this);
    },
    $prototype : {

        testAsyncHasProvider : function () {
            this.mapMgr.addProvider("testProvider", "test.aria.map.FakeMapProvider");
            this.mapMgr.addProvider("anotherTestProvider", "test.aria.map.AnotherFakeMapProvider");
            this.assertTrue(this.mapMgr.hasProvider("microsoft7"));
            this.assertTrue(this.mapMgr.hasProvider("testProvider"));
            this.assertTrue(this.mapMgr.hasProvider("anotherTestProvider"));
            this.assertFalse(this.mapMgr.hasProvider("inexistentProvider"));

            this._testDuplicatedProvider();
        },

        _testDuplicatedProvider : function () {
            this.mapMgr.addProvider("testProvider", "another.Class");
            this.assertErrorInLogs(this.mapMgr.DUPLICATED_PROVIDER);
            this._testAsyncMultipleMapCreation();
        },

        _testAsyncMultipleMapCreation : function () {
            this.mapCount = 60;
            this.provider = "testProvider";
            this._createMap({
                id : 1,
                cb : {
                    fn : this._testAsyncMultipleMapCreationCb,
                    scope : this
                }
            });
        },
        _testAsyncMultipleMapCreationCb : function () {
            this._testEventHandlerCalls();

            this._testDestroyProviderMaps();
            this.notifyTestEnd("testAsyncHasProvider");
        },

        _testEventHandlerCalls : function () {
            for (var i = 1; i <= this.mapCount; i++) {
                this.assertTrue(this.maps[i - 1] == "fakeMap" + i);
            }

        },

        _testDestroyProviderMaps : function () {
            this.mapMgr.destroyAllMaps("microsoft7");
            var maps = this.maps;
            for (var i = 1; i <= this.mapCount; i++) {
                if (i <= 2 * this.mapCount / 3) {
                    this._testExistentMap(maps[i - 1]);
                } else {
                    this._testInexistentMap(maps[i - 1]);
                }
            }
            this.assertTrue(this.mapMgr.hasProvider("microsoft7"));
            this.mapMgr.removeProvider("anotherTestProvider");
            for (i = 1; i <= this.mapCount; i++) {
                if (i <= this.mapCount / 3) {
                    this._testExistentMap(maps[i - 1]);
                } else {
                    this._testInexistentMap(maps[i - 1]);
                }
            }
            this.assertFalse(this.mapMgr.hasProvider("anotherTestProvider"));
            this.mapMgr.destroyAllMaps();
            for (i = 1; i <= this.mapCount; i++) {
                this._testInexistentMap(maps[i - 1]);
            }

        },

        _createMap : function (args) {
            var id = args.id;
            var document = Aria.$window.document;
            this["_testDomElement" + id] = document.createElement("DIV");
            var validCfg = {
                id : "fakeMap" + id,
                provider : this.provider,
                domElement : this["_testDomElement" + id],
                afterCreate : {
                    fn : this._createCallback,
                    scope : this,
                    args : args
                }
            };

            this.assertTrue(this.mapMgr.getMapStatus("fakeMap" + id) === null);
            this.mapMgr.createMap(validCfg);
            this.assertTrue(this.mapMgr.getMapStatus("fakeMap" + id) == this.mapMgr.LOADING ||
                    this.mapMgr.getMapStatus("fakeMap" + id) == this.mapMgr.READY);

        },

        _createCallback : function (map, args) {
            this.assertTrue(this.mapMgr.getMapStatus("fakeMap" + args.id) == this.mapMgr.READY);
            this.assertTrue(this.mapMgr.getMap("fakeMap" + args.id) == map);
            if (args.id >= this.mapCount / 3) {
                this.provider = "anotherTestProvider";
                if (args.id >= 2 * this.mapCount / 3) {
                    this.provider = "microsoft7";
                }
            }
            if (args.id < this.mapCount) {
                aria.core.Timer.addCallback({
                    fn : this._createMap,
                    scope : this,
                    args : {
                        id : args.id + 1,
                        cb : args.cb
                    },
                    delay : 50
                });
            } else {
                args.cb.delay = 100;
                aria.core.Timer.addCallback(args.cb);
            }
        },

        _mapReadyHandler : function (evt) {
            this.maps.push(evt.mapId);
        },

        _testInexistentMap : function (id) {
            this.assertTrue(this.mapMgr.getMap(id) === null);
            this.assertTrue(this.mapMgr.getMapStatus(id) === null);
            this.assertTrue(this.mapMgr.getMapDom(id) == null);
            this.mapMgr.destroyMap(id);
        },

        _testExistentMap : function (id) {
            this.assertTrue(this.mapMgr.getMap(id) !== null);
            this.assertTrue(this.mapMgr.getMapStatus(id) !== null);
            this.assertTrue(this.mapMgr.getMapDom(id) != null);
        }

    }
});