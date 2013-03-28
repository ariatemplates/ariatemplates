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

    var logs = [];

    Aria.classDefinition({
        $classpath : "test.aria.utils.History",
        $extends : "aria.jsunit.TestCase",
        $dependencies : ["aria.utils.FrameATLoader"],
        $constructor : function () {
            this.$TestCase.constructor.apply(this, arguments);
            this._newWindow = null;
            this._history = null;
            this._onpopstateCB = {
                fn : this._onpopstate,
                scope : this
            };
            /* BACKWARD-COMPATIBILITY-BEGIN-#441 */
            this._onpopstateCBBC = {
                fn : this._onpopstateBC,
                scope : this
            };
            /* BACKWARD-COMPATIBILITY-END-#441 */

            var browser = aria.core.Browser;
            var version = parseInt(browser.majorVersion, 10);
            this._testInIframe = !((browser.isIE && version < 10) || (browser.isSafari && browser.environment == "Windows"));
            this._stopTestBeforeNavigation = browser.isIE7 || browser.isPhantomJS;
            this._delayAfterNavigation = 100;
        },
        $destructor : function () {
            this._newWindow = null;
            this._history = null;
            logs = null;
            this._onpopstateCB = null;
            this.$TestCase.$destructor.apply(this, arguments);
        },
        $prototype : {

            testAsyncLoadIFrame : function () {
                var newWindow = null, ifrm = null;
                logs = [];
                if (this._testInIframe) {
                    ifrm = Aria.$window.document.createElement("IFRAME");
                    ifrm.setAttribute("id", "myIframe");
                    ifrm.style.width = "1px";
                    ifrm.style.height = "1px";
                    Aria.$window.document.body.appendChild(ifrm);
                    this._iframe = ifrm;
                } else {
                    newWindow = Aria.$window.open();
                    this._newWindow = newWindow;
                }

                aria.utils.FrameATLoader.loadAriaTemplatesInFrame(newWindow || ifrm, {
                    fn : this._iframeDone,
                    scope : this
                });
            },

            _iframeDone : function () {
                if (this._testInIframe) {
                    this._newWindow = this._iframe.contentWindow;
                }
                this._newWindow.aria.core.Log.addAppender(aria.core.Log.getAppenders()[0]);
                this._newWindow.document.title = "HistoryTest";

                this.waitFor({
                    condition : function () {
                        try {
                            return !!this._newWindow.Aria.load;
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

                this._newWindow.Aria.load({
                    classes : ['aria.utils.History'],
                    oncomplete : {
                        fn : this.startTest,
                        scope : this
                    }
                });
            },

            startTest : function () {
                this._history = this._newWindow.aria.utils.History;
                this._history.isBackwardCompatible = false;
                this._history.$on({
                    "onpopstate" : this._onpopstateCB
                });
                this._checkState(null);// 2
                this._checkTitle("HistoryTest");// 4
                this._history.pushState({
                    myData : "aaa"
                }, "aaa", "abcde");

                this._checkTitle("aaa");// 6
                this._checkState({
                    myData : "aaa"
                });// 8
                this._checkUrl("abcde");// 10
                this._history.pushState({
                    myData : "bbb"
                }, "bbb", "fghi");
                this._checkTitle("bbb");// 12
                this._checkState({
                    myData : "bbb"
                });// 14
                this._checkUrl("fghi");// 16
                if (this._stopTestBeforeNavigation) {
                    this._finalizeTest("testAsyncLoadIFrame");

                } else {
                    this._history.back();
                    aria.core.Timer.addCallback({
                        fn : this._afterFirstBack,
                        scope : this,
                        delay : this._delayAfterNavigation
                    });
                }
            },

            _afterFirstBack : function () {
                this._checkTitle("aaa");// 18
                this._checkState({
                    myData : "aaa"
                });// 20
                this._checkUrl("abcde");// 22
                this._checkLogs(0, {
                    myData : "aaa"
                });// 23

                this._history.back();
                aria.core.Timer.addCallback({
                    fn : this._afterSecondBack,
                    scope : this,
                    delay : this._delayAfterNavigation
                });
            },

            _afterSecondBack : function () {
                var url = this._newWindow.location.href.replace(/#$/, "");
                this._checkTitle("HistoryTest");// 25
                this._checkState(null);
                this._checkLogs(1, null);

                this._history.go(+2);
                aria.core.Timer.addCallback({
                    fn : this._afterFirstGo,
                    scope : this,
                    delay : this._delayAfterNavigation
                });
            },

            _afterFirstGo : function () {
                this._checkTitle("bbb");
                this._checkState({
                    myData : "bbb"
                });
                this._checkUrl("fghi");
                this._checkLogs(2, {
                    myData : "bbb"
                });

                this._history.go(-1);
                aria.core.Timer.addCallback({
                    fn : this._afterSecondGo,
                    scope : this,
                    delay : this._delayAfterNavigation
                });
            },

            _afterSecondGo : function () {
                this._checkTitle("aaa");
                this._checkState({
                    myData : "aaa"
                });
                this._checkUrl("abcde");
                this._checkLogs(3, {
                    myData : "aaa"
                });

                this._history.replaceState({
                    myData : "ccc"
                }, "ccc", "lm/no");
                this._checkTitle("ccc");
                this._checkState({
                    myData : "ccc"
                });
                this._checkUrl("lm/no");

                this._history.back();
                aria.core.Timer.addCallback({
                    fn : this._afterThirdBack,
                    scope : this,
                    delay : this._delayAfterNavigation
                });
            },

            _afterThirdBack : function () {
                this._checkTitle("HistoryTest");
                this._checkState(null);
                this._checkLogs(4, null);

                this._history.forward();
                aria.core.Timer.addCallback({
                    fn : this._afterFirstForward,
                    scope : this,
                    delay : this._delayAfterNavigation
                });
            },

            _afterFirstForward : function () {

                var browser = aria.core.Browser;
                if (!(browser.isSafari && browser.environment == "Windows")) {
                    this._checkTitle("ccc");
                    this._checkState({
                        myData : "ccc"
                    });
                    this._checkUrl("lm/no");
                    this._checkLogs(5, {
                        myData : "ccc"
                    });
                }
                this._finalizeTest("testAsyncLoadIFrame");

            },

            _checkTitle : function (title) {
                this.assertEquals(this._newWindow.document.title, title);
                this.assertEquals(this._history.getTitle(), title);
            },

            _checkState : function (state) {

                if (state == null) {
                    this.assertTrue(this._history.getState() == state);
                    this.assertTrue(this._history.state == state);

                } else {
                    this.assertJsonEquals(this._history.getState(), state);
                    this.assertJsonEquals(this._history.state, state);
                }
            },

            _checkUrl : function (url) {
                this.assertTrue(this._newWindow.location.href.match(url) !== null);
                this.assertEquals(this._history.getUrl(), url);
            },

            _checkLogs : function (index, state) {
                this.assertJsonEquals(logs[index], state);
            },

            _onpopstate : function (evt) {
                logs.push(evt.state);
            },

            _finalizeTest : function (testName) {
                if (this._testInIframe) {
                    Aria.$window.document.body.removeChild(this._iframe);
                } else {
                    this._newWindow.close();
                }
                this.notifyTestEnd(testName);
            }

            /* BACKWARD-COMPATIBILITY-BEGIN-#441 */
            ,
            testAsyncLoadIFrameBackwardCompatible : function () {
                logs = [];
                var newWindow = null, ifrm = null;
                if (this._testInIframe) {
                    ifrm = Aria.$window.document.createElement("IFRAME");
                    ifrm.setAttribute("id", "myIframe");
                    ifrm.style.width = "1px";
                    ifrm.style.height = "1px";
                    Aria.$window.document.body.appendChild(ifrm);
                    this._iframe = ifrm;
                } else {
                    newWindow = Aria.$window.open();
                    this._newWindow = newWindow;
                }

                aria.utils.FrameATLoader.loadAriaTemplatesInFrame(newWindow || ifrm, {
                    fn : this._iframeDoneBC,
                    scope : this
                });
            },

            _iframeDoneBC : function () {
                if (this._testInIframe) {
                    this._newWindow = this._iframe.contentWindow;
                }
                this._newWindow.aria.core.Log.addAppender(aria.core.Log.getAppenders()[0]);
                this._newWindow.document.title = "HistoryTest";

                this.waitFor({
                    condition : function () {
                        try {
                            return !!this._newWindow.Aria.load;
                        } catch (ex) {
                            return false;
                        }
                    },
                    callback : {
                        fn : this._waitForAriaLoadBC,
                        scope : this
                    }
                });
            },

            _waitForAriaLoadBC : function () {

                this._newWindow.Aria.load({
                    classes : ['aria.utils.History'],
                    oncomplete : {
                        fn : this.startTestBC,
                        scope : this
                    }
                });
            },

            startTestBC : function () {
                this._history = this._newWindow.aria.utils.History;
                this._history.isBackwardCompatible = true;
                this._history.$on({
                    "onpopstate" : this._onpopstateCBBC
                });
                this._checkStateBC(null);
                this._checkTitle("HistoryTest");

                this._history.pushState({
                    myData : "aaa"
                }, "aaa", "abcde");

                this._checkTitle("aaa");
                this._checkStateBC({
                    myData : "aaa"
                });
                this._checkUrlBC("abcde");
                this._checkLogsBC(0, {
                    myData : "aaa"
                });

                this._history.pushState({
                    myData : "bbb"
                }, "bbb", "fghi");

                this._checkTitle("bbb");
                this._checkStateBC({
                    myData : "bbb"
                });
                this._checkUrlBC("fghi");
                this._checkLogsBC(1, {
                    myData : "bbb"
                });

                if (this._stopTestBeforeNavigation) {
                    this._finalizeTest("testAsyncLoadIFrameBackwardCompatible");

                } else {
                    this._history.back();
                    aria.core.Timer.addCallback({
                        fn : this._afterFirstBackBC,
                        scope : this,
                        delay : this._delayAfterNavigation
                    });
                }
            },

            _afterFirstBackBC : function () {
                this._checkTitle("aaa");
                this._checkStateBC({
                    myData : "aaa"
                });
                this._checkUrlBC("abcde");
                this._checkLogsBC(2, {
                    myData : "aaa"
                });

                this._history.back();
                aria.core.Timer.addCallback({
                    fn : this._afterSecondBackBC,
                    scope : this,
                    delay : this._delayAfterNavigation
                });
            },

            _afterSecondBackBC : function () {
                var url = this._newWindow.location.href.replace(/#$/, "");
                this._checkTitle("HistoryTest");
                this._checkStateBC(null);
                this._checkLogsBC(3, {});

                this._history.go(+2);
                aria.core.Timer.addCallback({
                    fn : this._afterFirstGoBC,
                    scope : this,
                    delay : this._delayAfterNavigation
                });
            },

            _afterFirstGoBC : function () {
                this._checkTitle("bbb");
                this._checkStateBC({
                    myData : "bbb"
                });
                this._checkUrlBC("fghi");
                this._checkLogsBC(4, {
                    myData : "bbb"
                });

                this._history.go(-1);
                aria.core.Timer.addCallback({
                    fn : this._afterSecondGoBC,
                    scope : this,
                    delay : this._delayAfterNavigation
                });
            },

            _afterSecondGoBC : function () {
                this._checkTitle("aaa");
                this._checkStateBC({
                    myData : "aaa"
                });
                this._checkUrlBC("abcde");
                this._checkLogsBC(5, {
                    myData : "aaa"
                });

                this._history.replaceState({
                    myData : "ccc"
                }, "ccc", "lm/no");
                this._checkTitle("ccc");
                this._checkStateBC({
                    myData : "ccc"
                });
                this._checkUrlBC("lm/no");
                this._checkLogsBC(6, {
                    myData : "ccc"
                });

                this._history.back();
                aria.core.Timer.addCallback({
                    fn : this._afterThirdBackBC,
                    scope : this,
                    delay : this._delayAfterNavigation
                });
            },

            _afterThirdBackBC : function () {
                this._checkTitle("HistoryTest");
                this._checkStateBC(null);
                this._checkLogsBC(7, {});

                this._history.forward();
                aria.core.Timer.addCallback({
                    fn : this._afterFirstForwardBC,
                    scope : this,
                    delay : this._delayAfterNavigation
                });
            },

            _afterFirstForwardBC : function () {

                var browser = aria.core.Browser;
                if (!(browser.isSafari && browser.environment == "Windows")) {
                    this._checkTitle("ccc");
                    this._checkStateBC({
                        myData : "ccc"
                    });
                    this._checkUrlBC("lm/no");
                    this._checkLogsBC(8, {
                        myData : "ccc"
                    });
                }

                this.assertErrorInLogs(this._history.DEPRECATED_ONPOPSTATE, 3);
                this._finalizeTest("testAsyncLoadIFrameBackwardCompatible");

            },

            _checkStateBC : function (state) {

                if (state == null) {
                    this.assertJsonEquals(this._history.getState().data, {});
                } else {
                    this.assertJsonEquals(this._history.getState().data, state);
                }
            },

            _checkUrlBC : function (url) {
                this.assertTrue(this._newWindow.location.href.match(url) !== null);
            },

            _checkLogsBC : function (index, state) {
                this.assertJsonEquals(logs[index].data, state);
            },

            _onpopstateBC : function (evt) {
                logs.push(evt.state);
            }
            /* BACKWARD-COMPATIBILITY-END-#441 */

        }
    });

})();