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
    $classpath : "test.aria.pageEngine.utils.HistoryManagerTest",
    $extends : "test.aria.pageEngine.utils.BaseNavigationManagerTest",
    $constructor : function () {
        this.$BaseNavigationManagerTest.constructor.call(this);
        this._dependencies = ["aria.pageEngine.utils.HistoryManager"];
    },
    $prototype : {

        _getNavManagerInstance : function (cb, options) {
            return new this._testWindow.aria.pageEngine.utils.HistoryManager(cb, options);
        },

        _firstTestAfterUpdateWithOnlyData : function () {
            this._update({
                pageId : "bbb",
                title : "bbb_title",
                url : "",
                data : { test : "test"},
                replace : true
            });

            this.assertEquals(this._navManager._history.state.test, "test", "History' state has not been updated");

            aria.core.Timer.addCallback({
                fn : this._firstTestAfterSecondUpdate,
                scope : this,
                delay : 100
            });
        }

    }
});
