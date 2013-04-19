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
 * Test a simple binding with two modules and complex data
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.siteRootModule.ModelBindingTestThree",
    $extends : "test.aria.pageEngine.siteRootModule.SiteRootModuleBaseTestCase",
    $prototype : {
        testAsyncMultipleBinding : function () {
            this._createSiteModule({
                appData : {
                    baseFacts : {
                        one : 1,
                        two : 2
                    },
                    testArray : ["0", "1"]
                },
                cb : {
                    fn : this._loadSubmodules,
                    scope : this
                }
            });

        },

        _loadSubmodules : function (res) {
            var moduleConf = {
                page : [{
                            refpath : "m1",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule1",
                            initArgs : {
                                first : false
                            },
                            bind : {
                                "first" : "appData:baseFacts.first",
                                "third" : "appData:testArray"
                            }
                        }],
                common : [{
                            refpath : "m1",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule2",
                            bind : {
                                "first" : "appData:baseFacts",
                                "third" : "appData:testArray[1]"
                            }
                        }]
            };

            this.rm.loadModules(this.pageId, moduleConf, {
                fn : this._assertDataStructure,
                scope : this
            });
        },

        _assertDataStructure : function () {
            var expectedStorage = {
                appData : {
                    baseFacts : {
                        one : 1,
                        two : 2
                    },
                    testArray : ["0", "1"]
                },
                pageData : {}
            };
            var realStorage = this.$json.removeMetadata(this.rm.getData().storage);
            this.assertJsonEquals(realStorage, expectedStorage);

            // check m1
            var expectedModuleData = {
                first : undefined,
                newValue : false,
                third : ["0", "1"]
            };
            var realModuleData = this._getModuleData("m1", false);
            this.assertJsonEquals(expectedModuleData, realModuleData);

            // check common:m1
            expectedModuleData = {
                first : {
                    one : 1,
                    two : 2
                },
                third : "1"
            };
            realModuleData = this._getModuleData("common:m1", false);
            this.assertJsonEquals(expectedModuleData, realModuleData);

            this._checkSimpleBindings();
        },

        _checkSimpleBindings : function () {
            // change a bound value
            this.$json.setValue(this._getModuleData("m1", true), "first", "new");
            this.assertEquals(this.rm.getData().storage.appData.baseFacts.first, "new", "baseFacts.first not updated");
            this.assertEquals(this._getModuleData("common:m1", false).first.first, "new");
            this._checkAppDataChange();
        },
        _checkAppDataChange : function () {
            // change a value directly in the app data
            this.$json.setValue(this.rm.getData().storage.appData, "baseFacts", "notAnObject");
            var expectedModuleData = {
                first : undefined,
                newValue : false,
                third : ["0", "1"]
            };
            var realModuleData = this._getModuleData("m1", false);
            this.assertJsonEquals(expectedModuleData, realModuleData);

            expectedModuleData = {
                first : "notAnObject",
                third : "1"
            };
            realModuleData = this._getModuleData("common:m1", false);
            this.assertJsonEquals(expectedModuleData, realModuleData);
            this._checkObjectChange();
        },

        _checkObjectChange : function () {
            var baseFacts = {
                first : "1",
                second : "2",
                third : "3"
            };
            this.$json.setValue(this._getModuleData("common:m1", true), "first", baseFacts);
            this.assertJsonEquals(this.$json.removeMetadata(this.rm.getData()).storage.appData.baseFacts, baseFacts);
            this.assertEquals(this._getModuleData("m1", false).first, "1");
            this._checkArrayChange();
        },

        _checkArrayChange : function () {
            this.$json.setValue(this._getModuleData("common:m1", true), "third", "2");
            this.assertJsonEquals(this.$json.removeMetadata(this.rm.getData()).storage.appData.testArray, ["0", "2"]);
            this.assertEquals(this._getModuleData("m1", false).third[1], "2");

            this.$json.setValue(this._getModuleData("m1", true), "third", ["0"]);
            this.assertJsonEquals(this.$json.removeMetadata(this.rm.getData()).storage.appData.testArray, ["0"]);
            this.assertEquals(this._getModuleData("common:m1", false).third, undefined);

            this.completeTest();
        }
    }
});
