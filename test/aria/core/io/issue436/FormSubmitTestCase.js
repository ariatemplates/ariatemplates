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
    $classpath : "test.aria.core.io.issue436.FormSubmit",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Type"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.request = {};
        this.formTestAreaId = "formSubmitTestArea_" + this.$class;
        this.testArea = null;
    },
    $prototype : {
        setUp : function () {
            var div = Aria.$window.document.createElement("div");
            div.id = this.formTestAreaId;
            Aria.$window.document.body.appendChild(div);
            this.testArea = div;
        },

        tearDown : function () {
            if (this.testArea) {
                this.testArea.parentNode.removeChild(this.testArea);
            }
        },

        testAsyncFormSubmissionWithEncType : function () {
            this._injectForm();
            this.request = {
                formId : "simulateAsyncFormSubmit",
                callback : {
                    fn : this._testFormHandlerSuccess,
                    scope : this,
                    args : {
                        testName : "testAsyncFormSubmissionWithEncType"
                    }
                }
            };
            aria.core.IO.asyncFormSubmit(this.request);
        },

        testAsyncFormSubmissionWithEncTypeWithHeaders : function () {
            this._injectForm();
            this.request = {
                formId : "simulateAsyncFormSubmit",
                headers : {
                    some : "sdsds"
                },
                callback : {
                    fn : this._testFormHandlerSuccess,
                    scope : this,
                    args : {
                        testName : "testAsyncFormSubmissionWithEncTypeWithHeaders"
                    }
                }
            };
            aria.core.IO.asyncFormSubmit(this.request);
        },

        /**
         * Helper to create the mock form
         * @protected
         */
        _injectForm : function () {
            aria.utils.Dom.replaceHTML(this.formTestAreaId, "<form enctype='multipart/form-data' name='simulateAsyncFormSubmit' id='simulateAsyncFormSubmit' method='POST' action='"
                    + Aria.rootFolderPath
                    + "test/aria/core/test/TestFile.html'><input type='text' id='simulateAsyncFileUpload' name='simulateAsyncFileUpload' value='test.txt' style='-moz-opacity:0;filter:alpha(opacity: 0);opacity: 0;'></form>");
        },

        /**
         * Callback used when request was successful
         * @param {Object} request
         * @protected
         */
        _testFormHandlerSuccess : function (response, args) {
            try {

                this.assertEquals(response.status, 200, "Response status is wrong");
                this.assertEquals(this.request.headers["Content-Type"], "multipart/form-data", "Content-type header is not set properly");
                this.assertEquals(aria.utils.Type.isString(response.responseText), true, "responseText must be a string");
                this.notifyTestEnd(args.testName);
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        }

    }
});
