/*
 * Copyright 2013 Amadeus s.a.s.
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
    $classpath : "test.aria.templates.customization.CustomTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.core.environment.Customizations"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        // the customization descriptor below substitutes TemplateA for TemplateB
        aria.core.AppEnvironment.setEnvironment({
            customization : {
                // use resolveURL so that the test can be run from anywhere
                descriptor : aria.core.DownloadMgr.resolveURL("test/aria/templates/customization/descriptorAB.json")
            }
        });

        // we declare we'll load TemplateA, but the customization environment will actually load Template B
        this.setTestEnv({
            template : "test.aria.templates.customization.CustomTemplateA"
        });

        // some methods are called twice during the test, flag the last call and let the test to finish
        this._lastTest = false;
    },
    $prototype : {
        _getTemplateCtxt : function (classPath) {
            // we use the TemplateContextManager because this.templateCtxt is not reliable
            var tcm = aria.templates.TemplateCtxtManager;
            var tcs = tcm.getRootCtxts();
            for (var i = 0; i < tcs.length; i++) {
                if (tcs[i].tplClasspath == classPath) {
                    return tcs[i];
                }
            }
        },

        runTemplateTest : function () {
            // check the customization has worked
            this.assertTrue(this.templateCtxt.tplClasspath == "test.aria.templates.customization.CustomTemplateB");
            // the original template we intended to load was template A!
            this.assertTrue(this.templateCtxt._cfg.origClasspath == "test.aria.templates.customization.CustomTemplateA");

            // now let's customize again and substitute TemplateA for TemplateC
            aria.core.AppEnvironment.setEnvironment({
                customization : {
                    // use resolveURL so that the test can be run from anywhere
                    descriptor : aria.core.DownloadMgr.resolveURL("test/aria/templates/customization/descriptorAC.json")
                }
            });

            // we use the TemplateContextManager because $reload is not in the Template's public interface
            var tc = this._getTemplateCtxt("test.aria.templates.customization.CustomTemplateB");

            // tc is always defined here
            // reload the context
            tc.$reload(null, {
                fn : this._stepTwo,
                scope : this
            });
        },

        _stepTwo : function () {

            // this.templateCtxt reference is broken by the reload
            this.templateCtxt = aria.templates.TemplateCtxtManager.getFromDom(this.testDiv);

            // check the customization has worked
            this.assertTrue(this.templateCtxt.tplClasspath == "test.aria.templates.customization.CustomTemplateC");

            // the original template we intended to load was still template A!
            var contextC = this._getTemplateCtxt("test.aria.templates.customization.CustomTemplateC");
            this.assertTrue(contextC._cfg.origClasspath == "test.aria.templates.customization.CustomTemplateA");

            // now let's customize again trying a different path
            aria.core.environment.Customizations.$on({
                "descriptorLoaded" : {
                    fn : this._anotherPath,
                    scope : this
                }
            });
            aria.core.AppEnvironment.setEnvironment({
                customization : {
                    // use resolveURL so that the test can be run from anywhere
                    descriptor : aria.core.DownloadMgr.resolveURL("test/aria/templates/customization/descriptorAD.json")
                }
            });

        },

        _anotherPath : function () {
            var tc = this._getTemplateCtxt("test.aria.templates.customization.CustomTemplateC");

            // reload the context
            tc.$reload(null, {
                fn : this._anotherPathAfterReload,
                scope : this
            });
        },

        _anotherPathAfterReload : function () {
            // the original template we intended to load was still template A!
            var contextD = this._getTemplateCtxt("test.aria.templates.customization.CustomTemplateD");
            this.assertTrue(contextD._cfg.origClasspath == "test.aria.templates.customization.CustomTemplateA");

            // after testing passing descriptors as a path to descriptor file test passing a Json object containing
            // descriptor info
            if (this._lastTest) {
                aria.core.environment.Customizations.$unregisterListeners(this);
                this.notifyTemplateTestEnd();
            } else {
                this._jsonParamTest();
            }
        },

        _jsonParamTest : function () {
            // test passing the descriptor as a Json object
            aria.core.environment.Customizations.$unregisterListeners(this);
            aria.core.environment.Customizations.$on({
                "descriptorLoaded" : {
                    fn : this._jsonParam,
                    scope : this
                }
            });

            aria.core.AppEnvironment.setEnvironment({
                customization : {
                    descriptor : {
                        templates : {
                            "test.aria.templates.customization.CustomTemplateA" : "test.aria.templates.customization.CustomTemplateC"
                        }
                    }
                }
            });
        },

        _jsonParam : function () {

            var tc = this._getTemplateCtxt("test.aria.templates.customization.CustomTemplateD");

            // tc is always defined here
            // reload the context
            tc.$reload(null, {
                fn : this._jsonParamStepTwo,
                scope : this
            });
        },

        _jsonParamStepTwo : function () {
            // check the customization has worked
            this.assertTrue(this.templateCtxt.tplClasspath == "test.aria.templates.customization.CustomTemplateC");

            // the original template we intended to load was still template A!
            var contextC = this._getTemplateCtxt("test.aria.templates.customization.CustomTemplateC");
            this.assertTrue(contextC._cfg.origClasspath == "test.aria.templates.customization.CustomTemplateA");

            // now let's customize again trying a different path
            aria.core.environment.Customizations.$unregisterListeners(this);
            aria.core.environment.Customizations.$on({
                "descriptorLoaded" : {
                    fn : this._anotherPath,
                    scope : this
                }
            });

            this._lastTest = true;
            aria.core.AppEnvironment.setEnvironment({
                customization : {
                    descriptor : {
                        templates : {
                            "test.aria.templates.customization.CustomTemplateA" : "test.aria.templates.customization.CustomTemplateD"
                        }
                    }
                }
            });
        }
    }
});
