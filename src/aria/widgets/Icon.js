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
var ariaUtilsString = require("../utils/String");
var ariaWidgetsIconStyle = require("./IconStyle.tpl.css");
var ariaWidgetsWidget = require("./Widget");
var ariaCoreTplClassLoader = require("../core/TplClassLoader");

/**
 * Aria Icon Widget
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.Icon",
    $extends : ariaWidgetsWidget,
    $css : [ariaWidgetsIconStyle],
    $constructor : function (cfg, ctxt) {

        this.$Widget.constructor.apply(this, arguments);

        this._hasMarkup = false;

        var sourceImage = cfg.sourceImage;
        var iconInfo = sourceImage ? {
            "imageURL" : sourceImage.path,
            "width" : sourceImage.width,
            "height" : sourceImage.height
        } : this._getIconInfo(cfg.icon);

        /**
         * Skin information for this icon
         * @protected
         * @type Object
         */
        this._iconInfo = iconInfo;

        if (!iconInfo) {
            this._cfgOk = false;
        }

        /**
         * CSS classes which should be applied to this widget when it is created.
         * @protected
         * @type String
         */
        this._cssClassNames = "xWidget";

        /**
         * Extra attributes for the widget.
         * @type String
         */
        this.extraAttributes = "";
    },
    $statics : {
        // ERROR MESSAGES:
        ICON_BADLY_FORMATTED : "%1Icon name is not valid: %2",
        ICON_NOT_FOUND : "%1Icon was not found: %2"
    },
    $prototype : {
        /**
         * Override widget _widgetMarkup method.
         * @protected
         * @override
         * @param {aria.templates.MarkupWriter} out the html output writer
         */
        _widgetMarkup : function (out) {
            // --------------------------------------------------- destructuring

            var cfg = this._cfg;
            var icon = cfg.icon;
            var tooltip = cfg.tooltip;
            var tabIndex = cfg.tabIndex;
            var waiAria = cfg.waiAria;
            var label = cfg.label;
            var role = cfg.role;

            var id = this._domId;
            var iconInfo = this._iconInfo;
            var extraAttributes = this.extraAttributes;

            // ------------------------------------------------------ processing

            var attributes = [];

            function addAttribute(key, value) {
                value = '' + value;
                value = ariaUtilsString.escapeForHTML(value, {attr: true});
                attributes.push(key + '="' + value + '"');
            }

            // delegationMarkup ------------------------------------------------

            var delegateManager = aria.utils.Delegate;
            var delegateId = this._delegateId;

            if (!delegateId) {
                delegateId = delegateManager.add({
                    fn : this.delegate,
                    scope : this
                });
                this._delegateId = delegateId;
            }

            var delegationMarkup = delegateManager.getMarkup(delegateId);

            // icon ------------------------------------------------------------

            addAttribute('id', id);


            var style = null;

            if (!iconInfo.spriteURL && icon) {
                var parts = icon.split(":");
                var skinclass = parts[0];
                var contentKey = parts[1];

                var classes = aria.widgets.AriaSkinInterface.getSkinObject("Icon", skinclass, true).content[contentKey];

                addAttribute('class', ['xWidget'].concat(classes).join(' '));
            } else {
                addAttribute('class', this._getIconClasses(iconInfo));
                if (tooltip != null && tooltip !== '') {
                    tooltip = addAttribute('title', tooltip);
                }
                attributes.push(delegationMarkup);

                style = this._getIconStyle(iconInfo);
            }

            if (tabIndex != null) {
                tabIndex = this._calculateTabIndex();
                addAttribute('tabindex', tabIndex);
            }

            if (waiAria && label) {
                addAttribute('aria-label', label);
            }

            if (waiAria && role) {
                addAttribute('role', role);
            }

            if (style) {
                addAttribute('style', style);
            }

            attributes.push(extraAttributes);

            attributes = attributes.join(' ');
            var markup = '<span ' + attributes + '></span>';

            // ---------------------------------------------------------- output

            out.write(markup);
        },

        /**
         * Change the style to display a different icon.
         * @param {String} newIcon
         */
        changeIcon : function (newIcon) {

            // check if initialization was successful
            if (!this._iconInfo) {
                return;
            }

            var iconInfo = this._getIconInfo(newIcon);
            // check
            if (iconInfo) {
                var domElt = this.getDom();
                domElt.style.cssText = this._getIconStyle(iconInfo);
                domElt.className = this._getIconClasses(iconInfo);
            }

            this._iconInfo = iconInfo;
        },

        /**
         * Gets the current icon info
         * @return {Object}
         */
        getCurrentIconInfo : function () {
            return this._iconInfo;
        },

        /**
         * Gets the icon info
         * @param {String} icon, something like myLib:myIcon
         * @protected
         * @return {Object}
         */
        _getIconInfo : function (icon) {
            var iconParts = icon.split(":");
            if (iconParts.length !== 2) {
                this.$logError(this.ICON_BADLY_FORMATTED, [icon]);
                return null;
            } else {
                var iconInfo = aria.widgets.AriaSkinInterface.getIcon(iconParts[0], iconParts[1]);
                if (!iconInfo) {
                    this.$logError(this.ICON_NOT_FOUND, [icon]);
                    return null;
                }
                return iconInfo;
            }
        },

        /**
         * Return the icon style for a given icon skin
         * @param {Object} iconInfo
         * @protected
         * @return {String}
         */
        _getIconStyle : function (iconInfo) {
            var cfg = this._cfg;
            var vAlign = !cfg.verticalAlign ? "" : "vertical-align: " + cfg.verticalAlign;
            var margins = "margin: 0 0 0 0 "; // default value

            if (cfg.margins != null && cfg.margins.match(/^(\d+|x) (\d+|x) (\d+|x) (\d+|x)$/)) {
                var margArray = cfg.margins.split(" ");
                margins = ['margin:', margArray[0], 'px ', margArray[1], 'px ', margArray[2], 'px ', margArray[3],
                        'px; '].join('');
            } else if (iconInfo.margins != null) {
                margins = iconInfo.margins;
            }
            if (cfg.sourceImage) {
                return [margins, ';padding:0;background:url(', iconInfo.imageURL, ') no-repeat; width:',
                        iconInfo.width, 'px;height:', iconInfo.height, 'px;', vAlign].join('');
            } else {
                return [margins, ';padding:0;background-position:-', iconInfo.iconLeft, 'px -', iconInfo.iconTop,
                        'px;', vAlign].join('');
            }
        },

        /**
         * Return the icon classes for a given icon
         * @param {Object} iconInfo
         * @protected
         * @return {String}
         */
        _getIconClasses : function (iconInfo) {
            var cfg = this._cfg;
            var cssClasses = ariaCoreTplClassLoader.addPrintOptions(this._cssClassNames, cfg.printOptions);
            if (iconInfo.cssClass) {
                cssClasses += " " + iconInfo.cssClass;
            }
            if (cfg.block) {
                cssClasses += " xBlock";
            }
            return cssClasses;
        },

        _dom_onkeydown : function (domEvent) {
            var keyCode = domEvent.keyCode;

            if (keyCode == domEvent.KC_ENTER || keyCode == domEvent.KC_SPACE) {
                return this._dom_onclick(domEvent);
            }

            return true;
        },

        /**
         * The method called when the markup is clicked
         * @param {aria.DomEvent} evt Event
         * @protected
         */
        _dom_onclick : function (domEvent) {
            var cfg = this._cfg;
            if (cfg) {
                var domEvtWrapper;
                if (domEvent) {
                    domEvtWrapper = new aria.templates.DomEventWrapper(domEvent);
                }
                var returnValue = this.evalCallback(cfg.onclick, domEvtWrapper);
                if (domEvtWrapper) {
                    domEvtWrapper.$dispose();
                }
                return returnValue;
            }
            return true;
        }
    }
});
