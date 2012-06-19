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
 * @class aria.widgets.AriaSkinInterface A class that provides an interface to the AriaSkin object that comes from the
 * skinning system.
 * @extends aria.core.JsObject
 * @singleton
 */
Aria.classDefinition({
    $classpath : 'aria.widgets.AriaSkinInterface',
    $singleton : true,
    $dependencies : ['aria.core.JsonValidator', 'aria.widgets.AriaSkinBeans', 'aria.widgets.AriaSkinNormalization'],
    $statics : {
        // ERROR MESSAGES:
        WIDGET_SKIN_CLASS_OBJECT_NOT_FOUND : "There is no skin configuration for skin class %1 of widget %2. Skin class std will be used instead. The widget will probably not be displayed correctly."
    },
    $prototype : {
        /**
         * Normalizes the whole current skin, if not already done.
         */
        normalizeSkin : function () {
            aria.widgets.AriaSkinNormalization.normalizeSkin(aria.widgets.AriaSkin.skinObject);
        },

        /**
         * Returns the $properties object from the beans definition, whose keys are the valid states for the given
         * widget. Return null if the given name is not a widget or does not have any state.
         * @param {String} widgetName name of the widget (in fact, the skinnable class, which may not correspond exactly
         * to widgets)
         * @return {Object}
         */
        getWidgetStates : function (widgetName) {
            var bean = aria.core.JsonValidator.getBean("aria.widgets.AriaSkinBeans." + widgetName + "Cfg");
            if (bean && bean.$properties.states) {
                return bean.$properties.states.$properties;
            }
            return null;
        },

        /**
         * Returns the skin configuration for the given skin class of the given widget. It is normalized if it was not
         * done before. If the skin class does not exist, returns the std one with a warning on the console, unless
         * skipError is true.
         * @param {String} widgetName name of the widget (in fact, the skinnable class, which may not correspond exactly
         * to widgets)
         * @param {String} skinClass
         * @param {Boolean} skipError
         * @return {Object}
         */
        getSkinObject : function (widgetName, skinClass, skipError) {
            var widgetSkinObj = this.getSkinClasses(widgetName);
            if (widgetSkinObj) {
                if (skinClass == null) {
                    skinClass = 'std';
                }
                var skinClassObj = widgetSkinObj[skinClass];
                if (skinClassObj) {
                    return skinClassObj;
                } else if (!skipError) {
                    this.$logWarn(this.WIDGET_SKIN_CLASS_OBJECT_NOT_FOUND, [skinClass, widgetName]);
                    return widgetSkinObj.std;
                }
                return null;
            }
        },

        /**
         * Returns the skin configuration containing all skin classes for the given widget. This method calls the
         * normalization function, if it was not called before.
         * @param {String} widgetName name of the widget (in fact, the skinnable class, which may not correspond exactly
         * to widgets)
         * @return {Object}
         */
        getSkinClasses : function (widgetName) {
            var widgetSkinObj = aria.widgets.AriaSkin.skinObject[widgetName];
            if (!widgetSkinObj || !widgetSkinObj['aria:skinNormalized']) {
                var newValue = aria.widgets.AriaSkinNormalization.normalizeWidget(widgetName, widgetSkinObj);
                if (newValue && newValue != widgetSkinObj) {
                    widgetSkinObj = newValue;
                    aria.widgets.AriaSkin.skinObject[widgetName] = newValue;
                }
            }
            return widgetSkinObj;
        },

        /**
         * Return general skin properties. If those properties are not normalized yet, this function calls the
         * normalization function before returning its result.
         */
        getGeneral : function () {
            var general = aria.widgets.AriaSkin.skinObject.general;
            if (!general || !general['aria:skinNormalized']) {
                var newValue = aria.widgets.AriaSkinNormalization.normalizeGeneral(general);
                if (general != newValue) {
                    general = newValue;
                    aria.widgets.AriaSkin.skinObject.general = newValue;
                }
            }
            return general;
        },

        /**
         * Return icon information for given sprite and icon name
         * @param {String} sprite
         * @param {String} icon
         * @return {Object}
         */
        getIcon : function (sprite, icon) {
            var curSprite = this.getSkinObject("Icon", sprite, true), iconContent, iconLeft = 0, iconTop = 0;
            if (curSprite && (iconContent = curSprite.content[icon]) !== undefined) {
                if (curSprite.biDimensional) {
                    var XY = iconContent.split("_");
                    iconLeft = (curSprite.iconWidth + curSprite.spriteSpacing) * XY[0];
                    iconTop = (curSprite.iconHeight + curSprite.spriteSpacing) * XY[1];
                } else if (curSprite.direction === "x") {
                    iconLeft = (curSprite.iconWidth + curSprite.spriteSpacing) * iconContent;
                } else if (curSprite.direction === "y") {
                    iconTop = (curSprite.iconHeight + curSprite.spriteSpacing) * iconContent;
                }
                return {
                    "iconLeft" : iconLeft,
                    "iconTop" : iconTop,
                    "cssClass" : "xICN" + sprite,
                    "spriteURL" : curSprite.spriteURL,
                    "width" : curSprite.iconWidth,
                    "height" : curSprite.iconHeight
                };
            }
            return false;
        },

        /**
         * Return the name of the skin loaded
         * @return {String} Name of the skin, Default atdefskin
         */
        getSkinName : function () {
            return aria.widgets.AriaSkin.skinName || "atdefskin";
        },

        /**
         * Build the backgroung rule of a CSS selector. It is equivalent to the background macro inside .ftl files. It
         * computes the path to the css image from the baseUrl FIXME This function is needed because the packager
         * modifies any url(
         * @param {String} color Color description
         * @param {String} imageurl Image path, relative to the css folder
         * @param {String} otherparams Extra parameters
         * @return {String} full background rule
         */
        backgroundMacro : function (color, imageurl, otherparams) {
            var fullUrl = "";
            var gifUrl = "";

            if (imageurl) {
                var baseUrl = Aria.rootFolderPath;
                if (!baseUrl) {
                    // Relative path, make it looks like an absolute
                    baseUrl = "./";
                } else if (baseUrl.charAt(baseUrl.length - 1) !== "/") {
                    // Ensure an ending slash
                    baseUrl += "/";
                }
                var skinImagesRoot = baseUrl + this.getGeneral().imagesRoot;

                fullUrl = "url(" + skinImagesRoot + imageurl + ") ";

                if (aria.utils.String.endsWith(imageurl, ".png")) {
                    gifUrl = skinImagesRoot + imageurl.substring(0, imageurl.length - 4) + ".gif";
                } else {
                    gifUrl = skinImagesRoot + imageurl;
                }
            }

            var rule = ["background: ", color, " ", fullUrl, otherparams, ";"];

            if (gifUrl) {
                rule.push("_background-image: url(", gifUrl, ") !important;");
            }

            return rule.join("");
        }
    }
});