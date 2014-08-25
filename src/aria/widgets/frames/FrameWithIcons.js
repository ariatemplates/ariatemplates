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
var Aria = require("../../Aria");
var ariaWidgetsAriaSkinInterface = require("../AriaSkinInterface");
var ariaWidgetsFramesFrameFactory = require("./FrameFactory");
var ariaUtilsDom = require("../../utils/Dom");
var ariaUtilsType = require("../../utils/Type");
require("../../utils/Function");
var ariaUtilsArray = require("../../utils/Array");
var ariaUtilsDelegate = require("../../utils/Delegate");


/**
 * A frame with icons on the left and right. To create an object of this class, use the createFrame static method (not
 * the constructor).
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.widgets.frames.FrameWithIcons',
    /**
     * FrameWithIcons constructor. Do not use directly, use the createFrame static method instead, so that the
     * FrameWithIcons is not used when there is no icon defined in the skin.
     * @private
     */
    $constructor : function (cfg) {
        var skinObject = cfg.skinObject;

        this._baseId = cfg.id;

        this._skinObject = skinObject;
        this._stateName = cfg.state;

        this._iconsLeft = cfg.iconsLeft;
        this._iconsRight = cfg.iconsRight;

        this._icons = {};

        /**
         * Labels for the tooltips of active icon
         * @protected
         * @type Array
         */
        this._tooltipLabels = cfg.tooltipLabels;

        ariaUtilsArray.forEach(this._iconsLeft, this._initIcon, this);
        ariaUtilsArray.forEach(this._iconsRight, this._initIcon, this);

        this._outerWidth = cfg.width;
        this._outerHeight = cfg.height;

        this._updateIcons();
        this._updateFrameWidth();

        cfg.width = this._frameWidth;
        this._frame = ariaWidgetsFramesFrameFactory.createFrame(cfg);
        this.domElementNbr = this._frame.domElementNbr + this._iconsLeft.length + this._iconsRight.length;
        this.innerWidth = this._frame.innerWidth;
        this.innerHeight = this._frame.innerHeight;
    },
    $destructor : function () {
        if (this._frame) {
            this._frame.$dispose();
            this._frame = null;
        }
        if (this._icons) {
            ariaUtilsArray.forEach(this._iconsLeft, this._destroyIcon, this);
            ariaUtilsArray.forEach(this._iconsRight, this._destroyIcon, this);
            this._iconsLeft = null;
            this._iconsRight = null;
            this._icons = null;
        }
        this._domElt = null;
    },
    $events : {
        "iconClick" : {
            description : "Raised when an icon is clicked.",
            properties : {
                "iconName" : "Name of the icon."
            }
        },
        "iconMouseDown" : {
            description : "Raised when the mouse is pressed on an icon.",
            properties : {
                "iconName" : "Name of the icon."
            }
        },
        "iconMouseUp" : {
            description : "Raised when the mouse is released on an icon.",
            properties : {
                "iconName" : "Name of the icon."
            }
        },
        "iconBlur" : {
            description : "Raised when an icon is blured.",
            properties : {
                "iconName" : "Name of the icon."
            }
        },
        "iconFocus" : {
            description : "Raised when an icon is focused.",
            properties : {
                "iconName" : "Name of the icon."
            }
        }
    },
    $statics : {
        /**
         * Create a new frame according to the given configuration object. The type of frame used (either TableFrame or
         * FixedHeightFrame) depends on the frame.frameType property of the skin class. If the skin defines icons around
         * the frame, the frame returned is wrapped in a FrameWithIcons object, otherwise there is no FrameWithIcons
         * object.
         * @param {aria.widgets.frames.CfgBeans:FrameCfg} cfg Frame configuration
         * @return {aria.widgets.frames.Frame} A frame object, or null if an error occured (in this case, the error is
         * logged).
         */
        createFrame : function (cfg) {

            cfg = ariaWidgetsFramesFrameFactory.normalizeFrameCfg(cfg);
            var skinObject = cfg.skinObject;

            // normalize the skin:
            if (skinObject.iconsLeft == null || skinObject.iconsLeft === "") {
                skinObject.iconsLeft = [];
            } else if (ariaUtilsType.isString(skinObject.iconsLeft)) {
                skinObject.iconsLeft = skinObject.iconsLeft.split(',');
            }
            if (skinObject.iconsRight == null || skinObject.iconsRight === "") {
                skinObject.iconsRight = [];
            } else if (ariaUtilsType.isString(skinObject.iconsRight)) {
                skinObject.iconsRight = skinObject.iconsRight.split(',');
            }

            var iconsLeft = this._filterIcons(skinObject.iconsLeft, cfg.hideIconNames);
            var iconsRight = this._filterIcons(skinObject.iconsRight, cfg.hideIconNames);
            cfg.iconsLeft = iconsLeft;
            cfg.iconsRight = iconsRight;
            if (iconsLeft.length === 0 && iconsRight.length === 0) {
                // do not use the icon frame if there is no icon (useless overhead)
                return ariaWidgetsFramesFrameFactory.createFrame(cfg);
            } else {
                return new aria.widgets.frames.FrameWithIcons(cfg);
            }
        },
        /**
         * Does the filtering of icons
         * @param {Array} iconsList Icons to be displayed left or right
         * @param {Array} iconNames Icons to be removed from iconsList
         * @return {Array}
         */
        _filterIcons : function (iconsList, iconNames) {
            if (iconNames.length > 0) {
                var icons = [];
                ariaUtilsArray.forEach(iconsList, function (item, i) {
                    if (!ariaUtilsArray.contains(iconNames, iconsList[i])) {
                        icons.push(iconsList[i]);
                    }
                });
                return icons;
            }
            return iconsList;
        },

        /**
         * Map between DOM events and events raised by the frame
         * @type Object
         */
        eventMap : {
            "click" : "iconClick",
            "mousedown" : "iconMouseDown",
            "mouseup" : "iconMouseDown",
            "blur" : "iconBlur",
            "focus" : "iconFocus"
        },

        // ERROR MESSAGE:
        ICON_NOT_FOUND : "Icon was not found: %1"
    },
    $prototype : {

        /**
         * Generate the begining of the markup for the frame.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupBegin : function (out) {
            var oSelf = this;
            ariaUtilsArray.forEach(this._iconsLeft, function (value) {
                oSelf._writeIcon(value, out);
            });
            this._frame.writeMarkupBegin(out);
        },

        /**
         * Generate the end of the markup for this frame.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupEnd : function (out) {
            this._frame.writeMarkupEnd(out);
            var oSelf = this;
            ariaUtilsArray.forEach(this._iconsRight, function (value) {
                oSelf._writeIcon(value, out);
            });
        },

        /**
         * Return one of the DOM elements inside the frame. Must not be called before linkToDom has been called.
         * @param {Number} idx index of the child to retrieve. 0 means the first HTML element written after
         * writeMarkupBegin has returned.
         * @return {HTMLElement} the requested DOM element inside the frame
         */
        getChild : function (idx) {
            return this._frame.getChild(idx);
        },

        /**
         * Return the skin class object for this frame.
         * @return {Object} skin class object
         */
        getSkinObject : function () {
            return this._skinObject;
        },

        /**
         * Return the current state object inside the skin class.
         * @return {String} current state name
         */
        getStateName : function () {
            return this._stateName;
        },

        /**
         * Return the current state object inside the skin class.
         * @return {Object} state object (could also be retrieved with getSkinObject().states[getStateName()])
         */
        getStateObject : function () {
            return this._skinObject.states[this._stateName];
        },

        /**
         * Resize the frame to new dimensions.
         * @param {Number} width New width, or -1 to fit the content width
         * @param {Number} height New height, or -1 to fit the content height
         */
        resize : function (width, height) {
            this._updateFrameWidth(width);
            this._frame.resize(this._frameWidth, height);
            this.innerWidth = this._frame.innerWidth;
            this.innerHeight = this._frame.innerHeight;
        },

        _initIcon : function (icon) {
            this._icons[icon] = {
                domElts : []
            };
        },

        /**
         * Destroy dom links for a given icon
         * @param {String} iconName
         */
        _destroyIcon : function (iconName) {
            this._icons[iconName].domElts = null;
            ariaUtilsDelegate.remove(this._icons[iconName].iconDelegateId);
            this._icons[iconName] = null;
            delete this._icons[iconName];
        },

        /**
         * Updates this._iconsWidth and the iconInfo property for all icons, based on the current state.
         * @protected
         */
        _updateIcons : function () {
            var param = {
                width : 0,
                activeIconIndex : 0
            }, oSelf = this;
            ariaUtilsArray.forEach(this._iconsLeft, function (value) {
                oSelf._computeIconSize(value, param);
            });
            ariaUtilsArray.forEach(this._iconsRight, function (value) {
                oSelf._computeIconSize(value, param);
            });
            this._iconsWidth = param.width;
        },

        /**
         * Updates the value of this._frameWidth, based on the value of this._outerWidth and this._iconsWidth.
         * @return {Boolean} true if the frame width changed
         * @protected
         */
        _updateFrameWidth : function () {
            var outerWidth = this._outerWidth;
            var newValue;
            if (outerWidth < 0) {
                newValue = -1;
            } else {
                newValue = outerWidth - this._iconsWidth;
                if (newValue < 0) {
                    newValue = 0;
                }
            }
            if (this._frameWidth !== newValue) {
                this._frameWidth = newValue;
                return true;
            }
            return false;
        },

        /**
         * Compute the size of the given icon, after updating its iconInfo property based on the current state.
         * @protected
         */
        _computeIconSize : function (icon, param) {
            var stateObject = this.getStateObject();
            var iconParts = stateObject.icons[icon].split(":");
            var iconInfo = ariaWidgetsAriaSkinInterface.getIcon(iconParts[0], iconParts[1]);
            var active = stateObject.icons[icon + "IsActive"];
            if (iconInfo) {
                this._icons[icon].iconInfo = iconInfo;
                this._icons[icon].active = active;
                if (active) {
                    this._icons[icon].tooltip = this._tooltipLabels[param.activeIconIndex++];
                }
                param.width += iconInfo.width + (iconInfo.borderLeft || 0) + (iconInfo.borderRight || 0);
            } else {
                this.$logError(this.ICON_NOT_FOUND, icon);
            }
        },

        /**
         * Link this frame to a DOM element after the markup has been inserted in the DOM.
         * @param {HTMLElement} domElt The DOM element which corresponds to the first item inserted by the
         * writeMarkupBegin method.
         */
        linkToDom : function (domElt) {
            var param = {
                domElt : domElt
                // this property changes in the _linkIconToDom method
            }, oSelf = this;
            ariaUtilsArray.forEach(this._iconsLeft, function (value) {
                oSelf._linkIconToDom(value, param);
            });
            this._frame.linkToDom(param.domElt);
            param.domElt = ariaUtilsDom.getNextSiblingElement(param.domElt, this._frame.domElementNbr);
            ariaUtilsArray.forEach(this._iconsRight, function (value) {
                oSelf._linkIconToDom(value, param);
            });
        },

        /**
         * Change the state of the frame. Must not be called before linkToDom has been called.
         * @param {String} stateName name of the state
         */
        changeState : function (stateName) {
            this._stateName = stateName;
            this._updateIcons();
            if (this._updateFrameWidth()) {
                this._frame.resize(this._frameWidth, this._outerHeight);
            }
            ariaUtilsArray.forEach(this._iconsLeft, this._changeIconState, this);
            this._frame.changeState(stateName);
            ariaUtilsArray.forEach(this._iconsRight, this._changeIconState, this);
            this.innerWidth = this._frame.innerWidth;
            this.innerHeight = this._frame.innerHeight;
        },

        /**
         * Return the first HTML Element for the specified icon name, or null if the icon is not defined.
         * @param {String} the name of the icon to return.
         * @return {HTMLElement} HTML element for the specified icon.
         */
        getIcon : function (iconName) {
            var iconObject = this._icons[iconName];
            if (iconObject) {
                return iconObject.domElts[0];
            }
            return null;
        },

        /**
         * Return icon style as a string
         * @protected
         * @param {Object} iconInfo
         * @param {Boolean} active
         * @return {String}
         */
        _getIconStyle : function (iconInfo, active) {
            // TODO: mutualize with the icon widget
            var style = ['padding:0;display:inline-block;background-position:-', iconInfo.iconLeft, 'px -',
                    iconInfo.iconTop, 'px;width:', iconInfo.width, 'px;height:', iconInfo.height,
                    'px;vertical-align: top;'];
            if (active) {
                style.push('cursor:pointer;');
            }
            return style.join('');
        },

        _writeIcon : function (iconName, out) {
            // TODO: mutualize with the icon widget
            var icon = this._icons[iconName];
            var iconInfo = icon.iconInfo;
            var iconStyle = this._getIconStyle(iconInfo, icon.active);
            var utilDelegate = ariaUtilsDelegate;

            var delegateId = utilDelegate.add({
                fn : this._delegateIcon,
                scope : this,
                args : iconName
            });

            // register for disposal
            this._icons[iconName].iconDelegateId = delegateId;

            var title = icon.tooltip ? " title=\"" + icon.tooltip.replace(/\"/gi, "&quot;") + "\"" : "";

            out.write(['<span', Aria.testMode && this._baseId ? ' id="' + this._baseId + '_' + iconName + '"' : '',
                    ' class="', iconInfo.cssClass, '" style="', iconStyle,
                    '" ' + utilDelegate.getMarkup(delegateId) + title + ' tabIndex="-1">&nbsp;</span>'].join(''));
        },

        _linkIconToDom : function (icon, param) {
            var domElt = param.domElt;
            // set the dom element for the next icon or frame:
            param.domElt = ariaUtilsDom.getNextSiblingElement(domElt);
            this._icons[icon].domElts.push(domElt);
        },

        _changeIconState : function (iconName) {
            var icon = this._icons[iconName];
            var domElts = icon.domElts;
            var iconInfo = icon.iconInfo;
            var iconStyle = this._getIconStyle(iconInfo, icon.active);
            for (var i = 0, l = domElts.length; i < l; i++) {
                var domElt = domElts[i];
                domElt.className = iconInfo.cssClass;
                domElt.style.cssText = iconStyle;
            }
        },

        /**
         * Delegate Icon event
         * @param {aria.DomEvent} event
         * @param {String} iconName
         */
        _delegateIcon : function (event, iconName) {
            var eventName = this.eventMap[event.type];
            if (eventName) {
                this.$raiseEvent({
                    name : eventName,
                    iconName : iconName
                });
            }
        }

    }
});
