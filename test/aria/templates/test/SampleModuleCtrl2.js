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
 * Another sample module controller used as child of SampleModuleCtrl
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.test.SampleModuleCtrl2",
    $extends : "aria.templates.ModuleCtrl",
    $dependencies : ["test.aria.templates.test.SampleModuleSubClass"],
    $implements : ["test.aria.templates.test.ISampleModuleCtrl2"],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);

        this.subcontroller = new test.aria.templates.test.SampleModuleSubClass("name=subcontroller");

        // sample data model
        this._data = {
            count2 : 0
            // incremented when the incrementCount method is called
        };
    },
    $destructor : function () {
        if (this.subcontroller) {
            this.subcontroller.$dispose();
            this.subcontroller = null;
        }
        this.$publicInterface().SampleModuleCtrl2Disposed = true;
        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {
        $publicInterfaceName : "test.aria.templates.test.ISampleModuleCtrl2",

        /**
         * Sample init method that loads sm
         * @param {Object} args init arguments (contains a cb entry for the callback)
         */
        init : function (args, cb) {
            if (args && (args.test1 || args.test2)) {
                if (args.test1) {
                    // initCfg.test1: sub modules can be loaded in different orders
                    // depending on args or data model state
                    this.loadSubModules([{
                                refpath : "sm1",
                                classpath : 'test.aria.templates.test.SampleModuleCtrl',
                                initArgs : {
                                    instanceName : "sm1"
                                }
                            }], {
                        fn : this._init2,
                        args : cb
                    });
                } else {
                    // args.test2==true
                    // we load a private sub-module
                    this.loadSubModules([{
                                refpath : "_psm",
                                classpath : 'test.aria.templates.test.SampleModuleCtrl',
                                initArgs : {
                                    instanceName : "_psm"
                                }
                            }], {
                        fn : this._init2,
                        args : cb
                    });
                }
            } else {
                this.$callback(cb, null, this.INIT_CALLBACK_ERROR);
            }
        },

        /**
         * Init finalization method - called when sub module dependencies are loaded
         * @param {Object} res loadSubModules result
         * @param {aria.core.JsObject.Callback} cb init callback (args of loadSubModules callback)
         */
        _init2 : function (res, cb) {
            this.$callback(cb);
            // note: no event is raised on init - even if the data model is updated
        },

        /**
         * Sample method published in the Module Public Interface (MPI) As any MPI it accepts a single JSON argument to
         * ease backward-compatibility
         */
        incrementCount2 : function (args, cb) {
            if (args && args.by) {
                this._data.count2 += args.by;
            } else {
                this._data.count2++;
            }

            if (this._data.count2 > 3 && !this.pkg1) {
                this.loadSubModules([{
                            refpath : "pkg1.sm2",
                            arrayIndex : 0,
                            classpath : 'test.aria.templates.test.SampleModuleCtrl',
                            initArgs : {
                                instanceName : "pkg1.sm2[0]"
                            }
                        }, {
                            refpath : "pkg1.sm2",
                            arrayIndex : 2,
                            classpath : 'test.aria.templates.test.SampleModuleCtrl',
                            initArgs : {
                                instanceName : "pkg1.sm2[2]"
                            }
                        }], cb);
            } else {
                this.$callback(cb);
            }
        }

    }
});
