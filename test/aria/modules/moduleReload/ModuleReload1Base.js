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
 * This is a test of the module reload feature for a normal sub-module.
 */
Aria.classDefinition({
    // BE CAREFUL WHEN CHANGING THIS TEST, AS IT IS USED AS A BASE CLASS BY ModuleReloadTestCase2
    // ModuleReloadTestCase1 is to test standard sub-modules reload
    // ModuleReloadTestCase2 overrides some methods for custom sub-modules reload
    $classpath : "test.aria.modules.moduleReload.ModuleReload1Base",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.templates.ModuleCtrlFactory", "aria.core.environment.Customizations"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.moduleCtrlInitCalled = false;
        this.setTestEnv({
            template : "test.aria.modules.moduleReload.ModuleReloadTestCaseTpl",
            moduleCtrl : {
                classpath : "test.aria.modules.moduleReload.ParentModule",
                initArgs : {
                    testCase : this
                }
            }
        });
    },
    $prototype : {

        setUp : function () {
            this.initialCustomizations = aria.core.environment.Customizations.getCustomizations();
            aria.core.environment.Customizations.setCustomizations({}); // remove any customization
        },

        tearDown : function () {
            aria.core.environment.Customizations.setCustomizations(this.initialCustomizations); // restore
                                                                                                // customizations
        },

        _getSubTplWidget : function () {
            var tplWidget = this.getWidgetInstance("subTemplate");
            this.assertTrue(tplWidget.subTplCtxt.moduleCtrl == this.templateCtxt.moduleCtrl.subModule);
            return tplWidget;
        },

        _setSubModuleCtrlPrivate : function (name) {
            var tplWidget = this._getSubTplWidget();
            var moduleCtrlPrivate = tplWidget.subTplCtxt.moduleCtrlPrivate;
            var moduleCtrlPublic = tplWidget.subTplCtxt.moduleCtrl;

            this.assertTrue(moduleCtrlPublic == moduleCtrlPrivate.$publicInterface());

            this["childModuleCtrlPrivate" + name] = moduleCtrlPrivate;
            this["childModuleCtrlPublic" + name] = moduleCtrlPublic;
            this["childModuleCtrlClassLoadDate" + name] = moduleCtrlPublic.classLoadDate.getTime();
            this["childModuleCtrlInstanceLoadDate" + name] = moduleCtrlPublic.instanceLoadDate.getTime();

            this.assertTrue(this["childModuleCtrlClassLoadDate" + name] < this["childModuleCtrlInstanceLoadDate" + name]);

            var flowCtrlPrivate = tplWidget.subTplCtxt.flowCtrlPrivate;
            var flowCtrlPublic = tplWidget.subTplCtxt.flowCtrl;
            this.assertTrue(flowCtrlPublic == flowCtrlPrivate.$publicInterface());

            this["childFlowCtrlPrivate" + name] = flowCtrlPrivate;
            this["childFlowCtrlPublic" + name] = flowCtrlPublic;
            this["childFlowCtrlClassLoadDate" + name] = flowCtrlPublic.classLoadDate.getTime();
            this["childFlowCtrlInstanceLoadDate" + name] = flowCtrlPublic.instanceLoadDate.getTime();

            this.assertTrue(this["childFlowCtrlClassLoadDate" + name] < this["childFlowCtrlInstanceLoadDate" + name]);

            this._checkRaiseEvent(moduleCtrlPublic);
        },

        _checkRaiseEvent : function (moduleCtrlPublic) {
            // check raising the event. This makes sure a normal sub-module is not reloaded as a custom sub-module.
            this.expectingTestEvent = {};
            moduleCtrlPublic.raiseTestEvent(this.expectingTestEvent);
            this.assertTrue(this.expectingTestEvent == null);
        },

        runTemplateTest : function () {
            this.assertTrue(this.moduleCtrlInitCalled === true);
            this._count = 0;
            this._setSubModuleCtrlPrivate(0);

            // parentModuleCtrl is not reloadable, as it is a root module controller:
            this.assertFalse(aria.templates.ModuleCtrlFactory.isModuleCtrlReloadable(this.templateCtxt.moduleCtrlPrivate));

            this._reloadChildModule();
        },

        _reloadChildModule : function () {
            // childModuleCtrl is reloadable, as it is a child module controller:
            this.assertTrue(aria.templates.ModuleCtrlFactory.isModuleCtrlReloadable(this["childModuleCtrlPrivate"
                    + this._count]));

            this.moduleCtrlInitCalled = false;
            // reload the child module controller:
            aria.templates.ModuleCtrlFactory.reloadModuleCtrl(this["childModuleCtrlPrivate" + this._count], {
                scope : this,
                fn : this._moduleReloadedCb
            });
        },

        /**
         * Called from the child module controller init method.
         * @param {Object} args
         * @param {aria.core.JsObject.Callback} cb
         */
        childModuleCtrlInit : function (args, cb) {
            this.assertTrue(this.moduleCtrlInitCalled === false);
            this.moduleCtrlInitCalled = true;
            this.$callback(cb);
        },

        /**
         * Called from the parent module controller onSubModuleEvent method.
         * @param {Object} evt
         * @param {Object} args
         */
        parentOnSubModuleEvent : function (evt, args) {
            if (evt.name == "testEvent") {
                this.assertTrue(this["childModuleCtrlPublic" + this._count] == evt.src);
                this.assertTrue(this.expectingTestEvent != null);
                this.assertTrue(evt.testEventParam == this.expectingTestEvent);
                this.assertTrue(args.smRef == "subModule");
                this.expectingTestEvent = null;
            }
        },

        _moduleReloadedCb : function (res, args) {
            try {
                this.assertTrue(this.moduleCtrlInitCalled === true);
                var previousCount = this._count;
                this._count++;
                this._setSubModuleCtrlPrivate(this._count);
                this.assertTrue(this["childModuleCtrlClassLoadDate" + this._count] > this["childModuleCtrlInstanceLoadDate"
                        + previousCount]);
                this.assertTrue(this["childFlowCtrlClassLoadDate" + this._count] > this["childFlowCtrlInstanceLoadDate"
                        + previousCount]);
                // check that all previous module public interfaces now point to the new module controller
                // and that all previous flow public interfaces now point to the new flow:
                var currentData = this["childModuleCtrlPublic" + this._count].getData();
                var currentFlowData = this["childFlowCtrlPublic" + this._count].getFlowData();
                for (var i = 0; i < previousCount; i++) {
                    var data = this["childModuleCtrlPublic" + i].getData();
                    var flowData = this["childFlowCtrlPublic" + i].getFlowData();
                    this.assertTrue(data == currentData);
                    this.assertTrue(flowData == currentFlowData);
                }
                if (this._count == 3) {
                    // add a customization of the flow for that iteration
                    aria.core.environment.Customizations.setCustomizations({
                        flows : {
                            "test.aria.modules.moduleReload.ChildModuleFlow" : "test.aria.modules.moduleReload.CustomizedFlow"
                        }
                    });
                }
                var customized = (this._count >= 4 && this._count <= 6);
                this.assertTrue(currentFlowData.customized == (customized ? true : null));
                this.assertTrue(this["childFlowCtrlPrivate" + this._count].$classpath == (customized
                        ? "test.aria.modules.moduleReload.CustomizedFlow"
                        : "test.aria.modules.moduleReload.ChildModuleFlow"));
                this.assertTrue(this["childFlowCtrlPublic" + this._count].$classpath == (customized
                        ? "test.aria.modules.moduleReload.ICustomizedFlow"
                        : "test.aria.modules.moduleReload.IChildModuleFlow"));
                if (this._count == 6) {
                    // remove the customized flow
                    aria.core.environment.Customizations.setCustomizations({});
                }
                if (this._count >= 10) {
                    this.notifyTemplateTestEnd();
                } else {
                    aria.core.Timer.addCallback({
                        fn : this._reloadChildModule,
                        scope : this
                    });
                }
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        }

    }
});
