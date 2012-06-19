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
 * Derives from the TestCase and exposes a set of methods which allow to run UI comparison tests
 * @class aria.jsunit.UITestCase
 * @extends aria.jsunit.TestCase
 */
Aria.classDefinition({
    $classpath : 'aria.jsunit.UITestCase',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ['aria.jsunit.ScreenCapture'],
    $constructor : function () {
        // constructor
        this.$TestCase.constructor.call(this);
        this.screenCapture = aria.jsunit.ScreenCapture;
    },
    $destructor : function () {
        this.$TestCase.$destructor.call(this);
        // this.screenCapture.$dispose();
        this.screenCapture = null;
    },
    $prototype : {
        /**
         * Runs the UI comparison test
         * @param {Object} args arguments for the UI test
         * 
         * <pre>
         *     {
         *         testCaseName: // {String}- name of the testcase
         *         oncomplete: // {Object} - callback method
         *         scope: // {Object} - scope of the oncomplete callback
         *         x: // {Integer} (default:0) - x coordinate of the captured area
         *         y: // {Integer} (default:0) - y coordinate of the captured area
         *         width: // {Integer} (default:800) - width of the captured area
         *         height: // {Integer} (default:200) - height of the captured area
         * }
         * </pre>
         */
        runUITest : function (args) {
            // testCaseName,callback
            var scope = args.scope ? args.scope : this;

            // verify whether screen capture is possible
            var res = this.screenCapture.capture({
                useCaseName : args.testCaseName,
                conf : {
                    x : args.x ? args.x : 0,
                    y : args.y ? args.y : 0,
                    width : args.width ? args.width : 800,
                    height : args.height ? args.width : 200,
                    threshold : 0
                },
                oncomplete : args.oncomplete,
                scope : scope
            });

            // continue with the test if capture cannot be triggered
            if (!res) {
                res = null;
                args.oncomplete.call(scope);
            }
        },

        /**
         * Gets the result of the async UI test
         * @return {Object}
         */
        getUITestResult : function () {
            return this.screenCapture.getResponse();
        },

        /**
         * Captures the header. Obsolete
         * @private
         * @deprecated
         */
        __captureHeader : function () {
            this.screenCapture.capture("HomePage_Header", {
                x : 0,
                y : 0,
                width : 1280,
                height : 65,
                threshold : 0
            }, this.responseCallbackMethod, this);
        },

        /**
         * Captures the menu. Obsolete
         * @private
         * @deprecated
         */
        __captureMenu : function () {
            this.screenCapture.capture("HomePage_Menu", {
                x : 0,
                y : 0,
                width : 320,
                height : 500,
                threshold : 0
            }, this.responseCallbackMethod, this);
        },

        /**
         * Obsolete
         * @deprecated
         */
        responseCallbackMethod : function () {
            var result = this.screenCapture.getResponse(this.responseCallbackMethod, this);
            // alert('responseCallbackMethod CODE:'+result.code+ " REASON:"+result.reason);
        }
    }
});