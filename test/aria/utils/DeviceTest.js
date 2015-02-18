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
Aria.classDefinition({
    $classpath : "test.aria.utils.DeviceTest",
    $dependencies : ["aria.utils.Device", "aria.utils.String", "aria.core.Browser", "aria.utils.FrameATLoader", "aria.utils.Function"],
    $extends : "aria.jsunit.TestCase",
    $constructor : function () {
        this.$TestCase.constructor.call(this);

        // Since the singleton replaces the original method when they are called, store a copy here
        this.isTabletBackup = aria.utils.Device.isTablet;
        this.isMobileBackup = aria.utils.Device.isMobile;
        this.isTouchBackup = aria.utils.Device.isTouch;
        this.isDesktopBackup = aria.utils.Device.isDesktop;
        this.userAgentBackup = aria.utils.Device.ua;
        this.isClickNavigation = aria.utils.Device.isClickNavigation;
        this.isHorizontalScreen = aria.utils.Device.isHorizontalScreen;
        this.isPhoneGap = aria.utils.Device.isPhoneGap;
        this.is3DTransformCapable = aria.utils.Device.is3DTransformCapable;
        this.is2DTransformCapable = aria.utils.Device.is2DTransformCapable;
        this.isTouch = aria.utils.Device.isTouch;
        this.isDevice = aria.utils.Device.isDevice;

        this.originalWindow = Aria.$window;

        this._tmpWindow = null;
    },
    $destructor : function () {
        this.originalWindow = null;
        this.$TestCase.$destructor.call(this);
    },
    $prototype : {
        tearDown : function () {
            this.reset();
        },

        /**
         * Reset aria.utils.Device singleton to the original state
         */
        reset : function () {
            aria.utils.Device.isTablet = this.isTabletBackup;
            aria.utils.Device.isMobile = this.isMobileBackup;
            aria.utils.Device.isTouch = this.isTouchBackup;
            aria.utils.Device.isDesktop = this.isDesktopBackup;
            aria.utils.Device.ua = this.userAgentBackup;
            aria.utils.Device.isClickNavigation = this.isClickNavigation;
            aria.utils.Device.isHorizontalScreen = this.isHorizontalScreen;
            aria.utils.Device.isPhoneGap = this.isPhoneGap;
            aria.utils.Device.is3DTransformCapable = this.is3DTransformCapable;
            aria.utils.Device.is2DTransformCapable = this.is2DTransformCapable;
            aria.utils.Device.isTouch = this.isTouch;
            aria.utils.Device.isDevice = this.isDevice;

            aria.utils.Device._styleCache = {};

            Aria.$window = this.originalWindow;
        },

        /**
         * List of user agents to test and their expectations
         * @type
         */
        agents : {
            // MOBILE DEVICES
            "Mozilla/5.0 (Android; Linux armv7l; rv:2.0.1) Gecko/20100101 Firefox/4.0.1 Fennec/2.0.1" : {
                isDevice : true,
                isMobile : true,
                isDesktop : false,
                isTablet : false
            },
            "HTC_Touch_3G Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 7.11)" : {
                isDevice : true,
                isMobile : true,
                isDesktop : false,
                isTablet : false
            },
            "Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en-US) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.466 Mobile Safari/534.8+" : {
                isDevice : true,
                isMobile : true,
                isDesktop : false,
                isTablet : false
            },
            "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; NOKIA; Lumia 800)" : {
                isDevice : true,
                isMobile : true,
                isDesktop : false,
                isTablet : false
            },
            "Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; Nokia;N70)" : {
                isDevice : true,
                isMobile : true,
                isDesktop : false,
                isTablet : false
            },
            "Mozilla/5.0 (SymbianOS/9.4; Series60/5.0 NokiaN97-1/12.0.024; Profile/MIDP-2.1 Configuration/CLDC-1.1; en-us) AppleWebKit/525 (KHTML, like Gecko) BrowserNG/7.1.12344" : {
                isDevice : true,
                isMobile : true,
                isDesktop : false,
                isTablet : false
            },
            "Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19" : {
                isDevice : true,
                isMobile : true,
                isDesktop : false,
                isTablet : false
            },
            "Mozilla/5.0 (SAMSUNG; SAMSUNG-GT-S8500/S8500XXJD9 U; Bada/1.0; fr-fr) AppleWebKit/533.1 (KHTML, like Gecko) Dolfin/2.0 Mobile WVGA SMM-MMS/1.2.0 OPN-B" : {
                isDevice : true,
                isMobile : true,
                isDesktop : false,
                isTablet : false
            },
            "Mozilla/5.0 (webOS/1.4.0; U; en-US) AppleWebKit/532.2(KHTML, like Gecko) Version/1.0 Safari/532.2 Pre/1.1" : {
                isDevice : true,
                isMobile : true,
                isDesktop : false,
                isTablet : false
            },
            "Mozilla/5.0 (MeeGo; NokiaN9) AppleWebKit/534.13 (KHTML, like Gecko) NokiaBrowser/8.5.0 Mobile Safari/534.13" : {
                isDevice : true,
                isMobile : true,
                isDesktop : false,
                isTablet : false
            },
            "Opera/9.80 (Windows Mobile; WCE; Opera Mobi/WMD-50433; U; en) Presto/2.4.13 Version/10.00" : {
                isDevice : true,
                isMobile : true,
                isDesktop : false,
                isTablet : false
            },
            "Opera/9.80 (S60; SymbOS; Opera Mobi/SYB-1107071606; U; en) Presto/2.8.149 Version/11.10" : {
                isDevice : true,
                isMobile : true,
                isDesktop : false,
                isTablet : false
            },
            "Opera/9.80 (J2ME/MIDP; Opera Mini/9 (Compatible; MSIE:9.0; iPhone; BlackBerry9700; AppleWebKit/24.746; U; en) Presto/2.5.25 Version/10.54" : {
                isDevice : true,
                isMobile : true,
                isDesktop : false,
                isTablet : false
            },

            // TABLETS
            "Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.0.1; en-US) AppleWebKit/535.8+ (KHTML, like Gecko) Version/7.2.0.1 Safari/535.8+" : {
                isDevice : true,
                isMobile : false,
                isDesktop : false,
                isTablet : true
            },
            "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10" : {
                isDevice : true,
                isMobile : false,
                isDesktop : false,
                isTablet : true
            },
            "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.0.3705; Tablet PC 2.0)" : {
                isDevice : true,
                isMobile : false,
                isDesktop : false,
                isTablet : true
            },
            "Mozilla/5.0 (Linux; U; Android 2.2; en-gb; SAMSUNG GT-P1000 Tablet Build/MASTER) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1" : {
                isDevice : true,
                isMobile : false,
                isDesktop : false,
                isTablet : true
            },

            // DESKTOP
            "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.12 (KHTML, like Gecko) Chrome/24.0.1273.0 Safari/537.12" : {
                isDevice : false,
                isMobile : false,
                isDesktop : true,
                isTablet : false
            },

            // chrome OS
            "Mozilla/5.0 (X11; CrOS armv7l 2913.260.0) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.99 Safari/537.11" : {
                isDevice : false,
                isMobile : false,
                isDesktop : true,
                isTablet : false
            },

            // firefox
            "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0" : {
                isDevice : false,
                isMobile : false,
                isDesktop : true,
                isTablet : false
            },

            //IE
            "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)" : {
                isDevice : false,
                isMobile : false,
                isDesktop : true,
                isTablet : false
            }
        },

        log : function (callNumber, method, userAgent) {
            return aria.utils.String.substitute("%1 call to %2 mismatch for \n'%3'", [callNumber, method, userAgent])
                    + "Expecting %2, got %1";
        },

        /**
         * Test all methods that depends on the user agent
         */
        testUserAgents : function () {
            var methods = ["isDevice", "isMobile", "isDesktop", "isTablet"];

            for (var agent in this.agents) {
                if (this.agents.hasOwnProperty(agent)) {
                    for (var i = 0; i < methods.length; i += 1) {
                        // Before testing override the user agent
                        aria.utils.Device.ua = agent;

                        var method = methods[i];
                        // Call every method twice , to check that it still returns the same after being modified
                        this.assertEquals(aria.utils.Device[method](), this.agents[agent][method], this.log("First", method, agent));
                        this.assertEquals(aria.utils.Device[method](), this.agents[agent][method], this.log("Second", method, agent));

                        // Reset the singleton after every test, becuase methods call each other
                        this.reset();
                    }
                }
            }
        },

        testTouch : function () {
            // The touch function relies on the precence of ontouchstart or DocumentTouch
            Aria.$window = {
                "ontouchstart" : Aria.empty
            };
            this.assertTrue(aria.utils.Device.isTouch(), "Windows with ontouchstart should be touch");
            this.assertTrue(aria.utils.Device.isTouch(), "Windows with ontouchstart should be touch");

            this.reset();

            var documentTouch = function () {};
            Aria.$window = {
                "DocumentTouch" : documentTouch,
                document : new documentTouch()
            };
            this.assertTrue(aria.utils.Device.isTouch(), "Windows with DocumentTouch should be touch");
            this.assertTrue(aria.utils.Device.isTouch(), "Windows with DocumentTouch should be touch");

            this.reset();
            Aria.$window = {};
            // Blackberry 9100
            var originalBroweserBlackBerry = aria.core.Browser.isBlackBerry;
            aria.core.Browser.isBlackBerry = true;
            aria.utils.Device.ua = "BlackBerry9100/4.6.0.31 Profile/MIDP-2.0 Configuration/CLDC-1.1 VendorID/100";
            this.assertFalse(aria.utils.Device.isTouch(), "BlackBerry device should be touch");
            this.assertFalse(aria.utils.Device.isTouch(), "BlackBerry device should be touch");
            aria.core.Browser.isBlackBerry = originalBroweserBlackBerry;
        },

        test2DSupported : function () {
            // native inmplementation
            Aria.$window = {
                document : {
                    documentElement : {
                        style : {
                            "transform" : "yeah!"
                        }
                    }
                }
            };
            this.assertTrue(aria.utils.Device.is2DTransformCapable(), "2D transform should be natively supported");
            this.assertTrue(aria.utils.Device.is2DTransformCapable(), "2D transform should be natively supported");

            // browser dependent
            this.reset();
            Aria.$window = {
                document : {
                    documentElement : {
                        style : {
                            "MozTransform" : "o yeah!"
                        }
                    }
                }
            };
            this.assertTrue(aria.utils.Device.is2DTransformCapable(), "2D transform should be -moz supported");
            this.assertTrue(aria.utils.Device.is2DTransformCapable(), "2D transform should be -moz supported");

            // no support
            this.reset();
            Aria.$window = {
                document : {
                    documentElement : {
                        style : {
                            "missing" : "transform"
                        }
                    }
                }
            };
            this.assertFalse(aria.utils.Device.is2DTransformCapable(), "2D transform shouldn't be supported");
            this.assertFalse(aria.utils.Device.is2DTransformCapable(), "2D transform shouldn't be supported");
        },

        test3DSupported : function () {
            // native inmplementation
            Aria.$window = {
                document : {
                    documentElement : {
                        style : {
                            "perspective" : "yeah!"
                        }
                    }
                }
            };
            this.assertTrue(aria.utils.Device.is3DTransformCapable(), "3D transform should be natively supported");
            this.assertTrue(aria.utils.Device.is3DTransformCapable(), "3D transform should be natively supported");

            // browser dependent
            this.reset();
            Aria.$window = {
                document : {
                    documentElement : {
                        style : {
                            "OPerspective" : "o yeah!"
                        }
                    }
                }
            };
            this.assertTrue(aria.utils.Device.is3DTransformCapable(), "3D transform should be -o supported");
            this.assertTrue(aria.utils.Device.is3DTransformCapable(), "3D transform should be -o supported");

            // no support
            this.reset();
            Aria.$window = {
                document : {
                    documentElement : {
                        style : {
                            "missing" : "perspective"
                        }
                    }
                }
            };
            this.assertFalse(aria.utils.Device.is3DTransformCapable(), "3D transform shouldn't be supported");
            this.assertFalse(aria.utils.Device.is3DTransformCapable(), "3D transform shouldn't be supported");
        },

         testPhoneGap : function () {
            Aria.$window = {
                cordova : {},
                device : {}
            };
            this.assertTrue(aria.utils.Device.isPhoneGap(), "Having global cordova means on PhoneGap");
            this.assertTrue(aria.utils.Device.isPhoneGap(), "Having global cordova means on PhoneGap");

            this.reset();
            Aria.$window = {
                device : {
                    phonegap : "yeah!"
                }
            };
            this.assertTrue(aria.utils.Device.isPhoneGap(), "Having global phonegap means on PhoneGap");
            this.assertTrue(aria.utils.Device.isPhoneGap(), "Having global phonegap means on PhoneGap");

            this.reset();
            Aria.$window = {
                device : "what?"
            };
            this.assertFalse(aria.utils.Device.isPhoneGap(), "Missing globals means not on PhoneGap");
            this.assertFalse(aria.utils.Device.isPhoneGap(), "Missing globals means not on PhoneGap");
        },

        testClickNavigation : function () {
            // Only BlackBerries are clickable navigation
            var originalBroweserBlackBerry = aria.core.Browser.isBlackBerry;
            aria.core.Browser.isBlackBerry = true;
            this.assertTrue(aria.utils.Device.isClickNavigation(), "BlackBerry should be clickable");
            this.assertTrue(aria.utils.Device.isClickNavigation(), "BlackBerry should be clickable");
            aria.core.Browser.isBlackBerry = originalBroweserBlackBerry;

            this.reset();
            aria.core.Browser.isBlackBerry = false;
            this.assertFalse(aria.utils.Device.isClickNavigation(), "Non BlackBerry shouldn't be clickable");
            this.assertFalse(aria.utils.Device.isClickNavigation(), "Non BlackBerry shouldn't be clickable");
            aria.core.Browser.isBlackBerry = originalBroweserBlackBerry;
        },

        // Phantom does not handle windows resizing, so we'll use an iframe for orientation tests instead

        _fakeNewWindow : function (width, height) {
            if (this._tmpWindow == null) {
                this._tmpWindow = Aria.$window.document.createElement("iframe");
                Aria.$window.document.body.appendChild(this._tmpWindow);
            }
            this._tmpWindow.style.width = width+"px";
            this._tmpWindow.style.height = height+"px";
        },

        testAsyncOrientation : function () {
            this._fakeNewWindow(40, 80);
            aria.utils.FrameATLoader.loadAriaTemplatesInFrame(this._tmpWindow, {
                fn : this._orientation1,
                scope : this
            });
        },

        _orientation1 : function () {
            this._tmpWindow.contentWindow.Aria.load({
                classes: [
                    "aria.utils.Device"
                ],
                oncomplete: {
                    fn : this._orientation2,
                    scope : this
                }
            });
        },

        _orientation2 : function () {
            this.assertTrue(this._tmpWindow.contentWindow.aria.utils.Device.isPortrait(), "Initial viewport orientation should be reported as portrait");

            var that = this;
            this.eventRaised = false;

            this._tmpWindow.contentWindow.aria.utils.Device.$raiseEvent = function (e) {
                if (e.name == "orientationchange") {
                    that.eventRaised = true;
                }
            };

            this._tmpWindow.contentWindow.aria.utils.Device.$on({
                "orientationchange" : function(){},
                scope : this
            });

            this._fakeNewWindow(400, 800);
            setTimeout(aria.utils.Function.bind(this._orientation3, this), 50);
        },

        _orientation3 : function () {
            this.assertFalse(this.eventRaised, "Different viewport size with same orientation: event shouldn't be raised");

            this._fakeNewWindow(80, 40);
            setTimeout(aria.utils.Function.bind(this._orientation4, this), 50);
        },

        _orientation4 : function () {
            this.assertTrue(this.eventRaised, "Different viewport size with different orientation: event should be raised");
            this.notifyTestEnd("testAsyncOrientation");
        }

    }
});
