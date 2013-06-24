/* jshint maxparams:7 */
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
 * The ScreenCapture class is the API that allows to make screenshot-based integration tests from Javascript. It works
 * hand in hand with a Java Applet that needs to be present inside the page to allow communication with the remote
 * screen capture windows application. For the screencapture to work, you need to add an applet tag to your HTML page in
 * the following way:
 *
 * <pre>
 *         &lt;applet code='ScreenCaptureApplet.class' archive='ScreenCapture.jar' name='myTestApplet' width='1000' height='100' MAYSCRIPT&gt;&lt;/applet&gt;
 * </pre>
 *
 * And then instantiate the ScreenCapture class, passing it the name of the applet like so:
 *
 * <pre>
 * var sc = new ScreenCapture('myTestApplet');
 * </pre>
 */
Aria.classDefinition({
    $classpath : 'aria.jsunit.ScreenCapture',
    $dependencies : ['aria.jsunit.AppletWorker'],
    $singleton : true,
    $constructor : function () {
        /**
         * The applet object in the page
         * @type HTMLElement
         * @protected
         */
        this._applet = aria.jsunit.AppletWorker;
    },
    $destructor : function () {
        this._applet = null;
        delete this._applet;
    },
    $statics : {
        // ERROR MESSAGE:
        "MISSING_APPLET_WORKER" : "[Aria JsUnit] Missing applet communication bridge in %1"
    },
    $prototype : {
        /**
         * Prepare the actual string that is passed to the applet during an instruction. Also set the default values
         * that can be determined on the client side.
         * @param {String} type The type of isntruction
         * @param {String} useCaseName Name of the use case
         * @param {Number} x Start x coordinate of the capture (starting from the browser's internal border)
         * @param {Number} y Start y coordinate of the capture (starting from the browser's internal border)
         * @param {Number} width Width of the capture
         * @param {Number} height Height of the capture
         * @param {Number} threshold The threshold for image comparison to be used
         * @return {String} The constructed string
         * @private
         */
        _prepareInstructionString : function (type, useCaseName, x, y, width, height, threshold) {
            var document = Aria.$frameworkWindow.document;
            var s = [type, document.title, useCaseName, x || 0, y || 0, width || 0, height || 0, threshold || 0].join(";");
            return s;
        },

        /**
         * Capture a screenshot for a specific use case. A simple capture of the whole screen may be done like so:
         *
         * <pre>
         * sc.capture('homePageSimpleUseCase');
         * </pre>
         *
         * Specifying a custom area to capture:
         *
         * <pre>
         * sc.capture('homePageSimpleUseCase', {
         *     x : 50,
         *     y : 150,
         *     width : 500,
         *     height : 500
         * });
         * </pre>
         *
         * Subscribing a callback to be notified when the capture is done
         *
         * <pre>
         * sc.capture('homePageSimpleUseCase', {}, this.myCallbackMethod, this);
         * </pre>
         *
         * @param {String} useCaseName Name of the use case
         * @param {Object} conf The screenshot configuration object. It should be something like:
         *
         * <pre>
         *     {
         *         x : // Start x coordinate of the capture (starting from the browser's internal border)
         *         y : // Start y coordinate of the capture (starting from the browser's internal border)
         *         width : // Optional width of the capture, by default, the whole width of the browser will be captured
         *         height : // Optional height of the capture, by default, the whole height of the browser will be captured
         *         threshold : // Optional threshold for image comparison to be used, by default, 100% precision will be defined
         *     }
         * </pre>
         *
         * @param {Function} callback An option callback method to be executed when the screencapture server has
         * finished taking the image
         * @param {Object} callbackScope If a callback method was specified, optionally pass an object to be used as the
         * scope of the method
         */
        capture : function (args) {
            // useCaseName, conf, callback, callbackScope

            if (!this._applet.isReady()) {
                this.$logWarn(this.MISSING_APPLET_WORKER, this.$classpath);
                var console = Aria.$global.console;
                if (console) {
                    console.warn("Missing applet communication bridge in aria.jsunit.ScreenCapture");
                }
                return false;
            } else {

                var conf = args.conf;
                var instruction = this._prepareInstructionString("CAPTURE", args.useCaseName, conf.x, conf.y, conf.width, conf.height, conf.threshold);
                this._applet.sendInstruction({
                    instruction : instruction,
                    cb : args.oncomplete,
                    scope : args.scope,
                    args : args.args
                });
                conf = null;
                return true;
            }
        },

        /**
         * Get the applet response (after an instruction was requested)
         * @return {Object}
         *
         * <pre>
         *     {
         *         code : //(0=SUCCESS, 1=FAILURE),
         *         reason : // Error description...
         *     }
         * </pre>
         */
        getResponse : function () {
            if (!this._applet.isReady()) {
                this.$logError(this.MISSING_APPLET_WORKER, this.$classpath);
                return {
                    "code" : 1,
                    "reason" : "Missing applet worker"
                };
            } else {
                return this._applet.getResponse();
            }
        }
    }
});
