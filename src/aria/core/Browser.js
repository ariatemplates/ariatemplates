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
 * @class aria.core.Browser Global class gathering information about current browser type and version
 * @extends aria.core.JsObject
 * @singleton
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
         * True if the browser is any version of Opera.
         * @type Boolean
         */
        this.isOpera = false;

        /**
         * True if the browser is Opera 6.
         * @type Boolean
         */
        this.isOpera6 = false;

        /**
         * True if the browser is Opera 8.
         * @type Boolean
         */
        this.isOpera8 = false;

        /**
         * True if the browser is Opera 9.
         * @type Boolean
         */
        this.isOpera9 = false;

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
         * True if the browser is any version of Netscape.
         * @type Boolean
         */
        this.isNS = false;

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
         * @type String
         */
        this.majorVersion = "";

        /**
         * Browser code : name+majorVersion
         * @type String
         */
        this.code = "";

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
                        var detectedIEVersion;

                        // PTR 05207453
                        // With compatibility view, it can become tricky to
                        // detect the version.
                        // What is important to detect here is the document mode
                        // (which defines how the browser really
                        // reacts), NOT the browser mode (how the browser says
                        // it reacts, through conditional comments
                        // and ua string)
                        // For this, we use a trick: defineProperty is not
                        // defined in IE 7, it is buggy in IE 8 and it
                        // works well in IE 9

                        if (Object.defineProperty) {
                            try {
                                var testVar = {};
                                Object.defineProperty(testVar, "a", {
                                    get : function () {}
                                });
                                // defineProperty exists and works: IE 9
                                detectedIEVersion = 9;
                            } catch (e) {
                                // defineProperty exists but does not work: IE 8
                                detectedIEVersion = 8;
                            }
                        } else {
                            // defineProperty does not exist: IE 7
                            detectedIEVersion = 7;
                        }
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
                if (ua.indexOf('opera 6') > -1) {
                    this.isOpera6 = true;
                } else if (ua.indexOf('opera/9') > -1) {
                    this.isOpera9 = true;
                } else if ((ua.indexOf('opera/8') > -1) || (ua.indexOf('opera 8') > -1)) {
                    this.isOpera8 = true;
                }
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
                if (ua.indexOf('netscape') > -1) {
                    this.name = "Netscape";
                    this.isNS = true;
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
            } else if (this.isNS) {
                if (/netscape[\/\s]((?:\d+\.?)+)/.test(ua)) {
                    this.version = RegExp.$1;
                }
            } else if (this.isOpera) {
                if (/opera[\/\s]((?:\d+\.?)+)/.test(ua)) {
                    this.version = RegExp.$1;
                }
            }

            if (this.version) {
                if (this.isFirefox) {
                    this.majorVersion = this.version.substring(0, 3);
                } else {
                    this.majorVersion = this.version.substring(0, 1);
                }
            }

            this.code = this.name + this.majorVersion; // browser code :
            // name+majorVersion
        }
    }
});
