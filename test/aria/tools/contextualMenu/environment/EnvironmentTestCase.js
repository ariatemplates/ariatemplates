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
 * Check that setting the environment correctly enables or disables the contextual menu.
 */
Aria.classDefinition({
    $classpath : "test.aria.tools.contextualMenu.environment.EnvironmentTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.tools.contextual.ContextualMenu",
            "test.aria.tools.contextualMenu.ContextualMenuHelper"],
    $prototype : {
        setUp : function () {
            this.helper = test.aria.tools.contextualMenu.ContextualMenuHelper;
            this.contextualMenu = aria.tools.contextual.ContextualMenu;
            aria.core.AppEnvironment.setEnvironment({}); // resets the environment
        },

        tearDown : function () {
            aria.core.AppEnvironment.setEnvironment({}); // resets the environment
        },

        runTemplateTest : function () {
            this.myDiv = this.getElementById("myDiv");
            this.helper.assertNoContextualMenu(this);
            aria.core.AppEnvironment.setEnvironment({
                contextualMenu : {
                    enabled : false
                }
            });
            this.helper.sendCtrlRightClick(this.myDiv);
            aria.core.Timer.addCallback({
                fn : this._step2,
                scope : this,
                delay : 2000
            });
        },

        _step2 : function () {
            this.helper.assertNoContextualMenu(this);
            aria.core.AppEnvironment.setEnvironment({
                contextualMenu : {
                    enabled : true
                }
            });
            this.helper.sendCtrlRightClick(this.myDiv);
            aria.core.Timer.addCallback({
                fn : this._step3,
                scope : this,
                delay : 2000
            });
        },

        _step3 : function () {
            this.helper.assertContextualMenu(this, this.templateCtxt);
            this.contextualMenu.close();
            this.notifyTemplateTestEnd();
        }

    }
});
