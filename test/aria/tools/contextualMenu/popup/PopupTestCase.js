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
 * Check that the contextual menu can be used both outside of a popup and inside a popup.
 */
Aria.classDefinition({
    $classpath : "test.aria.tools.contextualMenu.popup.PopupTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.tools.contextual.ContextualMenu",
            "test.aria.tools.contextualMenu.ContextualMenuHelper", "aria.utils.Json", "aria.tools.contextual.environment.ContextualMenu"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.helper = test.aria.tools.contextualMenu.ContextualMenuHelper;
        this.contextualMenu = aria.tools.contextual.ContextualMenu;
        this.data = {
            dialogVisible : false
        };
        this.setTestEnv({
            template : "test.aria.tools.contextualMenu.popup.PopupTestTpl",
            data : this.data
        });
    },
    $prototype : {
        setUp : function () {
            this._savedContextualMenuCfg = aria.tools.contextual.environment.ContextualMenu.getContextualMenu();
            aria.core.AppEnvironment.setEnvironment({
                contextualMenu : {
                    enabled : true,
                    template : "aria.tools.contextual.ContextualDisplay",
                    moduleCtrl : "aria.tools.contextual.ContextualModule"
                }
            }, null, true);
        },

        tearDown : function () {
            aria.core.AppEnvironment.setEnvironment({
                contextualMenu : this._savedContextualMenuCfg
            }, null, true);
        },

        runTemplateTest : function () {
            var divOutsideDialog = this.getElementById("divOutsideDialog");

            this.helper.assertNoContextualMenu(this);
            this.helper.sendCtrlRightClick(divOutsideDialog);
            aria.core.Timer.addCallback({
                fn : this._step1,
                scope : this,
                delay : 2000
            });
        },

        _step1 : function () {
            this.helper.assertContextualMenu(this, this.templateCtxt);
            this.contextualMenu.close();

            aria.utils.Json.setValue(this.data, "dialogVisible", true);
            aria.core.Timer.addCallback({
                fn : this._step2,
                scope : this,
                delay : 200
            });
        },

        _step2 : function () {
            var divInsideDialog = this.getElementById("divInsideDialog");

            this.helper.assertNoContextualMenu(this);
            this.helper.sendCtrlRightClick(divInsideDialog);
            aria.core.Timer.addCallback({
                fn : this._step3,
                scope : this,
                delay : 1000
            });
        },

        _step3 : function () {
            this.helper.assertContextualMenu(this, this.templateCtxt);
            this.contextualMenu.close();

            this.helper.assertNoContextualMenu(this);
            this.notifyTemplateTestEnd();
        }

    }
});
