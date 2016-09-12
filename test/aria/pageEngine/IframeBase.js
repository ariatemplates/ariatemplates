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
    $classpath : "test.aria.pageEngine.IframeTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.FrameATLoader", "aria.core.log.SilentArrayAppender"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this._dependencies = [];
    },
    $prototype : {

        testAsyncInIframe : function () {
            this.loadIframe({
                fn : this.runTestInIframe,
                scope : this
            });
        },

        loadIframe : function (cb) {
            var testEnv;
            var document = Aria.$window.document;
            var iframe = document.createElement("iframe");
            iframe.id = "test-iframe";
            iframe.style.cssText = this.IFRAME_BASE_CSS_TEXT;
            document.body.appendChild(iframe);
            this._iframe = iframe;
            testEnv = iframe;
            aria.utils.FrameATLoader.loadAriaTemplatesInFrame(testEnv, {
                fn : this._onIframeReady,
                scope : this,
                args : cb,
                resIndex : -1
            });

        },

        removeIframe : function () {
            this._iframe.parentNode.removeChild(this._iframe);
            this._iframe = null;
            this._testWindow = null;

        },

        reloadIframe : function (cb) {
            this.removeIframe();
            this.loadIframe(cb);
        },

        _onIframeReady : function (cb) {
            this._testWindow = this._iframe.contentWindow;
            var iDocument = this._testWindow.document;
            var newDiv = iDocument.createElement('div');
            newDiv.id = "at-main";
            iDocument.body.appendChild(newDiv);
            newDiv = null;

            this.waitFor({
                condition : function () {
                    try {
                        return !!this._testWindow.Aria.load;
                    } catch (ex) {
                        return false;
                    }
                },
                callback : {
                    fn : this._waitForAriaLoad,
                    scope : this,
                    args : cb,
                    resIndex : -1
                }
            });
        },

        _waitForAriaLoad : function (cb) {
            this._testWindow.aria.core.Log.addAppender(aria.core.Log.getAppenders()[0]);
            if (this._dependencies.length > 0) {
                this._testWindow.Aria.load({
                    classes : this._dependencies,
                    oncomplete : cb
                });
            } else {
                this.$callback(cb);
            }

        },

        runTestInIframe : Aria.empty,

        end : function () {
            this.removeIframe();
            this.notifyTestEnd("testAsyncInIframe");
        }

    }
});
