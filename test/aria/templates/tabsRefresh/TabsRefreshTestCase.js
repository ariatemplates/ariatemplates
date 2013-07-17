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
 * Check that the global CSS for widgets is correctly loaded and is not unloaded when refreshing templates.<br>
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.tabsRefresh.TabsRefreshTestCase",
    $dependencies : ["aria.utils.Dom"],
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.domUtils = aria.utils.Dom;
        this.setTestEnv({
            template : "test.aria.templates.tabsRefresh.PTRTemplate",
            moduleCtrl : {
                classpath : "test.aria.templates.tabsRefresh.ParentModuleCtrl"
            }
        });
    },
    $destructor : function () {
        this.domUtils = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            this._reloadSubModuleCtrl({
                count : 10
            });
        },

        _reloadSubModuleCtrl : function (args) {
            this._checkResult();
            if (args.count > 0) {
                args.count--;
                this.templateCtxt.moduleCtrl.reloadSubModuleCtrl({
                    fn : this._refreshAndDelay,
                    scope : this,
                    args : args
                });
            } else {
                this.notifyTemplateTestEnd();
            }
        },

        _refreshAndDelay : function (res, args) {
            this.templateCtxt.$refresh();
            aria.core.Timer.addCallback({
                fn : this._reloadSubModuleCtrl,
                scope : this,
                args : args,
                delay : 200
            });
        },

        _checkResult : function () {
            var checkDiv = this.domUtils.getElementById("checkDiv");
            var geometry = this.domUtils.getGeometry(checkDiv);
            this.assertTrue(geometry.height < 50, "The height of checkDiv is too high. Something is probably wrong.");
            if (this._savedGeometry) {
                this.assertJsonEquals(geometry, this._savedGeometry, "The size of the div changed accross refreshes.");
            }
            this._savedGeometry = geometry;
        }

    }
});