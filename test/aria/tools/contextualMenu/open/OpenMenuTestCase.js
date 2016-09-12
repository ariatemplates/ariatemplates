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
 * Check that the contextual menu can be launched from method
 */
Aria.classDefinition({
    $classpath : "test.aria.tools.contextualMenu.open.OpenMenuTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.tools.contextual.ContextualMenu",
            "test.aria.tools.contextualMenu.ContextualMenuHelper"],
    $prototype : {
        setUp : function () {
            this.helper = test.aria.tools.contextualMenu.ContextualMenuHelper;
            this.contextualMenu = aria.tools.contextual.ContextualMenu;

            aria.core.AppEnvironment.setEnvironment({
                contextualMenu : {
                    enabled : true
                }
            });
        },

        runTemplateTest : function () {
            var divOutsideDialog = this.getElementById("divOutsideDialog");
            this.helper.assertNoContextualMenu(this);
            this.contextualMenu.open(divOutsideDialog);

            aria.core.Timer.addCallback({
                fn : this._simpleDiv,
                scope : this,
                delay : 2000
            });
        },

        _simpleDiv : function () {
            this.helper.assertContextualMenu(this, this.templateCtxt);
            this.contextualMenu.close();
            var divOutsideDialog = this.getElementById("divOutsideDialog");
            this.contextualMenu.open(divOutsideDialog, {
                x : 100,
                y : 200
            });

            aria.core.Timer.addCallback({
                fn : this._divposition,
                scope : this,
                delay : 1000
            });
        },

        _divposition : function () {
            this.helper.assertContextualMenu(this, this.templateCtxt);
            this.contextualMenu.close();
            this.helper.assertNoContextualMenu(this);
            this.contextualMenu.open(this.templateCtxt);
            aria.core.Timer.addCallback({
                fn : this._tplcxtend,
                scope : this,
                delay : 1000
            });

        },
        _tplcxtend : function () {
            this.helper.assertContextualMenu(this, this.templateCtxt);
            this.contextualMenu.close();
            this.notifyTemplateTestEnd();
        }

    }
});
