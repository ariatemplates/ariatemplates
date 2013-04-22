/**
 * Test a simple binding with two modules
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.siteRootModule.ModelBindingTestTwo",
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
                                "second" : "appData:second"
                            }
                        }],
                common : [{
                            refpath : "m1",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule2",
                            bind : {
                                "first.data" : "appData:baseFacts.first",
                                "second" : "appData:second"
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

            // check m1
            var expectedModuleData = {
                first : undefined,
                second : false,
                newValue : false
            };
            var realModuleData = this._getModuleData("m1", false);
            this.assertJsonEquals(expectedModuleData, realModuleData);

            // check common:m1
            expectedModuleData = {
                first : {
                    data : undefined
                },
                second : false
            };
            realModuleData = this._getModuleData("common:m1", false);
            this.assertJsonEquals(expectedModuleData, realModuleData);

            this._checkBindings();
        },

        _checkBindings : function () {
            // change a bound value
            this.$json.setValue(this._getModuleData("m1", true), "first", "new");
            this.assertEquals(this.rm.getData().storage.appData.baseFacts.first, "new", "baseFacts.first not updated");
            this.assertEquals(this._getModuleData("common:m1", false).first.data, "new");

            // change a value directly in the app data
            this.$json.setValue(this.rm.getData().storage.appData, "second", true);
            this.assertEquals(this._getModuleData("m1", false).second, true, "second not updated in m1");
            this.assertEquals(this._getModuleData("common:m1", false).second, true, "second not updated in common:m1");

            this.completeTest();
        }
    }
});
