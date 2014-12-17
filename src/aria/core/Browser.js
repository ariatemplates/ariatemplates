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
var UserAgent = require("./useragent/UserAgent");
var ariaUtilsArray = require("../utils/Array");

/**
 * Global class gathering information about current browser.
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.core.Browser',
    $singleton : true,

    $constructor : function () {
        /**
         * Cache for the supported CSS styles.
         * @type Object
         * @private
         */
        this._styleCache = {};

        /**
         * Cache for properties computed by <em>init</em> for a given user agent.
         * @type Object
         * @private
         */
        this._propertiesCache = {};

        ////////////////////////////////////////////////////////////////////////
        // User agent
        ////////////////////////////////////////////////////////////////////////

        /**
         * The user agent.
         * @type String
         */
        this.ua = "";



        ////////////////////////////////////////////////////////////////////////
        // Browser
        ////////////////////////////////////////////////////////////////////////

        /**
         * Browser name.
         * @type String
         */
        this.name = "";

        /**
         * Browser version.
         * @type String
         */
        this.version = "";

        /**
         * Browser major version.
         * @type Integer
         */
        this.majorVersion = 0;



        /**
         * <em>true</em> if the browser is any version of Internet Explorer.
         * @type Boolean
         */
        this.isIE = false;

        /**
         * <em>true</em> if the browser is Internet Explorer 7.
         * @type Boolean
         */
        this.isIE7 = false;

        /**
         * <em>true</em> if the browser is Internet Explorer 8.
         * @type Boolean
         */
        this.isIE8 = false;

        /**
         * <em>true</em> if the browser is Internet Explorer 9.
         * @type Boolean
         */
        this.isIE9 = false;

        /**
         * <em>true</em> if the browser is Internet Explorer 10.
         * @type Boolean
         */
        this.isIE10 = false;

        /**
         * <em>true</em> if the browser is Internet Explorer 11.
         * @type Boolean
         */
        this.isIE11 = false;

        /**
         * <em>true</em> if the browser is Internet Explorer 10 or less.
         * @type Boolean
         */
        this.isOldIE = false;

        /**
         * <em>true</em> if the browser is Internet Explorer 11 or more.
         * @type Boolean
         */
        this.isModernIE = false;

        /**
         * <em>true</em> if the browser is any version of Firefox.
         * Some reference: http://hacks.mozilla.org/2010/09/final-user-agent-string-for-firefox-4/
         * @type Boolean
         */
        this.isFirefox = false;

        /**
         * <em>true</em> if the browser is any version of Chrome.
         * @type Boolean
         */
        this.isChrome = false;

        /**
         * <em>true</em> if the browser is any version of Safari.
         * @type Boolean
         */
        this.isSafari = false;

        /**
         * <em>true</em> if the browser is any version of Opera.
         * @type Boolean
         */
        this.isOpera = false;

        /**
         * <em>true</em> if the browser is any version of BlackBerry.
         * @type Boolean
         */
        this.isBlackBerryBrowser = false;

        /**
         * <em>true</em> if the browser is any version of Android.
         * @type Boolean
         */
        this.isAndroidBrowser = false;

        /**
         * <em>true</em> if the browser is any version of Safari Mobile.
         * @type Boolean
         */
        this.isSafariMobile = false;

        /**
         * <em>true</em> if the browser is any version of IE Mobile.
         * @type Boolean
         */
        this.isIEMobile = false;

        /**
         * <em>true</em> if the browser is any version of Opera Mobile.
         * @type Boolean
         */
        this.isOperaMobile = false;

        /**
         * <em>true</em> if the browser is any version of Opera Mini.
         * @type Boolean
         */
        this.isOperaMini = false;

        /**
         * <em>true</em> if the browser is any version of S60.
         * @type Boolean
         */
        this.isS60 = false;

        /**
         * <em>true</em> if the browser is any version of PhantomJS.
         * @type Boolean
         */
        this.isPhantomJS = false;

        /**
         * <em>true</em> if browser is not a known one.
         * @type Boolean
         */
        this.isOtherBrowser = false;



        ////////////////////////////////////////////////////////////////////////
        // Rendering engine
        ////////////////////////////////////////////////////////////////////////

        /**
         * <em>true</em> if the rendering engine is Webkit.
         * @type Boolean
         */
        this.isWebkit = false;

        /**
         * <em>true</em> if the rendering engine is Gecko.
         * @type Boolean
         */
        this.isGecko = false;



        ////////////////////////////////////////////////////////////////////////
        // OS
        ////////////////////////////////////////////////////////////////////////

        /**
         * Name of the operating system on which the browser runs.
         * @type String
         */
        this.osName = "";

        /**
         * Version of the operating system on which the browser runs.
         * @type String
         */
        this.osVersion = "";



        /**
         * <em>true</em> if the operating system is Windows.
         * @type Boolean
         */
        this.isWindows = false;

        /**
         * <em>true</em> if the operating system is Mac OS.
         * @type Boolean
         */
        this.isMac = false;

        /**
         * <em>true</em> if operating system is iOS.
         * @type Boolean
         */
        this.isIOS = false;

        /**
         * <em>true</em> if operating system is Android.
         * @type Boolean
         */
        this.isAndroid = false;

        /**
         * <em>true</em> if operating system is Windows.
         * @type Boolean
         */
        this.isWindowsPhone = false;

        /**
         * <em>true</em> if operating system is BlackBerry.
         * @type Boolean
         */
        this.isBlackBerry = false;

        /**
         * <em>true</em> if operating system is Symbian.
         * @type Boolean
         */
        this.isSymbian = false;

        /**
         * <em>true</em> if operating system is not a known one.
         * @type Boolean
         */
        this.isOtherOS = false;



        ////////////////////////////////////////////////////////////////////////
        // Mobile browser specific properties
        //
        // Only for Window Phone with IE+9
        ////////////////////////////////////////////////////////////////////////

        // Only for Window Phone with IE+9
        /**
         * <em>true</em> if view type is Mobile.
         * @type Boolean
         */
        this.isMobileView = false;

        /**
         * <em>true</em> if view type is Desktop.
         * @type Boolean
         */
        this.isDesktopView = false;



        ////////////////////////////////////////////////////////////////////////
        // Initialization
        ////////////////////////////////////////////////////////////////////////

        this.init();
    },

    $prototype : {
        /**
         * Tells whether property descriptors are fully supported by the <b>running</b> browser or not.
         *
         * @return {Boolean} <em>true</em> if property descriptors are fully supported, <em>false</em> otherwise.
         */
        supportsPropertyDescriptors : function() {
            var userAgentWrapper = UserAgent.getUserAgentInfo();
            var runningBrowser = this._getProperties(userAgentWrapper);
            return !(Object.defineProperty == null || runningBrowser.isIE8);
        },

        /**
         * Sets the flag corresponding to the given name to the given state.
         *
         * <p>
         * Setting a flag corresponds to assigning its state value to a property whose name is built with <em>_buildFlagName</em>.
         * </p>
         *
         * <p>
         * If no explicit state is given, true is assumed.
         * </p>
         *
         * @param {Object} receiver The object receiving the resulting property
         * @param {String} name The name of the flag
         * @param {Boolean} state The state of the flag
         *
         * @return {Boolean} The final state of the flag.
         *
         * @private
         */
        _setFlag : function(receiver, name, state) {
            if (state == null) {
                state = true;
            }

            var flagName = this._buildFlagName(name);
            receiver[flagName] = state;

            return state;
        },

        /**
         * Builds a flag name for the given name.
         *
         * <p>
         * The flag name is built by:
         * <ul>
         *     <li>capitalizing the name</li>
         *     <li>prepending it with <em>"is"</em></li>
         * </ul>
         * </p>
         *
         * @param {String} name The name for this flag.
         *
         * @return {String} The flag name.
         *
         * @private
         */
        _buildFlagName : function (name) {
            return "is" + this._capitalize(name);
        },

        /**
         * Capitalizes the given string.
         *
         * <p>
         * Capitalizing means concerting the first letter to upper case, leaving all the others untouched.
         * </p>
         *
         * @param {String} string The string to capitalize.
         *
         * @return {String} The capitalized string
         *
         * @private
         */
        _capitalize : function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },

        /**
         * Imports an object into another.
         *
         * <p>
         * Own properties from given source are copied into given destination.
         * </p>
         *
         * @param {Object} source The source object from which properties should be read.
         * @param {Object} destination The object receiving the properties. Defaults to <em>this</em>.
         *
         * @return {Object} The destination object.
         *
         * @private
         */
        _import : function(source, destination) {
            // -------------------------------------------- arguments processing

            if (destination == null) {
                destination = this;
            }

            // ------------------------------------------------------ processing

            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    destination[key] = source[key];
                }
            }

            // ---------------------------------------------------------- return

            return destination;
        },

        /**
         * Returns properties corresponding to given user agent information.
         *
         * <p>
         * The returned properties match a particular API: the one finally exposed by this class. Also, they benefit from a cache mechanism.
         * </p>
         *
         * @param {Object} userAgentWrapper The user agent wrapper to use (see <em>aria.core.useragent.UserAgent.getUserAgentInfo</em>)
         *
         * @private
         */
        _getProperties : function(userAgentWrapper) {
            // ----------------------------------------------- early termination

            var cacheKey = userAgentWrapper.ua.toLowerCase();

            var values;
            if (this._propertiesCache.hasOwnProperty(cacheKey)) {
                values = this._propertiesCache[cacheKey];
            }

            if (values != null) {
                return values;
            }

            // ----------------------------------------------------- computation

            values = this._computeProperties(userAgentWrapper);

            // ---------------------------------------------------------- output

            this._propertiesCache[cacheKey] = values;
            return values;
        },

        /**
         * Computes properties for the given user agent.
         *
         * @param {Object} The user agent wrapper to use to compute the properties (see <em>aria.core.useragent.UserAgent.getUserAgentInfo</em>)
         *
         * @return {Object} The set of computed properties.
         *
         * @private
         */
        _computeProperties : function(userAgentWrapper) {
            var output = {};

            ////////////////////////////////////////////////////////////////////
            // Initialization
            ////////////////////////////////////////////////////////////////////

            var uaInfo = userAgentWrapper.results;

            var browser = uaInfo.browser;
            var engine = uaInfo.engine;
            var os = uaInfo.os;

            // ---------------------------------------- simply copied properties

            output.ua = userAgentWrapper.ua;

            // --------------------------------------- for anticipated detection

            var version = null;



            ////////////////////////////////////////////////////////////////////
            // OS
            ////////////////////////////////////////////////////////////////////

            // --------------------------------------------------------- version

            var osVersion = os.version;

            if (osVersion != null) {
                output.osVersion = osVersion;
            }

            // ------------------------------------------------------------ name

            var osName = os.name;

            if (osName == null) {
                osName = "";
            }

            switch (UserAgent.normalizeName(osName)) {
                case "windows":
                    if (osVersion == " M") {
                        // user agents with "Windows Mobile" instead of "Windows Phone" not properly recognized.
                        this._setFlag(output, "WindowsPhone");
                        if (/(Windows Mobile; WCE;)/ig.test(output.ua)) {
                            output.osVersion = "WCE";
                        } else {
                            output.osVersion = "";
                        }
                    } else {
                        this._setFlag(output, "Windows");
                        output.environment = "Windows";
                    }
                    break;

                case "macos":
                    this._setFlag(output, "Mac");
                    output.environment = "MacOS";
                    break;

                case 'ios':
                    this._setFlag(output, "IOS");
                    break;

                case 'windowsphoneos':
                    this._setFlag(output, "WindowsPhone");
                    break;

                default:
                    if (ariaUtilsArray.contains(["Android", "BlackBerry", "Symbian"], osName)) {
                        this._setFlag(output, osName);
                    } else {
                        this._setFlag(output, "OtherOS");
                    }
            }

            output.osName = osName;



            ////////////////////////////////////////////////////////////////////
            // Browser
            ////////////////////////////////////////////////////////////////////

            // ------------------------------------------------------------ name

            var name = browser.name;

            var maybeOtherBrowser = false;

            if (name != null) {
                switch (UserAgent.normalizeName(name)) {
                    case "mobilesafari":
                        if (output.isAndroid) {
                            this._setFlag(output, "AndroidBrowser");
                        } else if (output.isBlackBerry) {
                            this._setFlag(output, "BlackBerryBrowser");
                        } else {
                            this._setFlag(output, "SafariMobile");
                        }
                        break;
                    case "operamini":
                        this._setFlag(output, "OperaMini");
                        break;
                    case "operamobi":
                        this._setFlag(output, "OperaMobile");
                        break;
                    case "safari":
                        if (output.isSymbian) {
                            this._setFlag(output, "S60");
                        } else if (/(phantomjs)/ig.test(output.ua)) {
                            this._setFlag(output, "PhantomJS");
                            name = "PhantomJS";
                        } else {
                            this._setFlag(output, "Safari");
                        }
                        break;
                    default:
                        maybeOtherBrowser = true;
                }

                if (ariaUtilsArray.contains(["Firefox", "Chrome", "IE", "Opera", "IEMobile"], name)) {
                    this._setFlag(output, name);
                    maybeOtherBrowser = false;
                }
            } else {
                if (output.isBlackBerry) {
                    this._setFlag(output, "BlackBerryBrowser");
                    name = "BlackBerry";
                }
            }

            if (maybeOtherBrowser) {
                this._setFlag(output, "OtherBrowser");
            }

            // Special case - NGBrowser
            var match = /BrowserNG\/(\d+(?:\.\d+)*)/ig.exec(output.ua);
            if (match != null) {
                name = "NokiaBrowser";
                version = match[1];
            }

            output.name = name;

            // --------------------------------------- major version (detection)

            var detectedMajorVersion = null;

            if (output.isIE) {
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
                detectedMajorVersion = document.documentMode || 7;
                detectedMajorVersion = +detectedMajorVersion;
            }

            // ---------------------------------------------------- full version

            if (version == null) {
                version = browser.version;
            }

            if (detectedMajorVersion != null) {
                // the browser is not what it claims to be!
                // make sure output.version is consistent with detected
                // major version
                version = "" + detectedMajorVersion + ".0";
            }

            if (version == null) {
                if (output.isPhantomJS) {
                    if (/phantomjs[\/\s]((?:\d+\.?)+)/ig.test(output.ua)) {
                        version = RegExp.$1;
                    }
                }
            }

            // ----------------------------------------------- major version (2)

            var majorVersion;

            if (detectedMajorVersion != null) {
                majorVersion = detectedMajorVersion;
            } else if (version != null) {
                var part = /^(\d+)*/.exec(version);
                if (part != null) {
                    majorVersion = part[1];
                }
            } else if (browser.major != null) {
                majorVersion = browser.major;
            }

            if (majorVersion != null) {
                majorVersion = +majorVersion;
                output.majorVersion = majorVersion;
            }

            // -------------------------------------------------------- name (2)

            if (output.isIE) {
                if (majorVersion != null) {
                    this._setFlag(output, "IE" + majorVersion);

                    if (majorVersion >= 7) {
                        if (majorVersion <= 10) {
                            this._setFlag(output, "OldIE");
                        } else {
                            this._setFlag(output, "ModernIE");
                        }
                    }
                }
            }

            // ------------------------------------------------ full version (2)

            if (version == null && majorVersion != null) {
                version = "" + majorVersion;
            }

            if (version != null) {
                output.version = version;
            }



            ////////////////////////////////////////////////////////////////////
            // Rendering engine
            ////////////////////////////////////////////////////////////////////

            // ------------------------------------------------------------ name

            var engineName = engine.name;

            if (engineName != null) {
                switch (UserAgent.normalizeName(engineName)) {
                    case 'webkit':
                        this._setFlag(output, "Webkit");
                        break;

                    case 'gecko':
                        this._setFlag(output, "Gecko");
                        break;
                }
            }



            ////////////////////////////////////////////////////////////////////
            // Mobile browser specific properties
            ////////////////////////////////////////////////////////////////////

            if (output.isIEMobile) {
                var fullMatch = /(iemobile)[\/\s]?((\d+)?[\w\.]*)/ig.exec(output.ua);

                if (fullMatch != null) {
                    var match = fullMatch[0];

                    if (match != null && ariaUtilsArray.contains(['xblwp7', 'zunewp7'], match.toLowerCase())) {
                        this._setFlag(output, "DesktopView");
                    } else {
                        this._setFlag(output, "MobileView");
                    }
                }
            }



            ////////////////////////////////////////////////////////////////////
            // Output
            ////////////////////////////////////////////////////////////////////

            return output;
        },


        /**
         * Resets all properties to their default values.
         *
         * @private
         */
        _resetProperties : function() {
            this._styleCache = {};

            // -----------------------------------------------------------------

            this.ua = "";

            this.name = "";
            this.version = "";
            this.majorVersion = 0;
            this.isIE = false;
            this.isIE7 = false;
            this.isIE8 = false;
            this.isIE9 = false;
            this.isIE10 = false;
            this.isIE11 = false;
            this.isOldIE = false;
            this.isModernIE = false;
            this.isFirefox = false;
            this.isChrome = false;
            this.isSafari = false;
            this.isOpera = false;
            this.isBlackBerryBrowser = false;
            this.isAndroidBrowser = false;
            this.isSafariMobile = false;
            this.isIEMobile = false;
            this.isOperaMobile = false;
            this.isOperaMini = false;
            this.isS60 = false;
            this.isPhantomJS = false;
            this.isOtherBrowser = false;

            this.isWebkit = false;
            this.isGecko = false;

            this.osName = "";
            this.osVersion = "";
            this.isWindows = false;
            this.isMac = false;
            this.isIOS = false;
            this.isAndroid = false;
            this.isWindowsPhone = false;
            this.isBlackBerry = false;
            this.isSymbian = false;
            this.isOtherOS = false;

            this.isMobileView = false;
            this.isDesktopView = false;
        },

        /**
         * Makes the class work with the given user agent.
         *
         * <p>
         * If no user agent is given, current browser's one is taken.
         * </p>
         *
         * <p>
         * Not that providing a user agent different than the running browser's one will not make all functions return values corresponding to the browser associated to this custom user agent. Feature detection mechanism for instance will by nature always correspond to the running browser.
         * </p>
         *
         * @param {String} userAgent The user agent to take into account in this class
         *
         * @return {Object} The user agent wrapper used to compute the properties (see <em>aria.core.useragent.UserAgent.getUserAgentInfo</em>)
         */
        init : function(userAgent) {
            var userAgentWrapper = UserAgent.getUserAgentInfo(userAgent);

            // ----------------------------------------- reset /apply properties

            this._resetProperties();

            var properties = this._getProperties(userAgentWrapper);
            this._import(properties);

            // ---------------------------------------------------------- return

            return userAgentWrapper;
        },

        /**
         * Checks whether the browser supports PhoneGap/Cordova.
         *
         * @return {Boolean} <em>true</em> if so, <em>false</em> otherwise
         */
        isPhoneGap : function () {
            var window = Aria.$window;
            return !!((window.cordova && window.device) || (window.device && window.device.phonegap));
        },

        /**
         * Checks whether the Browser supports 2D transform.
         *
         * @return {Boolean} <em>true</em> if so, <em>false</em> otherwise
         */
        is2DTransformCapable : function () {
            return this._isStyleSupported('transform');
        },

        /**
         * Checks whether the Browser supports 3D transform.
         *
         * @return {Boolean} <em>true</em> if so, <em>false</em> otherwise
         */
        is3DTransformCapable : function () {
            return this._isStyleSupported('perspective');
        },

        /**
         * Check whether the given CSS property is supported by the browser or not.
         *
         * @param {String} property a CSS Property
         *
         * @return {Boolean} <em>true</em> if given style is supported, <em>false</em> otherwise.
         *
         * @private
         */
        _isStyleSupported : function (property) {
            // ----------------------------------------------------------- cache

            if (this._styleCache.hasOwnProperty(property)) {
                return this._styleCache[property];
            }

            // ------------------------------------------------------ processing

            // default if none of the actions below can find it
            var result = false;

            var prefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'Ms'];

            var element = Aria.$window.document.documentElement;
            var style = element.style;

            // test standard property
            if (typeof style[property] === 'string') {
                result = true;
            } else {
                // capitalize
                var capitalizedProperty = property.charAt(0).toUpperCase() + property.slice(1);

                // test vendor specific properties
                for (var index = 0, length = prefixes.length; index < length; index++) {
                    var prefix = prefixes[index];

                    var prefixed = prefix + capitalizedProperty;
                    if (typeof style[prefixed] === 'string') {
                        result = true;
                        break;
                    }
                }
            }

            // ---------------------------------------------------------- result

            this._styleCache[property] = result;
            return result;
        }
    }
});
