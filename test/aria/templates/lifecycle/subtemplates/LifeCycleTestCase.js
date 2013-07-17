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

/**
 * Template life cycle test case. Check that variables initialization, $dataReady, $viewReady, $displayReady, ... are
 * correctly done in various cases (when templates are already in the cache or when they must be downloaded, when the
 * template is a root template or a sub-template, when the refresh manager is stopped or not)
 */
Aria.classDefinition({
    $classpath : 'test.aria.templates.lifecycle.subtemplates.LifeCycleTestCase',
    $dependencies : ['aria.templates.RefreshManager', 'aria.utils.Dom'],
    $extends : 'aria.jsunit.TemplateTestCase',
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.refreshStopped = false;
    },
    $prototype : {

        // 8 tests are here, named from testAsync000 to testAsync111
        // first 0/1: 0 = parent templat, 1 = child template
        // second 0/1: 0 = refresh manager stopped, 1 = refresh manager not stopped
        // third 0/1: 0 = templates not yet loaded, 1 = templates already loaded

        testAsync000 : function () {
            this.startLifeCycleTest({
                tplName : "LifeCycle",
                stopRefresh : true,
                unloadClasses : true
            });
        },

        testAsync001 : function () {
            this.startLifeCycleTest({
                tplName : "LifeCycle",
                stopRefresh : true,
                preloadClasses : true
            });
        },

        testAsync010 : function () {
            this.startLifeCycleTest({
                tplName : "LifeCycle",
                stopRefresh : false,
                unloadClasses : true
            });
        },

        testAsync011 : function () {
            this.startLifeCycleTest({
                tplName : "LifeCycle",
                stopRefresh : false,
                preloadClasses : true
            });
        },

        testAsync100 : function () {
            this.startLifeCycleTest({
                tplName : "ParentTemplate",
                stopRefresh : true,
                unloadClasses : true
            });
        },

        testAsync101 : function () {
            this.startLifeCycleTest({
                tplName : "ParentTemplate",
                stopRefresh : true,
                preloadClasses : true
            });
        },

        testAsync110 : function () {
            this.startLifeCycleTest({
                tplName : "ParentTemplate",
                stopRefresh : false,
                unloadClasses : true
            });
        },

        testAsync111 : function () {
            this.startLifeCycleTest({
                tplName : "ParentTemplate",
                stopRefresh : false,
                preloadClasses : true
            });
        },

        startLifeCycleTest : function (cfgA, cfgB) {
            var cfg = cfgB || cfgA;
            if (cfg.unloadClasses) {
                cfg.unloadClasses = false;
                this._unloadAllClasses({
                    fn : this.startLifeCycleTest,
                    scope : this,
                    args : cfg
                });
                return;
            } else if (cfg.preloadClasses) {
                cfg.preloadClasses = false;
                this._preloadAllClasses({
                    fn : this.startLifeCycleTest,
                    scope : this,
                    args : cfg
                });
                return;
            }
            if (cfg.stopRefresh) {
                this.stopRefresh();
            }
            this.initState();
            this.tplName = cfg.tplName;
            this.setTestEnv({
                template : "test.aria.templates.lifecycle.subtemplates." + cfg.tplName,
                data : {
                    testCase : this
                }
            });
            this._waitForAllLoadedCount = 0;
            aria.core.Timer.addCallback({
                fn : this._waitForAllLoaded,
                scope : this,
                delay : 200
            });
            this.$TemplateTestCase.testAsyncStartTemplateTest.call(this);
        },

        stopRefresh : function () {
            if (!this.refreshStopped) {
                this.refreshStopped = true;
                aria.templates.RefreshManager.stop();
            }
        },

        resumeRefresh : function () {
            if (this.refreshStopped) {
                this.refreshStopped = false;
                aria.templates.RefreshManager.resume();
            }
        },

        _unloadAllClasses : function (cb) {
            aria.core.Timer.addCallback({
                fn : this._unloadAllClassesCallback,
                scope : this,
                args : cb
            });
        },

        _unloadAllClassesCallback : function (cb) {
            var classMgr = aria.core.ClassMgr;
            classMgr.unloadClass("test.aria.templates.lifecycle.subtemplates.SubTemplate");
            classMgr.unloadClass("test.aria.templates.lifecycle.subtemplates.LifeCycleScript");
            classMgr.unloadClass("test.aria.templates.lifecycle.subtemplates.LifeCycle");
            classMgr.unloadClass("test.aria.templates.lifecycle.subtemplates.ParentTemplate");
            this.$callback(cb);
        },

        _preloadAllClasses : function (cb) {
            Aria.load({
                templates : ["test.aria.templates.lifecycle.subtemplates.SubTemplate",
                        "test.aria.templates.lifecycle.subtemplates.ParentTemplate",
                        "test.aria.templates.lifecycle.subtemplates.LifeCycle"],
                oncomplete : cb
            });
        },

        testAsyncStartTemplateTest : function () {
            // do nothing in this method
            this.notifyTestEnd("testAsyncStartTemplateTest");
        },

        runTemplateTest : function () {
            // do nothing in this method
        },

        initState : function () {
            this.state = {
                tpl : null,
                globalVarsInit : false,
                dataReady : false,
                viewReady : false,
                afterRefresh : false,
                displayReady : false,
                markupGeneration : false,
                scriptDestructor : false,
                loadTemplateCB : false
            };
        },

        globalVarsInit : function (tpl) {
            this.assertTrue(this.state.tpl == null, "globalVarsInit called from different template");
            this.state.tpl = tpl;
            this.assertFalse(this.state.globalVarsInit, "globalVarsInit called twice");
            this.state.globalVarsInit = true;
        },

        dataReady : function (tpl) {
            this.assertTrue(this.state.tpl == tpl, "dataReady called from different template");
            this.assertFalse(this.state.dataReady, "dataReady called twice");
            this.assertTrue(this.state.globalVarsInit, "dataReady called before globalVarsInit");
            this.state.dataReady = true;
        },

        markupGeneration : function (tpl) {
            this.assertTrue(this.state.tpl == tpl, "markupGeneration called from different template");
            this.assertFalse(this.refreshStopped, "markupGeneration called even if refreshes are stopped in the refresh manager");
            this.assertFalse(this.state.markupGeneration, "markupGeneration called twice");
            this.assertTrue(this.state.dataReady, "markupGeneration called before dataReady");
            this.state.markupGeneration = true;
        },

        afterRefresh : function (tpl) {
            this.assertTrue(this.state.tpl == tpl, "afterRefresh called from different template");
            this.assertFalse(this.state.afterRefresh, "afterRefresh called twice");
            this.assertTrue(this.state.markupGeneration, "afterRefresh called before markupGeneration");
            this.state.afterRefresh = true;
        },

        viewReady : function (tpl) {
            this.assertTrue(this.state.tpl == tpl, "viewReady called from different template");
            this.assertFalse(this.state.viewReady, "viewReady called twice");
            this.assertTrue(this.state.afterRefresh, "viewReady called before afterRefresh");
            this.state.viewReady = true;
            this.assertTrue(aria.utils.Dom.getElementById("myItem") != null, "viewReady called before the item is inserted in the DOM");
        },

        _templateLoadCB : function () {
            if (this.tplName == "LifeCycle") {
                // only do these asserts if the LifeCycle is used as root template
                this.assertFalse(this.state.loadTemplateCB, "loadTemplate callback called twice");
                this.assertTrue(this.state.viewReady, "loadTemplate callback called before viewReady");
            }
            this.state.loadTemplateCB = true;
            this.$TemplateTestCase._templateLoadCB.apply(this, arguments);
        },

        displayReady : function (tpl) {
            this.assertTrue(this.state.tpl == tpl, "displayReady called from different template");
            this.assertFalse(this.state.displayReady, "displayReady called twice");
            this.assertTrue(this.state.markupGeneration, "displayReady called before markupGeneration");
            this.state.displayReady = true;
            this.assertTrue(aria.utils.Dom.getElementById("myItem") != null, "displayReady called before the item is inserted in the DOM");
            this.assertTrue(aria.utils.Dom.getElementById("mySubTemplateItem") != null, "displayReady called before the sub-template item is inserted in the DOM.");
        },

        _waitForAllLoaded : function () {
            // check that everything was correctly called before going on
            if (!this.state.displayReady || !this.state.viewReady || !this.state.loadTemplateCB) {
                this._waitForAllLoadedCount++;
                if (this.refreshStopped && ((this.tplName == "LifeCycle" && this.state.dataReady) || (this.tplName == "ParentTemplate" && this._waitForAllLoadedCount >= 4))) {
                    this.resumeRefresh();
                }
                aria.core.Timer.addCallback({
                    fn : this._waitForAllLoaded,
                    scope : this,
                    delay : 200
                });
            } else {
                this._afterLoaded();
            }
        },

        _afterLoaded : function () {
            this.assertTrue(this.state.globalVarsInit, "globalVarsInit not called");
            this.assertTrue(this.state.dataReady, "dataReady not called");
            this.assertTrue(this.state.markupGeneration, "markupGeneration not called");
            this.assertTrue(this.state.afterRefresh, "afterRefresh not called");
            this.assertTrue(this.state.loadTemplateCB, "loadTemplateCB not called");
            this.assertTrue(this.state.viewReady, "viewReady not called");
            this.assertTrue(this.state.displayReady, "displayReady not called");
            this._disposeTestTemplate();
            this.assertTrue(this.state.scriptDestructor, "scriptDestructor not called");
            this.state.tpl = null;
            this.state = null;
            aria.core.Timer.addCallback({
                fn : this.notifyTemplateTestEnd,
                scope : this
            });
        },

        scriptDestructor : function (tpl) {
            this.assertTrue(this.state.tpl == tpl, "scriptDestructor called from different template");
            this.state.scriptDestructor = true;
        }

    }
});
