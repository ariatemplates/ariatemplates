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
        $classpath : 'test.aria.core.MobileBrowserTest',
        $dependencies : ['aria.core.Browser'],
        $extends : "aria.jsunit.TestCase",
        $constructor : function () {

            this.$TestCase.constructor.call(this);
        },
        $destructor : function () {
            this.$TestCase.$destructor.call(this)
        },
        $prototype : {
            setUp : function () {
                this.userAgent = aria.core.Browser;
                this.originalBrowserProps = aria.utils.Json.copy(aria.core.Browser);
            },
            tearDown : function () {
                var browser = aria.core.Browser;
                for (var propName in this.originalBrowserProps) {
                    browser[propName] = this.originalBrowserProps[propName];
                }
                this.originalBrowserProps = null;
                this.userAgent = null;
            },
            testToUAParser : function () {
                this.userAgents = [
                        "Mozilla/5.0 (Linux; U; Android 4.0.3; de-ch; HTC Sensation Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
                        "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7",
                        "Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en-US) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.466 Mobile Safari/534.8+",
                        "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; NOKIA; Lumia 800)",
                        "HTC_Touch_3G Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 7.11)",
                        "Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; Nokia;N70)",
                        "Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.0.1; en-US) AppleWebKit/535.8+ (KHTML, like Gecko) Version/7.2.0.1 Safari/535.8+",
                        "Mozilla/5.0 (SymbianOS/9.4; Series60/5.0 NokiaN97-1/12.0.024; Profile/MIDP-2.1 Configuration/CLDC-1.1; en-us) AppleWebKit/525 (KHTML, like Gecko) BrowserNG/7.1.12344",
                        "Mozilla/5.0 (Android; Linux armv7l; rv:2.0.1) Gecko/20100101 Firefox/4.0.1 Fennec/2.0.1",
                        "Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19",
                        "Mozilla/5.0 (SAMSUNG; SAMSUNG-GT-S8500/S8500XXJD9 U; Bada/1.0; fr-fr) AppleWebKit/533.1 (KHTML, like Gecko) Dolfin/2.0 Mobile WVGA SMM-MMS/1.2.0 OPN-B",
                        "Mozilla/5.0 (webOS/1.4.0; U; en-US) AppleWebKit/532.2(KHTML, like Gecko) Version/1.0 Safari/532.2 Pre/1.1",
                        "Mozilla/5.0 (MeeGo; NokiaN9) AppleWebKit/534.13 (KHTML, like Gecko) NokiaBrowser/8.5.0 Mobile Safari/534.13",
                        "Opera/9.80 (Windows Mobile; WCE; Opera Mobi/WMD-50433; U; en) Presto/2.4.13 Version/10.00",
                        "Opera/9.80 (S60; SymbOS; Opera Mobi/SYB-1107071606; U; en) Presto/2.8.149 Version/11.10",
                        "Opera/9.80 (J2ME/MIDP; Opera Mini/9 (Compatible; MSIE:9.0; iPhone; BlackBerry9700; AppleWebKit/24.746; U; en) Presto/2.5.25 Version/10.54"];

                this.parsedString = [{
                            browser : "Mobile Safari",
                            OS : "Android",
                            OSVersion : "4.0.3",
                            browserVersion : "534.30",
                            deviceName : "HTC"
                        }, {
                            browser : "Mobile Safari",
                            OS : "IOS",
                            OSVersion : "4.0",
                            browserVersion : "6531.22.7",
                            deviceName : "iPhone"
                        }, {
                            browser : "Mobile Safari",
                            OS : "BlackBerry",
                            OSVersion : "6.0.0.466",
                            browserVersion : "534.8",
                            deviceName : "BlackBerry 9800"
                        }, {
                            browser : "IEMobile",
                            OS : "Windows",
                            OSVersion : "7.5",
                            browserVersion : "9.0",
                            deviceName : "NOKIA"
                        }, {
                            browser : "IEMobile",
                            OS : "Windows",
                            OSVersion : "CE",
                            browserVersion : "7.11",
                            deviceName : "HTC"
                        }, {
                            browser : "IEMobile",
                            OS : "Windows",
                            OSVersion : "7.0",
                            browserVersion : "7.0",
                            deviceName : "Nokia"
                        }, {
                            browser : "Safari",
                            OS : "BlackBerry Tablet OS",
                            OSVersion : "2.0.1",
                            browserVersion : "535.8",
                            deviceName : "PlayBook"
                        }, {
                            browser : "BrowserNG",
                            OS : "Symbian",
                            OSVersion : "9.4",
                            browserVersion : "7.1.12344",
                            deviceName : "Nokia"
                        }, {
                            browser : "Firefox",
                            OS : "Android",
                            OSVersion : "",
                            browserVersion : "4.0.1",
                            deviceName : ""
                        }, {
                            browser : "Chrome",
                            OS : "Android",
                            OSVersion : "4.1.1",
                            browserVersion : "18.0.1025.166",
                            deviceName : "Galaxy Nexus"
                        }, {
                            browser : "Other",
                            OS : "Other",
                            OSVersion : "1.0",
                            browserVersion : "2.0",
                            deviceName : "SAMSUNG"
                        }, {
                            browser : "Safari",
                            OS : "Other",
                            OSVersion : "1.4.0",
                            browserVersion : "532.2",
                            deviceName : ""
                        }, {
                            browser : "Mobile Safari",
                            OS : "Other",
                            OSVersion : "",
                            browserVersion : "534.13",
                            deviceName : "Nokia"
                        }, {
                            browser : "Opera Mobi",
                            OS : "Windows",
                            OSVersion : "WCE",
                            browserVersion : "WMD-50433",
                            deviceName : ""
                        }, {
                            browser : "Opera Mobi",
                            OS : "Symbian",
                            OSVersion : "",
                            browserVersion : "SYB-1107071606",
                            deviceName : ""
                        }, {
                            browser : "Opera Mini",
                            OS : "BlackBerry",
                            OSVersion : "10.54",
                            browserVersion : "9",
                            deviceName : "BlackBerry9700"
                        }];

                this._switchUserAgent();
            },

            resetSettings : function () {
                this.userAgent.deviceName = "";
                this.userAgent.osName = "";
                this.userAgent.osVersion = "";
                this.userAgent.browserType = "";
                this.userAgent.browserVersion = "";

            },

            _switchUserAgent : function () {
                for (var i = 0, len; len = this.userAgents.length, i < len; i++) {
                    this.resetSettings();
                    this.userAgent.ua = this.userAgents[i];
                    this.userAgent._init();
                    this._AssertVal(i);
                }
            },
            _AssertVal : function (index) {

                this.assertTrue(this.userAgent.osName == this.parsedString[index].OS, "The OS Name Detection went wrong.");
                this.assertTrue(this.userAgent.osVersion == this.parsedString[index].OSVersion, "The OS Version went wrong.");
                this.assertTrue(this.userAgent.browserType == this.parsedString[index].browser, "The Browser Detection went wrong.");
                this.assertTrue(this.userAgent.browserVersion == this.parsedString[index].browserVersion, "The Browser version Detection went wrong.");
                this.assertTrue(this.userAgent.deviceName == this.parsedString[index].deviceName, "The Device Detection went wrong.");

            }
        }
    };
    Aria.classDefinition(classDefinition);
})();
