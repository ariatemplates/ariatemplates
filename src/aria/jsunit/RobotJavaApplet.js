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
    $implements : ['aria.jsunit.IRobot'],
    $singleton : true,
    $constructor : function () {
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
    },
    $events : {
        "appletInitialized" : "Raised when the applet is initialized."
    },
    $statics : {
        // Keyboard keys:
        KEYS : {
            VK_0 : 48,
            VK_1 : 49,
            VK_2 : 50,
            VK_3 : 51,
            VK_4 : 52,
            VK_5 : 53,
            VK_6 : 54,
            VK_7 : 55,
            VK_8 : 56,
            VK_9 : 57,
            VK_A : 65,
            VK_ACCEPT : 30,
            VK_ADD : 107,
            VK_AGAIN : 65481,
            VK_ALL_CANDIDATES : 256,
            VK_ALPHANUMERIC : 240,
            VK_ALT : 18,
            VK_ALT_GRAPH : 65406,
            VK_AMPERSAND : 150,
            VK_ASTERISK : 151,
            VK_AT : 512,
            VK_B : 66,
            VK_BACK_QUOTE : 192,
            VK_BACK_SLASH : 92,
            VK_BACK_SPACE : 8,
            VK_BEGIN : 65368,
            VK_BRACELEFT : 161,
            VK_BRACERIGHT : 162,
            VK_C : 67,
            VK_CANCEL : 3,
            VK_CAPS_LOCK : 20,
            VK_CIRCUMFLEX : 514,
            VK_CLEAR : 12,
            VK_CLOSE_BRACKET : 93,
            VK_CODE_INPUT : 258,
            VK_COLON : 513,
            VK_COMMA : 44,
            VK_COMPOSE : 65312,
            VK_CONTEXT_MENU : 525,
            VK_CONTROL : 17,
            VK_CONVERT : 28,
            VK_COPY : 65485,
            VK_CUT : 65489,
            VK_D : 68,
            VK_DEAD_ABOVEDOT : 134,
            VK_DEAD_ABOVERING : 136,
            VK_DEAD_ACUTE : 129,
            VK_DEAD_BREVE : 133,
            VK_DEAD_CARON : 138,
            VK_DEAD_CEDILLA : 139,
            VK_DEAD_CIRCUMFLEX : 130,
            VK_DEAD_DIAERESIS : 135,
            VK_DEAD_DOUBLEACUTE : 137,
            VK_DEAD_GRAVE : 128,
            VK_DEAD_IOTA : 141,
            VK_DEAD_MACRON : 132,
            VK_DEAD_OGONEK : 140,
            VK_DEAD_SEMIVOICED_SOUND : 143,
            VK_DEAD_TILDE : 131,
            VK_DEAD_VOICED_SOUND : 142,
            VK_DECIMAL : 110,
            VK_DELETE : 127,
            VK_DIVIDE : 111,
            VK_DOLLAR : 515,
            VK_DOWN : 40,
            VK_E : 69,
            VK_END : 35,
            VK_ENTER : 10,
            VK_EQUALS : 61,
            VK_ESCAPE : 27,
            VK_EURO_SIGN : 516,
            VK_EXCLAMATION_MARK : 517,
            VK_F : 70,
            VK_F1 : 112,
            VK_F10 : 121,
            VK_F11 : 122,
            VK_F12 : 123,
            VK_F13 : 61440,
            VK_F14 : 61441,
            VK_F15 : 61442,
            VK_F16 : 61443,
            VK_F17 : 61444,
            VK_F18 : 61445,
            VK_F19 : 61446,
            VK_F2 : 113,
            VK_F20 : 61447,
            VK_F21 : 61448,
            VK_F22 : 61449,
            VK_F23 : 61450,
            VK_F24 : 61451,
            VK_F3 : 114,
            VK_F4 : 115,
            VK_F5 : 116,
            VK_F6 : 117,
            VK_F7 : 118,
            VK_F8 : 119,
            VK_F9 : 120,
            VK_FINAL : 24,
            VK_FIND : 65488,
            VK_FULL_WIDTH : 243,
            VK_G : 71,
            VK_GREATER : 160,
            VK_H : 72,
            VK_HALF_WIDTH : 244,
            VK_HELP : 156,
            VK_HIRAGANA : 242,
            VK_HOME : 36,
            VK_I : 73,
            VK_INPUT_METHOD_ON_OFF : 263,
            VK_INSERT : 155,
            VK_INVERTED_EXCLAMATION_MARK : 518,
            VK_J : 74,
            VK_JAPANESE_HIRAGANA : 260,
            VK_JAPANESE_KATAKANA : 259,
            VK_JAPANESE_ROMAN : 261,
            VK_K : 75,
            VK_KANA : 21,
            VK_KANA_LOCK : 262,
            VK_KANJI : 25,
            VK_KATAKANA : 241,
            VK_KP_DOWN : 225,
            VK_KP_LEFT : 226,
            VK_KP_RIGHT : 227,
            VK_KP_UP : 224,
            VK_L : 76,
            VK_LEFT : 37,
            VK_LEFT_PARENTHESIS : 519,
            VK_LESS : 153,
            VK_M : 77,
            VK_META : 157,
            VK_MINUS : 45,
            VK_MODECHANGE : 31,
            VK_MULTIPLY : 106,
            VK_N : 78,
            VK_NONCONVERT : 29,
            VK_NUM_LOCK : 144,
            VK_NUMBER_SIGN : 520,
            VK_NUMPAD0 : 96,
            VK_NUMPAD1 : 97,
            VK_NUMPAD2 : 98,
            VK_NUMPAD3 : 99,
            VK_NUMPAD4 : 100,
            VK_NUMPAD5 : 101,
            VK_NUMPAD6 : 102,
            VK_NUMPAD7 : 103,
            VK_NUMPAD8 : 104,
            VK_NUMPAD9 : 105,
            VK_O : 79,
            VK_OPEN_BRACKET : 91,
            VK_P : 80,
            VK_PAGE_DOWN : 34,
            VK_PAGE_UP : 33,
            VK_PASTE : 65487,
            VK_PAUSE : 19,
            VK_PERIOD : 46,
            VK_PLUS : 521,
            VK_PREVIOUS_CANDIDATE : 257,
            VK_PRINTSCREEN : 154,
            VK_PROPS : 65482,
            VK_Q : 81,
            VK_QUOTE : 222,
            VK_QUOTEDBL : 152,
            VK_R : 82,
            VK_RIGHT : 39,
            VK_RIGHT_PARENTHESIS : 522,
            VK_ROMAN_CHARACTERS : 245,
            VK_S : 83,
            VK_SCROLL_LOCK : 145,
            VK_SEMICOLON : 59,
            VK_SEPARATOR : 108,
            VK_SHIFT : 16,
            VK_SLASH : 47,
            VK_SPACE : 32,
            VK_STOP : 65480,
            VK_SUBTRACT : 109,
            VK_T : 84,
            VK_TAB : 9,
            VK_U : 85,
            VK_UNDEFINED : 0,
            VK_UNDERSCORE : 523,
            VK_UNDO : 65483,
            VK_UP : 38,
            VK_V : 86,
            VK_W : 87,
            VK_WINDOWS : 524,
            VK_X : 88,
            VK_Y : 89,
            VK_Z : 90
        }
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
            var document = applet.ownerDocument;
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