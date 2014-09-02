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
 * This class is still experimental, its interface may change without notice. Implementation of the aria.jsunit.IRobot
 * interface through a Java applet. The Java applet is currently not distributed with Aria Templates, but it is used
 * internally when testing the framework to generate low-level mouse and keyboard events.
 * @private
 */
Aria.classDefinition({
    $classpath : 'aria.jsunit.RobotJavaApplet',
    $dependencies : ['aria.utils.Dom', 'aria.utils.AriaWindow', 'aria.utils.StringCallback'],
    $extends : 'aria.jsunit.RobotJava',
    $implements : ['aria.jsunit.IRobot'],
    $singleton : true,
    $constructor : function () {
        this.$RobotJava.constructor.call(this);
        this._robotInitialized = false;
        this._initStringCb = null;
        aria.utils.AriaWindow.$on({
            'unloadWindow' : this._reset,
            scope : this
        });
    },
    $destructor : function () {
        this._reset();
        aria.utils.AriaWindow.$unregisterListeners(this);
        this.$RobotJava.$destructor.call(this);
    },
    $events : {
        "appletInitialized" : "Raised when the applet is initialized."
    },
    $statics : {
        absoluteUrlRegExp : /^https?:\/\//
    },
    $prototype : {

        /**
         * Return true if the robot is most likely usable (Java enabled).
         */
        isUsable : function () {
            var navigator = Aria.$window.navigator;
            try {
                var res = navigator && navigator.javaEnabled();
                return !!res;
            } catch (e) {
                return false;
            }
        },

        /**
         * Initialize the robot, if not already done. This must be called before any other method on the robot.
         * @param {aria.core.CfgBeans:Callback} callback callback to be called when the robot is ready to be used.
         */
        initRobot : function (cb) {
            if (this.applet == null) {
                var document = Aria.$window.document;
                var jnlp = aria.core.DownloadMgr.resolveURL('aria/jsunit/robot-applet.jnlp');

                // Resolve the url depending on the base tag
                var baseTags = document.getElementsByTagName('head')[0].getElementsByTagName("base");
                if (baseTags && baseTags[0] && !this.absoluteUrlRegExp.test(jnlp)) {
                    var baseUrl = baseTags[0].getAttribute("href").replace(/[^\/.]+\.[^\/.]+$/, "").replace(/\/$/, "")
                            + "/";
                    jnlp = baseUrl + jnlp;
                }

                var applet = document.createElement("applet");

                var jnlpHrefParam = document.createElement("param");
                jnlpHrefParam.setAttribute("name", "jnlp_href");
                jnlpHrefParam.setAttribute("value", jnlp);
                applet.appendChild(jnlpHrefParam);

                var separateJvmParam = document.createElement("param");
                separateJvmParam.setAttribute("name", "separate_jvm");
                separateJvmParam.setAttribute("value", "true");
                applet.appendChild(separateJvmParam);

                var initCallbackParam = document.createElement("param");
                initCallbackParam.setAttribute("name", "initCallback");
                if (!this._initStringCb) {
                    this._initStringCb = aria.utils.StringCallback.createStringCallback({
                        scope : this,
                        fn : this._callCallback,
                        args : this._raiseInitEvent,
                        resIndex : -1
                    });
                }
                initCallbackParam.setAttribute("value", this._initStringCb);
                applet.appendChild(initCallbackParam);

                // insert the applet at a specific position (for correct coordinates computation)
                applet.setAttribute("width", "1");
                applet.setAttribute("height", "1");

                // Safari (and perhaps other browsers) does not support loading JNLP files, so in that case, we use the
                // old mechanism. Note that this mechanism does not allow to use Sikuli.
                var jar = aria.core.DownloadMgr.resolveURL('aria/jsunit/robot-applet.jar', true);
                applet.setAttribute("archive", jar);
                applet.setAttribute("code", "com.amadeus.ui.aria.robotapplet.RobotApplet");

                applet.style.cssText = "position:absolute;display:block;left:0px;top:0px;width:1px;height:1px;z-index:-1;";
                document.body.appendChild(applet);

                this.applet = applet;
                aria.utils.AriaWindow.attachWindow();
            }
            if (cb) {
                if (this._robotInitialized) {
                    this.$callback(cb);
                } else {
                    this.$onOnce({
                        "appletInitialized" : cb
                    });
                }
            }
        },

        _raiseInitEvent : function () {
            this._robotInitialized = true;
            this._initStringCb = null;
            this.$raiseEvent("appletInitialized");
        },

        _reset : function () {
            var applet = this.applet;
            if (applet != null) {
                var window = Aria.$window;
                window.document.body.removeChild(applet);
                if (!this._robotInitialized) {
                    this.$unregisterListeners();
                } else {
                    this._robotInitialized = false;
                }
                this.applet = null;
                aria.utils.AriaWindow.detachWindow();
            }
        },

        _updateAppletPosition : function (cb) {
            // keep the applet at position 0,0 (even when the window is scrolled)
            var applet = this.applet;
            // var document = applet.ownerDocument;
            var scrollPos = aria.utils.Dom._getDocumentScroll();
            applet.style.left = scrollPos.scrollLeft + "px";
            applet.style.top = scrollPos.scrollTop + "px";
            // after updating the applet position, it is needed to wait a bit,
            // otherwise calling getLocationOnScreen inside the applet returns wrong
            // results
            this._callCallback(cb);
        },

        absoluteMouseMove : function (position, cb) {
            this.applet.absoluteMouseMove(position.x, position.y);
            this._callCallback(cb);
        },

        mouseMove : function (position, cb) {
            var viewport = aria.utils.Dom._getViewportSize();
            if (position.x < 0 || position.y < 0 || position.x > viewport.width || position.y > viewport.height) {
                // FIXME: log error correctly
                this.$logWarn("MouseMove position outside of the viewport.");
                // return;
            }
            this._updateAppletPosition({
                fn : this._mouseMoveCb,
                args : {
                    position : position,
                    cb : cb
                }
            });
        },

        _mouseMoveCb : function (unused, args) {
            var position = args.position;
            this.applet.mouseMove(position.x, position.y);
            this._callCallback(args.cb);
        },

        smoothMouseMove : function (from, to, duration, cb) {
            var viewport = aria.utils.Dom._getViewportSize();
            if (from.x < 0 || from.y < 0 || from.x > viewport.width || from.y > viewport.height || to.x < 0 || to.y < 0
                    || to.x > viewport.width || to.y > viewport.height) {
                // FIXME: log error correctly
                this.$logWarn("smoothMouseMove from or to position outside of the viewport.");
                // return;
            }
            this._updateAppletPosition({
                fn : this._smoothMouseMoveCb,
                args : {
                    from : from,
                    to : to,
                    duration : duration,
                    cb : cb
                }
            });
        },

        _smoothMouseMoveCb : function (unused, args) {
            var from = args.from;
            var to = args.to;
            this.applet.smoothMouseMove(from.x, from.y, to.x, to.y, args.duration, aria.utils.StringCallback.createStringCallback({
                fn : this._callCallback,
                scope : this,
                args : args.cb,
                resIndex : -1
            }));
        },

        mousePress : function (buttons, cb) {
            this.applet.mousePress(buttons);
            this._callCallback(cb);
        },

        mouseRelease : function (buttons, cb) {
            this.applet.mouseRelease(buttons);
            this._callCallback(cb);
        },

        mouseWheel : function (wheelAmt, cb) {
            this.applet.mouseWheel(wheelAmt);
            this._callCallback(cb);
        },

        keyPress : function (keycode, cb) {
            this.applet.keyPress(keycode);
            this._callCallback(cb);
        },

        keyRelease : function (keycode, cb) {
            this.applet.keyRelease(keycode);
            this._callCallback(cb);
        },

        screenCapture : function (geometry, imageName, cb) {
            var viewport = aria.utils.Dom._getViewportSize();
            if (geometry.x < 0 || geometry.y < 0 || geometry.width < 0 || geometry.height < 0
                    || geometry.x + geometry.width > viewport.width || geometry.y + geometry.height > viewport.height) {
                // FIXME: log error correctly
                this.$logError("Screen capture area outside of the viewport.");
                return;
            }
            this._updateAppletPosition({
                fn : this._screenCaptureCb,
                args : {
                    geometry : geometry,
                    imageName : imageName,
                    cb : cb
                }
            });
        },

        _screenCaptureCb : function (unused, args) {
            var geometry = args.geometry;
            this.applet.screenCapture(geometry.x, geometry.y, geometry.width, geometry.height, args.imageName);
            this.$callback(args.cb);
        },

        compareImages : function (imageName1, imageName2) {
            return this.applet.compareImages(imageName1, imageName2);
        },

        loadImage : function (url, imageName) {
            this.applet.loadImage(url, imageName);
        },

        saveImage : function (imageName, storePath) {
            this.applet.saveImage(imageName, storePath);
        },

        _callCallback : function (cb) {
            aria.core.Timer.addCallback({
                fn : this.$callback,
                scope : this,
                args : cb,
                delay : 50
            });
        },

        getWin32Api : function () {
            return this.applet.getWin32Api();
        }
    }
});
