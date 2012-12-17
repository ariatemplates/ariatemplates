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
    /**
     * @class test.aria.core.UATest
     * @extends extends
     */
    var classDefinition = {
        $classpath : 'test.aria.utils.DeviceTest',
        $dependencies : ['aria.utils.Device'],
        $extends : "aria.jsunit.TestCase",
        $constructor : function () {
            this.$TestCase.constructor.call(this);
            this.isTabletBackup = aria.utils.Device.isTablet;
            this.isMobileBackup = aria.utils.Device.isMobile;
            this.isTouchBackup = aria.utils.Device.isTouch;
            this.isDesktopBackup = aria.utils.Device.isDesktop;
            this.userAgentBackup = aria.utils.Device.ua;
        },

        $destructor : function () {
            this.isTabletBackup = null;
            this.isMobileBackup = null;
            this.userAgentBackup = null;
            this.isTouchBackup = null;
            this.isDesktopBackup = null;
            this.$TestCase.$destructor.call(this);
        },
        $prototype : {
            setUp : function () {
                this.userAgent = aria.utils.Device;

            },
            tearDown : function () {
                this.userAgent.ua = this.originalUserAgent;
                this.userAgent = null;
                this.originalUserAgent = null;
            },
            testToUAParser : function () {
                this.MobileUserAgents = [
                        "Mozilla/5.0 (Android; Linux armv7l; rv:2.0.1) Gecko/20100101 Firefox/4.0.1 Fennec/2.0.1",
                        "HTC_Touch_3G Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 7.11)",
                        "Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en-US) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.466 Mobile Safari/534.8+",
                        "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; NOKIA; Lumia 800)",
                        "HTC_Touch_3G Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 7.11)",
                        "Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; Nokia;N70)",
                        "Mozilla/5.0 (SymbianOS/9.4; Series60/5.0 NokiaN97-1/12.0.024; Profile/MIDP-2.1 Configuration/CLDC-1.1; en-us) AppleWebKit/525 (KHTML, like Gecko) BrowserNG/7.1.12344",
                        "Mozilla/5.0 (Android; Linux armv7l; rv:2.0.1) Gecko/20100101 Firefox/4.0.1 Fennec/2.0.1",
                        "Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19",
                        "Mozilla/5.0 (SAMSUNG; SAMSUNG-GT-S8500/S8500XXJD9 U; Bada/1.0; fr-fr) AppleWebKit/533.1 (KHTML, like Gecko) Dolfin/2.0 Mobile WVGA SMM-MMS/1.2.0 OPN-B",
                        "Mozilla/5.0 (webOS/1.4.0; U; en-US) AppleWebKit/532.2(KHTML, like Gecko) Version/1.0 Safari/532.2 Pre/1.1",
                        "Mozilla/5.0 (MeeGo; NokiaN9) AppleWebKit/534.13 (KHTML, like Gecko) NokiaBrowser/8.5.0 Mobile Safari/534.13",
                        "Opera/9.80 (Windows Mobile; WCE; Opera Mobi/WMD-50433; U; en) Presto/2.4.13 Version/10.00",
                        "Opera/9.80 (S60; SymbOS; Opera Mobi/SYB-1107071606; U; en) Presto/2.8.149 Version/11.10",
                        "Opera/9.80 (J2ME/MIDP; Opera Mini/9 (Compatible; MSIE:9.0; iPhone; BlackBerry9700; AppleWebKit/24.746; U; en) Presto/2.5.25 Version/10.54"];

                this.TabletUserAgents = [
                        "Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.0.1; en-US) AppleWebKit/535.8+ (KHTML, like Gecko) Version/7.2.0.1 Safari/535.8+",
                        "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10",
                        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.0.3705; Tablet PC 2.0)",
                        "Mozilla/5.0 (Linux; U; Android 2.2; en-gb; SAMSUNG GT-P1000 Tablet Build/MASTER) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"];

                this._testMobileUserAgents();
            },

            _testMobileUserAgents : function () {
                for (var i = 0; i < this.MobileUserAgents.length; i++) {
                    this.userAgent.ua = this.MobileUserAgents[i];
                    aria.utils.Device.isMobile = this.isMobileBackup;
                    this.assertTrue(this.userAgent.isMobile() === true, "This is not a Mobile device");
                }
                this._testTabletUserAgents();
            },

            _testTabletUserAgents : function () {
                for (var i = 0; i < this.TabletUserAgents.length; i++) {
                    this.userAgent.ua = this.TabletUserAgents[i];
                    aria.utils.Device.isTablet = this.isTabletBackup;
                    this.assertTrue(this.userAgent.isTablet() === true, "This is not a tablet device");
                }
                this._testStyleSupported();
            },

            _testStyleSupported : function () {
                if ('WebkitTransform' in Aria.$frameworkWindow.document.documentElement.style
                        || 'MozTransform' in Aria.$frameworkWindow.document.documentElement.style
                        || 'OTransform' in Aria.$frameworkWindow.document.documentElement.style
                        || 'transform' in Aria.$frameworkWindow.document.documentElement.style) {
                    var isSupported = aria.utils.Device._isStyleSupported('transform');
                    this.assertTrue(isSupported === true, "This style supported not correct");
                }
                this._test2DSupported();
            },

            _test2DSupported : function () {
                if ('WebkitTransform' in Aria.$frameworkWindow.document.documentElement.style
                        || 'MozTransform' in Aria.$frameworkWindow.document.documentElement.style
                        || 'OTransform' in Aria.$frameworkWindow.document.documentElement.style
                        || 'transform' in Aria.$frameworkWindow.document.documentElement.style) {
                    var isSupported = aria.utils.Device.is2DTransformCapable();
                    this.assertTrue(isSupported === true, "This style supported not correct");
                }
                this._testClickNavigation();
            },

            _testClickNavigation : function () {
                aria.core.Browser.ua = "Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en-US) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.466 Mobile Safari/534.8+";
                aria.core.Browser._init();
                var isSupported = aria.utils.Device.isClickNavigation();
                this.assertTrue(isSupported === true, "This test click not supported");
                this._testHorizontalScreen();
            },

            _testHorizontalScreen : function () {
                aria.utils.Device.ua = "Mozilla/5.0 (BlackBerry; U; BlackBerry 9670; en) AppleWebKit/534.3+ (KHTML, like Gecko) Version/6.0.0.286 Mobile Safari/534.3+";
                var isSupported = aria.utils.Device.isHorizontalScreen();
                this.assertTrue(isSupported === true, "This screen is not Horizontal");
                this._testTouchSupported();
            },

            _testTouchSupported : function () {
                aria.core.Browser.ua = "Mozilla/5.0 (BlackBerry; U; BlackBerry 9670; en) AppleWebKit/534.3+ (KHTML, like Gecko) Version/6.0.0.286 Mobile Safari/534.3+";
                aria.core.Browser._init();
                var isSupported = aria.utils.Device.isTouch();
                if (('ontouchstart' in Aria.$window) || Aria.$window.DocumentTouch
                        && Aria.$window.document instanceof Aria.$window.DocumentTouch) {
                    this.assertTrue(isSupported === true, "This screen Touch Supported");
                } else {
                    this.assertTrue(isSupported === false, "This screen Touch Supported");
                }
                this._testPhoneGap();
            },

            _testPhoneGap : function () {
                if (Aria.$frameworkWindow.device == null || Aria.$frameworkWindow.device == "")
                    Aria.$frameworkWindow["device"] = "phonegap";

                var isSupported = aria.utils.Device.isPhoneGap();
                this.assertTrue(isSupported === true, "This screen is not a PhoneGap Device");
                this._testDesktop();
            },
            _testDesktop : function () {
                aria.utils.Device.ua = "Mozilla/5.0 (BlackBerry; U; BlackBerry 9670; en) AppleWebKit/534.3+ (KHTML, like Gecko) Version/6.0.0.286 Mobile Safari/534.3+";
                var isSupported = aria.utils.Device.isDevice();
                this.assertTrue(isSupported === true, "This is a Desktop");

            }
        }
    };
    Aria.classDefinition(classDefinition);
})();