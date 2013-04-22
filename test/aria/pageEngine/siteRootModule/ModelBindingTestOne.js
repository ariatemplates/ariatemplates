/**
 * Test a simple binding with one module
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.siteRootModule.ModelBindingTestOne",
    $extends : "test.aria.pageEngine.siteRootModule.SiteRootModuleBaseTestCase",
    $prototype : {
        testAsyncMultipleBinding : function () {
            this._createSiteModule({
                appData : {
                    second : false,
                    baseFacts : {
                        one : 1,
                        two : 2
                    }
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
                                "third" : "appData:some.other.location",
                                "fourth" : "pageData:somewhere.over.the.rainbow",
                                "fifth" : "nothing",
                                "sixth" : "invalid:nothing"
                            }
                        }],
                common : []
            };

            this.rm.loadModules(this.pageId, moduleConf, {
                fn : this._assertDataStructure,
                scope : this
            });
        },

        _assertDataStructure : function () {
            var expectedStorage = {
                appData : {
                    second : false,
                    baseFacts : {
                        one : 1,
                        two : 2
                    }
                },
                pageData : {}
            };
            var realStorage = this.$json.removeMetadata(this.rm.getData().storage);
            this.assertJsonEquals(realStorage, expectedStorage);

            var expectedModuleData = {
                first : undefined,
                second : false,
                third : undefined,
                fourth : undefined,
                newValue : false
            };
            var realModuleData = this._getModuleData("m1", false);
            this.assertJsonEquals(expectedModuleData, realModuleData);

            this._checkBindings();
        },

        _checkBindings : function () {
            // change a bound value
            this.$json.setValue(this._getModuleData("m1", true), "first", "new");
            var expectedStorage = {
                appData : {
                    second : false,
                    baseFacts : {
                        one : 1,
                        two : 2,
                        first : "new"
                    }
                },
                pageData : {}
            };
            var realStorage = this.$json.removeMetadata(this.rm.getData().storage);
            this.assertJsonEquals(realStorage, expectedStorage);

            // change another bound value
            this.$json.setValue(this._getModuleData("m1", true), "third", "third");
            expectedStorage = {
                appData : {
                    second : false,
                    baseFacts : {
                        one : 1,
                        two : 2,
                        first : "new"
                    },
                    some : {
                        other : {
                            location : "third"
                        }
                    }
                },
                pageData : {}
            };
            realStorage = this.$json.removeMetadata(this.rm.getData().storage);
            this.assertJsonEquals(realStorage, expectedStorage);

            // change a value directly in the app data
            this.$json.setValue(this.rm.getData().storage.appData, "second", true);
            this.assertEquals(this._getModuleData("m1", true).second, true, "second not updated in m1");

            this.completeTest();
        }
    }
});
