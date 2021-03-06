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
    $classpath : "test.aria.map.MapManagerTwoBisTestCase",
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

        testAsyncValidCreateMapTwo : function () {
            var that = this;
            this.mapMgr.addProvider("anotherProvider", {
                load : function (cb) {
                    that.$callback(cb);
                },
                getMap : function () {
                    return {
                        mapText : "message"
                    };
                },
                disposeMap : function () {}
            });
            var validCfg = {
                id : "anotherMap",
                provider : "anotherProvider",
                domElement : this._testDomElement,
                afterCreate : {
                    fn : this._timeout2,
                    scope : this,
                    args : {
                        testArgs : "test"
                    }
                }
            };

            this.mapMgr.createMap(validCfg);

        },

        _timeout2 : function(map, args) {
            var that = this;
            setTimeout(function() {
                that._createCallbackOneTwo(map, args);
            }, 250);
        },

        _createCallbackOneTwo : function (map, args) {
            this.assertTrue(map !== null, "The map was not created.");
            this.assertTrue(args.testArgs === "test");
            this.assertTrue(this.mapMgr.getMapStatus("anotherMap") == this.mapMgr.READY);

            this.assertTrue(this.mapMgr.getMap("anotherMap") == map);
            this.assertTrue(map.mapText == "message");
            this._testDestroyMapTwo();
        },

        _testDestroyMapTwo : function () {
            this.mapMgr.destroyMap("anotherMap");
            this.assertTrue(this.mapMgr.getMap("anotherMap") === null);
            this.assertTrue(this.mapMgr.getMapStatus("anotherMap") === null);
            this.assertTrue(this.mapMgr.getMapDom("anotherMap") == null);
            this.mapMgr.destroyMap("anotherMap");

            this.assertTrue(this.mapMgr.hasProvider("anotherProvider"));
            this.mapMgr.removeProvider("anotherProvider");
            this.assertFalse(this.mapMgr.hasProvider("anotherProvider"));

            this.notifyTestEnd("testAsyncValidCreateMapTwo");
        },
        testAsyncValidCreateMapThree : function () {
            var that = this;

            var validCfg = {
                id : "anotherAnotherMap",
                provider : "anotherAnotherProvider",
                domElement : this._testDomElement,
                afterCreate : {
                    fn : this._timeout3,
                    scope : this,
                    args : {
                        testArgs : "test"
                    }
                }
            };

            this.mapMgr.createMap(validCfg);

        },

        _timeout3 : function(map, args) {
            var that = this;
            setTimeout(function() {
                that._createCallbackOneThree(map, args);
            }, 250);
        },

        _createCallbackOneThree : function (map, args) {
            this.assertTrue(map !== null, "The map was not created.");
            this.assertTrue(args.testArgs === "test");
            this.assertTrue(this.mapMgr.getMapStatus("anotherAnotherMap") == this.mapMgr.READY);

            this.assertTrue(this.mapMgr.getMap("anotherAnotherMap") == map);

            this.notifyTestEnd("testAsyncValidCreateMapThree");
        }

    }
});
