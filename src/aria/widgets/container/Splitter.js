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
var ariaUtilsDom = require("../../utils/Dom");
var ariaUtilsClassList = require("../../utils/ClassList");
var ariaUtilsDragdropDrag = require("../../utils/dragdrop/Drag");
var ariaCoreBrowser = require("../../core/Browser");
var ariaWidgetsContainerSplitterStyle = require("./SplitterStyle.tpl.css");
var ariaWidgetsContainerContainer = require("./Container");

/**
 * Splitter Widget
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.container.Splitter",
    $extends : ariaWidgetsContainerContainer,
    $css : [ariaWidgetsContainerSplitterStyle],
    /**
     * Splitter constructor
     * @param {aria.widgets.CfgBeans:SplitterCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        this.$Container.constructor.apply(this, arguments);

        this._skinObj = aria.widgets.AriaSkinInterface.getSkinObject(this._skinnableClass, cfg.sclass);

        /**
         * Contains the dom element of first splitter panel
         * @protected
         * @type HTMLElement
         */
        this._splitPanel1 = null;
        /**
         * Contains the dom element of second splitter panel
         * @protected
         * @type HTMLElement
         */
        this._splitPanel2 = null;
        /**
         * Splitter height.
         * @protected
         * @type Number
         */
        this._height = null;
        /**
         * CSS class which should be applied to the splitter bar .
         * @protected
         * @type String
         */
        this._handleBarClass = null;

        /**
         * List of css class applied on splitter bar proxy .
         * @protected
         * @type aria.utils.ClassList
         */
        this._splitBarProxyClass = null;

        /**
         * Reference to the dom element
         * @protected
         * @type HTMLElement
         */
        this._splitBar = null;

        /**
         * Reference to the dom element
         * @protected
         * @type HTMLElement this._splitBarProxy = null; /** Reference to the Splitter Orientation
         * @protected
         * @type Boolean
         */
        this._orientation = (cfg.orientation === "horizontal") ? true : false;

        /**
         * Reference to Splitter Proxy CSS Class
         * @protected
         * @type String
         */
        this._addHandleCls = this._orientation ? '_sSplitBarProxyH' : '_sSplitBarProxyV';

        /**
         * Splitter width.
         * @protected
         * @type Number
         */
        this._width = null;

        /**
         * Override default widget's span style
         * @protected
         * @override
         * @type String
         */
        this._spanStyle = "overflow: hidden;";

        /**
         * Panel horizontal borders
         * @protected
         * @type Number
         */
        this._panelBorderH = 0;

        /**
         * Panel vertical borders
         * @protected
         * @type Number
         */
        this._panelBorderV = 0;

        /**
         * Horizontal container borders
         * @protected
         * @type Number
         */
        this._containerBorderH = 0;

        /**
         * Vertical container borders
         * @protected
         * @type Number
         */
        this._containerBorderV = 0;

        /**
         * Horizontal separator borders
         * @protected
         * @type Number
         */
        this._separatorBorderH = 0;

        /**
         * Vertical separator borders
         * @protected
         * @type Number
         */
        this._separatorBorderV = 0;

    },
    $destructor : function () {
        this._skinObj = null;
        this._splitBar = null;
        this._splitBarProxy = null;
        this._splitPanel1 = null;
        this._splitPanel2 = null;
        this._splitBarProxyClass.$dispose();
        this._destroyDraggable();
        this.$Container.$destructor.call(this);
    },
    $prototype : {
        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : "Splitter",

        /**
         * OVERRIDE initWidget
         */
        initWidget : function () {
            this.$Container.initWidget.apply(this, arguments);
            var getChild = ariaUtilsDom.getDomElementChild;
            var parentContainer = getChild(getChild(this.getDom(), 0), 0);
            this._splitPanel1 = getChild(parentContainer, 0);
            this._splitBar = getChild(parentContainer, 1);
            this._splitBarProxy = getChild(parentContainer, 2);
            this._splitPanel2 = getChild(parentContainer, 3);

            this._splitBarProxyClass = new ariaUtilsClassList(this._splitBarProxy);
            var handleBarElem = "splitBarProxy_" + this._domId;
            var cursor = this._orientation ? "n-resize" : "e-resize";
            this._draggable = new ariaUtilsDragdropDrag(handleBarElem, {
                handle : handleBarElem,
                cursor : cursor,
                proxy : null,
                constrainTo : parentContainer
            });

            this._draggable.$on({
                "dragstart" : {
                    fn : this._onDragStart,
                    scope : this
                },

                "dragend" : {
                    fn : this._onDragEnd,
                    scope : this
                }
            });

        },
        _onDragStart : function () {
            if (ariaCoreBrowser.isOldIE) {
                this.getDom().onselectstart = Aria.returnFalse;
            }
            this._splitBarProxyClass.remove(this._handleBarClass);

            this._splitBarProxyClass.add("xSplitter_" + this._cfg.sclass + this._addHandleCls);
        },

        _onDragEnd : function () {
            this.getDom().onselectstart = Aria.returnTrue;
            this._splitBarProxyClass.remove("xSplitter_" + this._cfg.sclass + this._addHandleCls);
            this._splitBarProxyClass.add(this._handleBarClass);
            var elem = this._draggable.element, offSetType, dimType, dimMode, dimension, panelBorder = this._skinObj.panelBorder, limitMin, limitMax, handlePosition, size1, size2;
            if (this._orientation) {
                offSetType = "offsetTop";
                dimType = "height";
                dimMode = "top";
                dimension = this._height;
                limitMin = panelBorder.topWidth + panelBorder.bottomWidth;
                limitMax = dimension + limitMin;
            } else {
                offSetType = "offsetLeft";
                dimType = "width";
                dimMode = "left";
                dimension = this._width;
                limitMin = panelBorder.leftWidth + panelBorder.rightWidth;
                limitMax = dimension + limitMin;
            }

            handlePosition = elem[offSetType];

            if (handlePosition <= limitMin) {
                size1 = 0;
                size2 = limitMax;
            } else if (handlePosition >= limitMax) {
                size1 = limitMax;
                size2 = 0;
            } else {
                size1 = handlePosition - limitMin;
                size2 = dimension - size1;
            }

            this.setProperty("size1", size1);
            this.setProperty("size2", size2);
            this._splitPanel1.style[dimType] = size1 + "px";
            this._splitPanel2.style[dimType] = size2 + "px";
            if (dimType == "width") { // IE9 sometimes shows full-width scrollbars even on 0px-width containers!
                this._splitPanel1.style.overflowY = (size1 <= 16) ? "hidden" : "";
                this._splitPanel2.style.overflowY = (size2 <= 16) ? "hidden" : "";
            }

            if (size1 <= 0) {
                this._splitBar.style[dimMode] = size1 + "px";
                this._splitBarProxy.style[dimMode] = size1 + "px";
            } else if (size2 <= 0) {
                this._splitBar.style[dimMode] = limitMin + limitMax + "px";
                this._splitBarProxy.style[dimMode] = limitMin + limitMax + "px";
            } else {
                this._splitBar.style[dimMode] = handlePosition + "px";
                this._splitBarProxy.style[dimMode] = handlePosition + "px";
            }

            this._context.$refresh({
                section : "_splitterContent1_" + this._domId
            });
            this._context.$refresh({
                section : "_splitterContent2_" + this._domId
            });
        },

        /**
         * The main entry point into the Splitter begin markup.
         * @param {aria.templates.MarkupWriter} out the writer Object to use to output markup
         */
        _widgetMarkupBegin : function (out) {
            var cfg = this._cfg, orientation = this._orientation, cfgH, cfgW, cfgHclass, cfgWclass;
            var size = this._calculateSize(cfg), size1 = size.size1, size2 = size.size2, splitterBarPos;
            var panelBorder = orientation ? this._panelBorderH : this._panelBorderV;
            if (size1 === 0) {
                splitterBarPos = 0;
                size2 += panelBorder;
            } else {
                if (size2 === 0) {
                    size1 += panelBorder;
                }
                splitterBarPos = size1 + panelBorder;
            }

            this.setProperty("size1", size1);
            this.setProperty("size2", size2);
            var borderClass = "";
            var sclass = cfg.sclass;
            var height = cfg.height - this._containerBorderH, width = cfg.width - this._containerBorderV;

            if (cfg.border) {
                borderClass = "xSplitter_" + sclass + "_sBdr";
            }
            this._handleBarClass = "xSplitter_" + sclass + (orientation ? "_sHandleH" : "_sHandleV");

            if (orientation) {
                cfgH = height, cfgW = width, cfgWclass = width - this._panelBorderV, cfgHclass = size1;
            } else {
                cfgH = height, cfgHclass = height - this._panelBorderH, cfgW = width, cfgWclass = size1;
            }

            out.write(['<span class="xSplitter_', sclass, '_sContainer ', borderClass, '" style="height:', cfgH,
                    'px;width:', cfgW, 'px;"><span class="xSplitter_', sclass,
                    '_sConstrained"  ><span class="xSplitter_', sclass, '_sMacro" style="height: ', cfgHclass,
                    'px; width:', cfgWclass, 'px;">'].join(""));
            out.beginSection({
                id : "_splitterContent1_" + this._domId,
                macro : cfg.macro1
            });
            out.endSection();
            out.write('</span> ');

            var sDimension, sPosition, sEndPosition, splitterBarSize;
            if (orientation) {
                cfgHclass = size2, cfgWclass = width - this._panelBorderV, sDimension = "width", splitterBarSize = width
                        - this._separatorBorderV, sPosition = "top", sEndPosition = "bottom";
            } else {
                cfgHclass = height - this._panelBorderH, cfgWclass = size2, sDimension = "height", splitterBarSize = height
                        - this._separatorBorderH, sPosition = "left", sEndPosition = "right";
            }

            out.write(['<span class="', this._handleBarClass, '" style="' + sDimension + ':', splitterBarSize,
                    'px;' + sPosition + ':', splitterBarPos, 'px; "> </span><span id="splitBarProxy_', this._domId,
                    '" class="', this._handleBarClass, ' " style="' + sPosition + ':', splitterBarPos,
                    'px; ' + sDimension + ':' + splitterBarSize + 'px;"></span><span class="xSplitter_', sclass,
                    '_sMacro" style="height: ', cfgHclass, 'px;width:', cfgWclass, 'px;' + sEndPosition + ':0px">'].join(""));

            out.beginSection({
                id : "_splitterContent2_" + this._domId,
                macro : cfg.macro2
            });
            out.endSection();
            out.write(['</span> </span> </span>'].join(""));

        },

        /**
         * calculate the border size of an element
         * @param {aria.widgets.CfgBeans:BorderCfg}
         * @param {String} H, V
         * @return {Number} border size
         */
        _calculateBorderSize : function (element, orientation) {
            if (element.style && element.color) {
                if (orientation == "V") {
                    return element.leftWidth + element.rightWidth;
                } else if (orientation == "H") {
                    return element.topWidth + element.bottomWidth;
                }
            }
            return 0;
        },

        /**
         * calculate the width/height of panels from the splitter configuration
         * @param {aria.widgets.CfgBeans:SplitterCfg}
         */
        _calculateSize : function (cfg) {
            var size = {}, totalHeight, initDimension, skinObj = this._skinObj;

            this._panelBorderH = this._calculateBorderSize(skinObj.panelBorder, "H");
            this._panelBorderV = this._calculateBorderSize(skinObj.panelBorder, "V");

            this._separatorBorderH = this._calculateBorderSize(skinObj.separatorBorder, "H");
            this._separatorBorderV = this._calculateBorderSize(skinObj.separatorBorder, "V");

            if (cfg.border) {
                this._containerBorderH = (skinObj.borderWidth || skinObj.borderWidth === 0)
                        ? skinObj.borderWidth * 2
                        : this._skinObj.borderTopWidth + this._skinObj.borderBottomWidth;
                this._containerBorderV = (skinObj.borderWidth || skinObj.borderWidth === 0)
                        ? skinObj.borderWidth * 2
                        : this._skinObj.borderLeftWidth + this._skinObj.borderRightWidth;
            }

            this._height = cfg.height - skinObj.separatorHeight - this._separatorBorderH - this._panelBorderH * 2
                    - this._containerBorderH;
            this._width = cfg.width - skinObj.separatorWidth - this._separatorBorderV - this._panelBorderV * 2
                    - this._containerBorderV;

            if (this._height < 0) {
                this._height = 0;
            }
            if (this._width < 0) {
                this._width = 0;
            }

            if (cfg.size1 < 0) {
                cfg.size1 = 0;
            }
            if (cfg.size2 < 0) {
                cfg.size2 = 0;
            }

            initDimension = this._orientation ? this._height : this._width;
            if (cfg.size1 == null && cfg.size2 == null) {
                cfg.size1 = Math.floor(initDimension / 2);
                cfg.size2 = initDimension - cfg.size1;
            } else if (cfg.size1 == null && cfg.size2 != null) {
                cfg.size1 = initDimension - cfg.size2;
            } else if (cfg.size1 != null && cfg.size2 == null) {
                cfg.size2 = initDimension - cfg.size1;
            }

            totalHeight = cfg.size1 + cfg.size2;
            if (initDimension == totalHeight) {
                size.size1 = cfg.size1;
                size.size2 = cfg.size2;
            } else {
                if (cfg.adapt == "size1") {
                    size.size2 = cfg.size2;
                    if (size.size2 > initDimension) {
                        size.size2 = initDimension;
                    }
                    size.size1 = initDimension - size.size2;
                } else if (cfg.adapt == "size2") {
                    size.size1 = cfg.size1;
                    if (size.size1 > initDimension) {
                        size.size1 = initDimension;
                    }
                    size.size2 = initDimension - size.size1;
                } else {
                    if (totalHeight !== 0) {
                        size.size1 = Math.floor((initDimension * cfg.size1) / totalHeight);
                        size.size2 = initDimension - size.size1;
                    } else {
                        size.size1 = Math.floor(initDimension / 2);
                        size.size2 = initDimension - cfg.size1;
                    }

                }
            }
            return size;
        },

        /**
         * Internal method called when one of the model property that the widget is bound to has changed Must be
         * overridden by sub-classes defining bindable properties
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value
         * @param {Object} oldValue the old property value
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            if (propertyName == "size1" || propertyName == "size2") {
                var orientation = this._orientation, splitterDimension = orientation ? this._height : this._width, dimType, dimMode, splitPos;
                if (newValue > splitterDimension) {
                    newValue = splitterDimension;
                }
                if (newValue < 0) {
                    newValue = 0;
                }

                var otherSize = splitterDimension - newValue;
                dimType = orientation ? "height" : "width";
                dimMode = orientation ? "top" : "left";
                var panelBorder = orientation ? this._panelBorderH : this._panelBorderV;

                var size1, size2;
                if (propertyName == "size1") {
                    size1 = newValue;
                    size2 = otherSize;
                } else {
                    size2 = newValue;
                    size1 = otherSize;
                }

                if (size1 === 0) {
                    splitPos = 0;
                    size2 += panelBorder;
                } else {
                    if (size2 === 0) {
                        size1 += panelBorder;
                    }
                    splitPos = size1 + panelBorder;
                }
                this._splitPanel2.style[dimType] = size2 + "px";
                this._splitPanel1.style[dimType] = size1 + "px";
                this._splitBar.style[dimMode] = splitPos + "px";
                this._splitBarProxy.style[dimMode] = splitPos + "px";
                this.setProperty("size1", size1);
                this.setProperty("size2", size2);

                this._context.$refresh({
                    section : "_splitterContent1_" + this._domId
                });
                this._context.$refresh({
                    section : "_splitterContent2_" + this._domId
                });
            } else {
                this.$Container._onBoundPropertyChange.apply(this, arguments);
            }

        },

        /**
         * Remove listeners and dispose the Drag instance
         * @protected
         */
        _destroyDraggable : function () {
            this._draggable.$removeListeners({
                "dragstart" : {
                    fn : this._onDragStart,
                    scope : this
                },
                "dragend" : {
                    fn : this._onDragEnd,
                    scope : this
                }
            });
            this._draggable.$dispose();
            this._draggable = null;
        }
    }
});
