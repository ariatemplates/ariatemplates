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
    $classpath : "test.aria.pageEngine.siteRootModule.ModelBindingTest",
    $extends : "test.aria.pageEngine.siteRootModule.SiteRootModuleBaseTestCase",
    $dependencies : ["aria.utils.Json", "test.aria.pageEngine.testContents.modules.BoundModule1",
            "test.aria.pageEngine.testContents.modules.BoundModule2",
            "test.aria.pageEngine.testContents.modules.BoundModule3"],
    $constructor : function () {
        this.$SiteRootModuleBaseTestCase.constructor.call(this);
        this.$json = aria.utils.Json;
    },
    $prototype : {
        testAsyncMultipleBinding : function () {
            this._createSiteModule({
                appData : {
                    second : false,
                    baseFacts : {
                        one : 1,
                        two : 2
                    },
                    anArray : ["0"]
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
                                "second" : "appData:second",
                                "third" : "appData:some.other.location.third",
                                "fourth" : "pageData:somewhere.over.the.rainbow"
                            }
                        }, {
                            refpath : "m2",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule2",
                            bind : {
                                "some.deep.object.value" : "appData:baseFacts.first",
                                "second" : "appData:another.second"
                            }
                        }, {
                            refpath : "m3.m4",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule3",
                            bind : {
                                "one" : "appData:some.other.location.third",
                                "two" : "appData:second",
                                "three" : "second",
                                "four" : "invalidContainer:second"

                            }
                        }],
                common : [{
                            refpath : "m3.m4",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule3",
                            bind : {
                                "one" : "appData:some.other.location.third",
                                "two" : "appData:second",
                                "three" : "second",
                                "four" : "invalidContainer:second"
                            }
                        }, {
                            refpath : "m3.m5",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule3",
                            bind : {
                                "baseFacts" : "appData:baseFacts",
                                "some.data" : "appData:anArray",
                                "some.otherData" : "appData:second"

                            }
                        }]
            };

            this.rm.loadModules("page1", moduleConf, {
                fn : this._assertDataStructure,
                scope : this
            });
        },

        _assertDataStructure : function () {
            var expectedAppData = {
                baseFacts : {
                    first : null,
                    one : 1,
                    two : 2
                },
                anArray : ["0"],
                second : false,
                some : {
                    other : {
                        location : {
                            third : null
                        }
                    }
                },
                another : {
                    second : null
                }
            };
            var realAppData = this.$json.removeMetadata(this.rm.getData().storage.appData);
            this.assertJsonEquals(expectedAppData, realAppData);

            var expectedPageData = {
                somewhere : {
                    over : {
                        the : {
                            rainbow : null
                        }
                    }
                }
            };
            var realPageData = this.$json.removeMetadata(this.rm.getData().storage.pageData);
            this.assertJsonEquals(expectedPageData, realPageData);

            var expectedModuleData = {
                first : null,
                second : false,
                third : null,
                fourth : null,
                newValue : false
            };
            var realModuleData = this._getModuleData("m1", false);
            this.assertJsonEquals(expectedModuleData, realModuleData);

            expectedModuleData = {
                second : null,
                some : {
                    deep : {
                        object : {
                            value : null
                        }
                    }
                }
            };
            realModuleData = this._getModuleData("m2", false);
            this.assertJsonEquals(expectedModuleData, realModuleData);

            expectedModuleData = {
                one : null,
                two : false
            };
            this.assertJsonEquals(expectedModuleData, this._getModuleData("m3.m4", false));
            this.assertJsonEquals(expectedModuleData, this._getModuleData("common:m3.m4", false));

            // test objects initialization
            expectedModuleData = {
                baseFacts : {
                    first : null,
                    one : 1,
                    two : 2
                },
                some : {
                    data : ["0"],
                    otherData : false
                }
            };
            this.assertJsonEquals(expectedModuleData, this._getModuleData("common:m3.m5", false));

            this._checkBindings();
        },

        _checkBindings : function () {
            // change a bound value
            this.$json.setValue(this._getModuleData("m1", true), "first", "new");
            this.assertEquals(this.rm.getData().storage.appData.baseFacts.first, "new", "baseFacts.first not updated");
            this.assertEquals(this._getModuleData("m2", false).some.deep.object.value, "new", "baseFacts.first not updated in m2");
            this.assertEquals(this._getModuleData("common:m3.m5", false).baseFacts.first, "new");

            // change a value directly in the app data
            this.$json.setValue(this.rm.getData().storage.appData, "second", true);
            this.assertEquals(this._getModuleData("m1", true).second, true, "second not updated in m1");
            this.assertEquals(this._getModuleData("m3.m4", true).two, true, "second not updated in m3.m4");
            this.assertEquals(this._getModuleData("common:m3.m4", true).two, true, "second not updated in commno:m3.m4");

            // change a value in a module and check synchronization
            this.$json.setValue(this._getModuleData("common:m3.m4", true), "two", false);
            this.assertEquals(this._getModuleData("m1", true).second, false);
            this.assertEquals(this._getModuleData("m3.m4", true).two, false);
            this.assertEquals(this.rm.getData().storage.appData.second, false);

            // check that a

            this.completeTest();
        },

        _getModuleData : function (moduleId, keepMetadata) {
            var output = this.rm.getPageModule("page1", moduleId).getData();
            return keepMetadata ? output : this.$json.removeMetadata(output);
        },

        completeTest : function () {
            this.rm.$dispose();
            this.notifyTestEnd("testAsyncMultipleBinding");
        }
    }
});
