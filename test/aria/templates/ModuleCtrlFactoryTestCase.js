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
    $classpath : "test.aria.templates.ModuleCtrlFactoryTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.ModuleCtrlFactory", "aria.core.environment.Customizations"],
    $prototype : {

        /**
         * Executed after each test. It resets customizations.
         */
        tearDown : function () {
            // restore customization descriptor if modified
            if (this.oldCustomizations) {
                aria.core.environment.Customizations.setCustomizations(this.oldCustomizations);
                this.oldCustomizations = null;
            }
        },

        /**
         * Helper method which calls createModuleCtrl and has a callback with asserts.
         * @param {Object} args
         */
        _createModuleCtrl : function (args) {
            if (args.customizations) {
                if (!this.oldCustomizations) {
                    this.oldCustomizations = aria.core.environment.Customizations.getCustomizations() || {};
                }
                aria.core.environment.Customizations.setCustomizations(args.customizations);
            }
            aria.templates.ModuleCtrlFactory.createModuleCtrl(args.desc, {
                scope : this,
                fn : this._createModuleCtrlCb,
                args : args
            }, args.skipInit);
        },

        _createModuleCtrlCb : function (res, args) {
            try {
                var moduleCtrl = res.moduleCtrl;
                var moduleCtrlPrivate = res.moduleCtrlPrivate;
                var errorsInLog = args.errorsInLog;
                if (errorsInLog) {
                    for (var i = errorsInLog.length - 1; i >= 0; i--) {
                        this.assertErrorInLogs(errorsInLog[i], 1);
                    }
                } else {
                    this.assertLogsEmpty();
                }
                if (args.globalError) {
                    this.assertTrue(res.error === true, "error not reported in the callback of createModuleCtrl");
                    this.assertTrue(res.moduleCtrlPrivate == null, "moduleCtrlPrivate should not be present as there is an error");
                    this.assertTrue(res.moduleCtrl == null, "moduleCtrl should not be present as there is an error");
                    this.assertTrue(errorsInLog && errorsInLog.length > 0, "there should be an error in logs");
                } else {
                    this.assertTrue(res.error === false, "no error should be reported in the callback of createModuleCtrl");
                    this.assertTrue(moduleCtrlPrivate != null, "moduleCtrlPrivate should be present as there is an error");
                    this.assertTrue(moduleCtrl != null, "moduleCtrl should be present as there is an error");
                    this.assertTrue(moduleCtrlPrivate.$classpath == args.desc.classpath, "wrong module controller returned");
                    this.assertTrue(moduleCtrlPrivate.$publicInterface() == moduleCtrl, "moduleCtrlPrivate.$publicInterface() != moduleCtrl");
                }
                if (args.cb) {
                    this.$callback(args.cb, res);
                } else {
                    if (moduleCtrlPrivate) {
                        moduleCtrlPrivate.$dispose();
                    }
                    this.notifyTestEnd(args.testName);
                }
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        /**
         * Test the error when calling createModuleCtrl with a class which does not exist.
         */
        testAsyncModuleCtrlLoadFailure : function () {
            this._createModuleCtrl({
                desc : {
                    classpath : "does.not.exist"
                },
                errorsInLog : [aria.core.MultiLoader.LOAD_ERROR],
                globalError : true,
                testName : "testAsyncModuleCtrlLoadFailure"
            });
        },

        /**
         * Test the error when calling createModuleCtrl with a class which exists but does not extend
         * aria.templates.ModuleCtrl.
         */
        testAsyncInvalidModuleCtrl : function () {
            this._createModuleCtrl({
                desc : {
                    classpath : "test.aria.test.ClassA"
                },
                errorsInLog : [aria.templates.ModuleCtrlFactory.INVALID_MODULE_CTRL],
                globalError : true,
                testName : "testAsyncInvalidModuleCtrl"
            });
        },

        /**
         * Test that a module is loaded even if an associated custom module fails to be loaded.
         */
        testAsyncCustomModuleError : function (args) {
            this._createModuleCtrl({
                desc : {
                    classpath : "test.aria.templates.test.SampleModuleCtrl"
                },
                customizations : {
                    modules : {
                        "test.aria.templates.test.SampleModuleCtrl" : ["test.aria.test.ClassB"]
                    }
                },
                errorsInLog : [aria.templates.ModuleCtrlFactory.INVALID_MODULE_CTRL,
                        aria.templates.ModuleCtrlFactory.SM_CREATION_FAILED],
                globalError : false,
                testName : "testAsyncCustomModuleError"
            });
        },

        /**
         * Test that the associated custom module is loaded correctly (short form).
         */
        testAsyncCustomModuleSuccessful : function (args) {
            this._createModuleCtrl({
                desc : {
                    classpath : "test.aria.templates.test.SampleModuleCtrl2"
                },
                customizations : {
                    modules : {
                        "test.aria.templates.test.SampleModuleCtrl2" : ["test.aria.templates.test.SampleModuleCtrl"]
                    }
                },
                globalError : false,
                cb : {
                    fn : this._testAsyncCustomModuleSuccessfulCb,
                    args : {
                        testName : "testAsyncCustomModuleSuccessful",
                        refpath : "custom:test.aria.templates.test.SampleModuleCtrl",
                        instanceName : null
                    }
                }
            });
        },

        /**
         * Test that the associated custom module is loaded correctly (long form).
         */
        testAsyncCustomModuleWithRefpathSuccessful : function (args) {
            this._createModuleCtrl({
                desc : {
                    classpath : "test.aria.templates.test.SampleModuleCtrl2"
                },
                customizations : {
                    modules : {
                        "test.aria.templates.test.SampleModuleCtrl2" : [{
                                    classpath : "test.aria.templates.test.SampleModuleCtrl",
                                    refpath : "custom:MySampleModule",
                                    initArgs : {
                                        instanceName : "mySubModuleInstance"
                                    }
                                }]
                    }
                },
                globalError : false,
                cb : {
                    fn : this._testAsyncCustomModuleSuccessfulCb,
                    args : {
                        testName : "testAsyncCustomModuleWithRefpathSuccessful",
                        refpath : "custom:MySampleModule",
                        instanceName : "mySubModuleInstance"
                    }
                }
            });
        },

        _testAsyncCustomModuleSuccessfulCb : function (res, args) {
            try {
                var parentModule = res.moduleCtrl;
                var subModule = parentModule[args.refpath];
                var subData = parentModule.getData()[args.refpath];
                this.assertTrue(subData.instanceName == args.instanceName, "initArgs was not passed correctly");
                this.assertTrue(subModule.getData() == subData, "data in sub-module controller");
                this.assertTrue(parentModule.SampleModuleCtrl2Disposed !== true, "parent module disposed too quickly");
                this.assertTrue(subModule.SampleModuleCtrlDisposed !== true, "custom module disposed too quickly");
                res.moduleCtrlPrivate.$dispose();
                this.assertTrue(parentModule.SampleModuleCtrl2Disposed === true, "parent module not disposed correctly");
                this.assertTrue(subModule.SampleModuleCtrlDisposed === true, "custom module not disposed correctly");
                this.notifyTestEnd(args.testName);
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        /**
         * Test that a simple custom module recursion is correctly detected.
         */
        testAsyncSimpleRecursiveCustomModule : function (args) {
            this._createModuleCtrl({
                desc : {
                    classpath : "test.aria.templates.test.SampleModuleCtrl"
                },
                customizations : {
                    modules : {
                        "test.aria.templates.test.SampleModuleCtrl" : ["test.aria.templates.test.SampleModuleCtrl"]
                    }
                },
                globalError : false,
                errorsInLog : [aria.templates.ModuleCtrlFactory.CUSTOM_MODULES_INFINITE_RECURSION]
            });
        },

        /**
         * Test that a double custom module recursion is correctly detected.
         */
        testAsyncDoubleRecursiveCustomModule : function (args) {
            this._createModuleCtrl({
                desc : {
                    classpath : "test.aria.templates.test.SampleModuleCtrl"
                },
                customizations : {
                    modules : {
                        "test.aria.templates.test.SampleModuleCtrl" : ["test.aria.templates.test.SampleModuleCtrl2"],
                        "test.aria.templates.test.SampleModuleCtrl2" : ["test.aria.templates.test.SampleModuleCtrl"]
                    }
                },
                globalError : false,
                errorsInLog : [aria.templates.ModuleCtrlFactory.CUSTOM_MODULES_INFINITE_RECURSION]
            });
        },

        /**
         * Test that when two sub-modules use the same refpath, there is an error.
         */
        testAsyncErrorSubModuleRefPathAlreadyUsed : function (args) {
            this._createModuleCtrl({
                desc : {
                    classpath : "test.aria.templates.test.SampleModuleCtrl"
                },
                customizations : {
                    modules : {
                        // twice the same ref path:
                        "test.aria.templates.test.SampleModuleCtrl" : [{
                                    classpath : "test.aria.templates.test.SampleModuleCtrl2",
                                    refpath : "custom:MySampleModule",
                                    initArgs : {}
                                }, {
                                    classpath : "test.aria.templates.test.SampleModuleCtrl2",
                                    refpath : "custom:MySampleModule",
                                    initArgs : {}
                                }]
                    }
                },
                globalError : false,
                errorsInLog : [aria.templates.ModuleCtrlFactory.SUBMODULE_REFPATH_ALREADY_USED]
            });
        },

        /**
         * Test that when two sub-modules use different refpaths, there is no error.
         */
        testAsyncTwoCustomModules : function (args) {
            this._createModuleCtrl({
                desc : {
                    classpath : "test.aria.templates.test.SampleModuleCtrl"
                },
                customizations : {
                    modules : {
                        // twice the same sub-module but with different refpaths (and possibly, different init args):
                        // should produce no error
                        "test.aria.templates.test.SampleModuleCtrl" : [{
                                    classpath : "test.aria.templates.test.SampleModuleCtrl2",
                                    refpath : "custom:MySampleModuleInstance1",
                                    initArgs : {}
                                }, {
                                    classpath : "test.aria.templates.test.SampleModuleCtrl2",
                                    refpath : "custom:MySampleModuleInstance2",
                                    initArgs : {}
                                }]
                    }
                },
                globalError : false
            });
        },

        /**
         * Test that refpaths not starting with 'custom:' are not accepted.
         */
        testAsyncInvalidRefpath : function (args) {
            this._createModuleCtrl({
                desc : {
                    classpath : "test.aria.templates.test.SampleModuleCtrl"
                },
                customizations : {
                    modules : {
                        // twice the same sub-module but with different refpaths (and possibly, different init args):
                        // should produce no error
                        "test.aria.templates.test.SampleModuleCtrl" : [{
                                    classpath : "test.aria.templates.test.SampleModuleCtrl2",
                                    refpath : "wrongrefpath",
                                    initArgs : {}
                                }]
                    }
                },
                globalError : false,
                errorsInLog : [aria.templates.ModuleCtrlFactory.INVALID_CUSTOM_MODULE_REFPATH],
                cb : {
                    fn : this._testAsyncInvalidRefpathCb
                }
            });
        },

        _testAsyncInvalidRefpathCb : function (res) {
            try {
                var moduleCtrl = res.moduleCtrl;
                var data = moduleCtrl.getData();
                this.assertTrue(moduleCtrl.wrongrefpath == null, "wrong refpath was used in moduleCtrl");
                this.assertTrue(data.wrong == null, "wrong refpath was used in data");
                res.moduleCtrlPrivate.$dispose();
                this.notifyTestEnd("testAsyncInvalidRefpath");
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        }

    }
});
