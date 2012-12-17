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
    $classpath : 'aria.utils.Device',
    $dependencies : ['aria.core.Browser'],
    $singleton : true,
    $constructor : function () {
        var navigator = Aria.$global.navigator;
        var ua = navigator ? navigator.userAgent.toLowerCase() : "";
        /**
         * The user agent string.
         * @type String
         */
        this.ua = ua;
    },

    $prototype : {

        /**
         * Checks whether it is a Mobile Device including a Tablet
         * @public
         */
        isDevice : function () {
            var isDevice = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(this.ua)
                    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(this.ua.substr(0, 4));

            if (isDevice === true) {
                this.isDevice = Aria.returnTrue;
            } else {
                this.isDevice = Aria.returnFalse;
            }
            return this.isDevice();
        },

        /**
         * Checks whether it is a Mobile Device rather than a Tablet
         * @public
         */
        isMobile : function () {
            if (this.isDevice() === true && this.isTablet() === false) {
                this.isMobile = Aria.returnTrue;
            } else {
                this.isMobile = Aria.returnFalse;
            }
            return this.isMobile();
        },

        /**
         * Checks whether it is a Desktop
         * @public
         */
        isDesktop : function () {

            if (this.isDevice() === false) {
                this.isDesktop = Aria.returnTrue;
            } else {
                this.isDesktop = Aria.returnFalse;
            }
            return this.isDesktop();
        },

        /**
         * Checks whether the device is a Tablet Device
         * @public
         */
        isTablet : function () {
            var isTablet = /(iPad|SCH-I800|android 4.0|GT-P1000|GT-P1000R|GT-P1000M|SGH-T849|SHW-M180S|android 3.0|xoom|NOOK|playbook|tablet|silk|kindle|GT-P7510)/i.test(this.ua);
            if (isTablet) {
                this.isTablet = Aria.returnTrue;
            } else {
                this.isTablet = Aria.returnFalse;
            }
            return this.isTablet();
        },

        /**
         * Checks whether it is a Touch Device
         * @public
         */
        isTouch : function () {
            var isTouch;
            var blackBerryTouch = aria.core.Browser.isBlackBerry;
            var bbModel;
            if (/BlackBerry[\/\s]((?:\d+\.?)+)/.test(this.ua)) {
                bbModel = RegExp.$1;
            }
            if (bbModel === "9670" || bbModel === "9100" || bbModel === "9105" || bbModel === "9360"
                    || bbModel === "9350" || bbModel === "9330" || bbModel === "9320" || bbModel === "9310"
                    || bbModel === "9300" || bbModel === "9220" || bbModel === "9780" || bbModel === "9700"
                    || bbModel === "9650") {
                blackBerryTouch = false;
            }
            if ((('ontouchstart' in Aria.$window) || Aria.$window.DocumentTouch
                    && Aria.$window.document instanceof Aria.$window.DocumentTouch)
                    || !!blackBerryTouch) {
                this.isTouch = Aria.returnTrue;
            } else {
                this.isTouch = Aria.returnFalse;
            }
            return this.isTouch();
        },

        /**
         * Checks whether the Browser supports 2D transform
         * @public
         */
        is2DTransformCapable : function () {
            if (this._isStyleSupported('transform')) {
                this.is2DTransformCapable = Aria.returnTrue;
            } else {
                this.is2DTransformCapable = Aria.returnFalse;
            }
            return this.is2DTransformCapable();
        },

        /**
         * Checks whether the Browser supports 3D transform
         * @public
         */
        is3DTranformCapable : function () {
            if (this._isStyleSupported('perspective')) {
                this.is3DTransformCapable = Aria.returnTrue;
            } else {
                this.is3DTransformCapable = Aria.returnFalse;
            }
            return this.is3DTransformCapable();
        },

        /**
         * Checks whether the Device supports PhoneGap/Cordova
         * @public
         */
        isPhoneGap : function () {
            if ((Aria.$window.cordova !== null && Aria.$window.device !== null)
                    || (Aria.$window.device !== null && Aria.$window.device.phonegap !== "")) {
                this.isPhonegap = Aria.returnTrue;
            } else {
                this.isPhonegap = Aria.returnFalse;
            }
            return this.isPhonegap();
        },

        /**
         * Checks the orientation whether it is Horizontal or not
         * @public
         */
        isHorizontalScreen : function () {
            var blackBerryHorizontal = false;
            var bbModel;
            if (/BlackBerry[\/\s*]((?:\d+\.?)+)/.test(this.ua)) {
                blackBerryHorizontal = ("9670" == RegExp.$1) ? true : false;
            }
            if (!(Aria.$window.orientation === null || Aria.$window.orientation === 0 || Aria.$window.orientation === 180)
                    || blackBerryHorizontal === true) {
                this.isHorizontalScreen = Aria.returnTrue;
            } else {
                this.isHorizontalScreen = Aria.returnFalse;
            }
            return this.isHorizontalScreen();
        },

        /**
         * private function - To check whether the style property is supported by the browser
         * @param {String} CSS Property
         * @private
         */
        _isStyleSupported : function (propName, elem) {
            var prefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'Ms'];
            var _cache = {};

            var element = elem || Aria.$window.document.documentElement;
            var style = element.style, prefixed, uPropName;

            // check cache only when no element is given;
            if (arguments.length === 1 && typeof _cache[propName] === 'string') {
                return _cache[propName];
            }
            // test standard property first
            if (typeof style[propName] === 'string') {
                _cache[propName] = propName;
                return true;
            }

            // capitalize
            uPropName = propName.charAt(0).toUpperCase() + propName.slice(1);

            // test vendor specific properties
            for (var i = 0, l = prefixes.length; i < l; i++) {
                prefixed = prefixes[i] + uPropName;
                if (typeof style[prefixed] === 'string') {
                    _cache[propName] = prefixed;
                    return true;
                }
            }
        },

        /**
         * Checks whether the cursor moved with a trackball or trackpad.
         * @public
         */
        isClickNavigation : function () {
            if (aria.core.Browser.isBlackBerry) {
                this.isClickNavigation = Aria.returnTrue;
            } else {
                this.isClickNavigation = Aria.returnFalse;
            }
            return this.isClickNavigation();
        }
    }
});
