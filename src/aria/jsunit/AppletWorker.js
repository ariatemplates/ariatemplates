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
    var currAppletCb;
    var currAppletCbScope;
    var currAppletCbArgs;

    Aria.$global.AppletCallback = function () {
        if (currAppletCb != null) {
            currAppletCb.call(currAppletCbScope, currAppletCbArgs);
            currAppletCb = null;
            currAppletCbScope = null;
            currAppletCbArgs = null;
        }
    }

    /**
     * @class AppletWorker The AppletWorker class is the API that allows to use the applet as a communication bridge
     * between the javascript and external applications For the bridge to work you need to add an applet tag to your
     * HTML page in the following way:
     * @constructor
     * @param {String} appletName The name of the applet that was added the page
     */
    Aria.classDefinition({
        $classpath : 'aria.jsunit.AppletWorker',
        $singleton : true,
        $constructor : function () {
            this._applet = null;
            this._appletName = null;
            this._isReady = false;
        },
        $destructor : function () {
            // this._applet = null;
            // this._appletName = null;
            // this._isReady = null;
            // delete this._applet;
            // delete this._applet;
            // delete this._applet;
        },
        $prototype : {
            /**
             * Initializes the applet worker
             */
            init : function (divId) {
                /**
                 * The applet object in the page
                 * @type HTMLElement
                 * @private
                 */
                if (this._applet != null) {
                    // applet already initialized
                    return;
                } else {
                    this._appletName = 0;
                    this._applet = this._addApplet(divId);
                    this._isReady = true;

                    if (!this._applet) {
                        throw new Error(this._appletName + " applet was not found in the document");
                    }
                }
            },
            /**
             * Adds an applet instance to the HTML document
             * @param {String} divId The id of the div where applet should be stored
             */
            _addApplet : function (divId) {
                var d = Aria.$frameworkWindow.document.getElementById(divId);
                var s = "<APPLET name='myTestApplet' code='ScreenCaptureApplet.class' archive='ScreenCapture.jar' width='1000' height='100' MAYSCRIPT></APPLET>"
                d.innerHTML = s;
                return this._getApplet();
            },
            /**
             * Get the applet instance corresponding to the name passed
             * @param {String} appletName The name of the applet to find
             * @return {HTMLElement} The applet if found, null otherwise
             */
            _getApplet : function () {
                return Aria.$frameworkWindow.document.applets[this._appletName] || null;
            },
            /**
             * Accessor method to the applet
             * @param {String} instruction The instruction to pass to the applet
             */
            sendInstruction : function (args) {
                // store callback method and scope. Can only specify a string for a method
                // name when calling from an applet
                currAppletCb = args.cb;
                currAppletCbScope = args.scope;
                currAppletCbArgs = args.args;

                this._applet.setInstruction(args.instruction, "AppletCallback");
            },
            /**
             * Get the applet response (after an instruction was requested)
             * @return {Object} {"code":(0=SUCCESS, 1=FAILURE), "reason"="Error description..."}
             */
            getResponse : function () {
                var response = this._applet.getResponse();
                var code = 1;
                var reason = "No response yet - Retry later";
                if (response.indexOf(";") != -1) {
                    var parts = response.split(";");
                    code = parts[0];
                    if (parts.length > 1)
                        reason = parts[1];
                }
                return {
                    "code" : code,
                    "reason" : reason
                };
            },
            /**
             * Gets the valu stating whether the applet has been initialized and is ready to use
             * @return {Boolean}
             */
            isReady : function () {
                return this._isReady;
            }
        }
    });
})();