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

(function () {
    /**
     * @class test.aria.core.BrowserTest
     * @extends extends
     */
    var classDefinition = {
        $classpath : 'test.aria.core.BrowserTest',
        $dependencies : ['aria.core.Browser'],
        $extends : "aria.jsunit.TestCase",
        $constructor : function () {
            this.$TestCase.constructor.call(this);
        },
        $destructor : function () {
            this.$TestCase.$destructor.call(this)
        },
        $prototype : {
            setUp : function () {},
            tearDown : function () {},
            testToString : function () {
                var browserToString = aria.core.Browser.toString();
                this.assertTrue(browserToString != "[object Object]", "aria.core.Browser.toString method not overrided correctly. "
                        + "Expected something different from [object Object] and got " + browserToString);
            },
            testVersion : function () {
                var browser = aria.core.Browser;
                if (Object.defineProperty) {
                    this.assertFalse(browser.isIE6);
                    this.assertFalse(browser.isIE7);
                    try {
                        var testVar = {};
                        Object.defineProperty(testVar, "a", {
                            get : function () {}
                        });
                        this.assertFalse(browser.isIE8);
                    } catch (e) {
                        this.assertFalse(browser.isIE9);
                    }
                }
            }
        }
    };
    Aria.classDefinition(classDefinition);
})();