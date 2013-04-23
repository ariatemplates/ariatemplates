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
    $classpath : "test.aria.pageEngine.pageEngine.PageEngineBaseTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.FrameATLoader", "aria.core.log.SilentArrayAppender", "aria.utils.CSSLoader",
            "aria.utils.String"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.pageEngine.pageEngine.MainTemplate"
        });
        this.defaultTestTimeout = 10000;
        this._dependencies = ["aria.pageEngine.PageEngine"];
    },
    $prototype : {

        runTemplateTest : function () {
            this._iframe = aria.utils.Dom.getElementById("test-iframe");
            aria.utils.FrameATLoader.loadAriaTemplatesInFrame(this._iframe, {
                fn : this._onIframeReady,
                scope : this
            });
        },

        _onIframeReady : function () {
            this._iframeWindow = this._iframe.contentWindow;
            var iDocument = this._iframeWindow.document;
            var newDiv = iDocument.createElement('div');
            newDiv.id = "at-main";
            iDocument.body.appendChild(newDiv);
            newDiv = null;

            this.waitFor({
                condition : function () {
                    try {
                        return !!this._iframeWindow.Aria.load;
                    } catch (ex) {
                        return false;
                    }
                },
                callback : {
                    fn : this._waitForAriaLoad,
                    scope : this
                }
            });
        },

        _waitForAriaLoad : function () {
            this._iframeWindow.aria.core.Log.addAppender(aria.core.Log.getAppenders()[0]);
            this._iframeWindow.Aria.load({
                classes : this._dependencies,
                oncomplete : {
                    fn : this.runTemplateTestInIframe,
                    scope : this
                }
            });

        },

        _testCSSLinkTag : function (href, value, limit) {
            value = (value === false) ? false : true;
            limit = limit || 10;
            var prefix = aria.utils.CSSLoader.TAG_PREFIX;
            var id, element, counter = 0;
            for (var i = 0; i < limit; i++) {
                id = prefix + i;
                element = this._iframeWindow.aria.utils.Dom.getElementById(id);
                if (element && aria.utils.String.endsWith(element.href, href)) {
                    counter++;
                }
            }
            if (value) {
                this.assertTrue(counter == 1, href + " file has not been added.");
            } else {
                this.assertTrue(counter === 0, href + " file has been added. It should not.");
            }
        },

        runTemplateTestInIframe : function () {},

        end : function () {
            this._iframeWindow = null;
            this._iframe = null;
            this.$TemplateTestCase.end.call(this);
        }

    }
});