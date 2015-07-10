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
    $classpath : "test.aria.core.useragent.UseCases",

    $statics : {
        getValues: function() {
            return [



////////////////////////////////////////////////////////////////////////////////
// Firefox
////////////////////////////////////////////////////////////////////////////////

{
    id: "Firefox",
    ua: "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0",
    values: {
        browser: {
            properties: {
                name : "Firefox",
                version : "17.0",
                osName : "Windows",
                osVersion : "7"
            },
            flags: {
                engine: "Gecko",
                browser: "Firefox",
                os: "Windows"
            }
        },
        device: {
            properties: {
                isDevice : false,
                isPhone : false,
                isDesktop : true,
                isTablet : false,
                deviceName : ""
            }
        }
    }
},

////////////////////////////////////////////////////////////////////////////////
// Chrome
////////////////////////////////////////////////////////////////////////////////

{
    id: "Chrome",
    ua: "Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19",
    values: {
        browser: {
            properties: {
                name : "Chrome",
                version : "18.0.1025.166",
                osName : "Android",
                osVersion : "4.1.1"
            },
            flags: {
                engine: "Webkit",
                browser: "Chrome",
                os: "Android"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : "Samsung - Galaxy Nexus"
            }
        }
    }
},

{
    id: "Chrome",
    ua: "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.12 (KHTML, like Gecko) Chrome/24.0.1273.0 Safari/537.12",
    values: {
        browser: {
            properties: {
                name : "Chrome",
                version : "24.0.1273.0",
                osName : "Windows",
                osVersion : "8"
            },
            flags: {
                engine: "Webkit",
                browser: "Chrome",
                os: "Windows"
            }
        },
        device: {
            properties: {
                isDevice : false,
                isPhone : false,
                isDesktop : true,
                isTablet : false,
                deviceName : ""
            }
        }
    }
},

{
    id: "Chrome (Chrome OS)",
    ua: "Mozilla/5.0 (X11; CrOS armv7l 2913.260.0) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.99 Safari/537.11",
    values: {
        browser: {
            properties: {
                name : "Chrome",
                version : "23.0.1271.99",
                osName : "Chromium OS",
                osVersion : "2913.260.0"
            },
            flags: {
                engine: "Webkit",
                browser: "Chrome",
                os: "OtherOS"
            }
        },
        device: {
            properties: {
                isDevice : false,
                isPhone : false,
                isDesktop : true,
                isTablet : false,
                deviceName : ""
            }
        }
    }
},

////////////////////////////////////////////////////////////////////////////////
// IE
////////////////////////////////////////////////////////////////////////////////

{
    id: "IE",
    ua: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)",
    values: {
        browser: {
            properties: {
                name : "IE",
                version : "7.0",
                osName : "Windows",
                osVersion : "8"
            },
            flags: {
                browser: "IE",
                os: "Windows"
            }
        },
        device: {
            properties: {
                isDevice : false,
                isPhone : false,
                isDesktop : true,
                isTablet : false,
                deviceName : ""
            }
        }
    }
},

{
    id: "IE (Tablet PC)",
    ua: "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.0.3705; Tablet PC 2.0)",
    values: {
        browser: {
            properties: {
                name : "IE",
                version : "6.0",
                osName : "Windows",
                osVersion : "XP"
            },
            flags: {
                browser: "IE",
                os: "Windows"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : false,
                isDesktop : false,
                isTablet : true,
                deviceName : ""
            }
        }
    }
},

////////////////////////////////////////////////////////////////////////////////
// Safari
////////////////////////////////////////////////////////////////////////////////

{
    id: "Safari (RIM Tablet)",
    ua: "Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.0.1; en-US) AppleWebKit/535.8+ (KHTML, like Gecko) Version/7.2.0.1 Safari/535.8+",
    values: {
        browser: {
            properties: {
                name : "Safari",
                version : "7.2.0.1",
                osName : "RIM Tablet OS",
                osVersion : "2.0.1"
            },
            flags: {
                engine: "Webkit",
                browser: "Safari",
                os: "OtherOS"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : false,
                isDesktop : false,
                isTablet : true,
                deviceName : "RIM - PlayBook"
            }
        }
    }
},

{
    id: "Safari (WebOS)",
    ua: "Mozilla/5.0 (webOS/1.4.0; U; en-US) AppleWebKit/532.2(KHTML, like Gecko) Version/1.0 Safari/532.2 Pre/1.1",
    values: {
        browser: {
            properties: {
                name : "Safari",
                version : "1.0",
                osName : "webOS",
                osVersion : "1.4.0"
            },
            flags: {
                engine: "Webkit",
                browser: "Safari",
                os: "OtherOS"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : ""
            }
        }
    }
},

////////////////////////////////////////////////////////////////////////////////
// Opera (Desktop, Mini & Mobile)
////////////////////////////////////////////////////////////////////////////////

{
    id: "Opera Mobile (Windows Mobile)",
    ua: "Opera/9.80 (Windows Mobile; WCE; Opera Mobi/WMD-50433; U; en) Presto/2.4.13 Version/10.00",
    values: {
        browser: {
            properties: {
                name : "Opera Mobi",
                version : "10.00",
                osName : "Windows",
                osVersion : "WCE"
            },
            flags: {
                browser: "OperaMobile",
                os: "WindowsPhone"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : ""
            }
        }
    }
},

{
    id: "Opera Mobile (Symbian)",
    ua: "Opera/9.80 (S60; SymbOS; Opera Mobi/SYB-1107071606; U; en) Presto/2.8.149 Version/11.10",
    values: {
        browser: {
            properties: {
                name : "Opera Mobi",
                version : "11.10",
                osName : "Symbian",
                osVersion : ""
            },
            flags: {
                browser: "OperaMobile",
                os: "Symbian"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : ""
            }
        }
    }
},

{
    id: "Opera Mini",
    ua: "Opera/9.80 (J2ME/MIDP; Opera Mini/9 (Compatible; MSIE:9.0; iPhone; BlackBerry9700; AppleWebKit/24.746; U; en) Presto/2.5.25 Version/10.54",
    values: {
        browser: {
            properties: {
                name : "Opera Mini",
                version : "9",
                osName : "BlackBerry",
                osVersion : ""
            },
            flags: {
                browser: "OperaMini",
                os: "BlackBerry"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : "BlackBerry - 9700"
            }
        }
    }
},

////////////////////////////////////////////////////////////////////////////////
// Android Browser
////////////////////////////////////////////////////////////////////////////////

{
    id: "Android Browser",
    ua: "Mozilla/5.0 (Linux; U; Android 4.0.3; de-ch; HTC Sensation Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
    values: {
        browser: {
            properties: {
                name : "Android Browser",
                version : "4.0",
                osName : "Android",
                osVersion : "4.0.3"
            },
            flags: {
                engine: "Webkit",
                browser: "AndroidBrowser",
                os: "Android"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : "HTC - Sensation"
            }
        }
    }
},

{
    id: "Android (tablet)",
    ua: "Mozilla/5.0 (Linux; U; Android 2.2; en-gb; SAMSUNG GT-P1000 Tablet Build/MASTER) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
    values: {
        browser: {
            properties: {
                name : "Android Browser",
                version : "4.0",
                osName : "Android",
                osVersion : "2.2"
            },
            flags: {
                engine: "Webkit",
                browser: "AndroidBrowser",
                os: "Android"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : false,
                isDesktop : false,
                isTablet : true,
                deviceName : "Samsung - GT-P1000"
            }
        }
    }
},

////////////////////////////////////////////////////////////////////////////////
// Mobile Safari
////////////////////////////////////////////////////////////////////////////////

{
    id: "Mobile Safari",
    ua: "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7",
    values: {
        browser: {
            properties: {
                name : "Mobile Safari",
                version : "4.0.5",
                osName : "iOS",
                osVersion : "4.0"
            },
            flags: {
                engine: "Webkit",
                browser: "SafariMobile",
                os: "IOS"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : "Apple - iPhone"
            }
        }
    }
},

{
    id: "Mobile Safari (iPad)",
    ua: "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10",
    values: {
        browser: {
            properties: {
                name : "Mobile Safari",
                version : "4.0.4",
                osName : "iOS",
                osVersion : "3.2"
            },
            flags: {
                engine: "Webkit",
                browser: "SafariMobile",
                os: "IOS"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : false,
                isDesktop : false,
                isTablet : true,
                deviceName : "Apple - iPad"
            }
        }
    }
},

////////////////////////////////////////////////////////////////////////////////
// IE Mobile
////////////////////////////////////////////////////////////////////////////////

{
    id: "IEMobile",
    ua: "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; NOKIA; Lumia 800)",
    values: {
        browser: {
            properties: {
                name : "IEMobile",
                version : "9.0",
                osName : "Windows Phone OS",
                osVersion : "7.5"
            },
            flags: {
                browser: "IEMobile",
                os: "WindowsPhone"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : "Nokia - Lumia 800"
            }
        }
    }
},

{
    id: "IEMobile",
    ua: "HTC_Touch_3G Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 7.11)",
    values: {
        browser: {
            properties: {
                name : "IEMobile",
                version : "7.11",
                osName : "Windows",
                osVersion : "CE"
            },
            flags: {
                browser: "IEMobile",
                os: "Windows"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : "HTC - Touch 3G"
            }
        }
    }
},

{
    id: "IEMobile",
    ua: "Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; Nokia;N70)",
    values: {
        browser: {
            properties: {
                name : "IEMobile",
                version : "7.0",
                osName : "Windows Phone OS",
                osVersion : "7.0"
            },
            flags: {
                browser: "IEMobile",
                os: "WindowsPhone"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : "Nokia"
            }
        }
    }
},

////////////////////////////////////////////////////////////////////////////////
// BlackBerry
////////////////////////////////////////////////////////////////////////////////

{
    id: "BlackBerry Browser",
    ua: "Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en-US) AppleWebKit/534.8+ (KHTML, like Gecko) Version/6.0.0.466 Mobile Safari/534.8+",
    values: {
        browser: {
            properties: {
                name : "Mobile Safari",
                version : "6.0.0.466",
                osName : "BlackBerry",
                osVersion : ""
            },
            flags: {
                engine: "Webkit",
                browser: "BlackBerryBrowser",
                os: "BlackBerry"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : "BlackBerry - 9800"
            }
        }
    }
},

////////////////////////////////////////////////////////////////////////////////
// Nokia Browser
////////////////////////////////////////////////////////////////////////////////

{
    id: "Nokia Browser (BrowserNG)",
    ua: "Mozilla/5.0 (SymbianOS/9.4; Series60/5.0 NokiaN97-1/12.0.024; Profile/MIDP-2.1 Configuration/CLDC-1.1; en-us) AppleWebKit/525 (KHTML, like Gecko) BrowserNG/7.1.12344",
    values: {
        browser: {
            properties: {
                name : "NokiaBrowser",
                version : "7.1.12344",
                osName : "Symbian",
                osVersion : "9.4"
            },
            flags: {
                engine: "Webkit",
                browser: "OtherBrowser",
                os: "Symbian"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : "Nokia - N97-1"
            }
        }
    }
},

{
    id: "Nokia Browser",
    ua: "Mozilla/5.0 (MeeGo; NokiaN9) AppleWebKit/534.13 (KHTML, like Gecko) NokiaBrowser/8.5.0 Mobile Safari/534.13",
    values: {
        browser: {
            properties: {
                name : "NokiaBrowser",
                version : "8.5.0",
                osName : "MeeGo",
                osVersion : ""
            },
            flags: {
                engine: "Webkit",
                browser: "OtherBrowser",
                os: "OtherOS"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : "Nokia - N9"
            }
        }
    }
},

////////////////////////////////////////////////////////////////////////////////
// Other browsers
////////////////////////////////////////////////////////////////////////////////

{
    id: "Fennec (Firefox)",
    ua: "Mozilla/5.0 (Android; Linux armv7l; rv:2.0.1) Gecko/20100101 Firefox/4.0.1 Fennec/2.0.1",
    values: {
        browser: {
            properties: {
                name : "Fennec",
                version : "2.0.1",
                osName : "Android",
                osVersion : ""
            },
            flags: {
                engine: "Gecko",
                browser: "OtherBrowser",
                os: "Android"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : ""
            }
        }
    }
},

{
    id: "Dolphin",
    ua: "Mozilla/5.0 (SAMSUNG; SAMSUNG-GT-S8500/S8500XXJD9 U; Bada/1.0; fr-fr) AppleWebKit/533.1 (KHTML, like Gecko) Dolfin/2.0 Mobile WVGA SMM-MMS/1.2.0 OPN-B",
    values: {
        browser: {
            properties: {
                name : "Dolphin",
                version : "2.0",
                osName : "Bada",
                osVersion : "1.0"
            },
            flags: {
                engine: "Webkit",
                browser: "OtherBrowser",
                os: "OtherOS"
            }
        },
        device: {
            properties: {
                isDevice : true,
                isPhone : true,
                isDesktop : false,
                isTablet : false,
                deviceName : "Samsung - GT-S8500"
            }
        }
    }
}
            ];
        }
    }
});
