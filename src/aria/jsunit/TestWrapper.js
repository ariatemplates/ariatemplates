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
var Aria = require("../Aria");
var ariaUtilsFrameATLoader = require("../utils/FrameATLoader");
var ariaJsunitAssert = require("./Assert");
var ariaCoreTimer = require("../core/Timer");
var ariaUtilsScriptLoader = require("../utils/ScriptLoader");


/**
 * Run tests in an isolated environment.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.jsunit.TestWrapper",
    $extends : ariaJsunitAssert,
    $constructor : function (testClasspath) {
        this.$Assert.constructor.call(this);
        this.$classpath = testClasspath;
    },
    $destructor : function () {
        this._removeFrame();
        this.$Assert.$destructor.call(this);
    },
    $prototype : {

        /**
         * Run the test.
         */
        run : function () {
            this._startTest();
            var document = Aria.$window.document;
            this._frame = document.createElement("iframe");
            this._frame.style.cssText = "opacity:0.6;filter:alpha(opacity=60);zoom:1;z-index:100000;position:absolute;left:0px;top:0px;width:1024px;height:768px;border:1px solid black;visibility:hidden;display:block;background-color:white;";
            document.body.appendChild(this._frame);
            this._subWindow = this._frame.contentWindow;
            this._injectExtraScriptsIntoFrame(this._subWindow, "before", {
                fn: this._loadAtInFrame,
                scope: this
            });
        },

        /**
         * Calls ATFrameLoader to load AT into the iframe
         */
        _loadAtInFrame : function () {
            ariaUtilsFrameATLoader.loadAriaTemplatesInFrame(this._frame, {
                fn : this._atLoadedInFrame,
                scope : this
            });
        },

        /**
         * Finds SCRIPT nodes of the top-level document that have specific `data-extrascript` attribute
         * and injects them into an iframe. If there are no such scripts, it does nothing.
         * It calls the callback
         * @param {Document} subDocument document element of the iframe
         * @param {String} whereToInsert expected value of `data-extrascript` attribute
         * @param {aria.core.CfgBeans.Callback} callback
         */
        _injectExtraScriptsIntoFrame : function (subWindow, whereToInsert, callback) {
            var document = Aria.$window.document;
            var subDocument = subWindow.document;
            var scripts = document.scripts || document.getElementsByTagName('script');

            var scriptsToLoad = [];
            for (var i = 0; i < scripts.length; i++) {
                var script = scripts[i];
                var extraScriptData = script.getAttribute("data-extrascript");
                if (extraScriptData == whereToInsert) {
                    var src = script.getAttribute("src");
                    if (!(/^((https?)|(\/\/))/.test(src))) {
                        src = "//" + document.location.host + src;
                    }
                    scriptsToLoad.push(src);
                }
            }

            if (scriptsToLoad.length === 0) {
                this.$callback(callback);
            } else {
                ariaUtilsScriptLoader.load(scriptsToLoad, callback, {
                    document: subDocument
                });
            }
        },

        /**
         * Called when Aria Templates is loaded in the iframe.
         * @param {Object} res
         */
        _atLoadedInFrame : function (res) {
            if (!res.success) {
                this.raiseFailure("An error occurred while loading the framework in the iframe.");
                this._end();
                return;
            }
            this._injectExtraScriptsIntoFrame(this._subWindow, "after", {
                fn: this._extraScriptsAfterLoadedInFrame,
                scope: this
            });
        },

        /**
         * Called after the "after" extrascripts (if any) were injected into the DOM of the iframe
         */
        _extraScriptsAfterLoadedInFrame : function () {
            var subWindow = this._subWindow;
            var subAria = subWindow.Aria;
            var subDocument = subWindow.document;
            var testArea = subDocument.createElement('div');
            testArea.setAttribute('id', 'TESTAREA');
            subDocument.body.appendChild(testArea);
            var testClass = Aria.getClassRef(this.$classpath);
            if (testClass.prototype.needVisibleDocument) {
                // note that this has to be done before loading the test itself (otherwise, loading SynEvents in IE
                // fails)
                this._frame.style.visibility = "visible";
            }
            subAria.load({
                classes : [this.$classpath],
                oncomplete : {
                    fn : this._loadTestComplete,
                    scope : this
                },
                onerror : {
                    fn : this._loadTestError,
                    scope : this
                }
            });
        },

        /**
         * Called if the load of the test failed.
         */
        _loadTestError : function () {
            this.raiseFailure("An error occurred while loading the test class.");
            this._end();
        },

        /**
         * Called when the test is loaded in the iframe.
         */
        _loadTestComplete : function () {
            var Aria = this._subWindow.Aria;
            // var aria = this._subWindow.aria;
            this._testInstance = Aria.getClassInstance(this.$classpath);
            this._testInstance.$on({
                '*' : this._testEvent,
                scope : this
            });

            if (this.demoMode) {
                this._testInstance.demoMode = true;
            }

            this._testInstance.run();
        },

        handleAsyncTestError : function (error) {
            this.raiseFailure("Test was interrupted.");
            this._end();
        },

        /**
         * Handle events raised by the test in the iframe.
         * @param {Object} evt
         */
        _testEvent : function (evt) {
            if (evt.name == "error") {
                this.raiseError(evt.exception, evt.msg);
            } else if (evt.name == "failure") {
                this.raiseFailure(evt.description);
            } else if (evt.name == "stateChange") {
                this._updateAssertInfo(evt.testState);
            } else if (evt.name == "start") {
                // nothing to do
            } else if (evt.name == "end") {
                this._totalAssertCount = evt.nbrOfAsserts;
                this._testsCount = this._testInstance._testsCount;
                ariaCoreTimer.addCallback({
                    fn : this._end,
                    scope : this,
                    delay : 100
                });
            }
        },

        /**
         * Dispose the framework in the iframe if possible and remove then the iframe.
         */
        _removeFrame : function () {
            if (!this._frame) {
                return;
            }
            // Here, we are using Aria["eval"] in the sub window because otherwise, any exception raised by the test
            // $dispose method or Aria.dispose cannot be caught on IE7
            if (this._subWindow.Aria && this._subWindow.Aria["eval"]) {
                var disposeResult = this._subWindow.Aria["eval"]("(function () { try { if (this._testInstance) {this._testInstance.$dispose();} return Aria.dispose(); } catch (e) { return { error: e }; }}).call(arguments[2])", null, this);
                this._testInstance = null;
                if (disposeResult) {
                    if (disposeResult.error) {
                        this.raiseError(disposeResult.error, "An exception occurred while disposing the test or the framework.");
                    } else if (disposeResult.nbNotDisposed !== 0) {
                        var undisposed = disposeResult.notDisposed;
                        var msg = ["There were ", disposeResult.nbNotDisposed, " undisposed objects ("];
                        var first = true;
                        for (var i in undisposed) {
                            if (undisposed.hasOwnProperty(i)) {
                                if (first) {
                                    first = false;
                                } else {
                                    msg.push(", ");
                                }
                                msg.push(undisposed[i].$classpath);
                            }
                        }
                        msg.push(")");
                        this.raiseFailure(msg.join(''));
                    }
                }
            }
            var body = Aria.$window.document.body;
            body.removeChild(this._frame);
            this._subWindow = null;
            this._frame = null;
        },

        /**
         * Ends the test.
         */
        _end : function () {
            this._removeFrame();
            this._endTest();
        }

    }
});
