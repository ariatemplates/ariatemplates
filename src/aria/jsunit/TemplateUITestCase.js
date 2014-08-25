
var Aria = require("../Aria");
var ariaJsunitScreenCapture = require("./ScreenCapture");
var ariaJsunitTemplateTestCase = require("./TemplateTestCase");
/* BACKWARD-COMPATIBILITY-BEGIN GH-1104 */
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
 * Class to be extended to create a UI template test case. This kind of test is to be used to load a template from a tpl
 * file, and then take a screenshot of it (using the screencapture tool) and compare with previous screenshot images to
 * assert that the template is still displayed as before.
 * @class aria.jsunit.TemplateUITestCase
 * @extends aria.jsunit.TemplateTestCase
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.jsunit.TemplateUITestCase',
    $extends : ariaJsunitTemplateTestCase,
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.screenCapture = ariaJsunitScreenCapture;
        this.$logWarn("aria.jsunit.TemplateUITestCase class is deprecated and will be removed soon from the framework");
    },
    $prototype : {
        /**
         * Runs the UI comparison test. The goal here is to pass a use case name that will be used to save the image,
         * and compare with the previous image taken. Also, pass args to specify some custom image taking coordinates if
         * the default ones are not ok. The args should be used to pass a callback method and scope to be executed when
         * the capture is done. If the image comparison fails (different images), an test fail will be trigger by this
         * class directly, no need to do it in your test case.
         * @param {String} useCaseName The name of the use case to be used to save the screenshot image
         * @param {Object} args Arguments for the screencapture tool: {x, y, width, height, fn, scope}
         */
        capture : function (useCaseName, args) {
            // verify whether screen capture is possible
            var res = this.screenCapture.capture({
                useCaseName : useCaseName,
                conf : {
                    x : args.x ? args.x : 0,
                    y : args.y ? args.y : 0,
                    width : args.width ? args.width : 800,
                    height : args.height ? args.height : 200,
                    threshold : 0
                },
                oncomplete : this._onCaptureDone,
                scope : this,
                args : {
                    cb : args.fn,
                    scope : args.scope
                }
            });

            // There are cases when the screencapture won't work, in this case, we need to fail the test
            if (!res) {
                // this.assertTrue(false, "The screencapture tool didn't work");
                args.fn.call(args.scope);
            }
        },

        /**
         * @protected
         * @param {Object} args The callback and scope to be called
         */
        _onCaptureDone : function (args) {
            var code = this.screenCapture.getResponse().code;
            this.assertTrue("0" === code, "Images are different");
            args.cb.call(args.scope);
        }
    }
});
/* BACKWARD-COMPATIBILITY-END GH-1104 */
