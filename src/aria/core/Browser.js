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
 * @singleton
 * Global class gathering information about current browser type and version
 * A list of user agent string for mobile phones could be find here:
 * http://www.useragentstring.com/pages/Mobile%20Browserlist/
 */
Aria.classDefinition({
    $classpath : 'aria.core.Browser',
    $singleton : true,
    $constructor : function () {
        var navigator = Aria.$global.navigator;
        var ua = navigator ? navigator.userAgent.toLowerCase() : "";

        /**
         * The user agent string.
         * @type String
         */
        this.ua = ua;

        /**
         * True if the browser is any version of Internet Explorer.
         * @type Boolean
         */
        this.isIE = false;

        /**
         * True if the browser is Internet Explorer 6.
         * @type Boolean
         */
        this.isIE6 = false;

        /**
         * True if the browser is Internet Explorer 7.
         * @type Boolean
         */
        this.isIE7 = false;

        /**
         * True if the browser is Internet Explorer 8.
         * @type Boolean
         */
        this.isIE8 = false;

        /**
         * True if the browser is Internet Explorer 9.
         * @type Boolean
         */
        this.isIE9 = false;

        /**
         * True if the browser is Internet Explorer 10.
         * @type Boolean
         */
        this.isIE10 = false;

        /**
         * True if the browser is any version of Opera.
         * @type Boolean
         */
        this.isOpera = false;

        /**
         * True if the browser is any version of Chrome.
         * @type Boolean
         */
        this.isChrome = false;

        /**
         * True if the browser is any version of Safari.
         * @type Boolean
         */
        this.isSafari = false;

        /**
         * True if the browser is any version of Chrome or Safari.
         * @type Boolean
         */
        this.isWebkit = false;

        /**
         * True if the browser uses the Gecko engine.
         * @type Boolean
         */
        this.isGecko = false;

        /**
         * True if the browser is any version of Firefox.
         * @type Boolean
         */
        this.isFirefox = false;

        /**
         * Browser version.
         * @type String
         */
        this.version = "";

        /**
         * True if the operating systems is Windows.
         * @type Boolean
         */
        this.isWindows = false;

        /**
         * True if the operating systems is Mac.
         * @type Boolean
         */
        this.isMac = false;

        /**
         * Browser name.
         * @type String
         */
        this.name = "";

        /**
         * MacOS or Windows
         * @type String
         */
        this.environment = "";

        /**
         * Major version.
         * @type Integer
         */
        this.majorVersion = "";

        this._init();
    },
    $prototype : {
        /**
         * Returns browser name and version - ease debugging
         */
        toString : function () {
            return this.name + " " + this.version;
        },
        /**
         * Internal initialization function - automatically called when the object is created
         * @private
         */
        _init : function () {
            // browser determination
            var ua = this.ua;
            if (ua.indexOf('msie') > -1) {
                this.isIE = true;
                this.name = "IE";
                if (/msie[\/\s]((?:\d+\.?)+)/.test(ua)) {
                    this.version = RegExp.$1;
                    var ieVersion = parseInt(this.version, 10);

                    if (ieVersion == 6) {
                        this.isIE6 = true;
                    } else if (ieVersion >= 7) {
                        // PTR 05207453
                        // With compatibility view, it can become tricky to
                        // detect the version.
                        // What is important to detect here is the document mode
                        // (which defines how the browser really
                        // reacts), NOT the browser mode (how the browser says
                        // it reacts, through conditional comments
                        // and ua string).
                        //
                        // In IE7 document.documentMode is undefined. For IE8+
                        // (also in document modes emulating IE7) it is defined
                        // and readonly.

                        var document = Aria.$frameworkWindow.document;
                        var detectedIEVersion = document.documentMode || 7;
                        this["isIE" + detectedIEVersion] = true;
                        if (detectedIEVersion != ieVersion) {
                            // the browser is not what it claims to be!
                            // make sure this.version is consistent with isIE...
                            // variables
                            this.version = detectedIEVersion + ".0";
                        }
                    }
                }
            } else if (ua.indexOf('opera') > -1) {
                this.isOpera = true;
                this.name = "Opera";
            } else if (ua.indexOf('chrome') > -1) {
                this.isChrome = true;
                this.name = "Chrome";
            } else if (ua.indexOf('webkit') > -1) {
                this.isSafari = true;
                this.name = "Safari";
            } else {
                if (ua.indexOf('gecko') > -1) {
                    this.isGecko = true;
                }
                if (ua.indexOf('firefox') > -1) {
                    this.name = "Firefox";
                    this.isFirefox = true;
                }
            }

            // common group for webkit-based browsers
            this.isWebkit = this.isSafari || this.isChrome;

            if (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1) {
                this.isWindows = true;
                this.environment = "Windows";
            } else if (ua.indexOf("macintosh") != -1) {
                this.isMac = true;
                this.environment = "MacOS";
            }

            // version determination
            if (this.isIE) {
                // already determined
            } else if (this.isFirefox) {
                if (/firefox[\/\s]((?:\d+\.?)+)/.test(ua)) {
                    this.version = RegExp.$1;
                }
            } else if (this.isSafari) {
                if (/version[\/\s]((?:\d+\.?)+)/.test(ua)) {
                    this.version = RegExp.$1;
                }
            } else if (this.isChrome) {
                if (/chrome[\/\s]((?:\d+\.?)+)/.test(ua)) {
                    this.version = RegExp.$1;
                }
            } else if (this.isOpera) {
                if (/version[\/\s]((?:\d+\.?)+)/.test(ua)) {
                    this.version = RegExp.$1;
                }
            }
            if (this.version) {
                if (/(\d+)\./.test(this.version)) {
                    this.majorVersion = parseInt(RegExp.$1, 10);
                }
            }
        }
    }
});
