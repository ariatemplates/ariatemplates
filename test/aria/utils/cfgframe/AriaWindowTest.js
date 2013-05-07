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

Aria.classDefinition({
    $classpath : "test.aria.utils.cfgframe.AriaWindowTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.AriaWindow", "aria.utils.Dom"],
    $statics : {
        EVENTS_LIST : [{
                    name : "beginIframeReload",
                    src : "AriaWindowTest"
                }, {
                    name : "endIframeReload",
                    src : "AriaWindowTest"
                }, {
                    name : "beforeSetWindow",
                    src : "AriaWindowTest"
                }, {
                    name : "unloadWindow"
                }, {
                    name : "detachWindow"
                }, {
                    name : "afterSetWindow",
                    src : "AriaWindowTest"
                }, {
                    name : "attachWindow"
                }, {
                    name : "beginIframeReload",
                    src : "AriaWindowTest"
                }, {
                    name : "unloadWindow"
                }, {
                    name : "detachWindow"
                }, {
                    name : "endIframeReload",
                    src : "AriaWindowTest"
                }, {
                    name : "attachWindow"
                }, {
                    name : "detachWindow"
                }, {
                    name : "beginIframeReload",
                    src : "AriaWindowTest"
                }, {
                    name : "endIframeReload",
                    src : "AriaWindowTest"
                }, {
                    name : "attachWindow"
                }, {
                    name : "unloadWindow"
                }, {
                    name : "detachWindow"
                }]
    },
    $prototype : {
        _reloadIframe : function (cb) {
            this._setReloadCallback(cb);
            var url = "" + this._subWindow.location;
            url = url.replace(/timer=\d+/, "timer=" + (new Date().getTime()));
            this._subWindow.location = url;
        },

        _setReloadCallback : function (cb) {
            this.checkExpectedEvent({
                name : "beginIframeReload",
                src : "AriaWindowTest"
            });
            var window = this._initialWindow;
            window.iframeLoadedCallback = {
                fn : this._iframeReloaded,
                scope : this,
                args : cb
            };
        },

        _iframeReloaded : function (unused, cb) {
            this.checkExpectedEvent({
                name : "endIframeReload",
                src : "AriaWindowTest"
            });
            var window = this._initialWindow;
            window.iframeLoadedCallback = null;
            this.$callback(cb);
        },

        _useWindow : function () {
            if (!this._isUsingWindow) {
                this._isUsingWindow = true;
                aria.utils.AriaWindow.attachWindow();
            }
        },

        _releaseWindow : function () {
            if (this._isUsingWindow) {
                aria.utils.AriaWindow.detachWindow();
                this._isUsingWindow = false;
            }
        },

        _callSetWindow : function (window) {
            this.checkExpectedEvent({
                name : "beforeSetWindow",
                src : "AriaWindowTest"
            });
            aria.utils.AriaWindow.setWindow(window);
            this.checkExpectedEvent({
                name : "afterSetWindow",
                src : "AriaWindowTest"
            });
            this.assertTrue(Aria.$window == window);
        },

        _checkCopyGlobals : function () {
            var global = Aria.$global;
            var subWindow = this._subWindow;
            Aria.copyGlobals(subWindow);
            this.assertTrue(subWindow.Aria == global.Aria, "Aria was not copied to subWindow");
            this.assertTrue(subWindow.aria == global.aria, "aria was not copied to subWindow");
            this.assertTrue(subWindow.test == global.test, "test was not copied to subWindow");
        },


        testAsyncPageNavigation : function () {
            this._useWindow();
            this.assertTrue(aria.utils.AriaWindow.isWindowUsed());

            this.registerExpectedEventsList(this.EVENTS_LIST);

            aria.utils.AriaWindow.$on({
                "attachWindow" : this.checkExpectedEvent,
                "detachWindow" : this.checkExpectedEvent,
                "unloadWindow" : this.checkExpectedEvent,
                scope : this
            });
            aria.utils.AriaWindow.$on({
                "unloadWindow" : this._releaseWindow,
                scope : this
            });

            var window = Aria.$window;
            this._initialWindow = window;
            this.myIframe = window.document.createElement("iframe");
            this.myIframe.setAttribute("src", aria.core.DownloadMgr.resolveURL(this.$package.replace(/\./g, "/")
                    + "/IframeContent.html?timer=0"));
            this.myIframe.style.cssText = "border:1px solid black;background-color:white;z-index:100000;width:800px;height:600px;margin:5px;";
            this.testArea = aria.utils.Dom.getElementById("TESTAREA");
            this.testArea.appendChild(this.myIframe);
            this._subWindow = this.myIframe.contentWindow;
            this._setReloadCallback({
                scope : this,
                fn : this._firstPartLoaded
            });
        },

        _firstPartLoaded : function () {
            var window = this._initialWindow;
            var subWindow = this._subWindow;
            this._checkCopyGlobals();
            this._callSetWindow(subWindow);
            Aria.loadTemplate({
                classpath : "test.aria.utils.cfgframe.TestTemplate",
                div : "myDivItemInIframe"
            }, {
                fn : this._testTemplateLoaded,
                scope : this
            });
        },

        _testTemplateLoaded : function () {
            this._reloadIframe({
                fn : this._secondPartLoaded,
                scope : this
            });
        },

        _secondPartLoaded : function () {
            this.assertTrue(Aria.$window == this._subWindow);
            this.assertFalse(aria.utils.AriaWindow.isWindowUsed());
            this._useWindow();
            this.assertTrue(aria.utils.AriaWindow.isWindowUsed());
            this._releaseWindow();
            this.assertFalse(aria.utils.AriaWindow.isWindowUsed());
            this._reloadIframe({
                fn : this._thirdPartLoaded,
                scope : this
            });
        },

        _thirdPartLoaded : function () {
            this._checkCopyGlobals();
            Aria.loadTemplate({
                classpath : "test.aria.utils.cfgframe.TestTemplate",
                div : "myDivItemInIframe"
            }, {
                fn : this._testTemplateReloaded,
                scope : this
            });
        },

        _testTemplateReloaded : function () {
            this._restoreWindow();
        },

        _restoreWindow : function () {
            this._restoreAll();
            this.assertFalse(aria.utils.AriaWindow.isWindowUsed());
            aria.utils.AriaWindow.$unregisterListeners(this);
            this.checkExpectedEventListEnd();
            this.notifyTestEnd("testAsyncPageNavigation");
        },

        _restoreAll : function () {
            if (this._initialWindow) {
                aria.utils.AriaWindow.setWindow(this._initialWindow);
                this._initialWindow = null;
            }
            if (this.myIframe) {
                this.testArea.removeChild(this.myIframe);
                this.myIframe = null;
                this.testArea = null;
            }
        },

        tearDown : function () {
            // this makes sure everything is back to normal after the test even if it was interrupted
            this._restoreAll();
        }
    }
});
