/*
 * Copyright 2014 Amadeus s.a.s.
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

var Aria = require("ariatemplates/Aria");
var asyncRequire = require("noder-js/asyncRequire");
var IOFilter = require("ariatemplates/core/IOFilter");
var IOFiltersMgr = require("ariatemplates/core/IOFiltersMgr");
var AppEnvironment = require("ariatemplates/core/AppEnvironment");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.utils.environment.VisualFocusDependency",
    $extends : require("ariatemplates/jsunit/TestCase"),
    $prototype : {
        testAsyncCheck : function () {
            var visualFocusPath = require.resolve("ariatemplates/utils/VisualFocus");
            var envVisualFocusPath = require.resolve("ariatemplates/utils/environment/VisualFocus");
            // for the test to really be useful, the visual focus must not be either loaded or preloaded at the
            // beginning
            this.assertTrue(require.cache[visualFocusPath] == null);
            this.assertTrue(require.cache[envVisualFocusPath] == null);

            AppEnvironment.setEnvironment({
                appOutlineStyle : "red dashed 2px"
            });
            this.allSyncFilter = new IOFilter();
            this.allSyncFilter.onRequest = function (req) {
                // This simulates the fact that all needed classed are packaged and already loaded:
                req.async = false;
            };
            IOFiltersMgr.addFilter(this.allSyncFilter);

            var self = this;
            // Now load the class which usually triggers the load of VisualFocus
            asyncRequire("ariatemplates/templates/Template").thenSync(function () {
                try {
                    self.assertLogsEmpty();
                } catch (e) {
                    // to finish the test immediately
                    self.notifyTestEnd();
                    return;
                }

                // check that both classes are now correctly loaded:
                self.assertTruthy(require.cache[envVisualFocusPath].exports.getAppOutlineStyle);

                // check that the other class is also loaded (but only later):
                self.waitFor({
                    condition : function () {
                        return require.cache[visualFocusPath] && require.cache[visualFocusPath].loaded;
                    },
                    callback : function () {
                        self.assertTruthy(require.cache[visualFocusPath].exports.addVisualFocus);
                        IOFiltersMgr.removeFilter(self.allSyncFilter);
                        self.notifyTestEnd();
                    }
                });
            }).done();
        }
    }
});
